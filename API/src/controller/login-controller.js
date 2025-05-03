import { CrudFile } from "../services/CrudFile.js"
import { env } from "../config/env.js"
import { compare } from "bcrypt"

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
}