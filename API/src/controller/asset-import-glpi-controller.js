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
 * Gera um relatório de validação de ativos com base em dados de um arquivo Excel ou dados enviados no corpo da requisição.
 * 
 * Funcionalidade:
 * - Verifica se o arquivo `register_assets.xlsx` está presente no diretório `./tmp`.
 *   - Se presente, os dados são lidos via `CsvReader().csvData()`.
 *   - Caso contrário, valida a unidade enviada no `request.body` e busca os dados no repositório (`Repository().search.searcAssetUnit`).
 * - Os dados brutos são processados pelo utilitário `assetProcessor`, padronizando a estrutura dos equipamentos.
 * - Com os dados processados, o serviço de automação do GLPI (`GlpiAutomationService`) é utilizado para validar os ativos no GLPI.
 * - O resultado da validação é registrado em arquivos `.txt` e `.json` usando `AssetReport().manualReviewLogger`.
 * 
 * @param {Object} request - Objeto da requisição HTTP.
 * @param {Object} request.body - Dados enviados pelo cliente (caso não exista arquivo Excel).
 * @param {Object} request.user - Informações do usuário autenticado, usadas pelo `GlpiAutomationService`.
 * @param {Object} response - Objeto da resposta HTTP.
 * 
 * @returns {Object} Retorna uma resposta HTTP com status 200 e mensagem de sucesso.
 * 
 * @throws {Error} Caso ocorra erro na leitura do diretório, validação de dados, comunicação com o GLPI ou geração de relatório.
 */

  async index(request, response){
    const read = await fs.promises.readdir("./tmp")
    let data = null

    if(read.includes("register_assets.xlsx")){
      data = new CsvReader().csvData()
    }else {
      const validationUnit = new Validation()
      const unit = await validationUnit.unit(request.body)
      const repository = new Repository()
      data = await new repository.search.searcAssetUnit(unit)
    }

    const dataEquipment = assetProcessor(data.filter(value => !(value.equipment === null) && !(value.sector === null)))
    const glpiAutomationService = new GlpiAutomationService(request.user)
    const dataValidator = await glpiAutomationService.assets(dataEquipment)
    await new AssetReport().manualReviewLogger(
      { 
        dataValidator: dataValidator, 
        manualRegistration: data.filter(value => (value.equipment === null) || (value.sector === null))
      }
    )

    

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