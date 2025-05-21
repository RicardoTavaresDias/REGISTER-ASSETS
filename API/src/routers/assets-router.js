import { Router } from "express";
import { RegisterAssetsController } from "../controller/register-assets-controller.js";
import { authentication } from "../middlewares/authentication.js"
import { userAcess } from "../middlewares/userAcess.js"

export const assetsRouter = Router()
const registerAssetsController = new RegisterAssetsController()

assetsRouter.use(authentication)
assetsRouter.post("/file", userAcess(["member"]), registerAssetsController.file)
assetsRouter.post("/", userAcess(["member"]), registerAssetsController.create)
assetsRouter.get("/", userAcess(["member"]), registerAssetsController.index)

assetsRouter.get("/download", registerAssetsController.download)
assetsRouter.post("/upload", registerAssetsController.upload)