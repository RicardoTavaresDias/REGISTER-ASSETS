import Tesseract from "tesseract.js";
import multer from "multer";
import { z } from "zod"
import { RepositoryAsset } from "../repositories/RepositoryAsset.js"
import { Repository } from "../repositories/Repository.js"

import { upload } from "../config/multer.js";
import { LogRegisterAssets } from "../core/log-RegisterAssets.js";

export class RegisterAssetsController {

  postFile(request, response) {
    try {
      upload.single("file")(request, response, async (error) => {
        if (error instanceof multer.MulterError) {
          LogRegisterAssets({ error: error.message })
          return response.status(422).json({ message: error.message });      
        } else if (error) {
          LogRegisterAssets({ error: error.message })
          return response.status(500).json({ message: error.message });
        }

        if (request.errorMessage) {
          LogRegisterAssets({ error: request.errorMessage })
          return response.status(422).json({ message: request.errorMessage }); 
        }

        const result = await Tesseract.recognize(
          `./tmp/${request.file.filename}`,
          "por"
        );

        return response.status(200).json({
          // message: "Upload completed successfully!",
          message: "Leitura realizado da imagem!",
          file: request.file,
          SN:
            // Extrai no texto somente palavra que começa BR
            result.data.text.match(/\bBR\w*/i) &&
            result.data.text.match(/\bBR\w*/i)[0],
        });
      });
    } catch (error) {
      console.log(error);
      LogRegisterAssets({ error: error })
    }
  }

  async postAssets(request, response) {
      const mapUnits = await new Repository().searchAll("unit")

      const bodySchema = z.object({
        serie: z.string().optional(),
        equipment: z.string().optional(),
        sector: z.string().optional(),
        unit: z.string().refine(value => mapUnits.map(element => element.name).includes(value), {
          message: "Unidade inválida"
        })
      })

      const { serie, equipment, sector, unit } = bodySchema.parse(request.body)
      LogRegisterAssets({ message: request.body })
      await new RepositoryAsset().createAssts(unit, equipment, sector, serie)
      
      response.status(200).json({
         message: `SN: e Setor cadastrado com sucesso, na planilha Excel!`,
      })
  }

  // async indexAssets (request, response){
  //    const mapUnits = await new RepositoryAssets().searchAll("unit")

  //    const bodySchema = z.object({
  //       unit: z.string().refine(value => mapUnits.map(element => element.name).includes(value), {
  //         message: "Unidade inválida"
  //       })
  //     })

  //     const { unit } = bodySchema.parse(request.body)
  //     const resultUnit = await new Asset().searcAsstUnit(unit)
  //     response.status(200).json(resultUnit)
  // }

  // async downloadAssets(request, response){
  //   try {


  //     response.download(pathDonload, (error) => {
  //       if(error){
  //         console.log("Erro no download:", error)
  //         LogRegisterAssets({ error: error })
  //         return response.status(404).json({ message: "File not found" })
  //       }
  //     })
  //   } catch(error){
  //     console.log(error)
  //     LogRegisterAssets({ error: error })
  //     response.status(422).json({
  //         message: "Error ao acessar/ler o arquivo .xlsx",
  //         error: error.message,
  //     });
  //   }
  // }
}