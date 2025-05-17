import { PrismaClient } from '@prisma/client';

/**
 * Classe base genérica de repositório para realizar operações comuns com o banco de dados.
 * Utiliza Prisma ORM para comunicação com o banco.
 */

export class Repository {
  prisma = new PrismaClient();

  /**
   * Busca todos os registros de uma tabela especificada.
   * 
   * @param {string} tableDb - Nome da tabela no banco de dados (conforme modelo Prisma).
   * 
   * @returns {Promise<Array<Object>>} Uma lista de registros encontrados na tabela.
   * 
   * @example
   * const units = await repository.searchAll("unit");
   */

  async searchAll(tableDb){
    return await this.prisma[tableDb].findMany()
  }

  /**
   * Busca um único registro com base no campo `name` da tabela especificada.
   * 
   * @param {Object} params - Parâmetros para busca.
   * @param {string} params.tableDb - Nome da tabela no banco de dados.
   * @param {string} params.value - Valor a ser comparado com o campo `name`.
   * 
   * @returns {Promise<Object|null>} Retorna o primeiro registro encontrado com o nome correspondente ou `null` se não encontrar.
   * 
   * @example
   * const unit = await repository.searchByName({ tableDb: "unit", value: "Hospital Central" });
   */

  async searchByName({ tableDb, value }){
    return await this.prisma[tableDb].findFirst({
      where: {
        name: value
      }
    })
  }

  /**
 * Busca o primeiro usuário no banco de dados com base no nome de usuário fornecido.
 *
 * Utiliza o ORM Prisma para consultar a tabela `user` e retorna o primeiro resultado correspondente.
 *
 * @param {string} value - Nome de usuário a ser buscado.
 * @returns {Promise<Object|null>} Retorna um objeto de usuário se encontrado, ou `null` se não existir.
 * 
 * @example
 * const user = await repository.user("admin");
 * if (user) {
 *   console.log("Usuário encontrado:", user);
 * }
 */

  async user(value){
    return await this.prisma.user.findFirst({
      where: {
        user: value
      }
    })
  }
}