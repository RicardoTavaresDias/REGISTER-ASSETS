import { z } from "zod"
import { CrudFile } from "../services/CrudFile.js"
import { Paths } from "../utils/Paths.js"

/**
 * Controller responsável pelo gerenciamento de sugestões de dados (ex: setores, locais, etc.).
 * Lê e grava dados em arquivos usando paginação, validação com Zod e estrutura dinamicamente os caminhos.
 */

export class SuggestionsSearch {
  /**
   * Lista sugestões com paginação.
   *
   * @param {import('express').Request} request - Requisição contendo `page` e `limit` como query params, além de `type` como param.
   * @param {import('express').Response} response - Retorna um array paginado das sugestões.
   * 
   * @returns {Promise<void>}
   */

   async index(request, response) {  
    const page = request.query.page
    const limitPage = request.query.limit

    const path = Paths({ typeController: "suggestions", type: request.params.type })
    const crudfile = new CrudFile(path)
    const readFile = await crudfile.readFile()
    const dataRead = crudfile._GetPagination(page, limitPage, readFile)

    if(!dataRead){
      return response.status(400).json({ message: "Dados não encontrado." })
    }
    return response.status(200).json( dataRead )
  }

  /**
   * Cria novas sugestões, com validação condicional se o tipo for "sector".
   * 
   * @param {import('express').Request} request - Requisição contendo um array de sugestões no corpo e `type` como param.
   * @param {import('express').Response} response - Retorna os dados adicionados ou erro de validação.
   * 
   * @returns {Promise<void>}
   */

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

  /**
   * Remove sugestões com base no campo `name` passado no corpo da requisição.
   *
   * @param {import('express').Request} request - Requisição com array de objetos contendo `name` para remoção.
   * @param {import('express').Response} response - Resposta confirmando remoção dos dados.
   * 
   * @returns {Promise<void>}
   */

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