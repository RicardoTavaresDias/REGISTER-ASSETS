import { z } from "zod"
import { CrudFile } from "../servers/CrudFile.js"
import { Paths } from "../utils/Paths.js"

export class SuggestionsSearch {
   async index(request, response) {  
    const dataRead = await new CrudFile(Paths({ typeController: "suggestions", type: request.params.type }), request, response).readFile()
    
    if(!dataRead){
      return response.status(400).json({ message: "Dados não encontrado." })
    }
    return response.status(200).json( dataRead )
  }

  async insert(request, response){
    const suggestionsSchema = z.object({
          id: z.string().optional(),
          name: z.string().min(1, { message: "Este campo é obrigatório. Informe setor novo do GLPI." })
        }).superRefine((value, contexo) => {
          if(request.params.type === "sector"){
            if(!value.id){
              contexo.addIssue({
                path: ['id'],
                message: "Este campo é obrigatório. Informe id novo do GLPI."
              })
            }
          }      
        })

    const suggestionsArraySchema = z.array(suggestionsSchema)
    const result = suggestionsArraySchema.safeParse(request.body)

    if(!result.success){
      return response.status(400).json({
        error: result.error.issues[0].message
      })
    }

    const dataWrite = await new CrudFile(Paths({ typeController: "suggestions", type: request.params.type }), request, response).addWriteFile(result)

    response.status(201).json(dataWrite)
  }

  async remove(request, response){
    const suggestionsSchema = z.object({
      name: z.string().min(1, { message: "Adiciona name na 'params query' para remoção do item da lista."})
    })

    const suggestionsArraySchema = z.array(suggestionsSchema)
    const result = suggestionsArraySchema.safeParse(request.body)

    if(!result.success){
      return response.status(400).json({
        error: result.error.issues[0].message
      })
    }

    const dataRemove = await new CrudFile(Paths({ typeController: "suggestions", type: request.params.type }), request, response).removeWriteFile(result)

    response.status(201).json(dataRemove)
  }
}