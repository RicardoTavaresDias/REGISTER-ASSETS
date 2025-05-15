import { PrismaClient } from '@prisma/client';

export class Repository {
  prisma = new PrismaClient();

  async searchAll(tableDb){
    return await this.prisma[tableDb].findMany()
  }

  async searchUnic({ tableDb, value }){
    return await this.prisma[tableDb].findFirst({
      where: {
        name: value
      }
    })
  }
}