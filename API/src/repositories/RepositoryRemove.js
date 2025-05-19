import { AppError } from '../utils/AppError.js';

export class RepositoryRemove {
  constructor(prisma){
    this.prisma = prisma
  }

  /**
   * Remove todo o conteúdo de uma tabela.
   * Inclui `deleteMany` e execução direta de `DELETE FROM`.
   * 
   * @param {string} tableDb - Nome da tabela.
   * @returns {Promise<void>}
   */


  async removeAllContent(tableDb){
    await this.prisma[tableDb].deleteMany()
    await this.prisma.$executeRawUnsafe(`DELETE FROM ${tableDb}`)
    return 
  }

   /**
   * Remove um único registro com base no ID.
   * 
   * @param {Object} params
   * @param {string} params.tableDb - Nome da tabela.
   * @param {number} params.id - ID do registro a ser removido.
   * @returns {Promise<Object>} Registro removido.
   * 
   * @throws {AppError} Se ocorrer falha na exclusão.
   * 
   * @example
   * await repository.removeId({ tableDb: "type_Equipment", id: 1 });
   */

  async removeId({ tableDb, id }){
    try {
      return await this.prisma[tableDb].delete({
        where: {
          id: id
        }
      })
    }catch(error){
      console.log(error)
      throw new AppError("Erro ao remover. Certifique-se de que os dados estão corretos e tente novamente.", 400) 
    }
  }
}