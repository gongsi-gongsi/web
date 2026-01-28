import { config } from 'dotenv'
import { resolve } from 'path'

// .env.local 로드
const result = config({ path: resolve(__dirname, '../.env.local'), override: true })

console.log('환경변수 로드 결과:', result.error ? '실패' : '성공')
console.log('DATABASE_URL 존재:', !!process.env.DATABASE_URL)
console.log('DATABASE_URL 값:', process.env.DATABASE_URL ? '설정됨' : '없음')

if (process.env.DATABASE_URL) {
  const { PrismaClient } = require('@prisma/client')
  const prisma = new PrismaClient()

  prisma
    .$connect()
    .then(() => {
      console.log('\n✅ Supabase 연결 성공!')
      return prisma.user.count()
    })
    .then((count: number) => {
      console.log(`👤 User 테이블 레코드 수: ${count}개`)
      console.log('\n✨ 연결 테스트 통과!\n')
      return prisma.$disconnect()
    })
    .catch((error: Error) => {
      console.error('\n❌ 연결 실패:', error.message)
      process.exit(1)
    })
} else {
  console.error('\n❌ DATABASE_URL이 설정되지 않았습니다.')
  process.exit(1)
}
