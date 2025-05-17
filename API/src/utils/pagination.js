/**
 * Realiza a paginação de um array de dados e retorna os resultados da página atual,
 * junto com informações sobre a próxima e a página anterior, se aplicável.
 *
 * @param {number} page - Número da página atual (base 1).
 * @param {number} limit - Quantidade de itens por página.
 * @param {Array<Object>} data - Array de dados a ser paginado.
 * @returns {{
 *   results: {
 *     result: Array<Object>,
 *     next?: { page: number, limit: number },
 *     prev?: { page: number, limit: number }
 *   },
 *   totalPage: number
 * }} Objeto contendo os dados paginados e o total de páginas.
 *
 * @example
 * const dados = [{ name: "item1" }, { name: "item2" }, { name: "item3" }];
 * const resultado = pagination(1, 2, dados);
 * console.log(resultado.results.result); // [{ name: "item1" }, { name: "item2" }]
 */


export const pagination = (page, limit, data) => {
  const dataBase = data[0].name ? data.map(value => ({ name: value.name })) : data

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const results = {}

  if(endIndex < dataBase.length){
    results.next = {
      page: page + 1,
      limit: limit
    }
  }

  if(startIndex > 0){
    results.prev = {
      page: page - 1,
      limit: limit
    }
  }
  results.result = dataBase.slice(startIndex, endIndex)
  const totalPage = Math.ceil(dataBase.length / limit)

  return {
    results,
    totalPage
  }
}
