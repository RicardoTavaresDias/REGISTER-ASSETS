import fs from 'node:fs'
import path from 'path'
import { ArrayEquipment } from "../../../WEB/src/utils/arrayEquipment.js"
import { ArraySector } from "../../../WEB/src/utils/arraySector.js"

export function LogArrayEquipment({ error, message }){

  if(error){
    return registerLog({ body: 'error', value: error })
  }

  if(message.EQUIPAMENTO) {
    const filter = ArrayEquipment.filter(value => value.toLowerCase().includes(message.EQUIPAMENTO.toLowerCase())) 
    if(!filter.length){
      registerLog({ body: "equipment", value: message.EQUIPAMENTO })
    }
  }
  
  if(message.SETOR){
    const filter = ArraySector.filter(value => value.toLowerCase().includes(message.SETOR.toLowerCase())) 
    if(!filter.length){
      registerLog({ body: "sector", value: message.SETOR })
    }
  }
}


function registerLog({ body, value }){
  const logPath = path.resolve( 
    body === 'error' ? "./src/logs/error.txt" : 
    (body === 'equipment' ? './src/logs/log_array_equipment.txt' : "./src/logs/log_array_sector.txt") 
  )
    const date = new Date().toISOString()
    const message = `[${date}] - ${value}\n`

    fs.appendFile(logPath, message, (error) => {
      if(error) console.error('Erro ao escrever log:', error);
    })
}

