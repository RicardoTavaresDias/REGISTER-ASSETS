import { listEquipment } from "../../lib/listEquipment.js";
import { GlpiBrowser } from "./GlpiBrowser.js";
import { normalizeText } from '../../lib/normalizeText.js'
import { AppError } from "../../utils/AppError.js";

export class GlpiAutomationService extends GlpiBrowser {
  constructor(user){
    super(user)
    this.existsAssets = []
    this.doesNotExistsAssets = []
    this.updateAssets = []
  }

  async assetsRegisteredInGlpi(url){
    await this.page.goto(url, { timeout: 35000 })
    const dataGlpi = await this.page.evaluate(() => {

      // Procura a posição da tabela para extrair dados corretos, tabela muda de index.
      const tableBaseHtml = [...document.querySelectorAll('.tab_cadrehov tr th')]
      
      const searchSeriesTable = tableBaseHtml.filter((value) => value.textContent.includes("Número de série"))[0]
      const searchLocationTable = tableBaseHtml.filter((value) => value.textContent.includes("Localização"))[0]
        
      const indexNumberSeriePosition = tableBaseHtml.indexOf(searchSeriesTable)
      const indexNumberLocationPosition = tableBaseHtml.indexOf(searchLocationTable)

      const existsGlpi = [
        document.querySelectorAll('.tab_bg_2 td')[indexNumberSeriePosition]?.textContent.replace("\t", ""), 
        document.querySelectorAll('.tab_bg_2 td')[indexNumberLocationPosition]?.textContent
      ]
      
      return existsGlpi
    })
    
    return dataGlpi
  }

  validateAssetsInGlpi(dataGlpi, item){
    if(dataGlpi[0] === item.serie){
      if(normalizeText(String(item.sector)) === normalizeText(String(dataGlpi[1]))){
        this.existsAssets.push(
          { 
            sector: item.sector,
            equipment: item.equipment, 
            serie: item.serie 
          }) 
      }else {
        this.updateAssets.push(
          {
            sector: dataGlpi[1] ? dataGlpi[1].toLowerCase() + " => " + item.sector.toUpperCase() : 
            (item.sector !== "" && dataGlpi[1] === "") ?
              "n/a => " + item.sector : item.sector, 
            equipment: item.equipment, 
            serie: item.serie 
          }
        )
      }
    }else {
      this.doesNotExistsAssets.push(
        { sector: item.sector, equipment: item.equipment, serie: item.serie }
      )
    }
  }

  async Assets(data){
    await this.browser()
    await this.login()
    const dataEquipment = listEquipment(data)

    try {
      for(const key in dataEquipment){
        const items = dataEquipment[key]
        
        for(const item of items.data){
          const url = items.path + item.serie + items.base
          const dataGlpi = await this.assetsRegisteredInGlpi(url)
          this.validateAssetsInGlpi(dataGlpi, item)
        }
      }
      this.browserClose()

      return {
        existsAssets: this.existsAssets,
        doesNotExistsAssets: this.doesNotExistsAssets,
        updateAssets: this.updateAssets
      }
    } catch (error) {
      this.browserClose()
      throw new AppError(error.message, 500)
    } 
  }


}

