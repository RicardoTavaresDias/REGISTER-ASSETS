import XLSX from "xlsx";
import ExcelJS from "exceljs";

export class CsvReader {
  async _ReadCsv(){
    const file = XLSX.readFile("./src/files/register_assets.xlsx")
    const SheetName = file.SheetNames[0]
    const sheet = file.Sheets[SheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { range: 11, header: ["Setor", "Equipamento", "Modelo", "Patrimonio", "F", "Serie"] })

    const dataFormat = data.map((value) => {
      if(value.Equipamento){
      return { 
              setor: value.Setor ? value.Setor : " ", 
              equipamento: value.Equipamento ? value.Equipamento : " ", 
              serie: value.Serie ? value.Serie : " "
            }
      }
      return { 
        setor: "", 
        equipamento: "", 
        serie: ""
      }
  })

    return dataFormat 
  }
}
