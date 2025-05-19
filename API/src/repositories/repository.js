import { PrismaClient } from '@prisma/client';

import { RepositoryCreate } from "./RepositoryCreate.js"
import { RepositoryRemove } from "./RepositoryRemove.js"
import { RepositorySearch } from "./RepositorySearch.js"

export class Repository {
  prisma = new PrismaClient()

  constructor(){
    this.create = new RepositoryCreate(this.prisma)
    this.remove = new RepositoryRemove(this.prisma)
    this.search = new RepositorySearch(this.prisma)
  }
}