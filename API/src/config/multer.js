import multer from "multer"
import fs from "node:fs"
import CryptoJS from "crypto-js"
import { jwtConfig } from "../config/token.js"

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
        callback(new Error("File server not found"), null)
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
      request.errorMessage = "Invalid file type only jpg, jpeg and png."
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
        callback(new Error("File server not found"), null)
      }
    },

    filename: (request, file, callback) => {
      callback(null, `${
        CryptoJS.AES.decrypt(request.user.user, jwtConfig.secret).toString(CryptoJS.enc.Utf8)
        }&register_assets.${file.originalname.split('.')[1]}`
      )
    }
  }),

  fileFilter: (request, file, callback) => {
    const filter = [ 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ]

    if(filter.includes(file.mimetype)){
      callback(null, true)
    }else {
      request.errorMessage = "Invalid file type only xlsx."
      callback(null, false)
    }
  }, 
  
  limits: { fileSize: 200 * 1024 * 1024 }

})