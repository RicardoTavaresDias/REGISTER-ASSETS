import "./styles.css";

import { InputUpload } from "../../components/input-upload/index.jsx";
import { UploadLoading } from "../../components/upload-loading/index.jsx";
import { Button } from "../../components/button/index.jsx";
import { Info } from "../../components/info/index.jsx";
import { Input } from "../../components/input/index.jsx";

import svgClose from "../../assets/close.svg";
import svgCheck from "../../assets/check.svg";
import svgCloseError from "../../assets/closeError.svg";

import { useAsset } from "../../hooks/useAsset.js";

export function Assets() {
  const asset = useAsset();

  return (
    <main>
      <span id="closeLink" onClick={() => asset.CloseForm()}>
        Voltar
      </span>

      {asset.upload.progress < 100 &&
        <InputUpload>
          <input
            type="file"
            id='birth-file'
            name="birth-file"
            onChange={(e) => asset.upload.AddUPload(e.target.files[0])}
            disabled={asset.upload.file?.name ? true : asset.upload.progress ? true : false}
          />
        </InputUpload>
      }

      {asset.upload.file?.name && (
        <UploadLoading file={asset.upload.file} progress={asset.upload.progress} id={asset.upload.progress === 100 ? "invisible" : "visible"}>
          <a
            className={
              asset.upload.progress < 1 ? (asset.upload.progress === 100 ? "check" : "close") : "clean"
            }
            href="#"
            onClick={asset.upload.progress === 100 ? null : () => asset.upload.setFile({})}
          >
            {!(asset.upload.progress > 0 && asset.upload.progress < 100) ? (
              <img src={asset.upload.progress === 100 ? (asset.upload.error ? svgCloseError : svgCheck) : svgClose} />
            ) : null}
          </a>
        </UploadLoading>
      )}


      {!asset.upload.loading ? (
        asset.upload.file?.name && 
        asset.upload.file.type.startsWith("image/") &&
        (asset.upload.progress === 100 ? (
          <img
            className="imgPreview"
            src={URL.createObjectURL(asset.upload.file)}
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

      {asset.upload.progress == 100 ||
        (asset.upload.file?.name && (
          <>
            <Button>
              <button
                className="btn-primary"
                type="submit"
                onClick={asset.upload.FileSubmit}
                disabled={asset.upload.progress > 0 && asset.upload.progress < 99}
              >
                Upload
              </button>
            </Button>
          </>
        ))}

      <form onSubmit={asset.SubmitForm}>
        <Input
          value={asset.equipment}
          onFocus={() => {
            asset.suggestions.setSearchEquipment(!asset.suggestions.searchEquipment)
          }}
          onChange={(e) => {
            asset.setEquipment(e.target.value);
          }}
        >
          Equipamento:
        </Input>

        {!asset.suggestions.searchEquipment && asset.suggestions.suggestionsEquipment.length > 0 && (
          <div className="suggestions">
            {asset.suggestions.suggestionsEquipment.map((value, index) => (
              <div key={index}>
                <span
                  onClick={() => {
                    asset.setEquipment(value);
                    asset.suggestions.setSearchEquipment(!asset.suggestions.searchEquipment);
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
          value={asset.sector}
          onFocus={() => {
            asset.suggestions.setSearchSector(!asset.suggestions.searchSector)
          }}
          onChange={(e) => {
            asset.setSector(e.target.value);
          }}
        >
          Setor:
        </Input>

        {!asset.suggestions.searchSector && asset.suggestions.suggestions.length > 0 && (
          <div className="suggestions">
            {asset.suggestions.suggestions.map((value, index) => (
              <div key={index}>
                <span
                  onClick={() => {
                    asset.setSector(value);
                    asset.suggestions.setSearchSector(!asset.suggestions.searchSector);
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
          value={asset.sn}
          onChange={(e) => {
            asset.setSN(e.target.value);
            asset.suggestions.setSuggestions([]);
            asset.suggestions.setSuggestionsEquipment([]);
          }}
        >
          SN:
        </Input>

        <Button>
          <button
            className="btn-primary"
            type="submit"
          >
            Enviar
          </button>
        </Button>
      </form>
    </main>
  );
}
