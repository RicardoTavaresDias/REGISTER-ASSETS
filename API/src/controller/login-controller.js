import fs from "node:fs"
import { env } from "../config/env.js"
import { compare, hash } from "bcrypt"
import { z } from "zod"
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/token.js"
import CryptoJS from "crypto-js";
import { GlpiBrowser } from "../services/glpi/GlpiBrowser.js";

/**
 * Controlador responsável pela autenticação de usuários locais
 * e pela emissão de tokens de acesso ao GLPI.
 */

export class LoginController {

  /**
   * Autentica um usuário local com base em um arquivo de configuração.
   * 
   * Lê um arquivo JSON com as credenciais do usuário (`env.LOGIN`), 
   * compara as credenciais enviadas com as armazenadas e, se válidas,
   * emite um token JWT e o define como cookie `accessToken`.
   *
   * @param {import("express").Request} request - Requisição HTTP contendo `user` e `password` no corpo.
   * @param {import("express").Response} response - Resposta HTTP com token JWT ou mensagem de erro.
   * 
   * @returns {Promise<void>}
   */

  async create(request, response){
    const userSchema = z.object({
      user: z.string().min(1, { message: "Informe usuario e senha." }),
      password: z.string().min(1, { message: "Informe usuario e senha." })
    })
    const result = userSchema.parse(request.body)
    
    const data = await fs.promises.readFile(env.LOGIN)
    const dataJson = JSON.parse(data)

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
        maxAge: 15 * 60 * 1000 // 15m
      })

      return response.status(200).json({ message: "Login realizado com sucesso." })
    }
    return response.status(401).json({ message: "Usuario e senha incorretos." })        
  }

   /**
   * Realiza login no GLPI utilizando o navegador controlado via Puppeteer.
   * 
   * Recebe `user` e `password` no corpo da requisição, valida com Zod,
   * encripta com AES, e autentica via `GlpiBrowser`. Se bem-sucedido,
   * define um cookie `accessTokenGlpi` com o token JWT correspondente.
   *
   * @param {import("express").Request} request - Requisição HTTP com credenciais do GLPI.
   * @param {import("express").Response} response - Resposta HTTP com status de login.
   * 
   * @throws {z.ZodError} - Caso os campos estejam ausentes ou inválidos.
   * @returns {Promise<void>}
   */

  async createGlpi(request, response){
    const userSchema = z.object({
      user: z.string().min(1, { message: "Informe usuario e senha do GLPI." }),
      password: z.string().min(1, { message: "Informe usuario e senha do GLPI." })
    })

    const userResult = userSchema.parse(request.body)
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
      maxAge: 15 * 60 * 1000 // 15m
    })

    response.status(200).json({ message: "Login realizado com sucesso." })
  }
}