import { AssetReport } from "../core/AssetReport.js"

/**
 * Controller responsável por gerenciar os relatórios de ativos: cadastro manual.
 */

export class ReportManualRegisterController {
  /**
   * Lista os ativos que devem ser atualizados Manualmente, com paginação.
   * 
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns {Promise<void>}
   */

  async index(request, response){
    const assetReport = new AssetReport(request.user.user)
    const resultPagination = await assetReport
      .indexPaginationReport({
        typeReport: "manualRegistration",
        page: request.query.page,
        limit: request.query.limit
      })

    response.status(200).json(resultPagination)
  }
}