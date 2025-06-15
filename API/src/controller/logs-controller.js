import fs from "node:fs"
import { Repository } from "../repositories/Repository.js"

/**
 * Controller responsável por lidar com logs da aplicação.
 * Pode retornar e remover logs de erro ou logs de dados inválidos relacionados a equipamentos ou setores.
 */

export class LogsController {
 
       /**
 * Retorna os registros de log de acordo com o tipo informado.
 *
 * - Se o tipo for `"error"`:
 *   - Lê o conteúdo do arquivo `./src/logs/error.json`.
 *   - Suporta paginação via query params `page` e `limit`.
 *    - Se o tipo for `"equipment"` ou `"sector"`:
 *   - Busca os registros nas tabelas `log_Equipment_invalid` ou `log_Sector_invalid` no banco de dados.
 *
 * @param {Object} request - Objeto da requisição Express.
 * @param {Object} response - Objeto da resposta Express.
 * @returns {Promise<Response>} Resposta HTTP com os logs encontrados ou mensagem de ausência de registros.
 *
 * @example
 * GET /logs/error
 * GET /logs/error?page=1&limit=10
 * GET /logs/equipment
 * GET /logs/sector
 */

  async index(request, response){
    const { page, limit } = request.query

    if (request.params.type === "error"){
      const data = await fs.promises.readFile("./src/logs/error.json")
      if(data.toString() === "") return response.status(400).json({ message: "Sem registros disponíveis no log." })

      const dataPagination = pagination(page, limit, JSON.parse(data))

      if(page && limit){
        return response.status(200).json(dataPagination)
      }

      return response.status(200).json(JSON.parse(data))
    }
    
    const repository = new Repository()
    const data = await repository.search.searchAll(
      request.params.type === "equipment" ? 
      "log_Equipment_invalid" : 
      "log_Sector_invalid"
    )

    if(!data.length) return response.status(400).json({ message: "Sem registros disponíveis no log." })
    
    response.status(200).json(data)
  }
  

  /**
   * Remove os registros de log de acordo com o tipo informado.
   *
   * - Se o tipo for `"error"`, limpa o conteúdo do arquivo `./src/logs/error.txt`.
   * - Se for `"equipment"` ou `"sector"`, remove todos os registros da respectiva tabela de log no banco de dados.
   *
   * @param {Object} request - Objeto da requisição Express.
   * @param {Object} response - Objeto da resposta Express.
   * @returns {Promise<Response>} Resposta HTTP confirmando a remoção dos logs.
   *
   * @example
   * DELETE /logs/error
   * DELETE /logs/equipment
   * DELETE /logs/sector
   */

  async remove(request, response){
    if (request.params.type === "error"){
      await fs.promises.writeFile("./src/logs/error.txt", "")

      return response.status(200).json({ message: "Logs removido com sucesso." })
    }

    const repository = new Repository()  
    const data = repository.remove.removeAllContent(
      request.params.type === "equipment" ? 
      "log_Equipment_invalid" : 
      "log_Sector_invalid"
    )

     if(!data.length) return response.status(400).json({ message: "Sem registros disponíveis no log." })

    response.status(200).json({ message: "Logs removido com sucesso." })
  }
}