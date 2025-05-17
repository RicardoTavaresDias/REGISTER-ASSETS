import { normalizeText } from '../../lib/normalizeText.js'

export class GlpiAssetDataProcessing {
  constructor(){
    this.existsAssets = []
    this.doesNotExistsAssets = []
    this.updateAssets = []
  }

  async assetsRegisteredInGlpi(url, page){
    await page.goto(url, { timeout: 35000 })
    const dataGlpi = await page.evaluate(() => {

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
              id: String(item?.id),
              sector: item.sector,
              idSector: item?.id_sector,
              equipment: item.equipment, 
              serie: item.serie 
            }) 
        }else {
          this.updateAssets.push(
            {
              id: String(item?.id),
              sector: dataGlpi[1] ? dataGlpi[1].toLowerCase() + " => " + item.sector.toUpperCase() : 
              (item.sector !== "" && dataGlpi[1] === "") ?
                "n/a => " + item.sector : item.sector, 
              idSector: item?.id_sector,
              equipment: item.equipment, 
              serie: item.serie 
            }
          )
        }
      }else {
        this.doesNotExistsAssets.push(
          { id: String(item?.id), sector: item.sector, idSector: item?.id_sector, equipment: item.equipment, serie: item.serie }
        )
      }
    }

  getResultValidateAssets(){
    return {
      existsAssets: this.existsAssets,
      doesNotExistsAssets: this.doesNotExistsAssets,
      updateAssets: this.updateAssets
    }
  }
}