import { normalizeText } from "../lib/normalizeText.js";
import { Repository } from "../repositories/Repository.js";

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
    (value) => value.equipment.toLowerCase().includes("CPU".toLowerCase()) ? 
      value.equipment?.toLowerCase() === "CPU".toLowerCase() :
      value.equipment?.toLowerCase() === "computador".toLowerCase()
  );

  const monitor = data.filter(
    (value) => value.equipment.toLowerCase() === "monitor".toLowerCase()
  );

  const printer = data.filter(
    (value) => value.equipment.toLowerCase() === "impressora".toLowerCase()
  );

  const others = data.filter(
    (value) =>
      value.equipment.toLowerCase().includes("CPU".toLowerCase()) ? 
        value.equipment.toLowerCase() !== "CPU".toLowerCase() :
        value.equipment.toLowerCase() !== "computador".toLowerCase() &&

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
  const repository = new Repository()
  const newData = []

  for(const item in data){
    for(const key of data[item]){
      if(key.sector.includes("=>")){
        const resultDatabase = await repository.search.searchBySector(normalizeText(key.sector.split("=>")[1].trim()))
        newData.push({
          id: key.id,
          sector: resultDatabase.length > 0 ? resultDatabase.map(value => value.name)[0] : key.sector.split("=>")[0].trim(),
          idSector: resultDatabase.length > 0 ? resultDatabase.map(value => value.id_glpi)[0] : null,
          equipment: key.equipment,
          serie: key.serie
        })
      }else {
        const resultDatabase = await repository.search.searchBySector(String(key.sector).toUpperCase())
        newData.push({
            id: resultDatabase.map(value => value.id)[0] || key.id,
            sector: resultDatabase.map(value => value.name)[0] || key.sector,
            idSector: resultDatabase.map(value => value.id_glpi)[0] || null,
            equipment: key.equipment,
            serie: key.serie
        })
      }
    }
  }

  return assetProcessor(newData.filter(value => !(value.serie.toLowerCase() === "N/A".toLocaleLowerCase())))
}

/**
 * Classifica ativos em dois grupos:
 * - `manual`: sem `idSector` (necessitam revisão).
 * - `existId`: com `idSector` (prontos para uso).
 *
 * @param {Object} items - Ativos organizados por tipo (computer, monitor, etc).
 * @returns {{ manual: Array<Object>, existId: Array<Object> }}
 */

export function existIdSector(items){
  const manual = []
  const existId = []

  for(const key in items){
    for(const item of items[key]){
      if(item.idSector === null){
        manual.push(item)
      }else {
        existId.push(item)
      }
    }
  }

  return {
    manual,
    existId
  }
}
