import fs from 'node:fs'
import path from 'path'
import dayjs from 'dayjs'

export function LogRegisterAssets({ error, message }){

  // Comparação ignorando acentos - exemplos: "Coração", "coracao" = true - são iguais
  const notAccents = word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  if(error){
    return registerLog({ body: 'error', value: error })
  }

  if(message.EQUIPAMENTO) {
    fs.readFile("./src/utils/suggestions-data/suggestions-equipment.json", (error, data) => {
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
    fs.readFile("./src/utils/suggestions-data/suggestions-sector.json", (error, data) => {
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


function registerLog({ body, value }){
  const logPath = path.resolve( 
    body === 'error' ? "./src/logs/error.txt" : 
    (body === 'equipment' ? './src/logs/log_array_equipment.txt' : "./src/logs/log_array_sector.txt") 
  )
    const date = `${dayjs().format("DD-MM-YYYY")}T${dayjs().format("HH:mm:ss")}`
    const message = `[${date}] - ${value}\n`

    fs.appendFile(logPath, message, (error) => {
      if(error) console.error('Erro ao escrever log:', error);
    })
}


