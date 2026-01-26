import { config } from 'dotenv'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// .env.local 파일 로드
config({ path: '.env.local' })

const connectionString = process.env.DIRECT_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const sampleStocks = [
  { symbol: '005930', name: '삼성전자', market: 'KOSPI' as const, sector: '전기전자' },
  { symbol: '000660', name: 'SK하이닉스', market: 'KOSPI' as const, sector: '전기전자' },
  { symbol: '035420', name: 'NAVER', market: 'KOSPI' as const, sector: '서비스업' },
  { symbol: '035720', name: '카카오', market: 'KOSPI' as const, sector: '서비스업' },
  { symbol: '068270', name: '셀트리온', market: 'KOSPI' as const, sector: '의약품' },
  { symbol: '005380', name: '현대차', market: 'KOSPI' as const, sector: '운수장비' },
  { symbol: '006400', name: '삼성SDI', market: 'KOSPI' as const, sector: '전기전자' },
  { symbol: '051910', name: 'LG화학', market: 'KOSPI' as const, sector: '화학' },
  { symbol: '003670', name: '포스코퓨처엠', market: 'KOSPI' as const, sector: '철강금속' },
  { symbol: '247540', name: '에코프로비엠', market: 'KOSDAQ' as const, sector: '화학' },
]

async function main() {
  console.log('Seeding stocks...')

  for (const stock of sampleStocks) {
    await prisma.stock.upsert({
      where: { symbol: stock.symbol },
      update: stock,
      create: stock,
    })
    console.log(`  - ${stock.name} (${stock.symbol})`)
  }

  console.log(`Seeding completed. ${sampleStocks.length} stocks added.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
