import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/db'
import { redis } from '../../lib/redis'
import type { RegisterInput, LoginInput } from './auth.schema'

const ALL_MODULES = ['core', 'hotel', 'spa', 'salon', 'pool', 'restaurant', 'cafe']

const refreshTokenTtlSeconds = 30 * 24 * 60 * 60
const refreshTokenFallbackStore = new Map<string, {
  token: string
  expiresAt: number
}>()

function saveRefreshTokenFallback(userId: string, token: string): void {
  refreshTokenFallbackStore.set(userId, {
    token,
    expiresAt: Date.now() + refreshTokenTtlSeconds * 1000,
  })
}

function readRefreshTokenFallback(userId: string): string | null {
  const entry = refreshTokenFallbackStore.get(userId)
  if (!entry) return null
  if (entry.expiresAt <= Date.now()) {
    refreshTokenFallbackStore.delete(userId)
    return null
  }
  return entry.token
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name)
  let slug = base
  let counter = 1

  while (await prisma.tenant.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`
    counter++
  }

  return slug
}

export async function registerService(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })
  if (existingUser) {
    throw new Error('EMAIL_EXISTS')
  }

  const passwordHash = await bcrypt.hash(data.password, 12)

  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: data.businessName,
        slug: await generateUniqueSlug(data.businessName),
        plan: 'starter',
        modulesEnabled: ALL_MODULES,
        settings: {
          timezone: 'Europe/Kyiv',
          currency: 'UAH',
          language: 'uk',
          loyaltyRate: 10,
        },
      },
    })

    const user = await tx.user.create({
      data: {
        tenantId: tenant.id,
        email: data.email,
        passwordHash,
        role: 'owner',
        name: data.name,
      },
    })

    await tx.subscription.create({
      data: {
        tenantId: tenant.id,
        plan: 'starter',
        modules: ALL_MODULES,
        amount: 0,
        currency: 'USD',
        status: 'trialing',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    })

    return { tenant, user }
  })

  return result
}

export async function loginService(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { tenant: true },
  })

  if (!user) throw new Error('INVALID_CREDENTIALS')
  if (!user.active) throw new Error('ACCOUNT_DISABLED')

  const valid = await bcrypt.compare(data.password, user.passwordHash)
  if (!valid) throw new Error('INVALID_CREDENTIALS')

  return { user, tenant: user.tenant }
}

export async function saveRefreshToken(
  userId: string,
  token: string
): Promise<void> {
  try {
    await redis.set(
      `refresh:${userId}`,
      token,
      'EX',
      refreshTokenTtlSeconds
    )
  } catch {
    saveRefreshTokenFallback(userId, token)
  }
}

export async function validateRefreshToken(
  userId: string,
  token: string
): Promise<boolean> {
  try {
    const stored = await redis.get(`refresh:${userId}`)
    if (stored) return stored === token
  } catch {
    // Fall back to in-memory storage when Redis is unavailable.
  }

  return readRefreshTokenFallback(userId) === token
}

export async function deleteRefreshToken(userId: string): Promise<void> {
  refreshTokenFallbackStore.delete(userId)

  try {
    await redis.del(`refresh:${userId}`)
  } catch {
    // Ignore Redis failures during logout.
  }
}

export async function getMeService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tenant: {
        include: {
          subscriptions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  })

  if (!user) throw new Error('USER_NOT_FOUND')
  return user
}
