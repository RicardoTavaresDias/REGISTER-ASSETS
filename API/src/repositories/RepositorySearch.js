
/**
 * Classe responsável por operações de busca no banco de dados.
 * 
 * Contém métodos para consultar registros por nome, listar todos os registros,
 * realizar buscas específicas em views SQL e consultar usuários.
 */

export class RepositorySearch {
  constructor(prisma){
    this.prisma = prisma
  }

  /**
   * Busca todos os registros de uma tabela.
   * 
   * @param {string} tableDb - Nome da tabela.
   * 
   * @returns {Promise<Array<Object>>} Lista de todos os registros encontrados.
   */

  async searchAll(tableDb){
    return await this.prisma[tableDb].findMany()
  }

  /**
   * Busca o primeiro registro em uma tabela pelo campo `name`.
   * 
   * @param {Object} params
   * @param {string} params.tableDb - Nome da tabela.
   * @param {string} params.value - Valor a ser comparado no campo `name`.
   * 
   * @returns {Promise<Object|null>} Registro encontrado ou `null` se não existir.
   */

  async searchByName({ tableDb, value }){
    return await this.prisma[tableDb].findFirst({
      where: {
        name: value
      }
    })
  }

   /**
   * Busca todos os registros em uma tabela cujo campo `name` esteja incluído em uma lista de valores.
   * 
   * @param {Object} params
   * @param {string} params.tableDb - Nome da tabela.
   * @param {Array<string>} params.value - Lista de nomes a serem buscados.
   * 
   * @returns {Promise<Array<Object>>} Lista de registros encontrados.
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
 * Busca setores cujo nome começa com o valor informado.
 *
 * @param {string} value - Texto para buscar o início do nome do setor.
 * @returns {Promise<Array>} Lista de setores encontrados.
 */

  async searchBySector(value){
    // return await this.prisma.type_Sector.findMany({
    //   where: {
    //     name: {
    //       contente: value
    //     }
    //   }
    // })
    return await this.prisma.$queryRaw
      `SELECT * FROM type_sector WHERE LOWER(name) LIKE ${'%' + value}`
  }

  /**
   * Busca um usuário pelo campo `user`.
   * 
   * @param {string} value - Nome de usuário a ser buscado.
   * 
   * @returns {Promise<Object|null>} Registro do usuário ou `null` se não existir.
   */

  async user(value){
    return await this.prisma.user.findFirst({
      where: {
        user: value
      }
    })
  }

  /**
   * Busca ativos (assets) na view `vw_assets` filtrando pelo nome da unidade.
   * 
   * @param {string} unit - Nome da unidade a ser filtrada.
   * 
   * @returns {Promise<Array<Object>>} Lista de ativos da unidade informada.
   */

  async searcAssetUnit(unit){
    return await this.prisma.$queryRaw
      `SELECT * FROM vw_assets WHERE unit = ${unit}`
  }

   /**
   * Busca todos os ativos presentes na view `vw_assets`.
   * 
   * @returns {Promise<Array<Object>>} Lista de todos os ativos.
   */

  async searchByAsset(){
    return await this.prisma.$queryRaw
      `SELECT * FROM vw_assets`
  }
}