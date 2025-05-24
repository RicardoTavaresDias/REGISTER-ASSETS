 import fs from "node:fs"

 /**
 * Classe responsável por gerenciar arquivos JSON e XLSX relacionados a ativos pendentes para cadastro.
 */

export class File {
  constructor(user){
    this.user = user
  }

   /**
   * Verifica se o arquivo JSON de pendências existe no diretório ./tmp.
   * 
   * @throws {Error} Se o arquivo não existir.
   * @returns {Promise<void>}
   */

  async existFile(){
    const readFile = await fs.promises.readdir("./tmp")
    if(!readFile.includes(`${this.user}&pendentes-para-cadastro.json`)){
      throw new Error("Nenhum relatório foi gerado até o momento.")
    }
    return
  }

  /**
   * Lê o conteúdo do diretório ./tmp.
   * 
   * @returns {Promise<string[]>} Lista de arquivos presentes no diretório.
   */

  async fileReaddir(){
    return await fs.promises.readdir("./tmp")
  }

   /**
   * Lê e retorna o conteúdo do arquivo JSON de pendências, convertendo-o para objeto.
   * 
   * @throws {Error} Se o arquivo não existir.
   * @returns {Promise<Object>} Conteúdo do arquivo JSON já convertido em objeto.
   */

  async fileReader(){
    await this.existFile()
    const fsData = await fs.promises.readFile(`./tmp/${this.user}&pendentes-para-cadastro.json`)
    const reader = JSON.parse(fsData)
    return reader
  }

  /**
   * Escreve um objeto no arquivo JSON de pendências.
   * 
   * @param {Object} object - Objeto a ser salvo no arquivo.
   * @returns {Promise<void>}
   */

  async write(object) {
    await fs.promises.writeFile(`./tmp/${this.user}&pendentes-para-cadastro.json`, JSON.stringify(object, null, 2))
    return
  }

    /**
   * Atualiza o arquivo JSON de pendências com dados atualizados de ativos.
   *
   * @param {Object} params
   * @param {Array<Object>} params.manual - Setores para registro manual.
   * @param {Array<Object>} params.update - Ativos a serem atualizados.
   * @param {Array<Object>} params.create - Ativos a serem criados.
   * @param {string} params.user - Nome do usuário (para identificar o arquivo).
   *
   * @throws {Error} Se o arquivo de relatório não existir.
   */

  async updateImportFile({ manual, update, create }){
    const reader = await this.fileReader()
    await this.write(
      { 
        ...reader, 
        updateAssets: update || reader.updateAssets,
        manualRegistration: [{ manual: reader.manualRegistration, sector: manual || [] }]
      }
    )
    
    return
  }

  /**
   * Remove o arquivo Excel (.xlsx) de ativos registrados, se existir.
   * 
   * @returns {void}
   */

  async removerFileXlsx(){
    fs.unlinkSync(`./tmp/${this.user}&register_assets.xlsx`)
    return
  }
}







 
 
 


 

  

 