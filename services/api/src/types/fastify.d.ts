import 'fastify'
import '@fastify/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string
      tenantId?: string
      role?: string
    }
    user: {
      userId: string
      tenantId?: string
      role?: string
      iat?: number
      exp?: number
    }
  }
}