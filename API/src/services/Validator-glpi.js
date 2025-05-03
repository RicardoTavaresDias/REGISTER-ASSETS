import puppeteer from 'puppeteer'
import { env } from "../config/env.js"
import { listEquipment } from "../lib/listEquipment.js"

/**
 * Classe responsável por validar ativos no GLPI via web scraping.
 */

export class Validatorglpi{

  /**
   * @param {Object[]} data - Lista de dados dos equipamentos a validar.
   */

  constructor(data){
    this.data = data
    this.existsAssets = []
    this.doesNotExistsAssets = []
  }

  /**
   * Define o usuário que será utilizado para login no GLPI.
   * @param {{user: string, password: string}} user - Credenciais do usuário.
   */

  _user(user){
    this.user = user
  }

   /**
   * Inicializa o navegador Puppeteer.
   * @returns {Promise<puppeteer.Page>} Página do navegador.
   */

  async initBrowser(){
    this.browser = await puppeteer.launch({ headless: false })
    const page = await this.browser.newPage()

    return page
  }

   /**
   * Realiza o login no GLPI com as credenciais fornecidas.
   * @param {puppeteer.Page} page - Página atual do Puppeteer.
   * @throws Lança erro se o login falhar.
   */

  async loginGlpi(page){
    await page.goto(env.GLPIINITIAL, { timeout: 35000 })
    await page.type("#login_name", this.user.user)
    await page.type("#login_password", this.user.password)
    await page.type("#dropdown_auth1", "DC-SACA")
    await page.click(`[type="submit"]`)
    await page.waitForNavigation()

    const loginError = await page.evaluate(() => {
      return document.querySelector('[class="center b"]')?.textContent
    })

    if(loginError){
      page.browser().close()
      throw new Error(loginError + " no GLPI.")
    }
  }

  /**
   * Remove acentos e converte para minúsculas para facilitar comparações.
   * @param {string} [text=""] Texto a ser normalizado.
   * @returns {string} Texto sem acentos e em minúsculas.
   */

  _notAccents(text = ""){
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  }

  /**
   * Acessa a página de um ativo e retorna seus dados do GLPI.
   * @param {puppeteer.Page} page - Página atual.
   * @param {string} url - URL da página do ativo no GLPI.
   * @returns {Promise<string[]>} Dados coletados [serie, setor].
   */

  async assetsGlpiRegisterWeb(page, url){
    await page.goto(url, { timeout: 35000 })
    const dataGlpi = await page.evaluate(() => {
      const existsGlpi = [
        document.querySelectorAll('.tab_bg_2 td')[1]?.textContent.replace("\t", ""), 
        document.querySelectorAll('.tab_bg_2 td')[5]?.textContent
      ]
      
      return existsGlpi
    })

    return dataGlpi
  }

   /**
   * Valida se um ativo existe no GLPI comparando número de série e setor.
   * @param {string[]} dataGlpi - Dados retornados da página do GLPI.
   * @param {{sector: string, equipment: string, serie: string}} item - Ativo a ser validado.
   */

  async glpiAssetValidation(dataGlpi, item){
    dataGlpi[0] === item.serie ? 
      this.existsAssets.push(
        { 
          sector: item.sector && 
            this._notAccents(String(item.sector)) === this._notAccents(String(dataGlpi[1])) ? 
            item.sector : 
            dataGlpi[1] ? item.sector + " => " + dataGlpi[1] : item.sector, 

          equipment: item.equipment, 
          serie: item.serie 
        }) : 
    this.doesNotExistsAssets.push(
      { sector: item.sector, equipment: item.equipment, serie: item.serie }
    )
  }

  /**
   * Executa todo o processo de validação dos ativos no GLPI.
   * @returns {Promise<{existsAssets: Object[], doesNotExistsAssets: Object[]}>} Resultado da validação.
   */
 
  async glpiAssets(){    
    const dataEquipment = listEquipment(this.data)

    try {
      const page = await this.initBrowser()
      await this.loginGlpi(page)

      for(const key in dataEquipment){
        const items = dataEquipment[key]
        
        for(const item of items.data){
          const url = items.path + item.serie + items.base
          const dataGlpi = await this.assetsGlpiRegisterWeb(page, url)
          await this.glpiAssetValidation(dataGlpi, item)
        }
      }

      page.browser().close()

      return {
        existsAssets: this.existsAssets,
        doesNotExistsAssets: this.doesNotExistsAssets
      }

    }catch(error){
      this.browser.close()
      throw new Error(error.message)
    }
  }
}



