
export class RepositorySearch {
  constructor(prisma){
    this.prisma = prisma
  }

   /**
   * Retorna todos os registros de uma tabela específica.
   * 
   * @param {string} tableDb - Nome da tabela conforme definida no Prisma schema.
   * @returns {Promise<Array<Object>>} Lista de registros encontrados.
   * 
   * @example
   * const setores = await repository.searchAll("type_Sector");
   */

  async searchAll(tableDb){
    return await this.prisma[tableDb].findMany()
  }

  /**
   * Busca o primeiro registro com base no campo `name`.
   * 
   * @param {Object} params
   * @param {string} params.tableDb - Nome da tabela.
   * @param {string} params.value - Valor exato do nome a buscar.
   * @returns {Promise<Object|null>} Registro encontrado ou `null` se não existir.
   * 
   * @example
   * const setor = await repository.searchByName({ tableDb: "type_Sector", value: "Financeiro" });
   */

  async searchByName({ tableDb, value }){
    return await this.prisma[tableDb].findFirst({
      where: {
        name: value
      }
    })
  }

/**
   * Busca todos os registros que tenham um nome presente na lista fornecida.
   * 
   * @param {Object} params
   * @param {string} params.tableDb - Nome da tabela.
   * @param {string[]} params.value - Lista de nomes a buscar.
   * @returns {Promise<Array<Object>>} Registros encontrados.
   * 
   * @example
   * const setores = await repository.searchByNameAll({ tableDb: "type_Sector", value: ["TI", "RH"] });
   */
  
  async searchByNameAll({ tableDb, value }){
    return await this.prisma[tableDb].findMany({
      where: {
        name: {
          in: value
        }
      }
    })
  }

   /**
   * Busca um usuário pelo campo `user`.
   * 
   * @param {string} value - Nome de usuário.
   * @returns {Promise<Object|null>} Usuário encontrado ou `null`.
   * 
   * @example
   * const user = await repository.user("admin");
   */

  async user(value){
    return await this.prisma.user.findFirst({
      where: {
        user: value
      }
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