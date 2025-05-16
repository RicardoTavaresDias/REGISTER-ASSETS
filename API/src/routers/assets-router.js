import { Router } from "express";
import { RegisterAssetsController } from "../controller/register-assets-controller.js";

export const assetsRouter = Router()
const registerAssetsController = new RegisterAssetsController()

assetsRouter.post("/upload", registerAssetsController.file)
assetsRouter.post("/", registerAssetsController.create)
assetsRouter.get("/assets", registerAssetsController.index)

//assetsRouter.get("/download", registerAssetsController.downloadAssets)