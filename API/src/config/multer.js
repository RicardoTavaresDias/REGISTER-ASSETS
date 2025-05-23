import multer from "multer"
import fs from "node:fs"
import { encryption } from "../lib/security.js"

/**
 * Middleware de upload de imagens (.jpg, .jpeg, .png).
 * - Armazena em `tmp/` com nome fixo: `assets.<extensão>`.
 * - Tamanho máximo: 100MB.
 * - Tipos permitidos: `jpg`, `jpeg`, `png`.
 * - Em caso de tipo inválido, define `request.errorMessage`.
 *
 * @type {import("multer").Multer}
 */

export const uploadImage = multer({

  storage: multer.diskStorage({
    destination: (request, file, callback) => {
      try {
        if(!fs.existsSync('tmp')){
          fs.mkdirSync('tmp')
        }
        callback(null, 'tmp')
      } catch(error){
        callback(new Error("Servidor de arquivos indisponível no momento. Verifique sua conexão ou tente novamente mais tarde."), null)
      }
    },

    filename: (request, file, callback) => {
      callback(null, `assets.${file.originalname.split('.')[1]}`)
    }
  }),

  fileFilter: (request, file, callback) => {
    const filter = [ 
      "image/png", 
      "image/jpg", 
      "image/jpeg"
    ]

    if(filter.includes(file.mimetype)){
      callback(null, true)
    }else {
      request.errorMessage = "Formato de imagem não suportado. Envie arquivos nos formatos JPG, JPEG ou PNG."
      callback(null, false)
    }
  }, 
  
  limits: { fileSize: 100 * 1024 * 1024 }

})

/**
 * Middleware de upload de planilhas Excel (.xlsx).
 * - Armazena em `tmp/` com nome baseado no usuário descriptografado: `<usuario>&register_assets.xlsx`.
 * - Tamanho máximo: 200MB.
 * - Tipo permitido: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
 * - Em caso de tipo inválido, define `request.errorMessage`.
 *
 * @type {import("multer").Multer}
 */

export const uploadXlsx = multer({

  storage: multer.diskStorage({
    destination: (request, file, callback) => {
      try {
        if(!fs.existsSync('tmp')){
          fs.mkdirSync('tmp')
        }
        callback(null, 'tmp')
      } catch(error){
        callback(new Error("Servidor de arquivos indisponível no momento. Verifique sua conexão ou tente novamente mais tarde."), null)
      }
    },

    filename: (request, file, callback) => {
      callback(null, `${request.user.user}&register_assets.${file.originalname.trim().split('.')[1]}`
      )
    }
  }),

  fileFilter: (request, file, callback) => {
    const filter = [ 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ]

    if(filter.includes(file.mimetype)){
      callback(null, true)
    }else {
      request.errorMessage = "Formato de imagem não suportado. Envie arquivos nos formatos xlsx."
      callback(null, false)
    }
  }, 
  
  limits: { fileSize: 200 * 1024 * 1024 }

})