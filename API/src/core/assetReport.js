import fs from "node:fs"
import { AppError } from "../utils/AppError.js"
import { pagination } from "../utils/pagination.js"

/**
 * Classe responsável por gerenciar e manipular os relatórios de ativos validados (existentes, inexistentes e atualizações).
 */

export class AssetReport {
  constructor(user){
    this.user = user
  }

 /**
 * Gera logs dos ativos validados (existentes, pendentes, para atualização e para cadastro manual),
 * formatando em arquivos `.json` e `.txt` com as informações estruturadas.
 *
 * Os arquivos são salvos no diretório `./tmp` com os nomes:
 * - `pendentes-para-cadastro.json`: Contém os dados em formato estruturado.
 * - `pendentes-para-cadastro.txt`: Contém os dados em formato de tabela legível.
 *
 * @async
 * @param {Object} params - Parâmetros da função.
 * @param {Object} params.dataValidator - Objeto contendo os resultados da validação dos ativos.
 * @param {Array<Object>} params.dataValidator.existsAssets - Ativos que já existem no GLPI.
 * @param {Array<Object>} params.dataValidator.doesNotExistsAssets - Ativos que ainda não existem no GLPI.
 * @param {Array<Object>} params.dataValidator.updateAssets - Ativos que precisam de atualização de setor no GLPI.
 * @param {Array<Object>} params.manualRegistration - Ativos que devem ser cadastrados manualmente no GLPI.
 *
 * @returns {Promise<Object>} Retorna um objeto com os mesmos dados salvos nos arquivos.
 *
 * @throws {Error} Caso ocorra erro ao escrever os arquivos.
 */

  async manualReviewLogger({dataValidator, manualRegistration }){

    let output = "\n\nCadastros encontrados no glpi. \n\n"
    output += "+------------------------------------------+-----------------+--------------------+\n"
    output += "|                  SETOR                   |   EQUIPAMENTO   |     N° SERIE       |\n"
    output += "+------------------------------------------+-----------------+--------------------+\n"

    for(const item of dataValidator.existsAssets){
      output += `| ${item?.sector?.padEnd(40, " ")} | ${item?.equipment?.padEnd(15, " ")} | ${item?.serie?.padEnd(18, " ")} |\n`
      output += "+------------------------------------------+-----------------+--------------------+\n"
    }


    output += "\n\nCadastros pedentes para ser cadastrado no GLPI. \n\n"
    output += "+--------------------------------+-----------------+--------------------+\n"
    output += "|              SETOR             |   EQUIPAMENTO   |     N° SERIE       |\n"
    output += "+--------------------------------+-----------------+--------------------+\n"

    for(const item of dataValidator.doesNotExistsAssets ){
      output += `| ${item?.sector?.padEnd(30, " ")} | ${item?.equipment?.padEnd(15, " ")} | ${item?.serie?.padEnd(18, " ")} |\n`
      output += "+--------------------------------+-----------------+--------------------+\n"
    }


    output += "\n\nCadastros para atualizar setor no GLPI . \n"
    output += "SETOR DO GLPI => SETOR DA PLANILHA. \n\n"
    output += "+------------------------------------------+-----------------+--------------------+\n"
    output += "|                  SETOR                   |   EQUIPAMENTO   |     N° SERIE       |\n"
    output += "+------------------------------------------+-----------------+--------------------+\n"

    for(const item of dataValidator.updateAssets ){
      output += `| ${item?.sector?.padEnd(40, " ")} | ${item?.equipment?.padEnd(15, " ")} | ${item?.serie?.padEnd(18, " ")} |\n`
      output += "+------------------------------------------+-----------------+--------------------+\n"
    }

    output += "\n\nRealizar cadastro manual no GLPI. \n\n"
    output += "+--------------------------------+-----------------+--------------------+\n"
    output += "|              SETOR             |   EQUIPAMENTO   |     N° SERIE       |\n"
    output += "+--------------------------------+-----------------+--------------------+\n"

    for(const item of manualRegistration ){
      output += `| ${
        item.sector === null ? 
        item?.sector_log?.padEnd(30, " ") :
        item?.sector_log?.padEnd(30, " ")
      } | ${item.equipment === null ?
            item.equipment_log.padEnd(15, " ") :
            item.equipment_log.padEnd(15, " ")
          } | ${item?.serie?.padEnd(18, " ")} |\n`
      output += "+--------------------------------+-----------------+--------------------+\n"
    }

    await fs.promises.writeFile(`./tmp/${this.user}&pendentes-para-cadastro.json`, JSON.stringify({
      existsAssets: dataValidator.existsAssets,
      doesNotExistsAssets: dataValidator.doesNotExistsAssets,
      updateAssets: dataValidator.updateAssets,
      manualRegistration:  manualRegistration
    }, null, 2))

    await fs.promises.writeFile(`./tmp/${this.user}&pendentes-para-cadastro.txt`, output)

    return {
        existsAssets: dataValidator.existsAssets,
        doesNotExistsAssets: dataValidator.doesNotExistsAssets,
        updateAssets: dataValidator.updateAssets,
        manualRegistration:  manualRegistration
      }
  }

