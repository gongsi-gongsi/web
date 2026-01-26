import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

function validateEnv() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.')
  }
}

let pool: Pool | undefined

function createPrismaClient() {
  validateEnv()

  const connectionString = process.env.DATABASE_URL

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
    })
  }

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// 모든 환경에서 싱글톤 캐시 사용
globalForPrisma.prisma = prisma

// Graceful shutdown을 위한 cleanup 함수
export async function closePrismaConnection() {
  await prisma.$disconnect()
  await pool?.end()
  pool = undefined
}
