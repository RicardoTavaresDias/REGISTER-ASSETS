import { CsvReader } from "../core/Csv-reader.js"
import { manualReviewLogger } from "../core/manual-review-logger.js"
import { Validatorglpi } from "../core/Validator-glpi.js"
import { assetProcessor, mapUpdateSectorId } from "../core/asset-processor.js"
import { GlpiInserter } from "../core/glpi-inserter.js"
import { z } from "zod"
import { PrismaClient } from '@prisma/client';
import fs from "node:fs"

const prisma = new PrismaClient();

/**
 * Controller responsável pelas rotas de importação, atualização e criação de ativos no GLPI.
 */

export class AssetsImportGlpiController {

   /**
   * Método responsável por validar os ativos lidos do arquivo CSV.
   * Gera um relatório de equipamentos existentes, não existentes ou com inconsistências.
   */

  async index(request, response){
    const cvsData = new CsvReader().csvData()

    const dataEquipment = assetProcessor(cvsData)
    const validatorglpi = new Validatorglpi(dataEquipment)
    validatorglpi._user(request.user)
    const dataValidator = await validatorglpi.glpiAssets()

    manualReviewLogger(dataValidator)
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
    const readerUpdate = await fs.promises.readFile("./src/files/pendentes-para-cadastro.json").catch(() => {
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

    const readerCreate = await fs.promises.readFile("./src/files/pendentes-para-cadastro.json").catch(() => {
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