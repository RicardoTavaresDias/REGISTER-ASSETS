import { AppError } from "../utils/AppError.js";
import { ZodError } from "zod";
import { logRegisterAssets } from "../core/log-RegisterAssets.js";

/**
 * Middleware global de tratamento de erros para a aplicação Express.
 *
 * Este middleware intercepta qualquer erro lançado nas rotas ou middlewares anteriores e
 * envia uma resposta HTTP apropriada, além de registrar o erro.
 * 
 * Regras de tratamento:
 * 
 * 1. **ZodError**:
 *    - Captura erros de validação do Zod (schema).
 *    - Retorna HTTP 400 (Bad Request) com a primeira mensagem de erro.
 *
 * 2. **AppError**:
 *    - Erro personalizado da aplicação.
 *    - Retorna o status HTTP definido na exceção (`error.statusCode`).
 *    - A mensagem de erro personalizada é retornada no corpo da resposta.
 *
 * 3. **Erro desconhecido**:
 *    - Qualquer erro que não seja Zod ou AppError.
 *    - Retorna HTTP 500 (Internal Server Error) com mensagem genérica.
 * 
 * Todos os erros são registrados no sistema usando `logRegisterAssets`.
 *
 * @param {Error} error - Instância do erro lançado.
 * @param {import("express").Request} request - Objeto da requisição HTTP.
 * @param {import("express").Response} response - Objeto da resposta HTTP.
 * @param {Function} next - Próximo middleware (não utilizado, mas necessário pela assinatura do Express).
 * 
 * @returns {void}
 */

export function ErrorHandling(error, request, response, next) {
  if(error instanceof ZodError){
    logRegisterAssets( " MESSAGE: " + error.issues[0].message + " STACK: " + error.stack + "\n" )
    return response.status(400).json({ message: error.issues[0].message }) 
  }

  if(error instanceof Error){
    return response.status(400).json({ message: error.message })
  }

  if(error instanceof AppError){
    logRegisterAssets( " MESSAGE: " + error?.message + " STACK: " + error?.stack + "\n" )
    return response.status(error.statusCode).json({ message: error.message })
  }

  logRegisterAssets( " MESSAGE: " + error?.message + " STACK: " + error?.stack + "\n" )
  response.status(500).json({ message: 'Error interno servidor!' })
}