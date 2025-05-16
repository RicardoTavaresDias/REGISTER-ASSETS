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
