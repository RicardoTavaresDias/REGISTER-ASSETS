import { Validatorglpi } from "./Validator-glpi.js"

export class GlpiInserter {
  constructor(user) {
    this.user = user
    this.page
  }

  async _initBrowser(){
    const validatorglpi = new Validatorglpi()
    const page = await validatorglpi.initBrowser()
    this.page = page
    validatorglpi._user(this.user)
    await validatorglpi.loginGlpi(this.page)
  }

  async treeStructureGlpi(value){
    this.units = value

    try {
      await this.page.waitForSelector("#global_entity_select")
      await this.page.click("#global_entity_select")

      await this.page.waitForSelector(".jstree-closed")
      await this.page.click(".jstree-icon")

      await this.page.waitForSelector(".jstree-children")
      
      const result = await this.page.evaluate((units) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => { 
            const elements = [...document.querySelectorAll(".jstree-children .jstree-anchor")]
            if(elements.length === 0){
              resolve("Não foi carregado as unidades no glpi, tente novamente.")
              return
              //throw new Error("Não foi carregado as unidades no glpi, tente novamente.")
            }

            const unit = elements.filter(value => value.innerText.includes(units))[0]
            if(!unit){
              resolve("Nenhuma unidade encontrado.")
              return
              //throw new Error("Nenhuma unidade encontrado.")
            }

            unit.click()

            resolve(false);
          }, 1000)
        })
      }, this.units)


      

      // PAREI AQUI
      if(result){
        this.page.browser().close()
        return false
      }
      


      await this.page.waitForNavigation()
    }catch(error){
      this.browser.close()
      throw new Error(error.message)
    }
  }

  async updateSectorGlpi(){
    try {
      // link de teste
      await this.page.goto("https://glpi.ints.org.br/front/monitor.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=BRC323024F&search=Pesquisar&itemtype=Monitor&start=0&_glpi_csrf_token=8c16506e1bb040a53218865f21876257", { timeout: 35000 })
      
      await this.page.waitForSelector(".tab_bg_2 td a")

      await this.page.evaluate(() => {
        document.querySelectorAll('.tab_bg_2 td a')[0].click()
      })

      await this.page.waitForSelector(`[name="name"]`)
    
      await this.page.evaluate(() => {
        document.querySelectorAll(`.select2-hidden-accessible`)[3].innerHTML = `<option value="707" title="VACINA - ">VACINA</option>`
        //document.querySelector(".submit").click()
      })

      this.page.browser().close()
    }catch(error){
      this.browser.close()
      throw new Error(error.message)
    }
  }

  async registerAssets(){
    try {
      await this.page.goto("https://glpi.ints.org.br/front/monitor.form.php?id=1506&withtemplate=2", { timeout: 35000 })

      await this.page.waitForSelector(`[name="name"]`)

      await this.page.evaluate(() => {
        document.querySelector("[name='name']").value = "teste"
        document.querySelectorAll(`.select2-hidden-accessible`)[3].innerHTML = `<option value="707" title="VACINA - ">VACINA</option>`
        document.querySelector("[name='serial']").value = "teste2"
        //document.querySelector(".submit").click()
      })

      await this.page.waitForSelector(`[name="name"]`)
      
      this.page.browser().close()
    }catch(error){
      this.browser.close()
      throw new Error(error.message)
    }
  }

}