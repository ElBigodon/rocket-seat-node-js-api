import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken'

export async function checkUserToken(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization

  if (!token) {
    return reply.status(401).send({ result: 'unauthorized' })
  }

  const [_, tokenValue] = token.split(' ')

  console.log(_);
  console.log(tokenValue);
  
  try {
    const payload = jwt.verify(tokenValue, process.env.JWT_SECRET!)
    
    console.log(payload);
    
    request.user = payload as FastifyRequest['user']
  } catch(err) {
    console.log(err);
    
    return reply.status(401).send({ result: 'unauthorized' })
  }
}