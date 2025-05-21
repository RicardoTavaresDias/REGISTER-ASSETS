import puppeteer from 'puppeteer'
import { env } from "../../config/env.js"
import CryptoJS from "crypto-js";
import { jwtConfig } from "../../config/token.js"
import { AppError } from "../../utils/AppError.js"

/**
 * Classe responsável por controlar o navegador e autenticação no sistema GLPI.
 */

export class GlpiBrowser {

  /**
   * Cria uma instância do GlpiBrowser.
   * 
   * @param {Object} user - Objeto contendo as credenciais criptografadas.
   * @param {string} user.user - Nome de usuário criptografado (AES).
   * @param {string} user.password - Senha criptografada (AES).
   */

  constructor(user){
    this.user = user
    this.page = null
  }

  /**
   * Inicializa o navegador e abre uma nova página.
   * 
   * @returns {Promise<void>}
   */

  async browser(){
    this.browser = await puppeteer.launch({ headless: false })
    const page = await this.browser.newPage()
    this.page = page
  }

   /**
   * Fecha o navegador iniciado pelo Puppeteer.
   * 
   * @returns {Promise<void>}
   */

  async browserClose(){
    this.browser.close()
  }

   /**
   * Realiza o login no sistema GLPI com as credenciais fornecidas.
   * 
   * Este método navega até a página de login, preenche os campos,
   * e tenta autenticar. Caso falhe, lança um erro com a mensagem capturada.
   * 
   * @throws {Error} Caso o login falhe ou a entidade não carregue.
   * @returns {Promise<void>}
   */

  async login(){
    await this.page.goto(env.GLPIINITIAL, { timeout: 35000 })
    await this.page.type("#login_name", this.user.user)
    await this.page.type("#login_password", CryptoJS.AES.decrypt(this.user.password, jwtConfig.secret).toString(CryptoJS.enc.Utf8))
    await this.page.type("#dropdown_auth1", "DC-SACA")
    await this.page.click(`[type="submit"]`)

    await this.page.waitForSelector("#c_logo", { timeout: 10000 })
    .catch(async () => {
        const loginError = await this.page.evaluate(() => {
        return document.querySelector('[class="center b"]')?.textContent
      })
  
      if(loginError){
        this.browserClose()
        throw new AppError(loginError + " no GLPI.", 401)
      }

      this.browserClose()
      throw new AppError("Elemento de entidade não carregou após login no Glpi.", 500) 
    })
  }
}