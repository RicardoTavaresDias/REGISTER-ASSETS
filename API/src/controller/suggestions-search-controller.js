import { SuggestionsServer } from "../servers/suggestions-service.js"
import { env } from "../config/env.js"

export class SuggestionsSearch {
   index(request, response) {
    const { type } = request.params    
    new SuggestionsServer(
      getPath(type), 
      request, 
      response)
      .readAll()
  }

  insert(request, response){
    const { type } = request.params
    new SuggestionsServer(
      getPath(type), 
      request, 
      response)
      .addWriteFile()
  }

  remove(request, response){
    const { type } = request.params
    new SuggestionsServer(
      getPath(type), 
      request, 
      response)
      .removeWriteFile()
  }
}

function getPath(type){
  const map = {
    equipment: { path: env.EQUIPMENT, type: type },
    sector: { path: env.SECTOR, type: type },
    units: { path: env.UNITS, type: type }
  }

  if (!map[type]) throw new Error("Tipo inválido: equipment, sector ou units")
    
  return map[type]   
}