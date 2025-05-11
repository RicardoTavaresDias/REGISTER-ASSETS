import { normalizeText } from "../lib/normalizeText.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 *
 * @param {Array<{ sector: string, equipment: string, serie: string }>} data
 *
 * Um objeto com quatro listas separadas de ativos, classificadas por tipo.
 *
 * @returns {{
 *   computer: Array<Object>,
 *   monitor: Array<Object>,
 *   printer: Array<Object>,
 *   others: Array<Object>
 * }}
 *
 */

export function assetProcessor(data) {
  const computer = data.filter(
    (value) => value.equipment.toLowerCase() === "CPU".toLowerCase()
  );

  const monitor = data.filter(
    (value) => value.equipment.toLowerCase() === "monitor".toLowerCase()
  );

  const printer = data.filter(
    (value) => value.equipment.toLowerCase() === "impressora".toLowerCase()
  );

  const others = data.filter(
    (value) =>
      value.equipment.toLowerCase() !== "cpu".toLowerCase() &&
      value.equipment.toLowerCase() !== "monitor".toLowerCase() &&
      value.equipment.toLowerCase() !== "impressora".toLowerCase()
  );

  return {
    computer,
    monitor,
    printer,
    others,
  };
}


/**
 * Atualiza os nomes e IDs de setores em uma lista de equipamentos,
 * com base em correspondências encontradas no banco de dados.
 *
 * Para cada equipamento, se o campo `sector` contiver "=>",
 * a parte à direita será usada para buscar o nome atualizado no banco (`prisma.sector`).
 *
 * @param {Object} data - Objeto contendo as seguintes propriedades:
 *   - `computer`: Array de equipamentos
 *   - `monitor`: Array de equipamentos
 *   - `printer`: Array de equipamentos
 *   - `others`: Array de equipamentos
 *
 * Cada item dos arrays deve conter:
 *   - `sector`: string no formato "antigo => novo" ou apenas o nome do setor
 *   - `idSector`: string (pode ser sobrescrito)
 *   - `equipment`: string com o nome do equipamento
 *   - `serie`: string com o número de série
 *
 * @returns {Promise<Array>} Uma lista única (array) de equipamentos atualizados com:
 *   - `sector`: nome atualizado do setor (do banco)
 *   - `idSector`: id_glpi correspondente (do banco)
 *   - `equipment`, `serie`: mantidos do original
 *
 * Equipamentos com número de série "N/A" são removidos do resultado.
 */

export async function mapUpdateSectorId(data) {
  const newData = [];

  for(const item in data){
    for(const key of data[item]){

      if(key.sector.includes("=>")){
        const resultDatabase = await prisma.sector.findMany({
          where: {
            name: {
              startsWith: normalizeText(key.sector.split("=>")[1].trim())
            }
          }
        })
        newData.push({
          sector: resultDatabase.map(value => value.name)[0],
          idSector: resultDatabase.map(value => value.id_glpi)[0],
          equipment: key.equipment,
          serie: key.serie
        })
      }else {
        const resultDatabase = await prisma.sector.findMany({
          where: {
            name: {
              startsWith: normalizeText(key.sector)
            }
          }
        })
        newData.push({
            sector: resultDatabase.map(value => value.name)[0],
            idSector: resultDatabase.map(value => value.id_glpi)[0],
            equipment: key.equipment,
            serie: key.serie
        })
      }
    }
  }

  return assetProcessor(newData.filter(value => !(value.serie.toLowerCase() === "N/A".toLocaleLowerCase())))
}
