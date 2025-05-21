import { Router } from 'express'
import { ReportExistsAssetsController } from "../controller/report-exists-assets-controller.js"
import { authentication } from "../middlewares/authentication.js"
import { userAcess } from "../middlewares/userAcess.js"

export const reportExistsAssetsRouter = Router()
const reportExistsAssetsController = new ReportExistsAssetsController()

reportExistsAssetsRouter.use(authentication, userAcess(["member"]))
reportExistsAssetsRouter.get("/", reportExistsAssetsController.index)
reportExistsAssetsRouter.delete("/:id", reportExistsAssetsController.remove)
reportExistsAssetsRouter.patch("/:id", reportExistsAssetsController.update)