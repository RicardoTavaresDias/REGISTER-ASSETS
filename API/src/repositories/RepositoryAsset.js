import { AppError } from "../utils/AppError.js"
import { Repository } from "./Repository.js"

/**
 * Classe responsável por operações específicas relacionadas a ativos (assets),
 * estendendo funcionalidades genéricas da classe Repository.
 */

export class RepositoryAsset extends Repository {

  /**
   * Cria registros de equipamento e ativo associados à unidade, tipo de equipamento e setor informados.
   * 
   * Este método realiza as seguintes etapas dentro de uma transação:
   * 1. Valida a existência da unidade, tipo de equipamento e setor na base de dados.
   * 2. Cria um equipamento com a série informada.
   * 3. Cria um ativo associando o equipamento criado à unidade e setor.
   * 
   * @param {string} registerUnit - Nome da unidade onde o ativo será registrado.
   * @param {string} registerTypeEquipment - Tipo de equipamento a ser registrado.
   * @param {string} registerSector - Nome do setor ao qual o ativo pertence.
   * @param {string} serie - Número de série do equipamento.
   * 
   * @throws {AppError} Lança erro caso a unidade, tipo de equipamento ou setor não existam na base de dados.
   * 
   * @returns {Promise<void>} Retorna uma promessa resolvida ao final da criação.
   */

  async createAssets(value){

    const [ unit, type_Equipment, sector ] = await Promise.all([
      this.searchByName({ tableDb: "unit", value: value.unit }),
      this.searchByName({ tableDb: "type_Equipment", value: value.equipment }),
      this.searchByName({ tableDb: "sector", value: value.sector })
    ])

    if(!unit || !type_Equipment || !sector){
      throw new AppError("Setor e Equipamento não encontrado na base de dados.", 400);
    }

     await this.prisma.$transaction(async (tx) => {
      const equipment = await tx.equipment.create({
        data: {
          serie: value.serie,
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

  /**
   * Realiza uma busca de ativos com base no nome da unidade, utilizando a view `vw_assets`.
   * 
   * @param {string} unit - Nome da unidade a ser consultada.
   * 
   * @returns {Promise<Array<Object>>} Retorna uma lista de ativos encontrados para a unidade informada.
   */

  async searcAssetUnit(unit){
    return await this.prisma.$queryRaw
      `SELECT * FROM vw_assets WHERE unit = ${unit}`
  }

    /**
   * Busca todos os registros da view `vw_assets` sem filtros.
   * 
   * Utiliza `prisma.$queryRaw` para consultar diretamente a view no banco.
   * 
   * @returns {Promise<Array<Object>>} Lista completa de ativos da view.
   * 
   * @example
   * const todosAtivos = await repository.searchByAsset();
   */

  async searchByAsset(){
    return await this.prisma.$queryRaw
      `SELECT * FROM vw_assets`
  }
}
