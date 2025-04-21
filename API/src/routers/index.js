import { assetsRouter } from './assets-router.js'
import { Router } from 'express'

export const routers = Router()

routers.use("/", assetsRouter)