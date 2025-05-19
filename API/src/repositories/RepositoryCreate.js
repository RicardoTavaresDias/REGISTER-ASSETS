import { AppError } from '../utils/AppError.js';

export class RepositoryCreate {
  constructor(prisma){
    this.prisma = prisma
  }

   /**
   * Cria múltiplos registros em uma tabela.
   * 
   * @param {Object} params
   * @param {string} params.tableDb - Nome da tabela.
   * @param {Array<Object>} params.data - Dados a serem inseridos.
   * @returns {Promise<Object>} Resultado da operação `createMany`.
   * 
   * @throws {AppError} Caso ocorra erro no cadastro.
   */

  async createAll({ tableDb, data }){
    try {
      return await this.prisma[tableDb].createMany({
        data: data
      })
    }catch(error){
      throw new AppError("Não foi possível realizar o cadastro. Verifique os dados informados e tente novamente.", 400);
    }
  }

    /**
 * Cria um novo asset no banco de dados, associando unidade, setor e equipamento.
 * 
 * - Se a unidade informada não for encontrada, lança um erro.
 * - Se o tipo de setor ou tipo de equipamento não existirem, cria registros em suas respectivas tabelas de log.
 * 
 * @async
 * @param {Object} value - Objeto com os dados para criação do asset.
 * @param {string} value.unit - Nome da unidade.
 * @param {string} value.sector - Nome do setor.
 * @param {string} value.equipment - Nome do tipo de equipamento.
 * @param {string} value.serie - Número de série do equipamento.
 * 
 * @throws {AppError} Lança erro caso a unidade não seja encontrada ou ocorra falha na criação do asset.
 * 
 * @returns {Promise<void>} Não retorna valor, apenas realiza a inserção no banco de dados.
 */

  async createAssets(value){

    const [ unit, type_Equipment, type_Sector ] = await Promise.all([
      this.searchByName({ tableDb: "unit", value: value.unit }),
      this.searchByName({ tableDb: "type_Equipment", value: value.equipment }),
      this.searchByName({ tableDb: "type_Sector", value: value.sector })
    ])

    if(!unit){
      throw new AppError("Não encontrado unidade na base de dados.", 400);
    }

    try{
      await this.prisma.asset.create({
        data: {
          // cadastrando id unit no assent, que contem na lista unit
          unit: {
            connect: { id: unit.id }
          },

          // cadastro do sector
          sector: {
            // existir sector na lista type_sector,  gera id e cadastra no sector
            create: type_Sector ? {
              idTypeSector: type_Sector.id,
            } : {
              // Não existe, cadastra o log_type_sector e gera id
              logSectorInvalid: {
                create: {
                  name: value.sector
                }
              }
            }
          },

          // cadastro do equipment
          equipment: {
            // existir equipment na lista type_equipment,  gera id e cadastra no equipment
            create: type_Equipment ? {
              serie: value.serie,
              idTypeEquipment: type_Equipment.id
            } : {
                  // Não existe, cadastra o log_type_equipment e gera id
                  serie: value.serie,
                  logEquipmentInvalid: {
                    create: {
                      name: value.equipment
                    }
                  }
            }
          }
        }
      })
      
    }catch(error){
      console.error('[Erro ao criar asset]', {
        message: error.message,
        stack: error.stack,
        prismaError: error
      })
      throw new AppError("Erro ao criar asset no banco de dados.", 500)
    }
  }
}