  /**
   * Retorna os ativos de um tipo específico com paginação.
   * 
   * @param {Object} params
   * @param {string} params.typeReport - Tipo do relatório: `existsAssets`, `doesNotExistsAssets`, `updateAssets`.
   * @param {number|string} params.page - Página atual.
   * @param {number|string} params.limit - Limite de itens por página.
   * @returns {Promise<Object>} Dados paginados.
   * @throws {AppError} Se o relatório não tiver sido gerado ou não houver registros.
   */

  async indexPaginationReport({ typeReport, page, limit }){
    const readFile = await fs.promises.readdir("./tmp")
    if(!readFile.includes(`${this.user}&pendentes-para-cadastro.json`)){
      throw new AppError("Relatório não gerado.", 400)
    }

    const data = await fs.promises.readFile(`./tmp/${this.user}&pendentes-para-cadastro.json`)
    const dataJson = JSON.parse(data)

    if(!dataJson[typeReport].length){
      throw new AppError("Não tem registro.", 400)
    }

    const paginationDataJson = pagination(page, limit, dataJson[typeReport])
    
    return paginationDataJson
  }

  /**
   * Remove um ativo de um tipo específico de relatório, baseado no ID.
   * 
   * @param {Object} params
   * @param {string} params.typeReport - Tipo do relatório.
   * @param {string} params.id - ID do item a ser removido.
   * @returns {Promise<void>}
   */

  async removeReport({ typeReport, id }){
    const data = await this.processingData({ typeReport, id })
    
    const RemoveItem = data.dataJson[typeReport].filter(value => !(value.id === id))

    await fs.promises.writeFile(`./tmp/${this.user}&pendentes-para-cadastro.json`, 
      JSON.stringify({ [typeReport]: RemoveItem, ...data.restDataJson }, null, 4))
    
    return    
  }

  /**
   * Atualiza um ativo de um tipo de relatório pelo ID, aplicando os novos dados.
   * 
   * @param {Object} params
   * @param {string} params.typeReport - Tipo do relatório.
   * @param {string} params.id - ID do item a ser atualizado.
   * @param {Object} params.updates - Objeto com os dados a serem atualizados.
   * @returns {Promise<void>}
   */

  async updateReport({ typeReport, id, updates }){
    const data = await this.processingData({ typeReport, id })

    const updateItem = data.dataJson[typeReport].map(value => {
      if(value.id === id){
        return {
          ...value,
          ...updates
        }
      }
      return value
    })

    await fs.promises.writeFile(`./tmp/${this.user}&pendentes-para-cadastro.json`, 
      JSON.stringify({ [typeReport]: updateItem, ...data.restDataJson }, null, 4))
    
    return  
  }

    /**
   * Lê o arquivo de relatório e separa os dados do tipo de relatório solicitado dos demais.
   * 
   * @param {Object} element
   * @param {string} element.typeReport - Tipo de relatório.
   * @param {string} element.id - ID do item (opcional, usado em update/remove).
   * @returns {Promise<{ restDataJson: Object, dataJson: Object }>} Dados processados.
   * @throws {AppError} Se o arquivo de relatório não existir.
   */

  async processingData(element){
    const readFile = await fs.promises.readdir("./tmp")
    if(!readFile.includes(`${this.user}&pendentes-para-cadastro.json`)){
      throw new AppError("Relatório não gerado.", 400)
    }
    
    const data = await fs.promises.readFile(`./tmp/${this.user}&pendentes-para-cadastro.json`)
    const dataJson = JSON.parse(data)
    
    let restDataJson = null

    if(element.typeReport === "existsAssets"){
      const { existsAssets, ...rest } = dataJson
      restDataJson = rest
    }else if(element.typeReport === "doesNotExistsAssets"){
      const { doesNotExistsAssets, ...rest } = dataJson
      restDataJson = rest
    }else {
      const { updateAssets, ...rest } = dataJson
      restDataJson = rest
    }

    return { restDataJson, dataJson } 
  }
}