 import fs from "node:fs"

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
 
 export async function updateImportFile({ manual, update, create, user }){
    const readFile = await fs.promises.readdir("./tmp")
    if(!readFile.includes(`${user}&pendentes-para-cadastro.json`)){
      throw new Error("O relatório ainda não foi gerado.")
    }

    const fsData = await fs.promises.readFile(`./tmp/${user}&pendentes-para-cadastro.json`)
    const reader = JSON.parse(fsData)

    await fs.promises.writeFile(`./tmp/${user}&pendentes-para-cadastro.json`, 
      JSON.stringify(
        { 
          ...reader, 
          updateAssets: update || reader.updateAssets,
          manualRegistration: [{ manual: reader.manualRegistration, sector: manual || [] }]
        }, null, 2
      )
    )
    return
  }