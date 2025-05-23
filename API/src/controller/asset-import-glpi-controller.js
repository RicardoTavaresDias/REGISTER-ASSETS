import fs from "node:fs"
import { CsvReader } from "../core/Csv-reader.js"
import { AssetReport } from "../core/AssetReport.js"
import { assetProcessor } from "../core/activeDataProcessing.js"
import { Repository } from "../repositories/Repository.js"
import { GlpiAutomationService } from "../services/glpi/GlpiAutomationService.js"
import { Validation } from "../model/Validation.js"

/**
 * Controller responsável pelas rotas de importação, atualização e criação de ativos no GLPI.
 */

export class AssetsImportGlpiController {

/**
 * Gera um relatório de validação de ativos a partir de um arquivo Excel ou dados da requisição.
 *
 * - Descriptografa o nome do usuário para localizar o arquivo `register_assets.xlsx` em `./tmp`.
 * - Se o arquivo existir, os dados são lidos com `CsvReader`; caso contrário, são buscados via repositório.
 * - Os dados válidos (com `equipment` e `sector`) são processados e enviados para validação no GLPI.
 * - Gera um relatório com `AssetReport`, incluindo também os registros inválidos.
 * - Remove o arquivo após o uso, se aplicável.
 *
 * @async
 * @param {Object} request - Requisição com dados ou arquivo.
 * @param {Object} response - Resposta HTTP.
 * @returns {Promise<void>} Resposta com status 200 em caso de sucesso.
 *
 * @throws {Error} Em caso de falha na leitura, validação ou comunicação com o GLPI.
 */

  async index(request, response){
    const read = await fs.promises.readdir("./tmp")
    let data = null

    const existFile = read.includes(`${request.user.user}&register_assets.xlsx`)
    if(existFile){
      const csvReader = new CsvReader(request.user.user)
      data = csvReader.csvData()
    }else {
      const validationUnit = new Validation()
      const unit = await validationUnit.unit(request.body)
      const repository = new Repository()
      data = await repository.search.searcAssetUnit(unit)
    }

    const dataEquipment = assetProcessor(data.filter(value => !(value.equipment === null) && !(value.sector === null)))
    const glpiAutomationService = new GlpiAutomationService(request.user)
    const dataValidator = await glpiAutomationService.assets(dataEquipment)
    
    const assetReport = new AssetReport(request.user.user)
    assetReport.manualReviewLogger(
      { 
        dataValidator: dataValidator, 
        manualRegistration: data.filter(value => (value.equipment === null) || (value.sector === null))
      }
    ).then(() => {
      if(existFile){
        return fs.unlinkSync(`./tmp/${request.user.user}&register_assets.xlsx`)
      }
      return
    })

    response.status(200).json({ message: "Relatório gerado com sucesso." })
  }






  // PARTE 2 PARA ELABORAR ATUALIZAR GLPI E CADASTRAR GLPI.

  update(request, response){
    response.status(201).json({ message: "ok" })
  }

  create(request, response){
    response.status(201).json({ message: "ok" })
  }
}