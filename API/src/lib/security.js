import CryptoJS from "crypto-js";
import { jwtConfig } from "../config/token.js"

export function encryption(value){
  return CryptoJS.AES.encrypt(value, jwtConfig.secret).toString()
}

export function decryption(value){
  return CryptoJS.AES.decrypt(value, jwtConfig.secret).toString(CryptoJS.enc.Utf8)
}