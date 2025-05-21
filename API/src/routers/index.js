import { assetsRouter } from './assets-router.js'
import { suggestionsRouter } from './suggestions-router.js'
import { logsRouter } from './logs-router.js'
import { loginRouter } from './login-router.js'
import { assetsImportGlpiRouter } from './assets-import-glpi-router.js'
import { reportDoesNotExistsAssetsRouter } from "./report-does-not-exists-assets-router.js"
import { reportExistsAssetsRouter } from "./report-exists-assets-router.js"
import { reportManualRegisterRouter } from "./report-manual-register-router.js"
import { reportUpdateAssetsRouter } from "./report-update-assets-router.js"

import { Router } from 'express'

export const routers = Router()

routers.use("/assets", assetsRouter)
routers.use("/suggestions", suggestionsRouter)
routers.use("/log", logsRouter)
routers.use("/login", loginRouter)
routers.use("/import-glpi", assetsImportGlpiRouter)

routers.use("/does-notExists-assets", reportDoesNotExistsAssetsRouter)
routers.use("/update-assets", reportUpdateAssetsRouter)
routers.use("/exists-assets", reportExistsAssetsRouter)
routers.use("/manual-registes-assents", reportManualRegisterRouter)