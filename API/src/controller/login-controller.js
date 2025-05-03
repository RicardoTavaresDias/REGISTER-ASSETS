import { CrudFile } from "../services/CrudFile.js"
import { env } from "../config/env.js"
import { compare } from "bcrypt"
import { z } from "zod"
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/token.js"

export class LoginController {
  async create(request, response){
    const data = await new CrudFile({ path: env.LOGIN })._Read()
    const dataJson = JSON.parse(data)

    const { user, password, role } = dataJson
    const comparePassword = await compare(request.body.password, password)

    if(!user.includes(request.body.user)){
      return response.status(401).json({ message: "Usuario não cadastrado no sistema.", role: ""})
    }
   
    if(user.includes(request.body.user) && comparePassword){
      request.headers = {
        role: role
      }
      return response.status(200).json({ message: "Login realizado com sucesso.", role: role })
    }
    return response.status(401).json({ message: "Usuario e senha incorretos.", role: "" })        
  }


  async createGlpi(request, response){
    const userSchema = z.object({
      user: z.string().min(1, { message: "Informe usuario e senha do GLPI." }),
      password: z.string().min(1, { message: "Informe usuario e senha do GLPI." })
    })

    const user = userSchema.parse(request.body)
    const token = jwt.sign({ sub: user }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })

    response.status(200).json({ token })
  }
}