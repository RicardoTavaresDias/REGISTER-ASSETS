import { normalizeText } from '../../lib/normalizeText.js'

/**
 * Classe responsável por processar e validar dados de ativos extraídos do GLPI.
 * Ela classifica os ativos em três categorias:
 * - Ativos encontrados corretamente (`existsAssets`)
 * - Ativos com setor incorreto (`updateAssets`)
 * - Ativos não encontrados (`doesNotExistsAssets`)
 */

export class GlpiAssetDataProcessing {
  constructor(){
    this.existsAssets = []
    this.doesNotExistsAssets = []
    this.updateAssets = []
  }

  /**
   * Acessa uma URL específica do GLPI e extrai os dados do ativo (número de série e localização).
   * 
   * - Utiliza `page.goto` para acessar a página de um ativo no GLPI.
   * - Identifica dinamicamente a posição das colunas "Número de série" e "Localização".
   * - Retorna os valores desses campos em um array.
   * 
   * @param {string} url - URL da página do ativo no GLPI.
   * @param {import('puppeteer').Page} page - Instância da página do Puppeteer.
   * @returns {Promise<[string|null, string|null]>} Array com número de série e localização extraídos da tabela.
   */

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
        document.querySelectorAll('.tab_bg_2 td')[indexNumberSeriePosition]?.textContent.replace("\t", "").trim(), 
        document.querySelectorAll('.tab_bg_2 td')[indexNumberLocationPosition]?.textContent.trim()
      ]
 
      return existsGlpi
    })

    return dataGlpi
  }

   /**
   * Valida os dados extraídos do GLPI comparando com o item original.
   * 
   * Regras de validação:
   * - Se o número de série coincide:
   *    - Se a localização (setor) também bate: adiciona em `existsAssets`.
   *    - Se a localização diverge: adiciona em `updateAssets`.
   * - Se o número de série não coincide: adiciona em `doesNotExistsAssets`.
   * 
   * @param {[string|null, string|null]} dataGlpi - Array com número de série e localização extraídos da página GLPI.
   * @param {Object} item - Objeto do ativo original a ser validado.
   */

  validateAssetsInGlpi(dataGlpi, item){
      const filterNull = dataGlpi[0] !== null ? dataGlpi[0].toLowerCase() : dataGlpi[0]
      if(filterNull === item.serie.toLowerCase()){
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

    /**
   * Retorna o resultado da validação de ativos no GLPI.
   * 
   * @returns {{
   *  existsAssets: Array<Object>,
   *  doesNotExistsAssets: Array<Object>,
   *  updateAssets: Array<Object>
   * }} Resultado agrupado da validação.
   */

  getResultValidateAssets(){
    return {
      existsAssets: this.existsAssets,
      doesNotExistsAssets: this.doesNotExistsAssets,
      updateAssets: this.updateAssets
    }
  }
}