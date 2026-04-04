import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = Fastify({ logger: true })

app.register(cors, { origin: true, credentials: true })
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'dev-secret'
})

app.decorate('authenticate', async (request: any, reply: any) => {
  try { await request.jwtVerify() }
  catch { reply.status(401).send({ error: 'Unauthorized' }) }
})

app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  service: 'earthify-api'
}))

app.post('/api/auth/register', async (request: any, reply) => {
  try {
    const { name, email, password, businessName, businessType } = request.body

    if (!name || !email || !password || !businessName || !businessType) {
      return reply.status(400).send({ error: 'Всі поля обовязкові' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return reply.status(409).send({ error: 'Email вже використовується' })

    const passwordHash = await bcrypt.hash(password, 12)

    const tenant = await prisma.tenant.create({
      data: {
        name: businessName,
        slug: businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50),
        plan: 'starter',
        modulesEnabled: ['core', businessType],
        settings: { timezone: 'Europe/Kyiv', currency: 'UAH' }
      }
    })

    const user = await prisma.user.create({
      data: { tenantId: tenant.id, email, passwordHash, role: 'owner', name }
    })

    const accessToken = app.jwt.sign(
      { userId: user.id, tenantId: tenant.id, role: user.role },
      { expiresIn: '15m' }
    )

    return reply.status(201).send({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug, plan: tenant.plan }
    })
  } catch (err: any) {
    app.log.error(err)
    return reply.status(500).send({ error: err.message })
  }
})

app.post('/api/auth/login', async (request: any, reply) => {
  try {
    const { email, password } = request.body

    const user = await prisma.user.findUnique({
      where: { email }, include: { tenant: true }
    })
    if (!user) return reply.status(401).send({ error: 'Невірний email або пароль' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return reply.status(401).send({ error: 'Невірний email або пароль' })

    const accessToken = app.jwt.sign(
      { userId: user.id, tenantId: user.tenantId, role: user.role },
      { expiresIn: '15m' }
    )

    return reply.send({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tenant: { id: user.tenant.id, name: user.tenant.name, slug: user.tenant.slug }
    })
  } catch (err: any) {
    app.log.error(err)
    return reply.status(500).send({ error: err.message })
  }
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
