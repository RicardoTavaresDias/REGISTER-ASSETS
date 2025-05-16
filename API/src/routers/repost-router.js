import { Router } from "express"
import { ReportController } from "../controller/report-controller.js"

export const reportRouter = new Router()
const reportController = new ReportController()

// Items Existente
reportRouter.get("/existsAssets", reportController.getExistsAssets)
reportRouter.delete("/existsAssets/:id", reportController.removeExistsAssets)
reportRouter.patch("/existsAssets/:id", reportController.updateExistsAssets)

// Items não Existente
reportRouter.get("/doesNotExistsAssets", reportController.getDoesNotExistsAssets)
reportRouter.delete("/doesNotExistsAssets/:id", reportController.removeDoesNotExistsAssets)
reportRouter.patch("/doesNotExistsAssets/:id", reportController.updateDoesNotExistsAssets)

// Items para atualização
reportRouter.get("/updateAssets", reportController.getUpdateAssets)
reportRouter.delete("/updateAssets/:id", reportController.removeUpdateAssets)
reportRouter.patch("/updateAssets/:id", reportController.updateAssets)