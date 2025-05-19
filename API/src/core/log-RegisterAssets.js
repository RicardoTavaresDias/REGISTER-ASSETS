import fs from 'node:fs'
import path from 'path'
import dayjs from 'dayjs'
import { env } from "../config/env.js"

/**
 * Registra mensagens de erro em um arquivo de log.
 * 
 * Cada entrada é gravada com data e hora no formato `DD-MM-YYYYTHH:mm:ss`.
 * O caminho do arquivo de log é definido pela variável de ambiente `env.LOGERROR`.
 *
 * @async
 * @function logRegisterAssets
 * @param {string|Error} err - Mensagem ou objeto de erro a ser registrado no log.
 * 
 * @returns {Promise<void>} 
 *
 * @example
 * try {
 *   // alguma operação que pode falhar
 * } catch (err) {
 *   await logRegisterAssets(err)
 * }
 */

export async function logRegisterAssets(err){
  const logPath = path.resolve(env.LOGERROR)
  const date = `${dayjs().format("DD-MM-YYYY")}T${dayjs().format("HH:mm:ss")}`
  const message = `[${date}] - ${err}\n`

  fs.appendFile(logPath, message, (error) => {
    if(error) console.error('Erro ao escrever log:', error);
  })
}