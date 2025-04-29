import { z } from "zod"
import { CrudFile } from "../services/CrudFile.js"
import { Paths } from "../utils/Paths.js"

export class SuggestionsSearch {
   async index(request, response) {  
    const page = request.query.page
    const limitPage = request.query.limit

    const path = Paths({ typeController: "suggestions", type: request.params.type })
    const crudfile = new CrudFile(path)
    const dataRead = await crudfile.readFile(page, limitPage)

    if(!dataRead){
      return response.status(400).json({ message: "Dados não encontrado." })
    }
    return response.status(200).json( dataRead )
  }

  async create(request, response){
    const suggestionsSchema = z.object({
      id: z.optional(z.string().min(1, { message: "Este campo é obrigatório. Informe id novo do GLPI." })),
      name: z.string().min(1, { message: "Este campo é obrigatório. Informe setor novo do GLPI." })
    }).superRefine((value, contexo) => { 
      if(request.params.type === "sector"){
        if(!value.id){
          contexo.addIssue({
            path: ['id'],
            message: "Informe id do setor."
          })
        }
      }
    })

    const suggestionsArraySchema = z.array(suggestionsSchema)
    const resultSchema = suggestionsArraySchema.safeParse(request.body)

    if(!resultSchema.success){
      return response.status(400).json({
        error: resultSchema.error.issues[0].message
      })
    }

    const path = Paths({ typeController: "suggestions", type: request.params.type })
    const crudfile = new CrudFile(path)
    const dataWrite = await crudfile.addWriteFile(resultSchema)

    response.status(201).json(dataWrite)
  }

  async remove(request, response){
    const suggestionsSchema = z.object({
      name: z.string().min(1, { message: "Adiciona name na 'params query' para remoção do item da lista."})
    })

    const suggestionsArraySchema = z.array(suggestionsSchema)
    const resultSchema = suggestionsArraySchema.safeParse(request.body)

    if(!resultSchema.success){
      return response.status(400).json({
        error: resultSchema.error.issues[0].message
      })
    }

    const path = Paths({ typeController: "suggestions", type: request.params.type })
    const crudfile = new CrudFile(path)
    const dataRemove = await crudfile.removeWriteFile(resultSchema)

    response.status(201).json(dataRemove)
  }
}