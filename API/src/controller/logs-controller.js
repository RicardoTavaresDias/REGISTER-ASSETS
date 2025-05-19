import { Paths } from "../utils/Paths.js"
import fs from "node:fs"

export class LogsController {
 

  async index(request, response){
    const { path }  = Paths({ type: request.params.type })
    const data = await fs.promises.readFile(path)
    
    if(data.toString() === "") return response.status(400).json({ message: "Sem registros disponíveis no log." })
    response.status(200).json(data.toString().split('\n'))
  }



  async remove(request, response){
    const { path }  = Paths({ type: request.params.type })
    await fs.promises.writeFile(path, "")

    response.status(200).json({ message: "Logs removido com sucesso." })
  }
}