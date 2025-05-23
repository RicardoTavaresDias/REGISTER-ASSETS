import { pagination } from "../utils/pagination.js"
import { Repository } from "../repositories/Repository.js"
import { Validation } from "../validation/Validation.js"
import { AppError } from "../utils/AppError.js"

/**
 * Classe responsável por gerenciar sugestões de cadastro de equipamentos, setores e unidades.
 * Permite listar, criar e remover registros nas tabelas correspondentes.
 */

export class SuggestionsSearch {
  
  /**
   * Lista sugestões cadastradas no banco de dados de acordo com o tipo (equipment, sector ou unit).
   * Suporta paginação opcional via query string (?page=1&limit=10).
   *
   * @param {Object} request - Objeto da requisição HTTP.
   * @param {Object} request.params - Parâmetros da URL, deve conter `type` (equipment | sector | unit).
   * @param {Object} request.query - Query string, pode conter `page` e `limit`.
   * @param {Object} response - Objeto da resposta HTTP.
   *
   * @returns {Promise<Response>} Retorna uma lista dos itens cadastrados ou uma resposta paginada.
   */

  async index(request, response) {
    const validationParams = new Validation()
    const params = validationParams.validationType(request.params)

    const page = request.query.page
    const limitPage = request.query.limit

    const repository = new Repository()
    const readFile = await repository.search.searchAll(
      params.type === "equipment" ? 
        "type_Equipment" :
        (params.type === "sector" ? "type_Sector" : "unit")
    )
 
    if(!readFile || !readFile.length){
      return response.status(400).json({ message: "Dados não encontrados." })
    }

    if(page && limitPage){
      const dataRead = pagination(page, limitPage, readFile)
      return response.status(200).json(dataRead)
    }
    
     return response.status(200).json(readFile.map(value => ({ id: value.id, name: value.name })))
  }

  /**
   * Cria novos registros nas tabelas de sugestões (type_Equipment, type_Sector ou unit),
   * validando se já existem previamente.
   *
   * @param {Object} request - Objeto da requisição HTTP.
   * @param {Object} request.params - Deve conter `type` (equipment | sector | unit).
   * @param {Object} request.body - Corpo da requisição, deve conter os dados a serem cadastrados.
   * @param {Object} response - Objeto da resposta HTTP.
   *
   * @returns {Promise<Response>} Retorna mensagem de sucesso ou lança erro se já existir na base.
   *
   * @throws {AppError} Se algum dos itens informados já existir no banco de dados.
   */
 
  async create(request, response){
    const validationSchema = new Validation()
    const params = validationSchema.validationType(request.params)
    const data = validationSchema.suggestions({ requestBody: request.body, requestParms: request.params.type })

    const names = data.map(value => value.name)

    const repository = new Repository()
    const existsData = await repository.search.searchByNameAll(
      { 
        tableDb: params.type === "equipment" ? 
          "type_Equipment" :
          (params.type === "sector" ? "type_Sector" : "unit"),
        value: names 
      })

    if(existsData.length){
      throw new AppError("Item já foi adicionado na lista.", 400)
    } 

    await repository.create.createAll(
      { 
        tableDb: params.type === "equipment" ? 
          "type_Equipment" :
          (params.type === "sector" ? "type_Sector" : "unit"),
        data: params.type === "sector" ? 
          data.map(value => ({ idglpi: value.id_glpi, name: value.name })) : data
      })

    response.status(201).json({ message: `Item adicionado com sucesso.` })
  }

  /**
   * Remove um item da tabela de sugestões com base no tipo e no ID informado.
   *
   * @param {Object} request - Objeto da requisição HTTP.
   * @param {Object} request.params - Deve conter `type` (equipment | sector | unit) e `id`.
   * @param {Object} response - Objeto da resposta HTTP.
   *
   * @returns {Promise<Response>} Retorna mensagem de sucesso após remoção.
   */

  async remove(request, response){
    const validationSchema = new Validation()
    const params = validationSchema.validationType(request.params)

    const repository = new Repository()
    await repository.remove.removeId(
      { 
        tableDb: params.type === "equipment" ? 
          "type_Equipment" :
          (params.type === "sector" ? "type_Sector" : "unit"), 
        id: Number(request.params.id)
      })
      
    
    response.status(201).json({ message: "Item removido com sucesso." })
  }
}