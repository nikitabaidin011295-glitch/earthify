import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { env } from './lib/env'
import { errorHandler } from './lib/errors'
import { authenticate } from './middleware/auth'
import { authRoutes } from './modules/auth/auth.routes'

const app = Fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
})

// ── Plugins ────────────────────────────────────────────────────────────────
app.register(cors, { origin: true, credentials: true })
app.register(jwt, { secret: env.JWT_SECRET })

// ── Decorators ────────────────────────────────────────────────────────────
app.decorate('authenticate', authenticate)

// ── Error handler ─────────────────────────────────────────────────────────
app.setErrorHandler(errorHandler)

// ── Routes ────────────────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  service: 'earthify-api',
}))

app.register(authRoutes, { prefix: '/api/auth' })

// ── Start ──────────────────────────────────────────────────────────────────
const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    app.log.info(`Earthify API running on port ${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

// ── Graceful shutdown ──────────────────────────────────────────────────────
const shutdown = async (signal: string) => {
  app.log.info(`Received ${signal}, shutting down...`)
  await app.close()
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

start()
