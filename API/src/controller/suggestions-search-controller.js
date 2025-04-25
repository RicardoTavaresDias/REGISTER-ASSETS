import { SuggestionsServer } from "../servers/suggestions-service.js"

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
}

function getPath(type){
  const map = {
    equipment: "./src/utils/suggestions-data/suggestions-equipment.json",
    sector: "./src/utils/suggestions-data/suggestions-sector.json",
    units: "./src/utils/suggestions-data/suggestions-units.json"
  }

  if (!map[type]) throw new Error("Tipo inválido: equipment, sector ou units")
    
  return map[type] 
    
}