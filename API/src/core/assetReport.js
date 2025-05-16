import fs from "node:fs"
import { AppError } from "../utils/AppError.js"
import { pagination } from "../utils/pagination.js"

export class AssetReport {
  async manualReviewLogger(dataValidator){

    let output = "\n\nCadastros encontrados no glpi. \n\n"
    output += "+------------------------------------------+-----------------+--------------------+\n"
    output += "|                  SETOR                   |   EQUIPAMENTO   |     N° SERIE       |\n"
    output += "+------------------------------------------+-----------------+--------------------+\n"

    for(const item of dataValidator.existsAssets){
      output += `| ${item?.sector?.padEnd(40, " ")} | ${item?.equipment?.padEnd(15, " ")} | ${item?.serie?.padEnd(18, " ")} |\n`
      output += "+------------------------------------------+-----------------+--------------------+\n"
    }


    output += "\n\nCadastros pedentes para ser cadastrado no GLPI. \n\n"
    output += "+--------------------------------+-----------------+--------------------+\n"
    output += "|              SETOR             |   EQUIPAMENTO   |     N° SERIE       |\n"
    output += "+--------------------------------+-----------------+--------------------+\n"

    for(const item of dataValidator.doesNotExistsAssets ){
      output += `| ${item?.sector?.padEnd(30, " ")} | ${item?.equipment?.padEnd(15, " ")} | ${item?.serie?.padEnd(18, " ")} |\n`
      output += "+--------------------------------+-----------------+--------------------+\n"
    }


    output += "\n\nCadastros para atualizar setor no GLPI . \n"
    output += "SETOR DO GLPI => SETOR DA PLANILHA. \n\n"
    output += "+------------------------------------------+-----------------+--------------------+\n"
    output += "|                  SETOR                   |   EQUIPAMENTO   |     N° SERIE       |\n"
    output += "+------------------------------------------+-----------------+--------------------+\n"

    for(const item of dataValidator.updateAssets ){
      output += `| ${item?.sector?.padEnd(40, " ")} | ${item?.equipment?.padEnd(15, " ")} | ${item?.serie?.padEnd(18, " ")} |\n`
      output += "+------------------------------------------+-----------------+--------------------+\n"
    }

    await fs.promises.writeFile("./src/files/pendentes-para-cadastro.json", JSON.stringify({
      existsAssets: dataValidator.existsAssets,
      doesNotExistsAssets: dataValidator.doesNotExistsAssets,
      updateAssets: dataValidator.updateAssets
    }, null, 2))

    await fs.promises.writeFile("./src/files/pendentes-para-cadastro.txt", output)

    return {
        existsAssets: dataValidator.existsAssets,
        doesNotExistsAssets: dataValidator.doesNotExistsAssets,
        updateAssets: dataValidator.updateAssets
      }
  }

  async indexPaginationReport({ typeReport, page, limit }){
    const readFile = await fs.promises.readdir("./src/files")
    if(!readFile.includes("pendentes-para-cadastro.json")){
      throw new AppError("Relatório não gerado.", 400)
    }

    const data = await fs.promises.readFile("./src/files/pendentes-para-cadastro.json")
    const dataJson = JSON.parse(data)

    if(!dataJson[typeReport].length){
      throw new AppError("Não tem registro.", 400)
    }

    const paginationDataJson = pagination(page, limit, dataJson[typeReport])
    
    return paginationDataJson
  }

  async removeReport({ typeReport, id }){
    const data = await this.processingData({ typeReport, id })
    
    const RemoveItem = data.dataJson[typeReport].filter(value => !(value.id === id))

    await fs.promises.writeFile("./src/files/pendentes-para-cadastro.json", 
      JSON.stringify({ [typeReport]: RemoveItem, ...data.restDataJson }, null, 4))
    
    return    
  }

  async updateReport({ typeReport, id, updates }){
    const data = await this.processingData({ typeReport, id })

    const updateItem = data.dataJson[typeReport].map(value => {
      if(value.id === id){
        return {
          ...value,
          ...updates
        }
      }
      return value
    })

    await fs.promises.writeFile("./src/files/pendentes-para-cadastro.json", 
      JSON.stringify({ [typeReport]: updateItem, ...data.restDataJson }, null, 4))
    
    return  
  }

  async processingData(element){
    const readFile = await fs.promises.readdir("./src/files")
    if(!readFile.includes("pendentes-para-cadastro.json")){
      throw new AppError("Relatório não gerado.", 400)
    }
    
    const data = await fs.promises.readFile("./src/files/pendentes-para-cadastro.json")
    const dataJson = JSON.parse(data)
    
    let restDataJson = null

    if(element.typeReport === "existsAssets"){
      const { existsAssets, ...rest } = dataJson
      restDataJson = rest
    }else if(element.typeReport === "doesNotExistsAssets"){
      const { doesNotExistsAssets, ...rest } = dataJson
      restDataJson = rest
    }else {
      const { updateAssets, ...rest } = dataJson
      restDataJson = rest
    }

    return { restDataJson, dataJson } 
  }
}