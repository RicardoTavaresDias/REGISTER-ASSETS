import { AssetReport } from "../core/assetReport.js"

/**
 * Controller responsável por gerenciar os relatórios de ativos: cadastro manual.
 */

export class ReportManualRegisterController {

  /**
 * Lista ativos para atualização manual, com paginação.
 * Se `name` estiver presente na query, agrupa por setor.
 *
 * @param {import("express").Request} request - Requisição HTTP
 * @param {import("express").Response} response - Resposta HTTP
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

    const resultPaginationSector = await assetReport
    .indexPaginationReport({
      typeReport: "manualRegistration",
      manualSector: true,
      page: request.query.page,
      limit: request.query.limit
    })
  
    response.status(200).json( request.query.name ? resultPaginationSector : resultPagination )
  }
}