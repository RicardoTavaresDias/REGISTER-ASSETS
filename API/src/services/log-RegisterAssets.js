import fs from 'node:fs'
import path from 'path'
import dayjs from 'dayjs'
import { env } from "../config/env.js"
import { normalizeText } from '../lib/normalizeText.js'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Registra um log de erro ou de item não encontrado nas sugestões.
 *
 * @param {Object} params Parâmetros da função.
 * @param {string} [params.error] Mensagem de erro a ser registrada.
 * @param {Object} [params.message] Objeto com os nomes dos elementos para verificação.
 * @param {string} [params.message.EQUIPAMENTO] Nome do equipamento (opcional).
 * @param {string} [params.message.SETOR] Nome do setor (opcional).
 */

/**
 * @param {object} params Parâmetros da função.
 * @param {'error' | 'equipment' | 'sector'} params.body Tipo do log (define qual arquivo será usado).
 * @param {string} params.value Conteúdo a ser escrito no log.
 */

export async function LogRegisterAssets({ error, message }){
  if(error){
    return registerLog({ body: 'error', value: error })
  }

  const sources = {
    EQUIPAMENTO: {
      envPath: "type_Equipment",
      itemKey: "equipment",
      messageKey: "equipment",
    },
    SETOR: {
      envPath: "sector",
      itemKey: "sector",
      messageKey: "sector",
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
      const result = await prisma[sources[key].envPath].findFirst({
        where: {
          name: {
            endsWith: normalizeText(message[sources[key].itemKey])
          }
        }
      })
       
      if(!result){
        registerLog({ 
          body: sources[key].itemKey, 
          value: message[sources[key].messageKey] 
        })
      }
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