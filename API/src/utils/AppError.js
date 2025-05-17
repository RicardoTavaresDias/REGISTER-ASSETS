/**
 * Classe personalizada para tratamento de erros na aplicação.
 *
 * Permite lançar exceções com uma mensagem personalizada e um código de status HTTP,
 * facilitando o tratamento centralizado de erros em middlewares.
 *
 * @class
 */

export class AppError{

   /**
   * Cria uma instância de AppError.
   *
   * @param {string} message - Mensagem descritiva do erro.
   * @param {number} [statusCode=400] - Código de status HTTP correspondente ao erro (padrão: 400).
   */

  constructor(message, statusCode = 400){
    this.message = message
    this.statusCode = statusCode
  }
}