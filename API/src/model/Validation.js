import { z } from "zod"
import { Repository } from "../repositories/Repository.js"
import { AppError } from "../utils/AppError.js"

/**
 * Classe responsável pela validação de dados de entrada da API.
 * Utiliza a biblioteca `zod` para garantir que os dados estejam no formato esperado.
 */

export class Validation {

  /**
   * Valida os dados enviados para cadastro de ativos.
   * Verifica se os campos obrigatórios estão preenchidos e se a unidade informada existe no banco.
   *
   * @param {Object} requestBody - Corpo da requisição contendo os dados do ativo.
   * @returns {Promise<Object>} Objeto validado contendo os campos: `serie`, `equipment`, `sector` e `unit`.
   * @throws {ZodError} Se a validação falhar.
   */

  async assets(requestBody){
    const repository = new Repository()
    const mapUnits = await repository.search.searchAll("unit")
    const bodySchema = z.object({
      serie: z.string({ message: "Informe o número de série." }).min(1, { message: "Preencher o campo número de série." }),
      equipment: z.string({ message: "Informe um equipamento." }).min(1, { message: "Preencher o campo equipamento." }),
      sector: z.string({ message: "Informe o setor." }).min(1, { message: "Preencher o campo setor." }),
      unit: z.string({ message: "Informe o unidade." }).refine(value => mapUnits.map(element => element.name).includes(value), {
        message: "Unidade inválida"
      })
    })

    const resultSchema = bodySchema.parse(requestBody)
    return resultSchema
  }

  /**
   * Valida se a unidade informada existe no banco de dados.
   *
   * @param {Object} requestBody - Corpo da requisição contendo o nome da unidade.
   * @returns {Promise<string>} Nome da unidade validado.
   * @throws {ZodError} Se a unidade for inválida ou estiver ausente.
   */

  async unit(requestBody){
    const repository = new Repository()
    const mapUnits = await repository.search.searchAll("unit")
    const bodySchema = z.object({
      unit: z.string({ message: "Informe o unidade." })
        .refine(value => mapUnits.map(element => element.name).includes(value), {
          message: "Unidade inválida"
      })
    })

    const { unit } = bodySchema.parse(requestBody)
    return unit
  }

  /**
   * Valida os filtros de relatório.
   * Apenas os campos `serie`, `sector` e `equipment` são permitidos e opcionais.
   *
   * @param {Object} requestBody - Dados do filtro.
   * @returns {Object} Objeto com os campos filtrados.
   * @throws {ZodError} Se forem informados campos não permitidos.
   */

  report(requestBody){
    const reportSchema = z.object({
      serie: z.string().optional(),
      sector: z.string().optional(),
      equipment: z.string().optional()
    }).strict({ message: "Somente valores sector, serie e equipment." })

    const dataSchema = reportSchema.parse(requestBody)

    return dataSchema
  }

  /**
   * Valida as credenciais do usuário.
   *
   * @param {Object} requestBody - Deve conter os campos `user` e `password`.
   * @returns {Object} Objeto com `user` e `password`.
   * @throws {ZodError} Se algum campo estiver ausente ou vazio.
   */

  user(requestBody){
    const userSchema = z.object({
      user: z.string().min(1, { message: "Informe usuario e senha." }),
      password: z.string().min(1, { message: "Informe usuario e senha." })
    })
    const result = userSchema.parse(requestBody)

    return result
  }

  /**
   * Valida sugestões enviadas para cadastro de equipamentos, setores ou unidades.
   * 
   * Para `sector`, o campo `id_glpi` é obrigatório. Para os demais tipos, apenas `name` é obrigatório.
   *
   * @param {Object} params
   * @param {Array<Object>} params.requestBody - Lista de sugestões.
   * @param {string} params.requestParms - Tipo de sugestão: "equipment", "sector" ou "unit".
   * @returns {Array<Object>} Sugestões validadas.
   * @throws {AppError} Se a validação falhar.
   */

  suggestions({ requestBody, requestParms }){
    
    const suggestionsSchema = z.object({
      id_glpi: z.optional(z.string().min(1, { message: "Este campo é obrigatório. Informe id novo do GLPI." })),
      name: z.string().min(1, { message: "Este campo é obrigatório. Informe setor novo do GLPI." })
    }).superRefine((value, contexo) => { 
      if(requestParms === "sector"){
        if(!value.id_glpi){
          contexo.addIssue({
            path: ['id_glpi'],
            message: "Informe id do setor."
          })
        }
      }
    })

    const suggestionsArraySchema = z.array(suggestionsSchema)
    const resultSchema = suggestionsArraySchema.safeParse(requestBody)

    if(!resultSchema.success){
      throw new AppError(resultSchema.error.issues[0].message, 400)
    }

    return resultSchema.data
  }

   /**
   * Valida o parâmetro `type` recebido na URL.
   * Aceita apenas os valores: `"equipment"`, `"sector"` ou `"unit"`.
   *
   * @param {Object} requestParms - Objeto contendo o campo `type`.
   * @returns {Object} Parâmetro validado.
   * @throws {ZodError} Se o tipo for inválido.
   */

  validationType(requestParms){
    const paramsSchema = z.object({
      type: z.enum(["equipment", "sector", "unit"])
    })

    const params = paramsSchema.parse(requestParms)
    return params
  }

  /**
   * Valida nomes de itens que serão removidos da base de sugestões.
   * 
   * @param {Array<Object>} requestBody - Lista com objetos contendo o campo `name`.
   * @returns {Array<Object>} Nomes validados.
   * @throws {AppError} Se algum item não tiver o campo `name`.
   */

  validationByName(requestBody){
    const suggestionsSchema = z.object({
      name: z.string().min(1, { message: "O campo 'name' é obrigatório para remover o item da lista."})
    })

    const suggestionsArraySchema = z.array(suggestionsSchema)
    const resultSchema = suggestionsArraySchema.safeParse(requestBody)

    if(!resultSchema.success){
      throw new AppError(resultSchema.error.issues[0].message, 400)
    }

    return resultSchema.data
  }
}