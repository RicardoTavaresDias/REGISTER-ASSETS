import { Router } from "express";
import { RegisterAssetsController } from "../controller/register-Assets-Controller.js";

export const assetsRouter = Router()
const registerAssetsController = new RegisterAssetsController()

assetsRouter.post("/", registerAssetsController.postAssets)
assetsRouter.post("/upload", registerAssetsController.postFile)
