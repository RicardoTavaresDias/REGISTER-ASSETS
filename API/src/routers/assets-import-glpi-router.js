import { Router } from "express"
import { AssetsImportGlpiController } from "../controller/asset-import-glpi-controller.js"

export const assetsImportGlpiRouter = Router()
const assetsImportGlpiController = new AssetsImportGlpiController()

assetsImportGlpiRouter.post("/", assetsImportGlpiController.create)