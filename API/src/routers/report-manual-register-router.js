import { Router } from 'express'
import { ReportManualRegisterController } from "../controller/report-manual-register-controller.js"
import { authentication } from "../middlewares/authentication.js"
import { userAcess } from "../middlewares/userAcess.js"

export const reportManualRegisterRouter = Router()
const reportManualRegisterController = new ReportManualRegisterController()

reportManualRegisterRouter.use(authentication, userAcess(["member"]))
reportManualRegisterRouter.get("/", reportManualRegisterController.index)