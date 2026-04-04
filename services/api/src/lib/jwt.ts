import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { JWTPayload } from '../types'
import { env } from './env'

export function signAccessToken(
  fastify: FastifyInstance,
  payload: JWTPayload,
): string {
  return fastify.jwt.sign(payload, { expiresIn: env.JWT_ACCESS_EXPIRES })
}

export function signRefreshToken(
  fastify: FastifyInstance,
  userId: string,
): string {
  return fastify.jwt.sign({ userId }, { expiresIn: env.JWT_REFRESH_EXPIRES })
}

export function verifyToken(
  fastify: FastifyInstance,
  token: string,
): JWTPayload {
  try {
    return fastify.jwt.verify(token) as JWTPayload
  } catch (err) {
    throw new Error(`Token verification failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}
