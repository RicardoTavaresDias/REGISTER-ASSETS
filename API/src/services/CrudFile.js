import fs from "node:fs"
import { pagination } from "../utils/pagination.js"
import { normalizeText } from "../lib/normalizeText.js"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Abstrair operações de leitura, escrita e remoção de dados em arquivos JSON locais.
 * 
 * @typedef {Object} objectPath
 * @property { 'suggestions' | 'logs' } path caminho do arquivo
 * @property { 'equipment' | 'sector' | 'units' } [type] Tipo do elemento. Só presente em suggestions.
 */ 

 /**
 * @typedef {Object} RequestBody
 * @property { string } name schema request body
 * @property { number } [id] schema request body
 */


export class CrudFile {
  constructor (objectPath){
    this.objectPath = objectPath
  }

  /**
 * Lê dados do caminho definido em `objectPath.path`.
 * 
 * - Se for um nome de tabela (menor que 16 caracteres), usa Prisma.
 * - Caso contrário, lê de um arquivo JSON local.
 *
 * @returns {Promise<Array|String>} Dados lidos (array de objetos ou string JSON).
 */

  async _Read(){
    try {
      return this.objectPath.path.length < 16 ? await prisma[this.objectPath.path].findMany() : 
        await fs.promises.readFile(this.objectPath.path, "utf-8") 
    }catch(error){
      throw new Error( error.message )
      
    }
  }

/**
 * Escreve um item no destino apropriado.
 *
 * - Se `objectPath.path` for uma tabela, insere via Prisma.
 * - Caso contrário, escreve no arquivo local (sobrescreve o conteúdo).
 *
 * @param {{ name: string, id?: number }} data - Item a ser inserido.
 * @returns {Promise<void>}
 */

  async _Write(data){
    try {
      if(this.objectPath.path.length < 16){
        if(this.objectPath.path !== "sector"){
          return await prisma[this.objectPath.path].create({
            data: {
              name: data.name
            }
          })
      }
      return await prisma[this.objectPath.path].create({
          data: {
            name: data.name,
            id_glpi: data.id
          }
        })
      }
      fs.promises.writeFile(this.objectPath.path, data)
    }catch(error){
      throw new Error( error.message )
    }
  }
  
  _GetPagination(page, limitPage, data){
    const { results, totalPage } = pagination(page, limitPage, data)
    return { totalPage: totalPage, results }
  }

  /**
 * Lê os dados e, se necessário, converte JSON string para objeto.
 *
 * @returns {Promise<Array>} Lista de dados lidos.
 */

  async readFile(){
    const data = await this._Read()
    return data || JSON.parse(data)
  }

  /**
 * Adiciona novos itens ao destino, verificando se já existem por nome.
 *
 * @param {{ data: Array<RequestBodyItem> }} requestBody - Lista de itens a adicionar.
 * @returns {Promise<{ message: string }>}
 * @throws {Error} Se algum nome já existir.
 */

  async addWriteFile(requestBody){
    const data = await this._Read()

    const mapData = data.map(value => value.name)
    const existsData = requestBody.data.filter(value => mapData.includes(value.name))

    if(existsData.length){
      throw new Error("Item já foi adicionado na lista.")
    }

    for(const items of requestBody.data){
        await this._Write(items)
    }
  
    return { message: `Item adicionado com sucesso no ${this.objectPath.type}` }
  }

/**
 * Remove itens com base no campo `name`.
 *
 * - Verifica por nome normalizado.
 * - Opera apenas com banco de dados (Prisma).
 *
 * @param {{ data: Array<{ name: string }> }} requestBody - Lista de nomes a remover.
 * @returns {Promise<{ message: string }>}
 * @throws {Error} Se nenhum nome for encontrado.
 */
  
  async removeWriteFile(RequestBody){
    const data = await this._Read()
    //const dataJson = JSON.parse(data)
    
    const namesBody = RequestBody.data.map(value => value.name)
    const remove = data.filter(value => 
      normalizeText(String(namesBody)).includes(normalizeText(value.name))
    )
    
    if(!remove.length){
      throw new Error("Item não encontrado na base.")
    }

    for(const item of remove){
      await prisma[this.objectPath.path].delete({ where: { id: item.id } })
    }
    //await this._Write(remove)
    return { message: "Item removido com sucesso." }
  }
}