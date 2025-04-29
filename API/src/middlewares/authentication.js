export function authentication(request, response, next){

  const authent = request.headers['authorization'];
  
  if (!authent) {
    return response.status(401).json({ message: "Realizar autenticação" });
  }

  // Extraindo string adm do authent
  const base64Credentials = authent.split(" ")[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const stringCredentials = credentials.split(":")[0]

  if(!stringCredentials){
    return response.status(401).json({ message: "Realizar Autenticação" })
  }

  request.headers = {
    role: stringCredentials
  }
  
  return next()
}