import { z } from "zod"
import fs from "node:fs"

export class SuggestionsServer {
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
  

  async readAll(){
    const data = await this._Read()
    return this.response.status(200).json(JSON.parse(data))
  }


  async addWriteFile(){
    const suggestionsSchema = z.object({
      id: z.string().optional(),
      name: z.string().min(1, { message: "Este campo é obrigatório. Informe setor novo do GLPI." })
    }).superRefine((value, contexo) => {
      if(this.request.params.type === "sector"){
        if(!value.id){
          contexo.addIssue({
            path: ['id'],
            message: "Este campo é obrigatório. Informe id novo do GLPI."
          })
        }
      }      
    })

    const suggestionsArraySchema = z.array(suggestionsSchema)
    const result = suggestionsArraySchema.safeParse(this.request.body)

    if(!result.success){
      return this.response.status(400).json({
        error: result.error.issues[0].message
      })
    }

    const data = await this._Read()

    const dataJson = JSON.parse(data)

    for(const items of result.data){
      this.request.params.type !== "sector" ?
        dataJson.push({ [this.objectPath.type]: items.name }) :
          dataJson.push({ id: items.id, [this.objectPath.type]: items.name })
    }

    await this._Write(dataJson)
    return this.response.status(201).json({ message: `Item adicionado com sucesso no ${this.objectPath.type}` })
  }


  async removeWriteFile(){
    const suggestionsSchema = z.object({
      name: z.string().min(1, { message: "Adiciona name na 'params query' para remoção do item da lista."})
    })

    const suggestionsArraySchema = z.array(suggestionsSchema)
    const result = suggestionsArraySchema.safeParse(this.request.body)

    if(!result.success){
      return this.response.status(400).json({
        error: result.error.issues[0].message
      })
    }

    const data = await this._Read()
    const dataJson = JSON.parse(data)

    // Comparação ignorando acentos - exemplos: "Coração", "coracao" = true - são iguais
    const notAccents = word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

    const namesBody = result.data.map(value => value.name)
    const remove = dataJson.filter(value => 
      !notAccents(String(namesBody)).includes(notAccents(value[this.request.params.type]))
    )

    if(remove.length === dataJson.length){
      return this.response.status(400).json({ message: "Item não encontrado na base."})
    }
   
    await this._Write(remove)
    return this.response.status(201).json({ 
      message: "Item removido com sucesso."
    })
  }
}