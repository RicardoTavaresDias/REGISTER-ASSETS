import { env } from "../config/env.js"

export function Paths(element){
  const map = {
    suggestions: {
      equipment: { path: env.EQUIPMENT, value: element },
      sector: { path: env.SECTOR, value: element },
      units: { path: env.UNITS, value: element }
    },
    logs: {
      error: { path: env.LOGERROR },
      equipment: { path: env.LOGEQUIPMENT },
      sector: { path: env.LOGSECTOR },
      units: { path: env.LOGUNITS }
    }
  }

/*
  {
    path: './src/utils/suggestions-data/suggestions-equipment.json',
    value: { typeController: 'suggestions', type: 'equipment' }
  }
*/

  if (!map[element.typeController][element.type]) throw new Error("Tipo inválido: equipment, sector ou units")

  // Removendo typeController
  const { path, value } = map[element.typeController][element.type] || ""
  const { type } = value || ""
    
  return  value ? { path, type } : { path } 
}