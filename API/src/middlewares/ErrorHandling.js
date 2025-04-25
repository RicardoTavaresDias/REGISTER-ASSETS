import { ZodError } from "zod";

export function ErrorHandling(error, request, response, next) {
  if(error instanceof ZodError){
    return response.status(400).json({ message: error.issues[0].message })
  }
  response.status(500).json({ message: 'Error interno servidor!', error: error.message})
}