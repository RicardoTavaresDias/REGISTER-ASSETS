import { Router } from "express"
import { AssetsImportGlpiController } from "../controller/asset-import-glpi-controller.js"
import { authenticationGlpi } from "../middlewares/authentication.js"

export const assetsImportGlpiRouter = Router()
const assetsImportGlpiController = new AssetsImportGlpiController()

assetsImportGlpiRouter.post("/", authenticationGlpi, assetsImportGlpiController.create)
assetsImportGlpiRouter.patch("/", authenticationGlpi, assetsImportGlpiController.update)
assetsImportGlpiRouter.post("/", authenticationGlpi, assetsImportGlpiController.create)