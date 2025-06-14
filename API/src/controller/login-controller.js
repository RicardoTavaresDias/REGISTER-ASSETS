import { compare, hash } from "bcrypt"
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/token.js"
import { encryption } from "../lib/security.js"
import { GlpiBrowser } from "../services/glpi/GlpiBrowser.js";
import { Repository } from "../repositories/Repository.js"
import { Validation } from "../validation/Validation.js";

/**
 * Controlador responsável pela autenticação de usuários locais
 * e pela emissão de tokens de acesso ao GLPI.
 */

export class LoginController {

/**
   * Realiza o login tradicional no sistema.
   * 
   * @param {import('express').Request} request - Requisição HTTP com os dados do usuário.
   * @param {import('express').Response} response - Resposta HTTP para o cliente.
   * @returns {Promise<Response>} Retorna um cookie com token JWT e status HTTP.
   */

  async create(request, response){
    const validation = new Validation()
    const result = validation.user(request.body)

    if(result.user === "admin"){
      const repository = new Repository()
      const dataJson = await repository.search.user(result.user)

      const { user, password, role } = dataJson

      const roleHash = await hash(role, 8)
      const comparePassword = await compare(result.password, password)

      if(!user.includes(result.user)){
        return response.status(401).json({ message: "Usuario não cadastrado no sistema." })
      }
    
      if(user.includes(result.user) && comparePassword){
        const token = jwt.sign({ sub: { user: user, role: roleHash }}, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })

        return response.status(200).json({ token, user: { role: role } })
      }
      return response.status(401).json({ message: "Usuario e senha incorretos." }) 
    }
    

    const user = { 
      user: result.user, 
      password: encryption(result.password), 
      role: "member"
    }

    // const glpiBrowser = new GlpiBrowser(user)
    // await glpiBrowser.browser()
    // await glpiBrowser.login()
    // await glpiBrowser.browserClose()

    const tokenGlpi = jwt.sign({ sub: user }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })

    response.status(200).json({ token: tokenGlpi, user: { user: user.user, role: user.role } })
           
  }

  /**
   * Realiza login no sistema GLPI usando automação com navegador.
   * 
   * @param {import('express').Request} request - Requisição HTTP com os dados do usuário.
   * @param {import('express').Response} response - Resposta HTTP para o cliente.
   * @returns {Promise<Response>} Retorna um cookie com token JWT e status HTTP.
   */

  /** 
   
  async createGlpi(request, response){
    const validation = new Validation()
    const userResult = validation.user(request.body)

    const user = { 
      user: userResult.user, 
      password: encryption(userResult.password), 
      role: "member"
    }

    const glpiBrowser = new GlpiBrowser(user)
    await glpiBrowser.browser()
    await glpiBrowser.login()
    await glpiBrowser.browserClose()

    const tokenGlpi = jwt.sign({ sub: user }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })

    response.status(200).json({ token: tokenGlpi, user: { user: user.user, role: user.role } })
  }

  */
}