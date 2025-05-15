import { AppError } from "../utils/AppError.js"
import { Repository } from "./Repository.js"

export class RepositoryAsset extends Repository {
  async createAssts(registerUnit, registerTypeEquipment, registerSector, serie){

    const [ unit, type_Equipment, sector ] = await Promise.all([
      this.searchUnic({ tableDb: "unit", value: registerUnit }),
      this.searchUnic({ tableDb: "type_Equipment", value: registerTypeEquipment }),
      this.searchUnic({ tableDb: "sector", value: registerSector })
    ])

    if(!unit || !type_Equipment || !sector){
      throw new AppError("Setor e Equipamento não encontrado na base de dados.", 400);
    }

     await this.prisma.$transaction(async (tx) => {
      const equipment = await tx.equipment.create({
        data: {
          serie: serie,
          typeEquipment: {
            connect: { id: type_Equipment.id }
          }
        },
      });

      await tx.asset.create({
        data: {
          sector: {
            connect: { id: sector.id }
          },
          unit: {
            connect: { id: unit.id }
          },
          equipment: {
            connect: { id: equipment.id }
          }
        },
      })
    })
  }

  async searcAsstUnit(unit){
    return await this.prisma.$queryRaw
      `SELECT * FROM vw_assets WHERE unit = ${unit}`
  }
}
