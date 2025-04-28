import { assetsRouter } from './assets-router.js'
import { suggestionsRouter } from './suggestions-router.js'
import { logsRouter } from './logs-router.js'
import { Router } from 'express'

export const routers = Router()

routers.use("/", assetsRouter)
routers.use("/", suggestionsRouter)
routers.use("/log", logsRouter)