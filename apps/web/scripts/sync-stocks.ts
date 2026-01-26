/**
 * 종목 데이터 동기화 스크립트
 * 실행: cd apps/web && npx @dotenvx/dotenvx run -f .env.local -- npx tsx scripts/sync-stocks.ts
 */

import type { Market, SyncStatus, SyncType, PrismaClient } from '@prisma/client'
import type { KrxStockItem, StockPriceItem } from '../shared/lib/public-data/types'

// 시장 구분 매핑
function mapMarket(mrktCtg: string): Market | null {
  switch (mrktCtg) {
    case 'KOSPI':
      return 'KOSPI'
    case 'KOSDAQ':
      return 'KOSDAQ'
    default:
      return null // KONEX 등은 제외
  }
}

// 동기화 로그 생성
async function createSyncLog(prisma: PrismaClient, type: SyncType): Promise<string> {
  const log = await prisma.syncLog.create({
    data: {
      type,
      status: 'RUNNING',
    },
  })
  return log.id
}

// 동기화 로그 업데이트
async function updateSyncLog(
  prisma: PrismaClient,
  id: string,
  data: {
    status: SyncStatus
    totalCount?: number
    successCount?: number
    failCount?: number
    errorMessage?: string
  }
): Promise<void> {
  await prisma.syncLog.update({
    where: { id },
    data: {
      ...data,
      completedAt: data.status !== 'RUNNING' ? new Date() : undefined,
    },
  })
}

// 종목 목록 동기화
async function syncStockList(prisma: PrismaClient, getAllKrxStocks: () => Promise<KrxStockItem[]>) {
  console.log('\n=== 종목 목록 동기화 시작 ===')
  const syncLogId = await createSyncLog(prisma, 'STOCK_LIST')

  try {
    console.log('공공데이터 API에서 전체 종목 조회 중...')
    const items = await getAllKrxStocks()
    console.log(`총 ${items.length}개 종목 조회 완료`)

    let successCount = 0
    let failCount = 0

    // 배치 처리 (100개씩)
    const batchSize = 100
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      const progress = Math.min(i + batchSize, items.length)
      process.stdout.write(
        `\r처리 중: ${progress}/${items.length} (${Math.round((progress / items.length) * 100)}%)`
      )

      await prisma.$transaction(async tx => {
        for (const item of batch) {
          const market = mapMarket(item.mrktCtg)
          if (!market) {
            failCount++
            continue
          }

          try {
            await tx.stock.upsert({
              where: { symbol: item.srtnCd },
              update: {
                isinCode: item.isinCd,
                crno: item.crno || null,
                name: item.itmsNm,
                corpName: item.corpNm || null,
                market,
                isActive: true,
                syncedAt: new Date(),
              },
              create: {
                symbol: item.srtnCd,
                isinCode: item.isinCd,
                crno: item.crno || null,
                name: item.itmsNm,
                corpName: item.corpNm || null,
                market,
                isActive: true,
                syncedAt: new Date(),
              },
            })
            successCount++
          } catch (error) {
            console.error(`\n종목 동기화 실패: ${item.srtnCd}`, error)
            failCount++
          }
        }
      })
    }

    console.log('\n')
    await updateSyncLog(prisma, syncLogId, {
      status: 'COMPLETED',
      totalCount: items.length,
      successCount,
      failCount,
    })

    console.log(`종목 목록 동기화 완료: 성공 ${successCount}개, 실패 ${failCount}개`)
    return { success: true, syncLogId, totalCount: items.length, successCount, failCount }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 에러'
    console.error('종목 목록 동기화 실패:', errorMessage)

    await updateSyncLog(prisma, syncLogId, {
      status: 'FAILED',
      errorMessage,
    })

    return {
      success: false,
      syncLogId,
      totalCount: 0,
      successCount: 0,
      failCount: 0,
      error: errorMessage,
    }
  }
}

