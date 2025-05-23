import { CsvReader } from "../core/Csv-reader.js"
import { AssetReport } from "../core/assetReport.js"
import { assetProcessor, mapUpdateSectorId, existIdSector } from "../core/activeDataProcessing.js"
import { Repository } from "../repositories/Repository.js"
import { GlpiAutomationService } from "../services/glpi/GlpiAutomationService.js"
import { Validation } from "../validation/Validation.js"
import { File } from "../utils/File.js"

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
    const file = new File(request.user.user)
    const existFile = (await file.fileReaddir()).includes(`${request.user.user}&register_assets.xlsx`)
    let data = null

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
        return file.removerFileXlsx()
      }
      return
    })

    response.status(200).json({ message: "Relatório gerado com sucesso." })
  }

    /**
   * Atualiza ativos no GLPI com base no arquivo de pendências gerado anteriormente.
   *
   * - Lê o arquivo JSON com ativos a atualizar.
   * - Processa e mapeia os setores com IDs válidos.
   * - Separa ativos em dois grupos: com e sem `idSector`.
   * - Atualiza os ativos válidos no GLPI.
   * - Atualiza o arquivo de pendências com os setores que precisam de registro manual.
   *
   * @param {Object} request - Requisição contendo o usuário.
   * @param {Object} response - Resposta HTTP.
   *
   * @returns {Promise<void>} Envia uma resposta 202 em caso de sucesso.
   *
   * @throws {Error} Se o arquivo de pendências não for encontrado.
   */

  async update(request, response){
    const file = new File(request.user.user)
    const readerUpdate = await file.fileReader().catch(() => {
      throw new Error("Não foi encontrado a lista atualização dos setores, realizar verificação cadastros no glpi e na planilha." )
    })

    const dataEquipment = assetProcessor(readerUpdate.updateAssets)
    const sectorUpdate = await mapUpdateSectorId(dataEquipment)
    const { manual, existId } = existIdSector(sectorUpdate)

    const glpiAutomationService = new GlpiAutomationService(request.user)
    await glpiAutomationService.Update(assetProcessor(existId))

    await file.updateImportFile({ manual, update: existId })

    response.status(202).json(
      {
         message: `Atualização realizado com sucesso ${existId.length} ativos, cadastros que devem ser atualizado manualmente ${manual.length} ativos, devido não ter setor no glpi.`, 
         manualSector: manual
      }
    )
  }








  


  // PARTE 2 PARA ELABORAR ATUALIZAR GLPI E CADASTRAR GLPI.

  async create(request, response){
    const file = new File(request.user.user)
    const readerCreate = await file.fileReader().catch(() => {
      throw new Error("Não foi encontrado a lista atualização dos setores, realizar verificação cadastros no glpi e na planilha." )
    })
    
    const dataEquipment = assetProcessor(readerCreate.doesNotExistsAssets)
    const sectorCreate = await mapUpdateSectorId(dataEquipment)
    const { manual, existId } = existIdSector(sectorCreate)

    const glpiAutomationService = new GlpiAutomationService(request.user)
    const result = await glpiAutomationService.treeStructureGlpi(request.body.unit)

    if(result){
      response.status(401).json(result)
    }
    
    await glpiAutomationService.registerAssets(assetProcessor(existId))
    await file.updateImportFile({ manual, create: existId })

    response.status(202).json(
      {
         message: `Cadastrado com sucesso ${existId.length} ativos na unidade ${request.body.unit}, cadastros que devem ser atualizado manualmente ${manual.length} ativos, devido não ter setor no glpi.`, 
         manualCreate: manual
      }
    )
  }
  
}

