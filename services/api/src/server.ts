import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './modules/auth/auth.routes'

const app = Fastify({ logger: true })

// Plugins
app.register(cors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
  ],
  credentials: true,
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
})

// Auth decorator
app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({ error: 'Не авторизований' })
  }
})

// Health check
app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  service: 'earthify-api',
}))

// Routes
app.register(authRoutes, { prefix: '/api/auth' })

// Start
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
