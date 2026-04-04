import type { FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify()
  } catch (err) {
    request.log.warn({ err }, 'JWT verification failed')
    reply.status(401).send({ error: 'Unauthorized' })
  }
}
