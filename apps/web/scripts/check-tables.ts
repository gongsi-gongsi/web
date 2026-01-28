import { config } from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'

// .env.local 로드
config({ path: resolve(__dirname, '../.env.local') })

const prisma = new PrismaClient()

async function checkTables() {
  try {
    const result = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `

    console.log('현재 DB 테이블 목록:')
    console.log('='.repeat(50))
    result.forEach(row => {
      console.log(`- ${row.tablename}`)
    })
    console.log('='.repeat(50))
    console.log(`총 ${result.length}개 테이블`)

    // Prisma 스키마에 정의된 테이블
    const prismaModels = [
      'users',
      'stocks',
      'watchlist',
      'disclosures',
      'financial_data',
      'ai_reports',
      'ai_conversations',
      'notifications',
      '_prisma_migrations',
    ]

    console.log('\n사용하지 않는 테이블:')
    console.log('='.repeat(50))
    const unusedTables = result
      .filter(row => !prismaModels.includes(row.tablename))
      .map(row => row.tablename)

    if (unusedTables.length === 0) {
      console.log('없음')
    } else {
      unusedTables.forEach(table => {
        console.log(`- ${table}`)
      })
    }
    console.log('='.repeat(50))
  } catch (error) {
    console.error('에러:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTables()
