import { listEquipment } from "../../lib/listEquipment.js";
import { GlpiBrowser } from "./GlpiBrowser.js";
import { AppError } from "../../utils/AppError.js";
import { GlpiAssetDataProcessing } from "./GlpiAssetDataProcessing.js";

/**
 * Classe responsável por automatizar a validação de ativos no sistema GLPI via navegação automatizada com Puppeteer.
 * Estende a classe `GlpiBrowser`, que encapsula a inicialização do navegador e login.
 */

export class GlpiAutomationService extends GlpiBrowser {

  /**
   * Inicializa o serviço com as credenciais do usuário.
   * 
   * @param {Object} user - Objeto contendo as credenciais do usuário (utilizado no login do GLPI).
   */

  constructor(user){
    super(user)
  }

  
  /**
   * Valida os ativos fornecidos contra os registros existentes no GLPI.
   * 
   * Fluxo de execução:
   * 1. Inicia o navegador (via Puppeteer).
   * 2. Realiza login no GLPI.
   * 3. Agrupa os dados por tipo de equipamento usando `listEquipment`.
   * 4. Para cada equipamento:
   *    - Constrói a URL de busca no GLPI baseada no número de série.
   *    - Acessa a página do GLPI e extrai dados usando `GlpiAssetDataProcessing.assetsRegisteredInGlpi`.
   *    - Valida o resultado com `validateAssetsInGlpi`, que classifica o ativo (existe, não existe, precisa atualizar setor).
   * 5. Fecha o navegador.
   * 6. Retorna os resultados da validação agrupados em:
   *    - `existsAssets`
   *    - `doesNotExistsAssets`
   *    - `updateAssets`
   * 
   * Em caso de erro, o navegador é fechado e a exceção é lançada como `AppError`.
   * 
   * @param {Array<Object>} data - Lista de ativos no formato `{ sector, equipment, serie, ... }`.
   * @returns {Object} Resultado da validação dos ativos, estruturado como:
   *  - `existsAssets`: Ativos encontrados corretamente no GLPI.
   *  - `doesNotExistsAssets`: Ativos não encontrados no GLPI.
   *  - `updateAssets`: Ativos que existem, mas estão com setor incorreto.
   * 
   * @throws {AppError} Em caso de falha durante o processo de navegação ou validação.
   */

  async assets(data){
    await this.browser()
    await this.login()
    const dataEquipment = listEquipment(data)
    const processor = new GlpiAssetDataProcessing()

    try {
      for(const key in dataEquipment){
        const items = dataEquipment[key]
        
        for(const item of items.data){
          const url = items.path + item.serie + items.base
          const dataGlpi = await processor.assetsRegisteredInGlpi(url, this.page)
          processor.validateAssetsInGlpi(dataGlpi, item)
        }
      }
      this.browserClose()
      return processor.getResultValidateAssets()

    } catch (error) {
      this.browserClose()
      throw new AppError(error.message, 500)
    } 
  }

  /**
   * Automatiza a atualização dos ativos no GLPI via browser automatizado.
   *
   * Para cada equipamento na lista:
   * - Navega até a página do ativo usando o número de série.
   * - Aguarda o carregamento dos elementos da página necessários.
   * - Atualiza o setor do ativo com o valor fornecido.
   * - Submete o formulário de atualização.
   * 
   * Caso o número de série não seja encontrado, a página não carregue corretamente,
   * ou o GLPI retorne algum erro após o envio, lança uma `AppError` com mensagem e código HTTP.
   * 
   * O navegador é fechado ao final da operação, independentemente de sucesso ou erro.
   *
   * @param {Array} dataUpdate - Lista de ativos para atualização.
   * @throws {AppError} Erro ao localizar ativo, carregar página ou falha na atualização no GLPI.
   */

