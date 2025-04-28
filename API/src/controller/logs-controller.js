import fs from "node:fs"

import { Paths } from "../utils/Paths.js"

export class LogsController {
  async index(request, response){
    const { path }  = Paths({ typeController: "logs", type: request.params.type })
    const data = await fs.promises.readFile(path)
    if(data.toString() === "") return response.status(400).json({ message: "Não tem log." })
    response.status(200).json(data.toString().split('\n'))
  }

  async remove(request, response){
    const { path }  = Paths({ typeController: "logs", type: request.params.type })
    const remove = await fs.promises.writeFile(path, "")
    response.status(200).json({ message: "Logs removido com sucesso." })
  }
}