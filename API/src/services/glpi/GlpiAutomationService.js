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



   // PARTE 2 PARA ELABORAR ATUALIZAR GLPI E CADASTRAR GLPI.


}

