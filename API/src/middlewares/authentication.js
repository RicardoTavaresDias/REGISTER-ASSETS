import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/token.js"

/**
 * Middleware responsável por autenticar usuários com base no token JWT armazenado em cookies.
 * 
 * Este middleware deve ser aplicado em rotas protegidas para garantir que apenas usuários autenticados tenham acesso.
 * 
 * Verifica:
 * - Se o token JWT existe no cookie `accessToken`.
 * - Se o token é válido e não expirado.
 * 
 * Em caso de sucesso, o identificador do usuário (extraído de `sub`) é adicionado à requisição (`request.user`).
 * Caso contrário, responde com erro 401 e mensagem apropriada.
 * 
 * @param {import('express').Request} request - Objeto de requisição HTTP.
 * @param {import('express').Response} response - Objeto de resposta HTTP.
 * @param {Function} next - Função que chama o próximo middleware.
 * 
 * @returns {Response|void} Continua para a próxima função se autenticado ou retorna erro 401.
 */

export function authentication(request, response, next){
  const token = request.cookies?.accessToken;
  if (!token) {
    return response.status(401).json({ message: "Realizar autenticação" });
  }
  
  try {
    const role = jwt.verify(token, jwtConfig.secret)
    request.user = role.sub
    
    return next()
  }catch(error){
    if(error.name === "TokenExpiredError"){
      return response.status(401).json({ message: "Token expirado, realizar login." })
    }
    return response.status(401).json({ message: "Token inválido." })
  }
}