export function authentication(request, response, next){

  const authent = request.headers['authorization'];
  
  if (!authent) {
    return response.status(401).json({ message: "Realizar autenticação" });
  }

  const base64Credentials = authent.split(" ")[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')

  if(!credentials.split(":")[0]){
    return response.status(401).json({ message: "Realizar Autenticação" })
  }

  request.headers = {
    role: credentials.split(":")[0]
  }
  
  return next()
}