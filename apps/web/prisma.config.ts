import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// .env.local 파일 로드
config({ path: '.env.local' })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    // 마이그레이션/스키마 푸시는 Direct 연결 사용 (5432 포트)
    url: process.env.DIRECT_URL,
  },
})
