import { Router } from 'express'
import { ReportDoesNotExistsAssetsController } from "../controller/report-does-not-exists-assets-controller.js"
import { authentication } from "../middlewares/authentication.js"
import { userAcess } from "../middlewares/userAcess.js"

export const reportDoesNotExistsAssetsRouter = Router()
const reportDoesNotExistsAssetsController = new ReportDoesNotExistsAssetsController()

reportDoesNotExistsAssetsRouter.use(authentication, userAcess(["member"]))
reportDoesNotExistsAssetsRouter.get("/", reportDoesNotExistsAssetsController.index)
reportDoesNotExistsAssetsRouter.delete("/:id", reportDoesNotExistsAssetsController.remove)
reportDoesNotExistsAssetsRouter.patch("/:id", reportDoesNotExistsAssetsController.update)