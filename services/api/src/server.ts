import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

const app = Fastify({ logger: true })

app.register(cors, { origin: true, credentials: true })

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'dev-secret'
})

app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' })
  }
})

app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  service: 'earthify-api',
  routes: ['/api/auth/register', '/api/auth/login']
}))

app.post('/api/auth/register', async (request, reply) => {
  return reply.send({ message: 'Register endpoint working!', body: request.body })
})

app.post('/api/auth/login', async (request, reply) => {
  return reply.send({ message: 'Login endpoint working!', body: request.body })
})

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
