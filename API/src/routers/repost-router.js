import { Router } from "express"
import { ReportController } from "../controller/report-controller.js"

export const reportRouter = new Router()
const reportController = new ReportController()

reportRouter.get("/existsAssets", reportController.getExistsAssets)
reportRouter.delete("/existsAssets/:id", reportController.removeExistsAssets)

reportRouter.get("/doesNotExistsAssets", reportController.getDoesNotExistsAssets)
reportRouter.delete("/doesNotExistsAssets/:id", reportController.removeDoesNotExistsAssets)

reportRouter.get("/updateAssets", reportController.getUpdateAssets)
reportRouter.delete("/updateAssets/:id", reportController.removeUpdateAssets)