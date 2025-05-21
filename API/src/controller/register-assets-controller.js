import Tesseract from "tesseract.js";
import multer from "multer";
import { Repository } from "../repositories/Repository.js"
import { Validation } from "../model/Validation.js"

import { uploadImage, uploadXlsx } from "../config/multer.js";
import { logRegisterAssets } from "../core/log-RegisterAssets.js";

/**
 * Controller responsável por upload, leitura e cadastro de ativos.
 */

export class RegisterAssetsController {

/**
   * Realiza upload de imagem e extrai número de série (SN) via OCR com Tesseract.js.
   *
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  file(request, response) {
    try {
      uploadImage.single("file")(request, response, async (error) => {
        if (error instanceof multer.MulterError) {
          logRegisterAssets(error.message)
          return response.status(422).json({ message: error.message });      
        } else if (error) {
          logRegisterAssets(error.message)
          return response.status(500).json({ message: error.message });
        }

        if (request.errorMessage) {
          logRegisterAssets(request.errorMessage)
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
        })
      })
    } catch (error) {
      console.log(error);
      logRegisterAssets(error)
    }
  }

/**
   * Cadastra um novo ativo após validação dos dados.
   * Retorna erro se o número de série já existir na unidade.
   *
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async create(request, response) {
    const returnValidation = await new Validation().assets(request.body)

    const repository = new Repository()
    const existsRegisterSerie = await repository.search.searcAssetUnit(returnValidation.unit)
    if(existsRegisterSerie.find(value => value.serie === request.body.serie)){
      return response.status(400).json({ message: "Número de serie já existe na unidade." })
    }

    await repository.create.createAssets(returnValidation)
    
    response.status(201).json({
      message: "Cadastro salvo com sucesso.",
    })
  }

  /**
   * Lista ativos de uma unidade após validar o nome.
   * Retorna erro se nenhum ativo for encontrado.
   *
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async index (request, response){
    const unit = await new Validation().unit(request.body)
    const repository = new Repository()
    const resultUnit = await repository.search.searcAssetUnit(unit)

    if(!resultUnit.length){
      response.status(400).json({ message: "Nenhum ativo encontrado." })
    }

    response.status(200).json(resultUnit)
  }

  /**
   * Realiza upload de arquivo `.xlsx` com validação via multer.
   * Registra erros e responde conforme o resultado do upload.
   *
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async upload(request, response){
    try {
      uploadXlsx.single("file")(request, response, async (error) => {
        if (error instanceof multer.MulterError) {
            logRegisterAssets(error.message)
            return response.status(422).json({ message: error.message });      
          } else if (error) {
            logRegisterAssets(error.message)
            return response.status(500).json({ message: error.message });
          }

          if (request.errorMessage) {
            logRegisterAssets(request.errorMessage)
            return response.status(422).json({ message: request.errorMessage }); 
          }

          response.status(201).json({ message: "Arquivo gravado com sucesso." })          
      })
    }catch(error){
      console.log(error);
      logRegisterAssets(error)
    }
  }




// Parte que será definido no final do processo




  async download(request, response){
    response.status(200).json({ message: "Download ok" })
    // try {


    //   response.download(pathDonload, (error) => {
    //     if(error){
    //       console.log("Erro no download:", error)
    //       LogRegisterAssets({ error: error })
    //       return response.status(404).json({ message: "File not found" })
    //     }
    //   })
    // } catch(error){
    //   console.log(error)
    //   LogRegisterAssets({ error: error })
    //   response.status(422).json({
    //       message: "Error ao acessar/ler o arquivo .xlsx",
    //       error: error.message,
    //   });
    // }
  }
}