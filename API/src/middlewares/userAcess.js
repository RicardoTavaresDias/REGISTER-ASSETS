export function userAcess(role){
  return (request, response, next) => {
    // exemplo para liberação.
    request.Headers = { role: "admin" }

    if(!request.Headers){
      return response.status(401).json({ message: 'Não autorizado' })
    }

    if(!role.includes(request.Headers.role)){
      return response.status(401).json({ message: 'Não autorizado' })
    }

    return next()
  }
}