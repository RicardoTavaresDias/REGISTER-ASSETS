import Tesseract from "tesseract.js";
import multer from "multer";
import { RepositoryAsset } from "../repositories/RepositoryAsset.js"
import { Validation } from "../model/Validation.js"

import { upload } from "../config/multer.js";
import { LogRegisterAssets } from "../core/log-RegisterAssets.js";

/**
 * Controller responsável por lidar com requisições relacionadas ao cadastro e consulta de ativos.
 */

export class RegisterAssetsController {

  /**
   * Manipula o upload de um arquivo de imagem contendo número de série (SN).
   * Realiza OCR com Tesseract.js e tenta extrair palavras que iniciam com "BR" como indicativo de SN.
   * 
   * @param {import("express").Request} request - Objeto da requisição HTTP.
   * @param {import("express").Response} response - Objeto da resposta HTTP.
   * 
   * @returns {Promise<void>} Retorna uma resposta HTTP com os dados extraídos ou mensagens de erro.
   */

  file(request, response) {
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

    /**
   * Cria um novo registro de ativo no banco de dados.
   * Valida os dados recebidos com a classe `Validation` e os utiliza para criar:
   * - Unidade
   * - Setor
   * - Equipamento (com número de série)
   * 
   * @param {import("express").Request} request - Objeto da requisição HTTP contendo os dados no `body`.
   * @param {import("express").Response} response - Objeto da resposta HTTP.
   * 
   * @returns {Promise<void>} Envia uma resposta de sucesso após cadastro no banco de dados.
   */

  async create(request, response) {
    const { unit, equipment, sector, serie } = await new Validation().assets(request.body)
    LogRegisterAssets({ message: request.body })
    await new RepositoryAsset().createAssets(unit, equipment, sector, serie)
    
    response.status(200).json({
      message: `SN: e Setor cadastrado com sucesso, na planilha Excel!`,
    })
  }

   /**
   * Lista ativos de uma unidade específica.
   * Valida o nome da unidade, consulta os ativos correspondentes e retorna os resultados.
   * 
   * @param {import("express").Request} request - Objeto da requisição HTTP com `{ unit }` no corpo.
   * @param {import("express").Response} response - Objeto da resposta HTTP.
   * 
   * @returns {Promise<void>} Retorna a lista de ativos ou uma mensagem caso não haja resultados.
   */

  async index (request, response){
    const unit = await new Validation().unit(request.body)
    const resultUnit = await new RepositoryAsset().searcAsstUnit(unit)

    if(!resultUnit.length){
      response.status(200).json({ message: "Nenhum ativo encontrado." })
    }

    response.status(200).json(resultUnit)
  }

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