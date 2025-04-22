import "./styles.css";

import { InputUpload } from "../../components/input-upload/index.jsx";
import { UploadLoading } from "../../components/upload-loading/index.jsx";
import { Button } from "../../components/button/index.jsx";
import { Info } from "../../components/info/index.jsx";
import { Input } from "../../components/input/index.jsx";

import svgClose from "../../assets/close.svg";
import svgCheck from "../../assets/check.svg";
import svgCloseError from "../../assets/closeError.svg";
import img from "../../../../API/tmp/img.jpg";

import { useAssets } from "../../hooks/useAssets.js";

export function Assets() {
  const {
    file,
    progress,
    error,
    FileSubmit,
    AddUPload,
    sn,
    sector,
    setSN,
    setSector,
    SubmitForm,
    suggestions,
    setSuggestions,
    search,
    setSearch,
    loading,
    setFile,
    CloseForm,
    equipment,
    setEquipment,
    suggestionsEquipment,
    setSuggestionsEquipment,
  } = useAssets();

  return (
    <main>
      <span id="closeLink" href="#" onClick={() => CloseForm()}>
        Voltar
      </span>

      {progress < 100 && (
        <InputUpload>
          <input
            type="file"
            id="birth-file"
            name="birth-file"
            onChange={(e) => AddUPload(e.target.files[0])}
            disabled={file?.name ? true : progress ? true : false}
          />
        </InputUpload>
      )}

      {file?.name && (
        <UploadLoading file={file} progress={progress}>
          <a
            className={
              progress < 1 ? (progress === 100 ? "check" : "close") : "clean"
            }
            href="#"
            onClick={progress === 100 ? null : () => setFile({})}
          >
            {!(progress > 0 && progress < 100) ? (
              <img src={progress === 100 ? error && svgCheck : svgClose} />
            ) : null}
          </a>
        </UploadLoading>
      )}

      {!loading ? (
        file?.name &&
        file.type.startsWith("image/") &&
        (progress === 100 ? (
          <img
            className="imgPreview"
            src={URL.createObjectURL(file)}
            alt="preview"
          />
        ) : null)
      ) : (
        <div
          className="suggestions"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <h2>Carregando....</h2>
        </div>
      )}

      {progress == 100 ||
        (file?.name && (
          <>
            <Button>
              <button
                className="btn-primary"
                type="submit"
                onClick={FileSubmit}
                disabled={progress > 0 && progress < 99}
              >
                Upload
              </button>
            </Button>
          </>
        ))}

      <form onSubmit={SubmitForm}>
        <Input
          value={equipment}
          onChange={(e) => {
            setEquipment(e.target.value);
          }}
        >
          Equipamento:
        </Input>

        {search && suggestionsEquipment.length > 0 && (
          <div className="suggestions">
            {suggestionsEquipment.map((value, index) => (
              <div key={index}>
                <span
                  onClick={() => {
                    setSuggestionsEquipment([]);
                    setEquipment(value);
                    setSearch(!search);
                    setSuggestions([]);
                  }}
                >
                  {value}
                </span>
                <br />
              </div>
            ))}
          </div>
        )}

        <Input
          value={sector}
          onChange={(e) => {
            setSector(e.target.value);
          }}
        >
          Setor:
        </Input>

        {!search && suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((value, index) => (
              <div key={index}>
                <span
                  onClick={() => {
                    setSuggestionsEquipment([]);
                    setSector(value);
                    setSearch(!search);
                    setSuggestions([]);
                  }}
                >
                  {value}
                </span>
                <br />
              </div>
            ))}
          </div>
        )}

        <Input
          value={sn}
          onChange={(e) => {
            setSN(e.target.value);
            setSuggestions([]);
            setSuggestionsEquipment([]);
          }}
        >
          SN:
        </Input>

        <Button>
          <button
            className="btn-primary"
            type="submit"
            onClick={() => {
              setSearch(!search);
            }}
          >
            Enviar
          </button>
        </Button>
      </form>
    </main>
  );
}
