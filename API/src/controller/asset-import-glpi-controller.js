import { CsvReader } from "../core/Csv-reader.js"
import { AssetReport } from "../core/AssetReport.js"
//import { Validatorglpi } from "../core/Validator-glpi.js"
import { assetProcessor, mapUpdateSectorId } from "../core/activeDataProcessing.js"
//import { GlpiInserter } from "../core/glpi-inserter.js"
import { z } from "zod"
import { RepositoryAsset } from "../repositories/RepositoryAsset.js"
import fs from "node:fs"
import { GlpiAutomationService } from "../services/glpi/GlpiAutomationService.js"

/**
 * Controller responsável pelas rotas de importação, atualização e criação de ativos no GLPI.
 */

export class AssetsImportGlpiController {

  async index(request, response){
    // PASSO SEGUINTE REALIZAR UPLOAD DO EXCEL
    const read = await fs.promises.readdir("./tmp")
    let data = null

    if(read.includes("register_assets.xlsx")){
      data = new CsvReader().csvData()
    }else {
      data = await new RepositoryAsset().searcAssetUnit("UBS/ESF Jardim Selma") // VALIDAR UNIT NO REQUESTE BODY E PASSAR O VALOR NA CLASSE
    }

    const dataEquipment = assetProcessor(data)
    const glpiAutomationService = new GlpiAutomationService(request.user)
    const dataValidator = await glpiAutomationService.assets(dataEquipment)
    await new AssetReport().manualReviewLogger(dataValidator)

    response.status(200).json({ message: "Relatório gerado com sucesso." })
  }

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