/**
 * DART 고유번호 동기화 스크립트
 * 전체 상장 기업의 고유번호와 종목코드를 DB에 저장
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { getCorpCodeList, filterListedCompanies } from '../shared/lib/dart'

// .env.local 로드
config({ path: resolve(__dirname, '../.env.local'), override: true })

// Prisma 설정
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function syncCorpCodes() {
  console.log('🚀 DART 고유번호 동기화 시작...\n')

  try {
    // 1. DART API에서 고유번호 목록 가져오기
    console.log('📥 DART API에서 기업 정보 다운로드 중...')
    const allCorpCodes = await getCorpCodeList()
    console.log(`✅ 전체 기업 수: ${allCorpCodes.length}개`)

    // 2. 상장 기업만 필터링
    const listedCorps = filterListedCompanies(allCorpCodes)
    console.log(`📊 상장 기업 수: ${listedCorps.length}개\n`)

    // 3. DB에 저장
    console.log('💾 데이터베이스에 저장 중...')

    let successCount = 0
    let errorCount = 0

    for (const corp of listedCorps) {
      try {
        await prisma.stock.upsert({
          where: { stockCode: corp.stockCode },
          update: {
            corpCode: corp.corpCode,
            corpName: corp.corpName,
            updatedAt: new Date(),
          },
          create: {
            stockCode: corp.stockCode!,
            corpCode: corp.corpCode,
            corpName: corp.corpName,
          },
        })
        successCount++

        // 진행률 표시 (매 100개마다)
        if (successCount % 100 === 0) {
          const progress = ((successCount / listedCorps.length) * 100).toFixed(1)
          console.log(`  진행중... ${successCount}/${listedCorps.length} (${progress}%)`)
        }
      } catch (error) {
        errorCount++
        console.error(`  ❌ 실패: ${corp.corpName} (${corp.stockCode})`, error)
      }
    }

    console.log('\n✨ 동기화 완료!')
    console.log('='.repeat(80))
    console.log(`✅ 성공: ${successCount}개`)
    console.log(`❌ 실패: ${errorCount}개`)
    console.log('='.repeat(80))

    // 4. 동기화 결과 확인
    const totalStocks = await prisma.stock.count()
    console.log(`\n📊 DB에 저장된 종목 수: ${totalStocks}개`)

    // 5. 샘플 데이터 출력
    const samples = await prisma.stock.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    })

    console.log('\n📌 최근 저장된 종목 (5개):')
    console.log('='.repeat(80))
    samples.forEach(stock => {
      console.log(
        `${stock.corpName.padEnd(20)} | 종목코드: ${stock.stockCode} | 고유번호: ${stock.corpCode}`
      )
    })
    console.log('='.repeat(80))

    console.log('\n✅ 모든 작업이 완료되었습니다!\n')
  } catch (error) {
    console.error('\n❌ 동기화 실패:', error)
    if (error instanceof Error) {
      console.error('상세 오류:', error.message)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

syncCorpCodes()
