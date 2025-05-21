import { AssetReport } from "../core/AssetReport.js"
import { Validation } from "../model/Validation.js"

/**
 * Controller responsável por gerenciar os relatórios de ativos: existentes.
 */

export class ReportExistsAssetsController {

/**
   * Lista os ativos existentes com paginação.
   * 
   * @param {import("express").Request} request - Requisição HTTP contendo `page` e `limit` como query params.
   * @param {import("express").Response} response - Resposta HTTP com a lista paginada dos ativos existentes.
   * @returns {Promise<void>}
   */

  async index(request, response){
    const assetReport = new AssetReport(request.user.user)
    const resultPagination = await assetReport
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

  async remove(request, response){
    const assetReport = new AssetReport(request.user.user)
    await assetReport.removeReport({ typeReport: "existsAssets", id: request.params.id })
    
    response.status(200).json({ message: "Item removido com sucesso." })
  } 

  /**
   * Atualiza um ativo existente no relatório pelo ID.
   * 
   * @param {import("express").Request} request - Requisição HTTP com o ID na URL e os dados no corpo.
   * @param {import("express").Response} response - Resposta HTTP confirmando a atualização.
   * @returns {Promise<void>}
   */

  async update(request, response){
    const validation = new Validation()
    const responseSchema = validation.report(request.body)

    const assetReport = new AssetReport(request.user.user)
    await assetReport.updateReport({ typeReport: "existsAssets", id: request.params.id, updates: responseSchema })

    response.status(200).json({ message: "Dados atualizado com sucesso." })
  }
}