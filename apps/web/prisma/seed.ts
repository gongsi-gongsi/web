import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { getCorpCodeList, filterListedCompanies } from '../shared/lib/dart/apis/corp-code'

const BATCH_SIZE = 100

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    console.log('DART 고유번호 목록 다운로드 중...')
    const allCorpCodes = await getCorpCodeList()
    const listedCompanies = filterListedCompanies(allCorpCodes)
    console.log(`상장사 ${listedCompanies.length}개 확인`)

    console.log('Stock 테이블에 upsert 중...')
    let upserted = 0

    for (let i = 0; i < listedCompanies.length; i += BATCH_SIZE) {
      const batch = listedCompanies.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map(corp =>
          prisma.stock.upsert({
            where: { corpCode: corp.corpCode },
            update: {
              corpName: corp.corpName,
              stockCode: corp.stockCode ?? '',
            },
            create: {
              corpCode: corp.corpCode,
              corpName: corp.corpName,
              stockCode: corp.stockCode ?? '',
              market: null,
            },
          })
        )
      )

      upserted += batch.length
      console.log(`  ${upserted} / ${listedCompanies.length}`)
    }

    console.log(`시드 완료: ${upserted}개 종목 upsert`)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch(error => {
  console.error('시드 실패:', error)
  process.exit(1)
})
