import Tesseract from "tesseract.js";
import XLSX from "xlsx";
import ExcelJS from "exceljs";
import multer from "multer";
import path from "node:path";
import { env } from "../config/env.js"

import { upload } from "../config/multer.js";
import { LogRegisterAssets } from "../services/log-RegisterAssets.js";

export class RegisterAssetsController {
  postFile(request, response) {
    try {
      upload.single("file")(request, response, async (error) => {
        if (error instanceof multer.MulterError) {
          LogRegisterAssets({ error: error.message })
          return response.status(422).json({ message: error.message });      
        } else if (error) {
          LogRegisterAssets({ error: error.message })
          return response.status(500).json({ message: error.message });
        }

        if (request.errorMessage) {
          LogRegisterAssets({ error: request.errorMessage })
          return response.status(422).json({ message: request.errorMessage }); 
        }

        const result = await Tesseract.recognize(
          `./tmp/${request.file.filename}`,
          "por"
        );

        return response.status(200).json({
          // message: "Upload completed successfully!",
          message: "Leitura realizado da imagem!",
          file: request.file,
          SN:
            // Extrai no texto somente palavra que começa BR
            result.data.text.match(/\bBR\w*/i) &&
            result.data.text.match(/\bBR\w*/i)[0],
        });
      });
    } catch (error) {
      console.log(error);
      LogRegisterAssets({ error: error })
    }
  }

  async postAssets(request, response) {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(env.XLSX);
      const sheet = workbook.getWorksheet("Ativos");

      const xlsxFile = XLSX.readFile(env.XLSX);
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
      
      await workbook.xlsx.writeFile(env.XLSX);
      LogRegisterAssets({ message: request.body })
      response
        .status(200)
        .json({
          message: `SN: e Setor cadastrado com sucesso, na planilha Excel!`,
        });
    } catch (error) {
      console.log(error)
      LogRegisterAssets({ error: error })
      response
        .status(422)
        .json({
          message: "Error ao inserir SN: e Setor na planilha Excel!",
          error: error.message,
        });
    }
  }

  indexAssets (request, response){
    try {
      const xlsxFile = XLSX.readFile(env.XLSX);
      const sheet = xlsxFile.Sheets["Ativos"];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 2 })
      response.status(200).json(data)
    } catch(error){
      console.log(error)
      LogRegisterAssets({ error: error })
      response.status(422).json({
          message: "Error ao acessar/ler o arquivo .xlsx",
          error: error.message,
      });
    }
  }

  downloadAssets(request, response){
    try {
      const pathDonload = path.resolve(env.XLSX)
      response.download(pathDonload, (error) => {
        if(error){
          console.log("Erro no download:", error)
          LogRegisterAssets({ error: error })
          return response.status(404).json({ message: "File not found" })
        }
      })
    } catch(error){
      console.log(error)
      LogRegisterAssets({ error: error })
      response.status(422).json({
          message: "Error ao acessar/ler o arquivo .xlsx",
          error: error.message,
      });
    }
  }
}