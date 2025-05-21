import { Router } from "express";
import { RegisterAssetsController } from "../controller/register-assets-controller.js";
import { authentication } from "../middlewares/authentication.js"
import { userAcess } from "../middlewares/userAcess.js"

export const assetsRouter = Router()
const registerAssetsController = new RegisterAssetsController()

assetsRouter.use(authentication)
assetsRouter.post("/file", userAcess(["admin", "member"]), registerAssetsController.file)
assetsRouter.post("/", userAcess(["admin", "member"]), registerAssetsController.create)
assetsRouter.get("/", userAcess(["admin", "member"]), registerAssetsController.index)

assetsRouter.get("/download", userAcess(["admin", "member"]), registerAssetsController.download)
assetsRouter.post("/upload", userAcess(["member"]), registerAssetsController.upload)