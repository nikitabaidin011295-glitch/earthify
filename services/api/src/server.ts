import Fastify from 'fastify'
import type { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './modules/auth/auth.routes'

const app = Fastify({ logger: true })
const jwtSecret = process.env.JWT_SECRET
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required')
}

app.register(cors, {
  origin: (origin, cb) => {
    // Allow server-to-server and CLI requests with no Origin header.
    if (!origin) return cb(null, true)
    if (allowedOrigins.length === 0) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
    return cb(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
app.register(jwt, {
  secret: jwtSecret
})

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try { await request.jwtVerify() }
  catch { reply.status(401).send({ error: 'Unauthorized' }) }
})

app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  service: 'earthify-api'
}))

app.get('/', async () => ({
  message: 'Earthify API is running',
  health: '/health'
}))

app.register(authRoutes, { prefix: '/api/auth' })

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 8080
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`Earthify API running on port ${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
