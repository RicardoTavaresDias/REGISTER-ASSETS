import Tesseract from "tesseract.js";
import XLSX from "xlsx";
import ExcelJS from "exceljs";
import multer from "multer";

import { upload } from "../config/multer.js";
import { LogArrayEquipment } from "../utils/log-arrayEquipment.js";

export class RegisterAssetsController {
  postFile(request, response) {
    try {
      upload.single("file")(request, response, async (error) => {
        if (error instanceof multer.MulterError) {
          LogArrayEquipment({ error: error.message })
          return response.status(422).json({ message: error.message });      
        } else if (error) {
          LogArrayEquipment({ error: error.message })
          return response.status(500).json({ message: error.message });
        }

        if (request.errorMessage) {
          LogArrayEquipment({ error: request.errorMessage })
          return response.status(422).json({ message: request.errorMessage }); 
        }

        const result = await Tesseract.recognize(
          `./tmp/${request.file.filename}`,
          "por"
        );

        return response.status(200).json({
          message: "Upload completed successfully!",
          file: request.file,
          SN:
            // Extrai no texto somente palavra que começa BR
            result.data.text.match(/\bBR\w*/i) &&
            result.data.text.match(/\bBR\w*/i)[0],
        });
      });
    } catch (error) {
      console.log(error);
      LogArrayEquipment({ error: error })
    }
  }

  async postAssets(request, response) {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile("./teste.xlsx");
      const sheet = workbook.getWorksheet("Ativos");

      const xlsxFile = XLSX.readFile("./teste.xlsx");
      const xlsxSheetName = xlsxFile.SheetNames[0];
      const xlsxSheet = xlsxFile.Sheets[xlsxSheetName];
      const data = XLSX.utils.sheet_to_json(xlsxSheet, { header: 2 });
      
      let rowIndex = data.length + 2;

      for (const item of [request.body]) {
        const row = sheet.getRow(rowIndex);

        row.getCell(1).value = item.EQUIPAMENTO
        row.getCell(2).value = item.SN,
        row.getCell(3).value = item.SETOR,
        rowIndex++;
      }
      
      await workbook.xlsx.writeFile("teste.xlsx");
      LogArrayEquipment({ message: request.body })
      response
        .status(200)
        .json({
          message: `S/N e Setor cadastrado com sucesso, na planilha Excel!`,
        });
    } catch (error) {
      console.log(error)
      LogArrayEquipment({ error: error })
      response
        .status(422)
        .json({
          message: "Error ao inserir S/N e Setor na planilha Excel!",
          error: error.message,
        });
    }
  }
}

