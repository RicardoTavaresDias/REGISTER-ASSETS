import { AssetReport } from "../core/AssetReport.js"

export class ReportPaginationController {
  async getExistsAssets(request, response){
    const resultPagination = await new AssetReport()
      .indexPaginationReport({
        typeReport: "existsAssets",
        page: request.query.page,
        limit: request.query.limit
      })

    response.status(200).json(resultPagination)
  } 

  async removeExistsAssets(request, response){
    await new AssetReport().removeReport({ typeReport: "existsAssets", id: request.params.id })
    
    response.status(200).json({ message: "Item removido com sucesso." })
  } 

  async getDoesNotExistsAssets(request, response){
    const resultPagination = await new AssetReport()
      .indexPaginationReport({
        typeReport: "doesNotExistsAssets",
        page: request.query.page,
        limit: request.query.limit
      })

    response.status(200).json(resultPagination)
  }

  async removeDoesNotExistsAssets(request, response){
    await new AssetReport().removeReport({ typeReport: "doesNotExistsAssets", id: request.params.id })
    
    response.status(200).json({ message: "Item removido com sucesso." })
  } 

  async getUpdateAssets(request, response){
    const resultPagination = await new AssetReport()
      .indexPaginationReport({
        typeReport: "updateAssets",
        page: request.query.page,
        limit: request.query.limit
      })

    response.status(200).json(resultPagination)
  }

  async removeUpdateAssets(request, response){
    await new AssetReport().removeReport({ typeReport: "updateAssets", id: request.params.id })
    
    response.status(200).json({ message: "Item removido com sucesso." })
  } 
}