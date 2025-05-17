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
 * Lê dados de um CSV e formata cada linha em um objeto estruturado com `id`, `sector`, `equipment` e `serie`.
 * 
 * - Utiliza o método interno `_ReadCsv()` para carregar os dados brutos do arquivo.
 * - Cada entrada com campo `Equipamento` presente é formatada e recebe um `UUID` único.
 * - Entradas vazias ou incompletas são descartadas após o filtro.
 * 
 * @returns {Array<Object>} Lista de objetos formatados com as propriedades:
 * - `id`: string (UUID gerado)
 * - `sector`: string (valor do campo "Setor" no CSV)
 * - `equipment`: string (valor do campo "Equipamento" no CSV)
 * - `serie`: string (valor do campo "Serie" no CSV)
 */

  csvData(){
    const data = this._ReadCsv()
    const dataFormat = data.map((value) => {
      if(value.Equipamento){
      return { 
              id: randomUUID(),
              sector: value.Setor?.trim() || "", 
              equipment: value.Equipamento?.trim() || "", 
              serie: value.Serie?.trim() || ""
            }
      }
      return {
        id: " ",
        sector: " ", 
        equipment: " ", 
        serie: " "
      }
  }).filter(value => value.sector !== " " || value.equipment !== " " || value.serie !== " ")

    return dataFormat 
  }
}
