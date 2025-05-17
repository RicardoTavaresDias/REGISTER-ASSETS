import { compare, hash } from "bcrypt"
import { z } from "zod"
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/token.js"
import CryptoJS from "crypto-js";
import { GlpiBrowser } from "../services/glpi/GlpiBrowser.js";
import { Repository } from "../repositories/Repository.js"
import { Validation } from "../model/Validation.js";

/**
 * Controlador responsável pela autenticação de usuários locais
 * e pela emissão de tokens de acesso ao GLPI.
 */

export class LoginController {

  async create(request, response){
    const validation = new Validation()
    const result = validation.user(request.body)
    
    const repository = new Repository()
    const dataJson = await repository.user(result.user)

    const { user, password, role } = dataJson

    const roleHash = await hash(role, 8)
    const comparePassword = await compare(result.password, password)

    if(!user.includes(result.user)){
      return response.status(401).json({ message: "Usuario não cadastrado no sistema." })
    }
   
    if(user.includes(result.user) && comparePassword){
      const token = jwt.sign({ sub: roleHash }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })

      response.cookie("accessToken", token, {
        httpOnly: true, 
        secure: false,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000 // 1d
      })

      return response.status(200).json({ message: "Login realizado com sucesso." })
    }
    return response.status(401).json({ message: "Usuario e senha incorretos." })        
  }


  async createGlpi(request, response){
    const validation = new Validation()
    const userResult = validation.user(request.body)

    const user = { 
      user: CryptoJS.AES.encrypt(userResult.user, jwtConfig.secret).toString(), 
      password: CryptoJS.AES.encrypt(userResult.password, jwtConfig.secret).toString() 
    }

    const glpiBrowser = new GlpiBrowser(user)
    await glpiBrowser.browser()
    await glpiBrowser.login()
    await glpiBrowser.browserClose()

    const tokenGlpi = jwt.sign({ sub: user }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })
    
    response.cookie("accessTokenGlpi", tokenGlpi, {
      httpOnly: true, 
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000 // 1d
    })

    response.status(200).json({ message: "Login realizado com sucesso." })
  }
}