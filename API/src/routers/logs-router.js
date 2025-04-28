import { Router } from 'express'
import { LogsController } from "../controller/logs-controller.js"
import { userAcess } from "../middlewares/userAcess.js"

export const logsRouter = Router()
const logsController = new LogsController()

logsRouter.use(userAcess(["admin"]))
logsRouter.get("/:type", logsController.index)
logsRouter.delete("/:type", logsController.remove)