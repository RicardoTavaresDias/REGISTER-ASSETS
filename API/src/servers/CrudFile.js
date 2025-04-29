import fs from "node:fs"
import { pagination } from "../utils/pagination.js"

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

  async _Read(){
    try {
      return await fs.promises.readFile(this.objectPath.path, "utf-8")
    }catch(error){
      throw new Error( error.message )
      
    }
  }

  async _Write(data){
    try {
      return fs.promises.writeFile(this.objectPath.path, JSON.stringify(data, null, 1))
    }catch(error){
      throw new Error( error.message )
    }
  }
  

  async readFile(page, limitPage){
    const data = await this._Read()
    const { results, totalPage } = pagination(page, limitPage, JSON.parse(data))
    return { totalPage: totalPage, results }
  }


  async addWriteFile(requestBody){
    const data = await this._Read()
    const dataJson = JSON.parse(data)

    const mapDataJson = dataJson.map(value => value[this.objectPath.type])
    const existsDataJson = requestBody.data.filter(value => mapDataJson.includes(value.name))
    
    if(existsDataJson.length){
      throw new Error("Item já foi adicionado na lista.")
    }

    for(const items of requestBody.data){
      this.objectPath.type !== "sector" ?
        dataJson.push({ [this.objectPath.type]: items.name }) :
          dataJson.push({ id: items.id, [this.objectPath.type]: items.name })
    }

    await this._Write(dataJson)
    return { message: `Item adicionado com sucesso no ${this.objectPath.type}` }
  }


  async removeWriteFile(RequestBody){
    // Comparação ignorando acentos - exemplos: "Coração", "coracao" = true - são iguais
    const notAccents = word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

    const data = await this._Read()
    const dataJson = JSON.parse(data)

    const namesBody = RequestBody.data.map(value => value.name)
    const remove = dataJson.filter(value => 
      !notAccents(String(namesBody)).includes(notAccents(value[this.objectPath.type]))
    )
    
    if(remove.length === dataJson.length){
      throw new Error("Item não encontrado na base.")
    }
   
    await this._Write(remove)
    return { message: "Item removido com sucesso." }
  }
}