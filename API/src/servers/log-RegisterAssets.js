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

  const sources = {
    EQUIPAMENTO: {
      envPath: env.EQUIPMENT,
      itemKey: "equipment",
      messageKey: "EQUIPAMENTO",
    },
    SETOR: {
      envPath: env.SECTOR,
      itemKey: "sector",
      messageKey: "SETOR",
    },
    // SN: {
    //   envPath: env.UNITS,
    //   itemKey: "units",
    //   messageKey: "SN",
    // }
  }

  // Verifica o campo e ve se tem no JSON suggestions
  for(const key in sources){
    if(sources[key]){
      fs.readFile(sources[key].envPath, (error, data) => {
        if(error){
          return console.error("Error ao ler o log")
        }
        const result = JSON.parse(data)
        const filter = result.filter(value => 
          notAccents(value[sources[key].itemKey])
            .includes(notAccents(message[sources[key].messageKey]))) 
        if(!filter.length){
          registerLog({ 
            body: sources[key].itemKey, 
            value: message[sources[key].messageKey] 
          })
        }
      })
    }
  }
}


const LOG_PATHS = {
  error: env.LOGERROR,
  equipment: env.LOGEQUIPMENT,
  sector: env.LOGSECTOR,
  units: env.LOGUNITS
}

// Cria arquivo log em .txt
function registerLog({ body, value }){
  const logPath = path.resolve(LOG_PATHS[body])
  const date = `${dayjs().format("DD-MM-YYYY")}T${dayjs().format("HH:mm:ss")}`
  const message = `[${date}] - ${value}\n`

  fs.appendFile(logPath, message, (error) => {
    if(error) console.error('Erro ao escrever log:', error);
  })
}