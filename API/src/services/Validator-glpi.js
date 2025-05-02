import puppeteer from 'puppeteer'
import { env } from "../config/env.js"

/*
sugestão: criar uma class, com construtor criar arrayexistente e notexistente, criar funcoes dentro da class e demandar computador, monitor e impressora, e alimetando os arrays e no ultimo retornar para gravação em arquivo .txt
*/

export async function Validatorglpi(data){

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    await page.goto(env.GLPIINITIAL)
    await page.type("#login_name", "ricardo.dias")
    await page.type("#login_password", "chopper2#")
    await page.type("#dropdown_auth1", "DC-SACA")
    await page.click(`[type="submit"]`)
    await page.waitForNavigation()

    const existsAssets = []
    const doesNotExistsAssets = []

    for(const item of data){ 
      const path = `https://glpi.ints.org.br/front/monitor.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=${item.serie}&search=Pesquisar&itemtype=Monitor&start=0&_glpi_csrf_token=5b75a0f06d84fcd184e1d9b0f64992b9`

      await page.goto(path)
      const dataGlpi = await page.evaluate(() => {
        const existsGlpi = [
          document.querySelectorAll('.tab_bg_2 td')[1]?.textContent.replace("\t", ""), 
          document.querySelectorAll('.tab_bg_2 td')[5]?.textContent
        ]
        
        return existsGlpi
      })

      // Comparação ignorando acentos - exemplos: "Coração", "coracao" = true - são iguais
       const notAccents = word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

      dataGlpi[0] === item.serie ? 
        existsAssets.push(
          { 
            sector: item.sector && 
              notAccents(String(item.sector)) === notAccents(String(dataGlpi[1])) ? 
              item.sector : 
              dataGlpi[1] ? item.sector + " => " + dataGlpi[1] : item.sector, 

            equipment: item.equipment, 
            serie: item.serie 
          }) : 
      doesNotExistsAssets.push(
        { sector: item.sector, equipment: item.equipment, serie: item.serie }
      )
    }
    
    return {
      existsAssets,
      doesNotExistsAssets
    }

  } catch (error) {
    console.log(error)
  }
}