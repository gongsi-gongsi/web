'use server'

import { prisma } from '@/shared/lib/prisma'
import {
  getAllKrxStocks,
  getAllStockPrices,
  getKrxStockItems,
  getCompanyByCrno,
} from '@/shared/lib/public-data'
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

// 종목 코드 정규화 (A prefix 제거)
function normalizeSymbol(symbol: string): string {
  return symbol.startsWith('A') ? symbol.slice(1) : symbol
}

// API에서 최신 데이터 날짜 조회
async function getLatestDataDate(): Promise<string> {
  const items = await getKrxStockItems({ numOfRows: 1 })
  if (items.length === 0) {
    throw new Error('API에서 데이터를 가져올 수 없습니다.')
  }
  return items[0].basDt
}

// 설립일자 파싱 (YYYYMMDD -> Date)
function parseFoundedDate(dateStr?: string): Date | null {
  if (!dateStr || dateStr.length !== 8) return null
  try {
    const year = parseInt(dateStr.slice(0, 4), 10)
    const month = parseInt(dateStr.slice(4, 6), 10)
    const day = parseInt(dateStr.slice(6, 8), 10)
    if (year < 1800 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
      return null
    }
    return new Date(`${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`)
  } catch {
    return null
  }
}

// 딜레이 함수
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
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
export async function syncStockList(basDt?: string): Promise<SyncResult> {
  const syncLogId = await createSyncLog('STOCK_LIST')

  try {
    // 기준일 결정 (전달받지 않으면 API에서 최신 날짜 조회)
    const targetDate = basDt ?? (await getLatestDataDate())

    // 공공데이터 API에서 전체 종목 조회 (기준일 기준)
    const items = await getAllKrxStocks({ basDt: targetDate })

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
            const symbol = normalizeSymbol(item.srtnCd)
            await tx.stock.upsert({
              where: { symbol },
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
                symbol,
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
export async function syncStockPrices(basDt?: string): Promise<SyncResult> {
  const syncLogId = await createSyncLog('STOCK_PRICE')

  try {
    // 기준일 결정 (전달받지 않으면 API에서 최신 날짜 조회)
    const targetDate = basDt ?? (await getLatestDataDate())

    // 공공데이터 API에서 전체 시세 조회
    const items = await getAllStockPrices({ basDt: targetDate })

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

// 기업기본정보 동기화
export async function syncCompanyInfo(): Promise<SyncResult> {
  const syncLogId = await createSyncLog('COMPANY_INFO')

  try {
    // crno가 있고 sector가 없는 종목 조회
    const stocksWithCrno = await prisma.stock.findMany({
      where: {
        crno: { not: null },
        sector: null,
      },
      select: { id: true, symbol: true, crno: true, name: true },
    })

    if (stocksWithCrno.length === 0) {
      await updateSyncLog(syncLogId, {
        status: 'COMPLETED',
        totalCount: 0,
        successCount: 0,
        failCount: 0,
      })
      return { success: true, syncLogId, totalCount: 0, successCount: 0, failCount: 0 }
    }

    let successCount = 0
    let failCount = 0

    // 배치 처리 (10개씩, API 호출 제한 고려)
    const batchSize = 10
    for (let i = 0; i < stocksWithCrno.length; i += batchSize) {
      const batch = stocksWithCrno.slice(i, i + batchSize)

      // 병렬로 API 호출
      const results = await Promise.all(
        batch.map(async stock => {
          try {
            const companyInfo = await getCompanyByCrno(stock.crno!)
            return { stock, companyInfo }
          } catch {
            return { stock, companyInfo: null }
          }
        })
      )

      // DB 업데이트 (트랜잭션)
      await prisma.$transaction(async tx => {
        for (const { stock, companyInfo } of results) {
          if (companyInfo) {
            try {
              await tx.stock.update({
                where: { id: stock.id },
                data: {
                  sector: companyInfo.sicNm || null,
                  nameEn: companyInfo.corpEnsnNm || null,
                  ceoName: companyInfo.enpRprFnm || null,
                  address: companyInfo.enpBsadr || null,
                  homepage: companyInfo.enpHmpgUrl || null,
                  phone: companyInfo.enpTlno || null,
                  foundedAt: parseFoundedDate(companyInfo.enpEstbDt),
                  syncedAt: new Date(),
                },
              })
              successCount++
            } catch {
              failCount++
            }
          } else {
            failCount++
          }
        }
      })

      // API 호출 제한 방지
      await delay(100)
    }

    await updateSyncLog(syncLogId, {
      status: 'COMPLETED',
      totalCount: stocksWithCrno.length,
      successCount,
      failCount,
    })

    return {
      success: true,
      syncLogId,
      totalCount: stocksWithCrno.length,
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

// 전체 동기화 (종목 + 시세 + 기업정보)
export async function syncAll(): Promise<{
  stockList: SyncResult
  stockPrices: SyncResult
  companyInfo: SyncResult
}> {
  // API에서 최신 데이터 날짜 조회
  const basDt = await getLatestDataDate()

  // 종목 목록 먼저 동기화
  const stockListResult = await syncStockList(basDt)

  // 시세 동기화 (종목 목록 동기화 성공 시에만)
  let stockPricesResult: SyncResult
  if (stockListResult.success) {
    stockPricesResult = await syncStockPrices(basDt)
  } else {
    stockPricesResult = {
      success: false,
      syncLogId: '',
      totalCount: 0,
      successCount: 0,
      failCount: 0,
      error: '종목 목록 동기화 실패로 시세 동기화 건너뜀',
    }
  }

  // 기업기본정보 동기화 (종목 목록 동기화 성공 시에만)
  let companyInfoResult: SyncResult
  if (stockListResult.success) {
    companyInfoResult = await syncCompanyInfo()
  } else {
    companyInfoResult = {
      success: false,
      syncLogId: '',
      totalCount: 0,
      successCount: 0,
      failCount: 0,
      error: '종목 목록 동기화 실패로 기업정보 동기화 건너뜀',
    }
  }

  return {
    stockList: stockListResult,
    stockPrices: stockPricesResult,
    companyInfo: companyInfoResult,
  }
}
