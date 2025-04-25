import { z } from "zod"
import fs from "node:fs"

export class SuggestionsServer {
  constructor (path, request, response){
    this.path = path
    this.request = request
    this.response = response
  }

  readAll(){
    fs.readFile(this.path, (error, data) => {
      if(error){
        return this.response.status(400).json({ message: error.message })
      }
      return this.response.status(200).json(JSON.parse(data))
    })
  }

  addWriteFile(){
    fs.readFile(this.path, (error, data) => {
      if(error){
        this.response.status(400).json({ message: error.message })
        return
      }

      const suggestionsSchema = z.object({
        name: z.string().min(1, { message: "Este campo é obrigatório. Informe um valor." }),
      })
      const suggestionsArraySchema = z.array(suggestionsSchema)
      const result = suggestionsArraySchema.safeParse(this.request.body)

      if(!result.success){
        return this.response.status(400).json({
          error: result.error.issues[0].message
        })
      }
      
      const dataJson = JSON.parse(data)
      const extractName = this.path.split("-")[2].split(".")[0]

      for(const items of result.data){
        dataJson.push({ [extractName]: items.name })
      }
    
      fs.writeFile(this.path, JSON.stringify(dataJson, null, 1), (error) => {
        if(error){
          return this.response.status(400).json({ message: `Erro ao adicionar item no ${extractName}!:`, error })
        } 
      })
  
      return this.response.status(201).json({ message: `Item adicionado com sucesso no ${extractName}` })
    })
  }
}


