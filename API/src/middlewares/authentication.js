import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/token.js"

/**
 * Middleware de autenticação para usuários locais.
 * 
 * Verifica se o token JWT (`accessToken`) está presente nos cookies.
 * Se válido, adiciona a propriedade `request.role` com o valor do `sub` (hash do papel/role).
 *
 * @param {import("express").Request} request - Requisição HTTP com cookies.
 * @param {import("express").Response} response - Resposta HTTP.
 * @param {Function} next - Próxima função da cadeia de middlewares.
 * 
 * @returns {void}
 */

export function authentication(request, response, next){
  const token = request.cookies?.accessToken;
  if (!token) {
    return response.status(401).json({ message: "Realizar autenticação" });
  }
  
  try {
    const role = jwt.verify(token, jwtConfig.secret)
    request.role = {
      role: role.sub
    }
    
    return next()
  }catch(error){
    if(error.name === "TokenExpiredError"){
      return response.status(401).json({ message: "Token expirado, realizar login." })
    }
    return response.status(401).json({ message: "Token inválido." })
  }
}

/**
 * Middleware de autenticação para usuários autenticados no GLPI.
 * 
 * Verifica se o token JWT (`accessTokenGlpi`) está presente nos cookies.
 * Se válido, adiciona a propriedade `request.user` com os dados encriptados do usuário GLPI.
 *
 * @param {import("express").Request} request - Requisição HTTP com cookies.
 * @param {import("express").Response} response - Resposta HTTP.
 * @param {Function} next - Próxima função da cadeia de middlewares.
 * 
 * @returns {void}
 */

export function authenticationGlpi(request, response, next){
  const token = request.cookies?.accessTokenGlpi
  if(!token){
    return response.status(401).json({ message: "Realizar autenticação" });
  }

  try {
    const user = jwt.verify(token, jwtConfig.secret)
    request.user = user.sub
    
    return next()
  }catch(error){
    if(error.name === "TokenExpiredError"){
      return response.status(401).json({ message: "Token expirado, realizar login." })
    }
    return response.status(401).json({ message: "Token inválido." })
  }
}