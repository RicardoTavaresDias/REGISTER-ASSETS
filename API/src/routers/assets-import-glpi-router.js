import { Router } from "express"
import { AssetsImportGlpiController } from "../controller/asset-import-glpi-controller.js"
import { authentication } from "../middlewares/authentication.js"
import { userAcess } from "../middlewares/userAcess.js"

export const assetsImportGlpiRouter = Router()
const assetsImportGlpiController = new AssetsImportGlpiController()

assetsImportGlpiRouter.use(authentication, userAcess(["member"]))
assetsImportGlpiRouter.get("/", assetsImportGlpiController.index)
assetsImportGlpiRouter.patch("/", assetsImportGlpiController.update)
assetsImportGlpiRouter.post("/", assetsImportGlpiController.create)