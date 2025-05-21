import CryptoJS from "crypto-js"
import { jwtConfig } from "../config/token.js"
import { CsvReader } from "../core/Csv-reader.js"
import { AssetReport } from "../core/AssetReport.js"
import { assetProcessor, mapUpdateSectorId } from "../core/activeDataProcessing.js"
import { z } from "zod"
import { Repository } from "../repositories/Repository.js"
import fs from "node:fs"
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
    const nameFile = CryptoJS.AES.decrypt(request.user.user, jwtConfig.secret).toString(CryptoJS.enc.Utf8)
    const read = await fs.promises.readdir("./tmp")
    let data = null

    const existFile = read.includes(`${nameFile}&register_assets.xlsx`)
    if(existFile){
      const csvReader = new CsvReader(nameFile)
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
    
    const assetReport = new AssetReport()
    assetReport.manualReviewLogger(
      { 
        dataValidator: dataValidator, 
        manualRegistration: data.filter(value => (value.equipment === null) || (value.sector === null))
      }
    ).then(() => {
      if(existFile){
        return fs.unlinkSync(`./tmp/${nameFile}&register_assets.xlsx`)
      }
      return
    })

    response.status(200).json({ message: "Relatório gerado com sucesso." })
  }






  // PARTE 2 PARA ELABORAR ATUALIZAR GLPI E CADASTRAR GLPI.








  /**
   * Atualiza o setor de ativos já cadastrados no GLPI com base em um arquivo JSON previamente gerado.
   * 
   * @throws {Error} - Quando não encontra o arquivo JSON com os dados.
   * 
   * @returns {Promise<void>}
   */

  async update(request, response){
    const readerUpdate = await fs.promises.readFile("./tmp/pendentes-para-cadastro.json").catch(() => {
      throw new Error("Não foi encontrado a lista atualização dos setores, realizar verificação cadastros no glpi e na planilha." )
    })
  
    const glpiInserter = new GlpiInserter(request.headers)
    await glpiInserter._initBrowser()

    const readerUpdateJson = JSON.parse(readerUpdate)
    
    const dataEquipment = assetProcessor(readerUpdateJson.updateAssets)
    const sectorUpdate = await mapUpdateSectorId(dataEquipment)
    await glpiInserter.updateSectorGlpi(sectorUpdate)

    response.status(201).json({ message: `Setores da unidade, atualizado com sucesso.` })
  }

   /**
   * Cadastra novos ativos no GLPI após validar a unidade e preparar os dados para inserção.
   * 
   * @throws {Error} - Em caso de unidade inválida ou leitura mal sucedida do JSON de entrada.
   * 
   * @returns {Promise<void>}
   */

  async create(request, response){
    const readerUnits = await prisma.unit.findMany({ 
      where: {
        name: {
          contains: request.body.units
        },
      },
      select: {
        name: true
      }
    })

    const mapUnits = readerUnits.map(value => value.name)

    const unitsSchema = z.object({
      units: z.string().refine(value => mapUnits.includes(value), {
        message: "Unidade inválida"
      })
    })

    const { units } = unitsSchema.parse(request.body)

    const readerCreate = await fs.promises.readFile("./tmp/pendentes-para-cadastro.json").catch(() => {
      throw new Error("Não foi encontrado a lista atualização dos setores, realizar verificação cadastros no glpi e na planilha." )
    })

    const readerCreateJson = JSON.parse(readerCreate)
    
    const dataEquipment = assetProcessor(readerCreateJson.doesNotExistsAssets)
    const sectorCreate = await mapUpdateSectorId(dataEquipment)

    const glpiInserter = new GlpiInserter(request.headers)
    await glpiInserter._initBrowser()
    const result = await glpiInserter.treeStructureGlpi(units)

    if(result){
      response.status(401).json(result)
    }
    
    await glpiInserter.registerAssets(sectorCreate)

    response.status(201).json({ message: `Novos ativos da unidade ${request.body.units}, cadastrados com sucesso.` })
  }
}