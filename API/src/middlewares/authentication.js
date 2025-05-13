import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/token.js"

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