import { AssetReport } from "../core/AssetReport.js"
import { Validation } from "../model/Validation.js"

export class ReportController {
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

  async updateExistsAssets(request, response){
    const responseSchema = new Validation().report(request.body)
    new AssetReport().updateReport({ typeReport: "existsAssets", id: request.params.id, updates: responseSchema })

    response.status(200).json({ message: "Dados atualizado com sucesso." })
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

  async updateDoesNotExistsAssets(request, response){
    const responseSchema = new Validation().report(request.body)
    new AssetReport().updateReport({ typeReport: "doesNotExistsAssets", id: request.params.id, updates: responseSchema })

    response.status(200).json({ message: "Dados atualizado com sucesso." })
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

  async updateAssets(request, response){
    const responseSchema = new Validation().report(request.body)
    new AssetReport().updateReport({ typeReport: "updateAssets", id: request.params.id, updates: responseSchema })

    response.status(200).json({ message: "Dados atualizado com sucesso." })
  }
}