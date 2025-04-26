import { z } from "zod"
import fs from "node:fs"

export class SuggestionsServer {
  constructor (objectPath, request, response){
    this.objectPath = objectPath
    this.request = request
    this.response = response
  }

  readAll(){
    fs.readFile(this.objectPath.path, (error, data) => {
      if(error){
        return this.response.status(400).json({ message: error.message })
      }
      return this.response.status(200).json(JSON.parse(data))
    })
  }

  addWriteFile(){
    fs.readFile(this.objectPath.path, (error, data) => {
      if(error){
        this.response.status(400).json({ message: error.message })
        return
      }

      const suggestionsSchema = z.object({
        id: z.string().min(1, { message: "Este campo é obrigatório. Informe id novo do GLPI." }),
        name: z.string().min(1, { message: "Este campo é obrigatório. Informe setor novo do GLPI." })
      })
      const suggestionsArraySchema = z.array(suggestionsSchema)
      const result = suggestionsArraySchema.safeParse(this.request.body)

      if(!result.success){
        return this.response.status(400).json({
          error: result.error.issues[0].message
        })
      }
      
      const dataJson = JSON.parse(data)

      for(const items of result.data){
        dataJson.push({ id: items.id, [this.objectPath.type]: items.name })
      }
    
      fs.writeFile(this.objectPath.path, JSON.stringify(dataJson, null, 1), (error) => {
        if(error){
          return this.response.status(400).json({ message: `Erro ao adicionar item no ${this.objectPath.type}!:`, error })
        } 
      })
  
      return this.response.status(201).json({ message: `Item adicionado com sucesso no ${this.objectPath.type}` })
    })
  }

  removeWriteFile(){
    // Realizar remoção do conteúdo que foi cadastrado errado ou item removido no glpi.
  }
}


