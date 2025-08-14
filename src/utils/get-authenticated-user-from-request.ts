import type { FastifyRequest } from 'fastify'

export function getAuthenticatedUserFromRequest(request: FastifyRequest) {

  const { user } = request
  
  if (!user) {
    throw new Error('user not found')
  }

  return user
}