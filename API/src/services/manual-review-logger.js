import { CrudFile } from "./CrudFile.js"

/**
 * Gera um relatório de ativos classificados em dois grupos:
 * 1. Encontrados no GLPI.
 * 2. Ativos pendentes que precisam ser cadastrados no GLPI.
 *
 * O relatório é formatado em texto tabular e salvo no arquivo:
 * `./src/files/pendentes-para-cadastro.txt`
 *
 * @param {Array<{ sector: string, equipment: string, serie: string }>} existsAssets 
 *   Lista de ativos que foram encontrados no GLPI.
 *
 * @param {Array<{ sector: string, equipment: string, serie: string }>} doesNotExistsAssets 
 *   Lista de ativos ainda não cadastrados no GLPI (setor não encontrado ou dados ausentes).
 *
 * @returns {Promise<void>} Promessa que resolve após o arquivo ser escrito com sucesso.
 */

export async function manualReviewLogger(existsAssets, doesNotExistsAssets ){
  const crudFile = new CrudFile({ path: "./src/files/pendentes-para-cadastro.txt" })

  let output = "\n\nCadastros encontrados no glpi. \n\n"
  output += "+------------------------------------------+-----------------+--------------------+\n"
  output += "|                  SETOR                   |   EQUIPAMENTO   |     N° SERIE       |\n"
  output += "+------------------------------------------+-----------------+--------------------+\n"

  for(const item of existsAssets){
    output += `| ${item?.sector?.padEnd(40, " ")} | ${item?.equipment?.padEnd(15, " ")} | ${item?.serie?.padEnd(18, " ")} |\n`
    output += "+------------------------------------------+-----------------+--------------------+\n"
  }

  output += "\n\nCadastros pedentes para ser cadastrado no GLPI. \n\n"
  output += "+--------------------------------+-----------------+--------------------+\n"
  output += "|              SETOR             |   EQUIPAMENTO   |     N° SERIE       |\n"
  output += "+--------------------------------+-----------------+--------------------+\n"

  for(const item of doesNotExistsAssets ){
    output += `| ${item?.sector?.padEnd(30, " ")} | ${item?.equipment?.padEnd(15, " ")} | ${item?.serie?.padEnd(18, " ")} |\n`
    output += "+--------------------------------+-----------------+--------------------+\n"
  }

  await crudFile._Write(output)
}