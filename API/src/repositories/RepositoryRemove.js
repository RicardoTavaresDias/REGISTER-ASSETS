import { AppError } from '../utils/AppError.js';

/**
 * Classe responsável por operações de remoção no banco de dados.
 * 
 * Oferece métodos para remover registros por ID ou limpar completamente
 * uma tabela utilizando Prisma.
 */

export class RepositoryRemove {
  constructor(prisma){
    this.prisma = prisma
  }

 /**
   * Remove todos os registros de uma tabela.
   * 
   * Este método executa duas operações:
   * 1. `deleteMany()` via Prisma, para deletar com segurança.
   * 2. `DELETE FROM ...` com `executeRawUnsafe` para garantir a limpeza total.
   * 
   * ⚠️ Cuidado: o uso de `executeRawUnsafe` pode introduzir riscos de **SQL Injection**
   * se `tableDb` não for validado corretamente. Use apenas com nomes de tabelas confiáveis.
   * 
   * @param {string} tableDb - Nome da tabela a ser limpa.
   * 
   * @returns {Promise<void>} Não retorna valor, apenas executa a remoção.
   */

  async removeAllContent(tableDb){
    await this.prisma[tableDb].deleteMany()
    await this.prisma.$executeRawUnsafe(`DELETE FROM ${tableDb}`)
    return 
  }

   /**
   * Remove um registro específico por ID.
   * 
   * @param {Object} params
   * @param {string} params.tableDb - Nome da tabela.
   * @param {number|string} params.id - Identificador do registro a ser removido.
   * 
   * @returns {Promise<Object>} Objeto removido do banco de dados.
   * 
   * @throws {AppError} Se houver erro na remoção (ex: ID inválido ou inexistente).
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