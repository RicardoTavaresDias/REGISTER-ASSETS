import { z } from "zod"
import { Repository } from "../repositories/Repository.js"
import { RepositoryAsset } from "../repositories/RepositoryAsset.js"

/**
 * Classe responsável por validar os dados enviados para operações relacionadas a ativos (assets) e unidades (units).
 */

export class Validation {

   /**
   * Valida os dados de um ativo, garantindo que a unidade informada exista no sistema.
   * 
   * @param {Object} requestBody - Objeto contendo os dados a serem validados.
   * @param {string} [requestBody.serie] - (Opcional) Número de série do ativo.
   * @param {string} [requestBody.equipment] - (Opcional) Nome ou tipo do equipamento.
   * @param {string} [requestBody.sector] - (Opcional) Nome do setor associado ao ativo.
   * @param {string} requestBody.unit - Nome da unidade onde o ativo está localizado. Deve existir no sistema.
   * 
   * @returns {Promise<Object>} Retorna o objeto validado contendo os campos fornecidos.
   * 
   * @throws {ZodError} Lança erro se algum dos campos não seguir o esquema definido ou se a unidade for inválida.
   */

  async assets(requestBody){
    const mapUnits = await new Repository().searchAll("unit")
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
   * Valida se a unidade fornecida existe no sistema.
   * 
   * @param {Object} requestBody - Objeto contendo a unidade a ser validada.
   * @param {string} requestBody.unit - Nome da unidade que será verificada.
   * 
   * @returns {Promise<string>} Retorna o nome da unidade validado.
   * 
   * @throws {ZodError} Lança erro se a unidade não for válida.
   */

  async unit(requestBody){
    const mapUnits = await new RepositoryAsset().searchAll("unit")
    const bodySchema = z.object({
      unit: z.string({ message: "Informe o unidade." })
        .refine(value => mapUnits.map(element => element.name).includes(value), {
          message: "Unidade inválida"
      })
    })

    const { unit } = bodySchema.parse(requestBody)
    return unit
  }
}