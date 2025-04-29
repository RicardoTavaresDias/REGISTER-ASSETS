export function userAcess(role){
  return (request, response, next) => {

    if(!request.headers){
      return response.status(401).json({ message: 'Não autorizado' })
    }

    if(!role.includes(request.headers.role)){
      return response.status(401).json({ message: 'Não autorizado' })
    }

    return next()
  }
}