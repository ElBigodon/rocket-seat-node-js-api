import type { FastifyRequest } from 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    user: {
      sub: string
      role: string
    }
  }
}