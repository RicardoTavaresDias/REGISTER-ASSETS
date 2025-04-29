
/**
 * Verifica se o usuário tem acesso com base nas roles (ex: admin ou member)
 * 
 * @param {string[]} role Lista de permissões do usuário (ex: ['admin', 'member']).
 * @returns {boolean} Retorna `true` se tiver acesso permitido.
 */

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