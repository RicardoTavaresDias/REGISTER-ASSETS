import { z } from "zod"
import { CrudFile } from "../services/CrudFile.js"
import { Paths } from "../utils/Paths.js"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller responsável pelo gerenciamento de sugestões de dados (ex: setores, locais, etc.).
 * Lê e grava dados em arquivos usando paginação, validação com Zod e estrutura dinamicamente os caminhos.
 */

export class SuggestionsSearch {
  /**
   * Lista sugestões armazenadas em arquivo, com ou sem paginação.
   *
   * - Se `page` e `limit` forem fornecidos via query, os dados retornados serão paginados.
   * - Caso contrário, retorna todos os dados.
   *
   * @param {import('express').Request} request - Requisição HTTP contendo:
   *   - `type` (param): tipo da sugestão (ex: 'sector', 'local', etc.), para definir roteamento.
   *   - `page` (query, opcional): número da página para paginação.
   *   - `limit` (query, opcional): quantidade de itens por página.
   *
   * @param {import('express').Response} response - Retorna JSON com os dados das sugestões (paginados ou não).
   *
   * @returns {Promise<void>}
   *
   * @throws {400} - Caso o arquivo não contenha dados ou esteja vazio.
   */

   async index(request, response) {
    const page = request.query.page
    const limitPage = request.query.limit

    const path = Paths({ typeController: "suggestions", type: request.params.type })
    const crudfile = new CrudFile(path)
    const readFile = await crudfile.readFile()

    if(!readFile || !readFile.length){
      return response.status(400).json({ message: "Dados não encontrados." })
    }

    if(page && limitPage){
      const dataRead = crudfile._GetPagination(page, limitPage, readFile)
      return response.status(200).json(dataRead)
    }
    
     return response.status(200).json(readFile.map(value => ({ name: value.name })))
  }

  /**
 * Cria novas sugestões, com validação condicional se o tipo for "sector".
 * 
 * - Se o `type` for `"sector"`, o campo `id` será obrigatório em cada sugestão.
 * - Para outros tipos, apenas o campo `name` será exigido.
 * 
 * @param {import('express').Request} request - Requisição contendo:
 *   - `params.type`: tipo da sugestão (ex: "sector", "local", etc.).
 *   - `body`: array de sugestões a serem criadas. Cada sugestão deve conter ao menos `name`, e `id` se o tipo for "sector".
 *
 * @param {import('express').Response} response - Retorna os dados adicionados em caso de sucesso, ou mensagem de erro de validação.
 * 
 * @returns {Promise<void>}
 * 
 * @throws {400} - Se a validação falhar, retorna a primeira mensagem de erro encontrada.
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
 * - Cada item do corpo da requisição deve conter o campo `name` da sugestão a ser removida.
 *
 * @param {import('express').Request} request - Requisição contendo:
 *   - `params.type`: tipo da sugestão (ex: "sector", "local", etc.), para localizar o arquivo correspondente.
 *   - `body`: array de objetos, cada um com um campo `name` representando a sugestão a ser removida.
 *
 * @param {import('express').Response} response - Retorna os dados removidos, ou erro de validação.
 * 
 * @returns {Promise<void>}
 * 
 * @throws {400} - Se algum item do corpo não contiver `name` válido.
 */

  async remove(request, response){
    const suggestionsSchema = z.object({
      name: z.string().min(1, { message: "O campo 'name' é obrigatório para remover o item da lista."})
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