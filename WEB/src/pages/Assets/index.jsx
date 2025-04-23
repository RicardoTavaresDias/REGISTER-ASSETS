import "./styles.css";

import { InputUpload } from "../../components/input-upload/index.jsx";
import { UploadLoading } from "../../components/upload-loading/index.jsx";
import { Button } from "../../components/button/index.jsx";
import { Info } from "../../components/info/index.jsx";
import { Input } from "../../components/input/index.jsx";
import { Suggestions } from "../../components/suggestions/index.jsx"

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

      {/* <INPUT FILE> */}
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
      {/* </INPUT FILE> */}

      {/* <UPLOAD> */}
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
      {/* </UPLOAD> */}

      {/* <LOADING AND IMG> */}
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
      {/* </LOADING AND IMG> */}

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

        {/* <EQUIPMENT> */}
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
          <Suggestions 
            suggestions={asset.suggestions.suggestionsEquipment} 
            setName={asset.setEquipment}
            setSearch={asset.suggestions.setSearchEquipment}
            Search={asset.suggestions.searchEquipment}
          />
        )}
        {/* </EQUIPMENT> */}

        {/* <SECTOR> */}
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

        {!asset.suggestions.searchSector && asset.suggestions.suggestionsSector.length > 0 && (
          <Suggestions 
            suggestions={asset.suggestions.suggestionsSector} 
            setName={asset.setSector}
            setSearch={asset.suggestions.setSearchSector}
            Search={asset.suggestions.searchSector}
            />
        )}
        {/* </SECTOR> */}

        {/* <SN> */}
        <Input
          value={asset.sn}
          onChange={(e) => {
            asset.setSN(e.target.value);
            asset.suggestions.setSuggestionsSector([]);
            asset.suggestions.setSuggestionsEquipment([]);
          }}
        >
          SN:
        </Input>
        {/* </SN> */}

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
