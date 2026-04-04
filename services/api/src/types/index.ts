export interface JWTPayload {
  userId: string
  tenantId: string
  role: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  tenantId: string
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export type BusinessType =
  | 'hotel'
  | 'spa'
  | 'salon'
  | 'pool'
  | 'restaurant'
  | 'cafe'
