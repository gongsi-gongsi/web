'use server'

import { prisma } from '@/shared/lib/prisma'
import { getAllKrxStocks, getAllStockPrices } from '@/shared/lib/public-data'
import type { Market, SyncStatus, SyncType } from '@prisma/client'

interface SyncResult {
  success: boolean
  syncLogId: string
  totalCount: number
  successCount: number
  failCount: number
  error?: string
}

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

// 기준일자 포맷 (YYYYMMDD)
function getBaseDateString(date?: Date): string {
  const d = date ?? new Date()
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

// 동기화 로그 생성
async function createSyncLog(type: SyncType): Promise<string> {
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
export async function syncStockList(): Promise<SyncResult> {
  const syncLogId = await createSyncLog('STOCK_LIST')

  try {
    // 공공데이터 API에서 전체 종목 조회
    const items = await getAllKrxStocks()

    let successCount = 0
    let failCount = 0

    // 배치 처리 (100개씩)
    const batchSize = 100
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)

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
            console.error(`종목 동기화 실패: ${item.srtnCd}`, error)
            failCount++
          }
        }
      })
    }

    await updateSyncLog(syncLogId, {
      status: 'COMPLETED',
      totalCount: items.length,
      successCount,
      failCount,
    })

    return {
      success: true,
      syncLogId,
      totalCount: items.length,
      successCount,
      failCount,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 에러'

    await updateSyncLog(syncLogId, {
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
export async function syncStockPrices(baseDate?: Date): Promise<SyncResult> {
  const syncLogId = await createSyncLog('STOCK_PRICE')

  try {
    const basDt = getBaseDateString(baseDate)

    // 공공데이터 API에서 전체 시세 조회
    const items = await getAllStockPrices({ basDt })

    let successCount = 0
    let failCount = 0

    // 배치 처리 (100개씩)
    const batchSize = 100
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)

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

    await updateSyncLog(syncLogId, {
      status: 'COMPLETED',
      totalCount: items.length,
      successCount,
      failCount,
    })

    return {
      success: true,
      syncLogId,
      totalCount: items.length,
      successCount,
      failCount,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 에러'

    await updateSyncLog(syncLogId, {
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

// 전체 동기화 (종목 + 시세)
export async function syncAll(): Promise<{
  stockList: SyncResult
  stockPrices: SyncResult
}> {
  // 종목 목록 먼저 동기화
  const stockListResult = await syncStockList()

  // 시세 동기화
  const stockPricesResult = await syncStockPrices()

  return {
    stockList: stockListResult,
    stockPrices: stockPricesResult,
  }
}
