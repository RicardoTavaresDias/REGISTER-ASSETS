import fs from "node:fs"
import { env } from "../config/env.js"

export class LoginController {
  async insert(request, response){
    const data = await fs.promises.readFile(env.LOGIN)
    const dataJson = JSON.parse(data)

    const [{ user, passaword, role }] = dataJson

    if(!user.includes(request.body.user)){
      return response.status(401).json({ message: "Usuario não cadastrado no sistema.", role: ""})
    }
   
    if(user === request.body.user && passaword === request.body.passaword){
      request.headers = {
        role: role
      }
      return response.status(200).json({ message: "Login realizado com sucesso.", role: role })
    }

    return response.status(401).json({ message: "Usuario e senha incorretos.", role: "" })        
  }
}