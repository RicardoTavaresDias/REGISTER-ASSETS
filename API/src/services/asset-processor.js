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