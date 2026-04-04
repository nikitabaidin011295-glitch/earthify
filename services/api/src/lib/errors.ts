import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT')
    this.name = 'ConflictError'
  }
}

export function errorHandler(
  err: FastifyError | AppError | ZodError | Error,
  _request: FastifyRequest,
  reply: FastifyReply,
): void {
  if (err instanceof ZodError) {
    reply.status(400).send({
      error: 'Validation error',
      details: err.issues,
    })
    return
  }

  if (err instanceof AppError) {
    reply.status(err.statusCode).send({
      error: err.message,
      code: err.code,
    })
    return
  }

  const fastifyErr = err as FastifyError
  if (fastifyErr.statusCode) {
    reply.status(fastifyErr.statusCode).send({ error: fastifyErr.message })
    return
  }

  reply.status(500).send({ error: 'Internal server error' })
}
