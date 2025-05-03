import puppeteer from 'puppeteer'
import { env } from "../config/env.js"

export class Validatorglpi{
  constructor(data){
    this.data = data
    this.existsAssets = []
    this.doesNotExistsAssets = []
  }

  async initBrowser(){
    this.browser = await puppeteer.launch({ headless: false })
    const page = await this.browser.newPage()

    return page
  }

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

  _notAccents(text = ""){
    // Comparação ignorando acentos - exemplos: "Coração", "coracao" = true - são iguais
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  }

  async assetsGlpiRegisterWeb(page, item){
    const path = `https://glpi.ints.org.br/front/monitor.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=${item.serie}&search=Pesquisar&itemtype=Monitor&start=0&_glpi_csrf_token=5b75a0f06d84fcd184e1d9b0f64992b9`

    await page.goto(path, { timeout: 35000 })
    const dataGlpi = await page.evaluate(() => {
      const existsGlpi = [
        document.querySelectorAll('.tab_bg_2 td')[1]?.textContent.replace("\t", ""), 
        document.querySelectorAll('.tab_bg_2 td')[5]?.textContent
      ]
      
      return existsGlpi
    })

    return dataGlpi
  }

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

  async glpiAssets(user){
    this.user = user
    try {
      const page = await this.initBrowser()
      await this.loginGlpi(page)

      for(const item of this.data){
        const dataGlpi = await this.assetsGlpiRegisterWeb(page, item)
        await this.glpiAssetValidation(dataGlpi, item)
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