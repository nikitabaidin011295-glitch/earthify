import type { FastifyInstance } from 'fastify'
import { Prisma } from '@prisma/client'
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from './auth.schema'
import {
  registerService,
  loginService,
  saveRefreshToken,
  validateRefreshToken,
  deleteRefreshToken,
  getMeService,
} from './auth.service'

function buildErrorPayload(err: unknown) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      error: 'Помилка сервера',
      details: err.message,
      code: err.code,
    }
  }

  if (err instanceof Error) {
    return {
      error: 'Помилка сервера',
      details: err.message,
    }
  }

  return { error: 'Помилка сервера' }
}

export async function authRoutes(fastify: FastifyInstance) {
  // POST /api/auth/register
  fastify.post('/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body)
      const { tenant, user } = await registerService(body)

      // Генерувати токени
      const accessToken = fastify.jwt.sign(
        { userId: user.id, tenantId: tenant.id, role: user.role },
        { expiresIn: '15m' }
      )
      const refreshToken = fastify.jwt.sign(
        { userId: user.id },
        { expiresIn: '30d' }
      )

      await saveRefreshToken(user.id, refreshToken)

      return reply.status(201).send({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          plan: tenant.plan,
          modulesEnabled: tenant.modulesEnabled,
        },
      })
    } catch (err: any) {
      if (err.message === 'EMAIL_EXISTS') {
        return reply.status(409).send({
          error: 'Email вже використовується',
        })
      }
      if (err.name === 'ZodError') {
        return reply.status(400).send({
          error: 'Невірні дані',
          details: err.errors,
        })
      }
      fastify.log.error(err)
      return reply.status(500).send(buildErrorPayload(err))
    }
  })

  // POST /api/auth/login
  fastify.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body)
      const { user, tenant } = await loginService(body)

      const accessToken = fastify.jwt.sign(
        { userId: user.id, tenantId: tenant.id, role: user.role },
        { expiresIn: '15m' }
      )
      const refreshToken = fastify.jwt.sign(
        { userId: user.id },
        { expiresIn: '30d' }
      )

      await saveRefreshToken(user.id, refreshToken)

      return reply.send({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          plan: tenant.plan,
          modulesEnabled: tenant.modulesEnabled,
        },
      })
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') {
        return reply.status(401).send({
          error: 'Невірний email або пароль',
        })
      }
      if (err.message === 'ACCOUNT_DISABLED') {
        return reply.status(403).send({
          error: 'Акаунт заблоковано',
        })
      }
      fastify.log.error(err)
      return reply.status(500).send(buildErrorPayload(err))
    }
  })

  // POST /api/auth/refresh
  fastify.post('/refresh', async (request, reply) => {
    try {
      const { refreshToken } = refreshSchema.parse(request.body)
      const decoded = fastify.jwt.verify<{ userId: string }>(refreshToken)

      const valid = await validateRefreshToken(
        decoded.userId,
        refreshToken
      )
      if (!valid) {
        return reply.status(401).send({ error: 'Невірний refresh token' })
      }

      const user = await getMeService(decoded.userId)

      const newAccessToken = fastify.jwt.sign(
        {
          userId: user.id,
          tenantId: user.tenantId,
          role: user.role,
        },
        { expiresIn: '15m' }
      )

      return reply.send({ accessToken: newAccessToken })
    } catch (err: any) {
      return reply.status(401).send({ error: 'Невірний токен' })
    }
  })

  // POST /api/auth/logout
  fastify.post(
    '/logout',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const user = request.user
      await deleteRefreshToken(user.userId)
      return reply.send({ message: 'Вийшли успішно' })
    }
  )

  // GET /api/auth/me
  fastify.get(
    '/me',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const user = request.user
        const me = await getMeService(user.userId)

        return reply.send({
          id: me.id,
          name: me.name,
          email: me.email,
          role: me.role,
          tenant: {
            id: me.tenant.id,
            name: me.tenant.name,
            slug: me.tenant.slug,
            plan: me.tenant.plan,
            modulesEnabled: me.tenant.modulesEnabled,
            settings: me.tenant.settings,
            subscription: me.tenant.subscriptions[0] || null,
          },
        })
      } catch (err) {
        return reply.status(404).send({ error: 'Користувача не знайдено' })
      }
    }
  )
}
