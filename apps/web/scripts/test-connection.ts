import { config } from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'

// .env.local 로드
config({ path: resolve(__dirname, '../.env.local') })

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔌 Supabase 연결 테스트 중...\n')

    // 1. DB 연결 테스트
    await prisma.$connect()
    console.log('✅ DB 연결 성공!')

    // 2. 테이블 조회 테스트
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `
    console.log('\n📋 현재 테이블 목록:')
    tables.forEach(table => {
      console.log(`   - ${table.tablename}`)
    })

    // 3. User 테이블 테스트
    const userCount = await prisma.user.count()
    console.log(`\n👤 User 테이블 레코드 수: ${userCount}개`)

    // 4. 테스트 데이터 생성 (선택)
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    })
    console.log('\n✅ 테스트 유저 생성 성공!')
    console.log(`   ID: ${testUser.id}`)
    console.log(`   Email: ${testUser.email}`)

    // 5. 테스트 데이터 삭제
    await prisma.user.delete({
      where: { id: testUser.id },
    })
    console.log('\n🗑️  테스트 유저 삭제 완료')

    console.log('\n✨ 모든 테스트 통과! Supabase 연결이 정상적으로 작동합니다.\n')
  } catch (error) {
    console.error('\n❌ 연결 테스트 실패:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
