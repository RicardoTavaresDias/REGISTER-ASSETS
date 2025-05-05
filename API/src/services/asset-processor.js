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

export function assetProcessor(data){
  const computer = data.filter(value => 
    value.equipment.toLowerCase() === "CPU".toLowerCase())

  const monitor = data.filter(value => 
    value.equipment.toLowerCase() === "monitor".toLowerCase())

  const printer = data.filter(value => 
    value.equipment.toLowerCase() === "impressora".toLowerCase())

  const others = data.filter(value => 
    value.equipment.toLowerCase() !== "cpu".toLowerCase() &&
    value.equipment.toLowerCase() !== "monitor".toLowerCase() &&
    value.equipment.toLowerCase() !== "impressora".toLowerCase()
  )

  return {
    computer,
    monitor,
    printer,
    others
  }
}

/**
 * Transforma uma estrutura de dados contendo listas de equipamentos por categoria,
 * atualizando o nome do setor com base na parte à direita do delimitador "=>".
 *
 * @param {Object} data - Objeto com quatro propriedades: `computer`, `monitor`, `printer`, e `others`.
 * Cada propriedade deve conter um array de objetos com os campos:
 *   - `sector`: string com formato "antigo => novo"
 *   - `equipment`: string com o nome do equipamento
 *   - `serie`: string com o número de série do equipamento
 *
 * @returns {Object} Um novo objeto com as mesmas propriedades (`computer`, `monitor`, `printer`, `others`),
 * onde cada item tem o `sector` atualizado (somente a parte após "=>").
 *
 */

export function mapUpdateSector(data){
  const newData = []
    
  for(const key in data){
    newData.push(data[key]
        .map(value => (
          { 
            sector: value.sector.split("=>")[1].trim(), 
            equipment: value.equipment, 
            serie: value.serie 
          }
        )
      )
    )
  }

  return { 
    computer: [...newData[0]], 
    monitor: [...newData[1]], 
    printer: [...newData[2]], 
    others: [...newData[3]] 
  }
}