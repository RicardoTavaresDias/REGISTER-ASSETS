import { listEquipment } from "../../lib/listEquipment.js";
import { GlpiBrowser } from "./GlpiBrowser.js";
import { AppError } from "../../utils/AppError.js";
import { GlpiAssetDataProcessing } from "./GlpiAssetDataProcessing.js";

export class GlpiAutomationService extends GlpiBrowser {
  constructor(user){
    super(user)
  }

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


}

