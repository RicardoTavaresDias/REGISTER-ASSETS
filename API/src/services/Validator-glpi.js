import puppeteer from 'puppeteer'
import { env } from "../config/env.js"

/*
sugestão: criar uma class, com construtor criar arrayexistente e notexistente, criar funcoes dentro da class e demandar computador, monitor e impressora, e alimetando os arrays e no ultimo retornar para gravação em arquivo .txt
*/

export class Validatorglpi{
  constructor(data){
    this.data = data
    this.existsAssets = []
    this.doesNotExistsAssets = []
  }

  async initBrowser(){
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    return page
  }

  async loginGlpi(page){
    await page.goto(env.GLPIINITIAL)
    await page.type("#login_name", "ricardo.dias")
    await page.type("#login_password", "chopper2#")
    await page.type("#dropdown_auth1", "DC-SACA")
    await page.click(`[type="submit"]`)
    await page.waitForNavigation()
  }

  _notAccents(text = ""){
    // Comparação ignorando acentos - exemplos: "Coração", "coracao" = true - são iguais
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  }

  async assetsGlpiRegisterWeb(page, item){
    const path = `https://glpi.ints.org.br/front/monitor.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=${item.serie}&search=Pesquisar&itemtype=Monitor&start=0&_glpi_csrf_token=5b75a0f06d84fcd184e1d9b0f64992b9`

    await page.goto(path)
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

  async glpiAssets(){
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
  }
}