// 시세 동기화
async function syncStockPrices(
  prisma: PrismaClient,
  getAllStockPrices: (params?: { basDt?: string }) => Promise<StockPriceItem[]>,
  baseDate?: Date
) {
  console.log('\n=== 시세 동기화 시작 ===')
  const syncLogId = await createSyncLog(prisma, 'STOCK_PRICE')

  try {
    const d = baseDate ?? new Date()
    const basDt = d.toISOString().slice(0, 10).replace(/-/g, '')
    console.log(`기준일: ${basDt}`)

    console.log('공공데이터 API에서 전체 시세 조회 중...')
    const items = await getAllStockPrices({ basDt })
    console.log(`총 ${items.length}개 시세 조회 완료`)

    let successCount = 0
    let failCount = 0

    // 배치 처리 (100개씩)
    const batchSize = 100
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      const progress = Math.min(i + batchSize, items.length)
      process.stdout.write(
        `\r처리 중: ${progress}/${items.length} (${Math.round((progress / items.length) * 100)}%)`
      )

      await prisma.$transaction(async tx => {
        for (const item of batch) {
          try {
            await tx.stock.update({
              where: { symbol: item.srtnCd },
              data: {
                prevClose: parseInt(item.clpr, 10) || null,
                prevOpen: parseInt(item.mkp, 10) || null,
                prevHigh: parseInt(item.hipr, 10) || null,
                prevLow: parseInt(item.lopr, 10) || null,
                prevVolume: item.trqu ? BigInt(item.trqu) : null,
                prevTradingValue: item.trPrc ? BigInt(item.trPrc) : null,
                prevChange: parseInt(item.vs, 10) || null,
                prevChangeRate: item.fltRt ? parseFloat(item.fltRt) : null,
                marketCap: item.mrktTotAmt ? BigInt(item.mrktTotAmt) : null,
                listedShares: item.lstgStCnt ? BigInt(item.lstgStCnt) : null,
                priceDate: new Date(
                  `${item.basDt.slice(0, 4)}-${item.basDt.slice(4, 6)}-${item.basDt.slice(6, 8)}`
                ),
                syncedAt: new Date(),
              },
            })
            successCount++
          } catch {
            // 종목이 없는 경우 등 무시
            failCount++
          }
        }
      })
    }

    console.log('\n')
    await updateSyncLog(prisma, syncLogId, {
      status: 'COMPLETED',
      totalCount: items.length,
      successCount,
      failCount,
    })

    console.log(`시세 동기화 완료: 성공 ${successCount}개, 실패 ${failCount}개`)
    return { success: true, syncLogId, totalCount: items.length, successCount, failCount }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 에러'
    console.error('시세 동기화 실패:', errorMessage)

    await updateSyncLog(prisma, syncLogId, {
      status: 'FAILED',
      errorMessage,
    })

    return {
      success: false,
      syncLogId,
      totalCount: 0,
      successCount: 0,
      failCount: 0,
      error: errorMessage,
    }
  }
}

async function main() {
  console.log('='.repeat(50))
  console.log('종목 데이터 동기화 시작')
  console.log('='.repeat(50))

  // Dynamic import to ensure env is loaded first
  const { prisma, closePrismaConnection } = await import('../shared/lib/prisma')
  const { getAllKrxStocks, getAllStockPrices } = await import('../shared/lib/public-data')

  try {
    // 종목 목록 동기화
    const stockListResult = await syncStockList(prisma, getAllKrxStocks)

    // 시세 동기화 (종목 목록 동기화 성공 시에만)
    if (stockListResult.success) {
      await syncStockPrices(prisma, getAllStockPrices)
    }

    // 결과 확인
    console.log('\n=== 동기화 결과 확인 ===')
    const stockCount = await prisma.stock.count()
    const kospiCount = await prisma.stock.count({ where: { market: 'KOSPI' } })
    const kosdaqCount = await prisma.stock.count({ where: { market: 'KOSDAQ' } })
    const withPriceCount = await prisma.stock.count({ where: { prevClose: { not: null } } })

    console.log(`총 종목 수: ${stockCount}`)
    console.log(`  - KOSPI: ${kospiCount}`)
    console.log(`  - KOSDAQ: ${kosdaqCount}`)
    console.log(`시세 보유 종목: ${withPriceCount}`)

    // 샘플 데이터 출력
    console.log('\n=== 샘플 데이터 (시총 상위 5개) ===')
    const topStocks = await prisma.stock.findMany({
      where: { marketCap: { not: null } },
      orderBy: { marketCap: 'desc' },
      take: 5,
    })

    topStocks.forEach((stock, i) => {
      const marketCapBillion = stock.marketCap ? Number(stock.marketCap) / 100000000 : 0
      console.log(
        `${i + 1}. ${stock.name} (${stock.symbol}) - ${stock.market}, 종가: ${stock.prevClose?.toLocaleString()}원, 시총: ${marketCapBillion.toLocaleString()}억원`
      )
    })

    console.log('\n' + '='.repeat(50))
    console.log('동기화 완료!')
    console.log('='.repeat(50))
  } catch (error) {
    console.error('동기화 중 에러 발생:', error)
    process.exit(1)
  } finally {
    await closePrismaConnection()
  }
}

main()
