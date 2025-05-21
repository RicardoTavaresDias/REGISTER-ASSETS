import { AssetReport } from "../core/AssetReport.js"
import { Validation } from "../model/Validation.js"

/**
 * Controller responsável por gerenciar os relatórios de ativos: atualização.
 */

export class ReportUpdateAssetsController {
  /**
   * Lista os ativos que devem ser atualizados, com paginação.
   * 
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async index(request, response){
    const assetReport = new AssetReport(request.user.user)
    const resultPagination = await assetReport
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

  async remove(request, response){
    const assetReport = new AssetReport(request.user.user)
    await assetReport.removeReport({ typeReport: "updateAssets", id: request.params.id })
    
    response.status(200).json({ message: "Item removido com sucesso." })
  } 

  /**
   * Atualiza um ativo no relatório de atualização pelo ID.
   * 
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async update(request, response){
    const validation = new Validation()
    const responseSchema = validation.report(request.body)

    const assetReport = new AssetReport(request.user.user)
    await assetReport.updateReport({ typeReport: "updateAssets", id: request.params.id, updates: responseSchema })

    response.status(200).json({ message: "Dados atualizado com sucesso." })
  }
}





  