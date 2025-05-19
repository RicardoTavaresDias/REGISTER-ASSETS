import { z } from "zod"
import { PrismaClient } from '@prisma/client';
import { pagination } from "../utils/pagination.js";

const prisma = new PrismaClient();


export class SuggestionsSearch {
  
  
   async index(request, response) {
    const page = request.query.page
    const limitPage = request.query.limit

    const readFile = await prisma[request.params.type].findMany()

    if(!readFile || !readFile.length){
      return response.status(400).json({ message: "Dados não encontrados." })
    }

    if(page && limitPage){
      const dataRead = pagination(page, limitPage, readFile)
      return response.status(200).json(dataRead)
    }
    
     return response.status(200).json(readFile.map(value => ({ name: value.name })))
  }

 
  async create(request, response){
    const suggestionsSchema = z.object({
      id_glpi: z.optional(z.string().min(1, { message: "Este campo é obrigatório. Informe id novo do GLPI." })),
      name: z.string().min(1, { message: "Este campo é obrigatório. Informe setor novo do GLPI." })
    }).superRefine((value, contexo) => { 
      if(request.params.type === "sector"){
        if(!value.id_glpi){
          contexo.addIssue({
            path: ['id_glpi'],
            message: "Informe id do setor."
          })
        }
      }
    })

    const suggestionsArraySchema = z.array(suggestionsSchema)
    const resultSchema = suggestionsArraySchema.safeParse(request.body)

    if(!resultSchema.success){
      return response.status(400).json({
        error: resultSchema.error.issues[0].message
      })
    }

    const names = resultSchema.data.map(value => value.name)
    const existsData = await prisma[request.params.type].findMany({
      where: {
        name: {
          in: names
        }
      }
    })

    if(existsData.length){
      throw new Error("Item já foi adicionado na lista.")
    } 

    await prisma[request.params.type].createMany({
      data: resultSchema.data
    })

    response.status(201).json({ message: `Item adicionado com sucesso.` })
  }


  async remove(request, response){
    const suggestionsSchema = z.object({
      name: z.string().min(1, { message: "O campo 'name' é obrigatório para remover o item da lista."})
    })

    const suggestionsArraySchema = z.array(suggestionsSchema)
    const resultSchema = suggestionsArraySchema.safeParse(request.body)

    if(!resultSchema.success){
      return response.status(400).json({
        error: resultSchema.error.issues[0].message
      })
    }

    const names = resultSchema.data.map(value => value.name)
    const existsData = await prisma[request.params.type].findMany({
      where: {
        name: {
          in: names
        }
      }
    })

    if(!existsData.length){
      throw new Error("Item não encontrado na base.")
    } 

    const id = existsData.map(value => value.id)
    await prisma[request.params.type].deleteMany({ 
      where: { 
        id: {
          in: id
        }
      } 
    })

    response.status(201).json({ message: "Item removido com sucesso." })
  }
}