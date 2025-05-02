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
import { assetProcessor } from "../services/asset-processor.js"

export class AssetsImportGlpiController {
  async create(request, response){
    const cvsData = new CsvReader().csvData()
    const {computer, monitor } = assetProcessor(cvsData)
    const validatorglpi = new Validatorglpi(monitor)
    const { existsAssets, doesNotExistsAssets } = await validatorglpi.glpiAssets()

    //const validatorPrinter = await glpiValidator({ data: monitor, path:  })

    manualReviewLogger(existsAssets, doesNotExistsAssets)
    response.status(200).json({ message: "ok" })
  }
}