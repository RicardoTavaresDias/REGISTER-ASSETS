import { ZodError } from "zod";
import { LogRegisterAssets } from "../servers/log-RegisterAssets.js";

export function ErrorHandling(error, request, response, next) {
  if(error instanceof ZodError){
    LogRegisterAssets({ error: error.message })
    return response.status(400).json({ message: error.issues[0].message })
    
  }
  LogRegisterAssets({ error: error.message })
  response.status(500).json({ message: 'Error interno servidor!', error: error.message})
}