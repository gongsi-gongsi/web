import { Prisma } from '@prisma/client'

export const PRISMA_ERROR_CODES = {
  UNIQUE_CONSTRAINT: 'P2002',
  FOREIGN_KEY_CONSTRAINT: 'P2003',
  RECORD_NOT_FOUND: 'P2025',
  CONNECTION_ERROR: 'P1001',
  TIMEOUT: 'P1008',
} as const

const ERROR_MESSAGES: Record<string, string> = {
  P2002: '이미 존재하는 데이터입니다.',
  P2003: '참조하는 데이터가 존재하지 않습니다.',
  P2025: '요청한 데이터를 찾을 수 없습니다.',
  P1001: '데이터베이스 연결에 실패했습니다.',
  P1008: '요청 시간이 초과되었습니다.',
}

export function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError
}

export function isPrismaValidationError(
  error: unknown
): error is Prisma.PrismaClientValidationError {
  return error instanceof Prisma.PrismaClientValidationError
}

export function getPrismaErrorMessage(error: unknown): string {
  if (isPrismaError(error)) {
    return ERROR_MESSAGES[error.code] ?? '데이터베이스 오류가 발생했습니다.'
  }
  if (isPrismaValidationError(error)) {
    return '잘못된 데이터 형식입니다.'
  }
  if (error instanceof Error) {
    return error.message
  }
  return '알 수 없는 오류가 발생했습니다.'
}

export function getUniqueConstraintField(
  error: Prisma.PrismaClientKnownRequestError
): string | null {
  if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT) {
    const target = error.meta?.target as string[] | undefined
    return target?.[0] ?? null
  }
  return null
}
