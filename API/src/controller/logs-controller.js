import { CrudFile } from "../services/CrudFile.js"
import { Paths } from "../utils/Paths.js"

export class LogsController {
  async index(request, response){
    const { path }  = Paths({ typeController: "logs", type: request.params.type })
    const data = await new CrudFile({ path: path })._Read()
    
    if(data.toString() === "") return response.status(400).json({ message: "Sem registros disponíveis no log." })
    response.status(200).json(data.toString().split('\n'))
  }

  async remove(request, response){
    const { path }  = Paths({ typeController: "logs", type: request.params.type })
    await new CrudFile({ path: path })._Write("")
    response.status(200).json({ message: "Logs removido com sucesso." })
  }
}