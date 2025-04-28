import fs from "node:fs"
import { pagination } from "../utils/pagination.js"

export class CrudFile {
  constructor (objectPath, request, response){
    this.objectPath = objectPath
    this.request = request
    this.response = response
  }

  async _Read(){
    try {
      return await fs.promises.readFile(this.objectPath.path)
    }catch(error){
      return this.response.status(400).json({ message: error.message })
    }
  }

  async _Write(data){
    try {
      return fs.promises.writeFile(this.objectPath.path, JSON.stringify(data, null, 1))
    }catch(error){
      return this.response.status(400).json({ message: error.message })
    }
  }
  

  async readFile(){
    const page = this.request.query.page
    const limit = this.request.query.limit

    const data = await this._Read()
    const { results, totalPage } = pagination(page, limit, JSON.parse(data))
    return { totalPage: totalPage, results }
  }


  async addWriteFile(requestBody){
    const data = await this._Read()
    const dataJson = JSON.parse(data)

    const mapDataJson = dataJson.map(value => value[this.objectPath.type])
    const existsDataJson = requestBody.data.filter(value => mapDataJson.includes(value.name))
    
    if(existsDataJson.length){
      return this.response.status(400). json({ message: "Item já foi adicionado na lista." })
    }

    for(const items of requestBody.data){
      this.request.params.type !== "sector" ?
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
      !notAccents(String(namesBody)).includes(notAccents(value[this.request.params.type]))
    )
    
    if(remove.length === dataJson.length){
      return this.response.status(400).json({ message: "Item não encontrado na base."})
    }
   
    await this._Write(remove)
    return { message: "Item removido com sucesso." }
  }
}