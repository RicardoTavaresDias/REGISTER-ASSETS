import fs from "node:fs"
import { z } from "zod"

// {EQUIPMET}
export class SuggestionsSearchEquipmet {
  index(request, response) {
    fs.readFile("./src/utils/suggestions-equipment.json", (error, data) => {
      if(error){
        return response.status(400).json({ message: error.message })
      }
      return response.status(200).json(JSON.parse(data))
    })
  }

  insert(request, response){
    addWriteFile("./src/utils/suggestions-equipment.jso", request, response)
  }
}


// {SECTOR}
export class SuggestionsSearchSector {
  index(request, response) {
    fs.readFile("./src/utils/suggestions-sector.json", (error, data) => {
      if(error){
        return response.status(400).json({ message: error.message })
      }
      return response.status(200).json(JSON.parse(data))
    })
  }

  insert(request, response){
    addWriteFile("./src/utils/suggestions-sector.jso", request, response)
  }
}

// {UNITS}
export class SuggestionsSearchUnits {
  index(request, response) {
    fs.readFile("./src/utils/suggestions-units.json", (error, data) => {
      if(error){
        return response.status(400).json({ message: error.message })
      }
      return response.status(200).json(JSON.parse(data))
    })
  }

  insert(request, response){
    addWriteFile("./src/utils/suggestions-units.jso", request, response)
  }
}


// LEBRENTE: item para validar chegada do body se é sector ou equipment => function addWriteFile(path, item, request, response)
function addWriteFile(path, request, response){
  fs.readFile("./src/utils/suggestions-sector.json", (error, data) => {
    if(error){
      return response.status(400).json({ message: error.message })
    }
    const dataJson = JSON.parse(data)

    for(const items of request.body){
      dataJson.push(items)
    }

    fs.writeFile(path, JSON.stringify(dataJson, null, 1), (error) => {
      if(error){
        return response.status(400).json({ message: 'Erro ao adicionar item no Equipamento!:', error })
      } 
    })

    return response.status(201).json({ message: "Item adicionado com sucesso no Equipamento" })
  })
}