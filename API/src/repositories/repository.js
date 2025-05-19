import { PrismaClient } from '@prisma/client';

import { RepositoryCreate } from "./RepositoryCreate.js"
import { RepositoryRemove } from "./RepositoryRemove.js"
import { RepositorySearch } from "./RepositorySearch.js"

/**
 * Classe principal que centraliza o acesso ao banco de dados utilizando o Prisma.
 * 
 * A classe `Repository` atua como um ponto de entrada para operações de criação,
 * remoção e busca, delegando cada responsabilidade para suas respectivas classes
 * especializadas: `RepositoryCreate`, `RepositoryRemove` e `RepositorySearch`.
 */

export class Repository {
  prisma = new PrismaClient()

  /**
   * Cria uma nova instância do repositório, inicializando as operações
   * de criação, remoção e busca com o cliente Prisma.
   */
  
  constructor(){
    this.create = new RepositoryCreate(this.prisma)
    this.remove = new RepositoryRemove(this.prisma)
    this.search = new RepositorySearch(this.prisma)
  }
}