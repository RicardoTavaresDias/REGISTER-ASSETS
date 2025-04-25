import fs from 'node:fs'
import path from 'path'
import dayjs from 'dayjs'
import { env } from "../config/env.js"

export function LogRegisterAssets({ error, message }){

  // Comparação ignorando acentos - exemplos: "Coração", "coracao" = true - são iguais
  const notAccents = word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  if(error){
    return registerLog({ body: 'error', value: error })
  }

 /*
 **CORREÇÃO NO CODIGO**
 SUGESTÃO: 
 Realizar um loop para codigo a baixo para não ser repetitivo como message.EQUIPAMENTO e message.SETOR eoutros, 
 deixar flexivel para crecimento de novos items 

*/

  if(message.EQUIPAMENTO) {
    fs.readFile(env.EQUIPMENT, (error, data) => {
      if(error){
        return console.error("Error ao ler o log")
      }
      const result = JSON.parse(data)
      const filter = result.filter(value => notAccents(value.equipment).includes(notAccents(message.EQUIPAMENTO))) 
      if(!filter.length){
        registerLog({ body: "equipment", value: message.EQUIPAMENTO })
      }
    })
  }
  
  if(message.SETOR){
    fs.readFile(env.SECTOR, (error, data) => {
      if(error){
        return console.error("Error ao ler e escrver log")
      }
      const result = JSON.parse(data)
      const filter = result.filter(value => notAccents(value.sector).includes(notAccents(message.SETOR))) 
      if(!filter.length){
        registerLog({ body: "sector", value: message.SETOR })
      }
    })
  }
}

const LOG_PATHS = {
  error: env.LOGERROR,
  equipment: env.LOGEQUIPMENT,
  sector: env.LOGSECTOR,
  units: env.LOGUNITS
}

function registerLog({ body, value }){
  const logPath = path.resolve(LOG_PATHS[body])
  const date = `${dayjs().format("DD-MM-YYYY")}T${dayjs().format("HH:mm:ss")}`
  const message = `[${date}] - ${value}\n`

  fs.appendFile(logPath, message, (error) => {
    if(error) console.error('Erro ao escrever log:', error);
  })
}