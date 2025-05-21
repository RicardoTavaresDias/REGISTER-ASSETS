import { Router } from 'express'
import { ReportUpdateAssetsController } from "../controller/report-update-assets-controller.js"
import { authentication } from "../middlewares/authentication.js"
import { userAcess } from "../middlewares/userAcess.js"

export const reportUpdateAssetsRouter = Router()
const reportUpdateAssetsController = new ReportUpdateAssetsController()

reportUpdateAssetsRouter.use(authentication, userAcess(["member"]))
reportUpdateAssetsRouter.get("/", reportUpdateAssetsController.index)
reportUpdateAssetsRouter.delete("/:id", reportUpdateAssetsController.remove)
reportUpdateAssetsRouter.patch("/:id", reportUpdateAssetsController.update)