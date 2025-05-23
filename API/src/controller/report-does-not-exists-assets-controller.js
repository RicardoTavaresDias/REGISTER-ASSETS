import { AssetReport } from "../core/AssetReport.js"
import { Validation } from "../validation/Validation.js"

/**
 * Controller responsável por gerenciar os relatórios de ativos: inexistentes.
 */

export class ReportDoesNotExistsAssetsController {
  
   /**
   * Lista os ativos que não existem (inexistentes) com paginação.
   * 
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async index(request, response){
    const assetReport = new AssetReport(request.user.user)
    const resultPagination = await assetReport
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

  async remove(request, response){
    const assetReport = new AssetReport(request.user.user)
    await assetReport.removeReport({ typeReport: "doesNotExistsAssets", id: request.params.id })

    response.status(200).json({ message: "Item removido com sucesso." })
  } 

   /**
   * Atualiza um ativo inexistente no relatório pelo ID.
   * 
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async update(request, response){
    const validation = new Validation()
    const responseSchema = validation.report(request.body)

    const assetReport = new AssetReport(request.user.user)
    await assetReport.updateReport({ typeReport: "doesNotExistsAssets", id: request.params.id, updates: responseSchema })

    response.status(200).json({ message: "Dados atualizado com sucesso." })
  }
}