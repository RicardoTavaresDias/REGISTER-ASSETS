import { AssetReport } from "../core/AssetReport.js"
import { Validation } from "../model/Validation.js"

/**
 * Controller responsável por gerenciar os relatórios de ativos: existentes, inexistentes e para atualização.
 */

export class ReportController {

/**
   * Lista os ativos existentes com paginação.
   * 
   * @param {import("express").Request} request - Requisição HTTP contendo `page` e `limit` como query params.
   * @param {import("express").Response} response - Resposta HTTP com a lista paginada dos ativos existentes.
   * @returns {Promise<void>}
   */

  async getExistsAssets(request, response){
    const resultPagination = await new AssetReport()
      .indexPaginationReport({
        typeReport: "existsAssets",
        page: request.query.page,
        limit: request.query.limit
      })

    response.status(200).json(resultPagination)
  } 

  /**
   * Remove um ativo existente do relatório pelo ID.
   * 
   * @param {import("express").Request} request - Requisição HTTP contendo o ID no parâmetro da URL.
   * @param {import("express").Response} response - Resposta HTTP confirmando a exclusão.
   * @returns {Promise<void>}
   */

  async removeExistsAssets(request, response){
    await new AssetReport().removeReport({ typeReport: "existsAssets", id: request.params.id })
    
    response.status(200).json({ message: "Item removido com sucesso." })
  } 

  /**
   * Atualiza um ativo existente no relatório pelo ID.
   * 
   * @param {import("express").Request} request - Requisição HTTP com o ID na URL e os dados no corpo.
   * @param {import("express").Response} response - Resposta HTTP confirmando a atualização.
   * @returns {Promise<void>}
   */

  async updateExistsAssets(request, response){
    const responseSchema = new Validation().report(request.body)
    new AssetReport().updateReport({ typeReport: "existsAssets", id: request.params.id, updates: responseSchema })

    response.status(200).json({ message: "Dados atualizado com sucesso." })
  }

   /**
   * Lista os ativos que não existem (inexistentes) com paginação.
   * 
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async getDoesNotExistsAssets(request, response){
    const resultPagination = await new AssetReport()
      .indexPaginationReport({
        typeReport: "doesNotExistsAssets",
        page: request.query.page,
        limit: request.query.limit
      })

    response.status(200).json(resultPagination)
  }

  /**
   * Remove um ativo inexistente do relatório pelo ID.
   * 
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async removeDoesNotExistsAssets(request, response){
    await new AssetReport().removeReport({ typeReport: "doesNotExistsAssets", id: request.params.id })
    
    response.status(200).json({ message: "Item removido com sucesso." })
  } 

   /**
   * Atualiza um ativo inexistente no relatório pelo ID.
   * 
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async updateDoesNotExistsAssets(request, response){
    const responseSchema = new Validation().report(request.body)
    new AssetReport().updateReport({ typeReport: "doesNotExistsAssets", id: request.params.id, updates: responseSchema })

    response.status(200).json({ message: "Dados atualizado com sucesso." })
  }

  /**
   * Lista os ativos que devem ser atualizados, com paginação.
   * 
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async getUpdateAssets(request, response){
    const resultPagination = await new AssetReport()
      .indexPaginationReport({
        typeReport: "updateAssets",
        page: request.query.page,
        limit: request.query.limit
      })

    response.status(200).json(resultPagination)
  }

  /**
   * Remove um ativo do relatório de atualização pelo ID.
   * 
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async removeUpdateAssets(request, response){
    await new AssetReport().removeReport({ typeReport: "updateAssets", id: request.params.id })
    
    response.status(200).json({ message: "Item removido com sucesso." })
  } 

  /**
   * Atualiza um ativo no relatório de atualização pelo ID.
   * 
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async updateAssets(request, response){
    const responseSchema = new Validation().report(request.body)
    new AssetReport().updateReport({ typeReport: "updateAssets", id: request.params.id, updates: responseSchema })

    response.status(200).json({ message: "Dados atualizado com sucesso." })
  }
}