  async Update(dataUpdate){
    await this.browser()
    await this.login()
    const dataEquipment = listEquipment(dataUpdate)

    try {
      for(const key in dataEquipment){
        const items = dataEquipment[key]
        for(const item of items.data){
          
          await this.page.goto(items.path + item.serie + items.base, { timeout: 35000 })

          await this.page.waitForSelector(".tab_bg_2 td a", { timeout: 10000 })
          .catch(() => { 
            throw new AppError("Número de serie não encontrado no glpi, verifica o número de serie corretamente para atualização.", 400) 
          })

          await this.page.evaluate(() => {
            document.querySelectorAll('.tab_bg_2 td a')[0].click()
          })

          await this.page.waitForSelector(`[name="name"]`, { timeout: 10000 })
          .catch(() => { 
            throw new AppError("Pagina de ativos no glpi não foi carregado corretamente, tente novamente.", 400) 
          })

          await this.page.evaluate((item) => {
            document.querySelectorAll(`.select2-hidden-accessible`)[3]
              .innerHTML = `<option value=${item.id} title="${item.sector} - ">${item.sector}</option>`

            //document.querySelector(".submit").click()
          }, { sector: item.sector, id: item.idSector })

          //Submeter formulário
          // await Promise.all([
          //   this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }),
          //   //this.page.click(".submit")
          // ]);

          const errorGlpi = await this.page.evaluate(() => {
            const exist = document.querySelector("#message_after_redirect_1")
            return exist ? exist.innerText : null
          })

          if(errorGlpi){
            throw new AppError(errorGlpi.replaceAll("\n", " "), 400);
          }
        }
      }
      
    }catch(error){
      throw new AppError(error.message, 500)
    }finally{
      this.browserClose()
    }
  }









  

   // PARTE 2 PARA ELABORAR ATUALIZAR GLPI E CADASTRAR GLPI.

   async treeStructureGlpi(value){
    await this.browser()
    await this.login()
    this.units = value

    try {
      await this.page.waitForSelector("#global_entity_select", { timeout: 10000 })
      await this.page.click("#global_entity_select")

      await this.page.waitForSelector(".jstree-closed", { timeout: 10000 })
      await this.page.click(".jstree-icon")

      await this.page.waitForSelector(".jstree-children", { timeout: 10000 })
      
      const result = await this.page.evaluate((units) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => { 
            const elements = [...document.querySelectorAll(".jstree-children .jstree-anchor")]
            if(elements.length === 0){
              resolve("Não foi carregado as unidades no glpi, tente novamente.")
              return
            }

            const unit = elements.filter(value => value.innerText.includes(units))[0]
            if(!unit){
              resolve("Nenhuma unidade encontrado.")
              return
            }

            unit.click()
            resolve(false);
          }, 1000)
        })
      }, this.units)

      // retorna somente, se tiver retorno resolve com string
      if(result){
        this.browserClose()
        return { message: result }
      }

      await this.page.waitForSelector("#ui-tabs-1", { timeout: 10000 })
      .catch(() => { 
        this.page.screenshot({ path: './src/logs/files_puppeteer/after_tree_structure_glpi.png' })
        throw new Error("Não foi carregado as unidades no glpi, tente novamente.") 
      })
      
    }catch(error){
      this.browserClose()
      throw new Error(error.message)
    }
  }


  async registerAssets(dataCreate){
    const dataEquipment = listEquipment(dataCreate)

    try {            
      for(const key in dataEquipment){
        const items = dataEquipment[key]
        for(const item of items.data){
          await this.page.goto("https://glpi.ints.org.br/front/monitor.form.php?id=1506&withtemplate=2", { timeout: 35000 })

          await this.page.waitForSelector(`[name="name"]`, { timeout: 10000 })
          .catch(() => { 
            throw new Error("Pagina de ativos no glpi não foi carregado corretamente, tente novamente.") 
          })

          await this.page.evaluate((data) => {
            document.querySelector("[name='name']").value = data.serie
            document.querySelectorAll(`.select2-hidden-accessible`)[3]
              .innerHTML = `<option value=${data.idSector} title="${data.sector} - ">${data.sector}</option>`
            document.querySelector("[name='serial']").value = data.serie
          }, item )

           // Submeter formulário
          // await Promise.all([
          //   this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }),
          //   this.page.click(".submit")
          // ])

          const errorGlpi = await this.page.evaluate(() => {
            const exist = document.querySelector("#message_after_redirect_1")
            return exist ? exist.innerText : null
          })

          if(errorGlpi){
            throw new Error(errorGlpi.replaceAll("\n", " "));
          }

          // //TESTE
          // this.page.screenshot({ path: `./src/logs/files_puppeteer/${key}_${item.serie}.png` })

        }
      }
      
    }catch(error){
      throw new Error(error.message)
    }finally{
      this.browserClose()
    }
  }
}