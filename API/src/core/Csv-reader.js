import XLSX from "xlsx";
import { randomUUID } from "crypto"

export class CsvReader {
  constructor(fileName){
    this.fileName = fileName
  }

    /**
   * Lê o arquivo Excel `register_assets.xlsx` e extrai os dados brutos da planilha.
   *
   * Funcionalidade:
   * - Utiliza a biblioteca `xlsx` para abrir o arquivo na pasta `./tmp`, baseado no nome de arquivo `this.fileName`.
   * - Lê a primeira planilha do arquivo.
   * - Converte os dados a partir da linha 12 (índice base 0: `range: 11`), ignorando as linhas anteriores.
   * - Define manualmente os nomes das colunas: `"Setor"`, `"Equipamento"`, `"C"`, `"D"`, `"E"` e `"Serie"`.
   *
   * @returns {Array<Object>} Um array de objetos representando os dados das linhas da planilha, com chaves baseadas no cabeçalho definido.
   *
   * @throws {Error} Pode lançar erro caso o arquivo não exista, esteja corrompido ou não tenha estrutura esperada.
   */

  _ReadCsv(){
    const file = XLSX.readFile(`./tmp/${this.fileName}&register_assets.xlsx`)
    const SheetName = file.SheetNames[0]
    const sheet = file.Sheets[SheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { range: 11, header: ["Setor", "Equipamento", "C", "D", "E", "Serie"] })

    return data
  }

/**
 * Lê e formata os dados de um arquivo CSV, transformando cada linha em um objeto estruturado.
 * 
 * Funcionalidades:
 * - Utiliza o método interno `_ReadCsv()` para obter os dados brutos do CSV.
 * - Converte registros com o campo `Equipamento` igual a "Desktop" (case-insensitive) para "CPU".
 * - Formata os valores dos campos `Setor`, `Equipamento` e `Serie` com `trim()` (caso sejam strings).
 * - Gera um `UUID` único para cada item válido.
 * - Registros com todos os campos (`sector`, `equipment`, `serie`) vazios são descartados.
 * 
 * @returns {Array<Object>} Array de objetos com estrutura padronizada contendo:
 *  - `id` {string} UUID único para o registro.
 *  - `sector` {string} Valor tratado do campo "Setor" (ou string vazia).
 *  - `equipment` {string} Valor tratado do campo "Equipamento" (ou string vazia).
 *  - `serie` {string} Valor tratado do campo "Serie" (ou string vazia).
 */

  csvData(){
    const data = this._ReadCsv()

    const validateDataComputer = data.map(value => {
      if(!value.Setor || !value.Equipamento){
        return ""
      }

      if(value.Equipamento.toLowerCase() === "desktop".toLowerCase()){
        return {
          ...value,
          Equipamento: "CPU"
        }
      }
      return value
    }).filter(value => !(value === ""))

    const dataFormat = validateDataComputer.map((value) => {
      if(value.Equipamento){
      return { 
              id: randomUUID(),
              sector: typeof value.Setor === 'string' ? value.Setor.trim() : "", 
              equipment: typeof value.Equipamento === 'string' ? value.Equipamento.trim() : "", 
              serie: typeof value.Serie === 'string' ? value.Serie.trim() : ""
            }
      }
      return {
        id: " ",
        sector: " ", 
        equipment: " ", 
        serie: " "
      }
    })
    
    const filterRemoveNull = dataFormat.filter(value => !(value.serie === ""))
    return filterRemoveNull
  }
}
