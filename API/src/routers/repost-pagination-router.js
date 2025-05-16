import { Router } from "express"
import { ReportPaginationController } from "../controller/report-pagination-controller.js"

export const reportPaginationRouter = new Router()
const reportPaginationController = new ReportPaginationController()

reportPaginationRouter.get("/existsAssets", reportPaginationController.getExistsAssets)
reportPaginationRouter.delete("/existsAssets/:id", reportPaginationController.removeExistsAssets)

reportPaginationRouter.get("/doesNotExistsAssets", reportPaginationController.getDoesNotExistsAssets)
reportPaginationRouter.delete("/doesNotExistsAssets/:id", reportPaginationController.removeDoesNotExistsAssets)

reportPaginationRouter.get("/updateAssets", reportPaginationController.getUpdateAssets)
reportPaginationRouter.delete("/updateAssets/:id", reportPaginationController.removeUpdateAssets)