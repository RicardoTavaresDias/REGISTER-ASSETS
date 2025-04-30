import { CrudFile } from "./CrudFile.js"

export async function manualReviewLogger(data){
  const crudFile = new CrudFile({ path: "./src/files/pendentes-para-cadastro.txt" })

  let output = "\n\nCadastros pedentes devido o setor não encontrado no glpi, realizar cadastro manual. \n\n"
  output += "+--------------------------------+-----------------+--------------------+\n"
  output += "|              SETOR             |   EQUIPAMENTO   |     N° SERIE       |\n"
  output += "+--------------------------------+-----------------+--------------------+\n"

  for(const item of data){
    output += `| ${item?.setor?.padEnd(30, " ")} | ${item?.equipamento?.padEnd(15, " ")} | ${item?.serie?.padEnd(18, " ")} |\n`
    output += "+--------------------------------+-----------------+--------------------+\n"
  }

  await crudFile._Write(output)
}