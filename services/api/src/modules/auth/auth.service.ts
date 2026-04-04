import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/db'
import { redis } from '../../lib/redis'
import type { RegisterInput, LoginInput } from './auth.schema'

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

// Хелпер для slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}

// Генерація унікального slug
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
  // 1. Перевірити чи email вже є
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })
  if (existingUser) {
    throw new Error('EMAIL_EXISTS')
  }

  // 2. Хешувати пароль
  const passwordHash = await bcrypt.hash(data.password, 12)

  // 3. Створити тенанта і власника в одній транзакції
  const result = await prisma.$transaction(async (tx) => {
    // Створити тенанта
    const tenant = await tx.tenant.create({
      data: {
        name: data.businessName,
        slug: await generateUniqueSlug(data.businessName),
        plan: 'starter',
        modulesEnabled: ['core', data.businessType],
        settings: {
          timezone: 'Europe/Kyiv',
          currency: 'UAH',
          language: 'uk',
          loyaltyRate: 10,
        },
      },
    })

    // Створити власника
    const user = await tx.user.create({
      data: {
        tenantId: tenant.id,
        email: data.email,
        passwordHash,
        role: 'owner',
        name: data.name,
      },
    })

    // Створити підписку (trial 14 днів)
    await tx.subscription.create({
      data: {
        tenantId: tenant.id,
        plan: 'starter',
        modules: ['core', data.businessType],
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
  // 1. Знайти користувача
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { tenant: true },
  })

  if (!user) throw new Error('INVALID_CREDENTIALS')
  if (!user.active) throw new Error('ACCOUNT_DISABLED')

  // 2. Перевірити пароль
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
