import XLSX from "xlsx";
import { randomUUID } from "crypto"

export class CsvReader {

  /**
   * Lê o arquivo `register_assets.xlsx` e extrai os dados crus da planilha.
   * 
   * @returns {Array<Object>} Array de objetos com as colunas definidas no cabeçalho.
   */

  _ReadCsv(){
    const file = XLSX.readFile("./tmp/register_assets.xlsx")
    const SheetName = file.SheetNames[0]
    const sheet = file.Sheets[SheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { range: 11, header: ["Setor", "Equipamento", "Modelo", "Patrimonio", "F", "Serie"] })

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
