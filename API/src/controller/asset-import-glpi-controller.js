/*
  # Realizará leitura da planilha excel tratar os dados.
  # Manipular glpi para verificação se já existe o número de seria na unidade.
  # Se tiver numero de serie eliminar o numero de serie que veio da planilha.
  # O que não tiver numero de serie realizar cadastro do mesmo.
  # O setor que não existir na lista do glpi passar para usuario cadastrar manualmente.
  # Informar usuarios os numero de serie cadastrados, rejeitados existentes e os numeros que deve cadastrar manualmente.
*/

/*
  # Criar arquivo separado para manipulação glpi - 1° responsabilidade
  # Criar arquivo separado para manipular arquivos junto com a planilha, 
    verificando quais será necessario cadastrar manualmente devido setor, 
    os setores que não existe - 2° responsabilidade.
  # Criar um arquivo para verificar se o numeros de serie já existe no glpi - 3° responsabilidade
  # Criar arquivo para cadastrar os numeros de serie no glpi - 4° responsabilidade
*/

/*
  OBSERVAÇÂO:
  📋Planejar como será relação a unidade no cadastro da planilha excel pois necessita inclusão no sitema

  Outro Exemplo de arquivos e pastas

/*
💡
  src/
  ├── controller/
  │   └── ✅ asset-import-glpi-controller.js         # Controla o fluxo da importação
  │   ├── login-controller.js
  │   ├── logs-controller.js
  │   ├── register-assets-controller.js
  │   ├── suggestions-search-controller.js
  │
  ├── routers/
  │   └── ✅ asset-import-glpi-router.js             # Define rota de importação
  │   ├── assets-router.js
  │   ├── index.js
  │   ├── login-router.js
  │   ├── logs-router.js
  │   ├── suggestions-router.js 
  │
  ├── services/
  │   ├── CrudFile.js
  │   ├── log-RegisterAssets.js
  │   ├── ✅ csv-reader.js              # Lê arquivo CSV
  │   ├── ✅ asset-processor.js         # Processa dados do CSV
  │   ├── ✅ glpi-validator.js          # Valida existência no GLPI
  │   ├── ✅ glpi-inserter.js           # Cadastra no GLPI
  │   ├── ✅ manual-review-logger.js    # Armazena dados inválidos p/ revisão
  │
  ├── files/
  │   ├── ativos.csv                            # Arquivo com os dados de entrada
  │   └── ✅ pendentes-para-cadastro.json       # Saída para cadastro manual
  │
  ├── routers/index.js                       # Onde você adiciona as rotas
*/
import { CsvReader } from "../services/Csv-reader.js"
import { manualReviewLogger } from "../services/manual-review-logger.js"
import { Validatorglpi } from "../services/Validator-glpi.js"
import { assetProcessor, mapUpdateSectorId } from "../services/asset-processor.js"
import { GlpiInserter } from "../services/glpi-inserter.js"
import { z } from "zod"
import { CrudFile } from "../services/CrudFile.js"
import { env } from "../config/env.js"

export class AssetsImportGlpiController {
  async index(request, response){
    const cvsData = new CsvReader().csvData()

    const dataEquipment = assetProcessor(cvsData)
    const validatorglpi = new Validatorglpi(dataEquipment)
    validatorglpi._user(request.headers)
    const dataValidator = await validatorglpi.glpiAssets()

    manualReviewLogger(dataValidator)
    response.status(200).json({ message: "Relatório gerado com sucesso." })
  }

  async update(request, response){
    const glpiInserter = new GlpiInserter(request.headers)
    await glpiInserter._initBrowser()

    const readerUpdate = new CrudFile({ path: "./src/files/pendentes-para-cadastro.json" })._Read()
    const readerUpdateJson = JSON.parse(await readerUpdate)
    
    const dataEquipment = assetProcessor(readerUpdateJson.updateAssets)
    const sectorUpdate = await mapUpdateSectorId(dataEquipment)
    await glpiInserter.updateSectorGlpi(sectorUpdate)

    response.status(201).json({ message: `Setores da unidade ${request.body.units}, atualizado com sucesso.` })
  }

  async create(request, response){
    const readerUnits = await new CrudFile({ path: env.UNITS })._Read()
    const readerUnitsJson = JSON.parse(readerUnits)
    const mapUnits = readerUnitsJson.map(value => value.units)
  
    const unitsSchema = z.object({
      units: z.string().refine(value => mapUnits.includes(value), {
        message: "Unidade inválida"
      })
    })

    const { units } = unitsSchema.parse(request.body)

    const readerCreate = new CrudFile({ path: "./src/files/pendentes-para-cadastro.json" })._Read()
    const readerCreateJson = JSON.parse(await readerCreate)
    
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