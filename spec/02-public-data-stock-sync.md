# 02. 공공데이터포털 API 연동 및 종목 데이터 동기화

## 개요

공공데이터포털(data.go.kr)의 금융위원회 API를 활용하여 KRX 상장 종목 정보와 시세 데이터를 수집하고 DB에 동기화합니다.

### 사용 API

| API명                                                              | 용도                        | 갱신 주기           |
| ------------------------------------------------------------------ | --------------------------- | ------------------- |
| [KRX상장종목정보](https://www.data.go.kr/data/15094775/openapi.do) | 종목코드, 종목명, 시장구분  | 일 1회              |
| [주식시세정보](https://www.data.go.kr/data/15094808/openapi.do)    | 전일 종가, 거래량, 시가총액 | 영업일 D+1 오후 1시 |
| [기업기본정보](https://www.data.go.kr/data/15043184/openapi.do)    | 업종, 대표자, 설립일        | 비정기              |

### 데이터 흐름

```
공공데이터포털 API → API Client → Sync Service → Prisma → Supabase PostgreSQL
```

---

## 1. 환경변수 설정

### 파일: `apps/web/.env.local` (추가)

```bash
# 공공데이터포털 API 인증키 (data.go.kr에서 발급)
PUBLIC_DATA_API_KEY="YOUR_SERVICE_KEY"
```

### 파일: `apps/web/.env.example` (추가)

```bash
# 공공데이터포털 API 인증키
# https://www.data.go.kr 에서 회원가입 후 API 활용신청하여 발급
PUBLIC_DATA_API_KEY="YOUR_SERVICE_KEY"
```

---

## 2. 폴더 구조

```
apps/web/
├── shared/
│   └── lib/
│       └── public-data/              # 공공데이터포털 API 클라이언트
│           ├── index.ts              # barrel export
│           ├── client.ts             # HTTP 클라이언트
│           ├── types.ts              # API 응답 타입
│           └── apis/
│               ├── stock-info.ts     # KRX상장종목정보 API
│               ├── stock-price.ts    # 주식시세정보 API
│               └── company-info.ts   # 기업기본정보 API
├── features/
│   └── stock-sync/                   # 종목 동기화 기능
│       ├── index.ts
│       ├── api/
│       │   └── sync-stocks.ts        # 동기화 Server Action
│       ├── model/
│       │   └── use-stock-sync.ts     # 동기화 상태 훅
│       └── types/
│           └── index.ts
└── app/
    └── api/
        └── cron/
            └── sync-stocks/
                └── route.ts          # Vercel Cron Job 엔드포인트
```

---

## 3. Prisma 스키마 확장

### 파일: `apps/web/prisma/schema.prisma` (수정)

```prisma
// 기존 Stock 모델 확장
model Stock {
  id        String   @id @default(uuid()) @db.Uuid
  symbol    String   @unique @db.VarChar(10)   // 종목 코드 (예: 005930)
  isinCode  String?  @unique @map("isin_code") @db.VarChar(12) // ISIN 코드
  name      String   @db.VarChar(100)          // 종목명
  market    Market                              // 시장 구분
  sector    String?  @db.VarChar(50)           // 업종
  isActive  Boolean  @default(true) @map("is_active")

  // 로고 (추후 구현)
  logoUrl   String?  @map("logo_url")          // 로고 이미지 URL
  domain    String?  @db.VarChar(100)          // 기업 도메인 (Logo API 연동용)

  // 시세 정보 (전일 기준)
  prevClose     Int?       @map("prev_close")      // 전일 종가
  prevOpen      Int?       @map("prev_open")       // 전일 시가
  prevHigh      Int?       @map("prev_high")       // 전일 고가
  prevLow       Int?       @map("prev_low")        // 전일 저가
  prevVolume    BigInt?    @map("prev_volume")     // 전일 거래량
  marketCap     BigInt?    @map("market_cap")      // 시가총액
  listedShares  BigInt?    @map("listed_shares")   // 상장주식수
  priceDate     DateTime?  @map("price_date")      // 시세 기준일

  // 동기화 메타데이터
  syncedAt  DateTime? @map("synced_at")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  @@index([symbol])
  @@index([market])
  @@index([name])
  @@index([isActive, market])
  @@map("stocks")
}

// 동기화 이력 테이블
model SyncLog {
  id          String    @id @default(uuid()) @db.Uuid
  type        SyncType                          // 동기화 유형
  status      SyncStatus                        // 상태
  totalCount  Int       @default(0) @map("total_count")
  successCount Int      @default(0) @map("success_count")
  failCount   Int       @default(0) @map("fail_count")
  errorMessage String?  @map("error_message") @db.Text
  startedAt   DateTime  @default(now()) @map("started_at")
  completedAt DateTime? @map("completed_at")

  @@index([type, status])
  @@index([startedAt])
  @@map("sync_logs")
}

enum SyncType {
  STOCK_LIST    // 종목 목록 동기화
  STOCK_PRICE   // 시세 동기화
  COMPANY_INFO  // 기업 정보 동기화
}

enum SyncStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
}
```

---

## 4. 공공데이터포털 API 클라이언트

### 파일: `shared/lib/public-data/types.ts`

```typescript
// 공통 API 응답 구조
export interface PublicDataResponse<T> {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: {
      numOfRows: number
      pageNo: number
      totalCount: number
      items: {
        item: T[]
      }
    }
  }
}

// KRX 상장종목정보 응답
export interface KrxStockItem {
  basDt: string // 기준일자 (YYYYMMDD)
  srtnCd: string // 단축코드 (6자리)
  isinCd: string // ISIN코드 (12자리)
  mrktCtg: string // 시장구분 (KOSPI/KOSDAQ/KONEX)
  itmsNm: string // 종목명
  crno: string // 법인등록번호
  corpNm: string // 법인명
}

// 주식시세정보 응답
export interface StockPriceItem {
  basDt: string // 기준일자
  srtnCd: string // 단축코드
  isinCd: string // ISIN코드
  itmsNm: string // 종목명
  mrktCtg: string // 시장구분
  clpr: string // 종가
  mkp: string // 시가
  hipr: string // 고가
  lopr: string // 저가
  trqu: string // 거래량
  trPrc: string // 거래대금
  lstgStCnt: string // 상장주식수
  mrktTotAmt: string // 시가총액
  vs: string // 대비
  fltRt: string // 등락률
}

// 기업기본정보 응답
export interface CompanyInfoItem {
  crno: string // 법인등록번호
  corpNm: string // 법인명
  corpEnsnNm: string // 법인영문명
  enpRprFnm: string // 대표자명
  enpBsadr: string // 기업주소
  enpHmpgUrl: string // 홈페이지URL
  enpTlno: string // 전화번호
  sicNm: string // 표준산업분류명
  enpEstbDt: string // 설립일자
}

// API 요청 파라미터
export interface StockListParams {
  basDt?: string // 기준일자 (YYYYMMDD)
  mrktCtg?: 'KOSPI' | 'KOSDAQ' | 'KONEX'
  pageNo?: number
  numOfRows?: number
}

export interface StockPriceParams {
  basDt?: string // 기준일자 (YYYYMMDD)
  srtnCd?: string // 단축코드
  mrktCtg?: 'KOSPI' | 'KOSDAQ'
  pageNo?: number
  numOfRows?: number
}
```

### 파일: `shared/lib/public-data/client.ts`

```typescript
import type { PublicDataResponse } from './types'

const BASE_URL = 'https://apis.data.go.kr/1160100/service'

function getApiKey(): string {
  const apiKey = process.env.PUBLIC_DATA_API_KEY
  if (!apiKey) {
    throw new Error('PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.')
  }
  return apiKey
}

export async function fetchPublicData<T>(
  endpoint: string,
  params: Record<string, string | number | undefined>
): Promise<PublicDataResponse<T>> {
  const apiKey = getApiKey()

  const searchParams = new URLSearchParams({
    serviceKey: apiKey,
    resultType: 'json',
  })

  // undefined가 아닌 파라미터만 추가
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value))
    }
  })

  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    // 캐시 비활성화 (항상 최신 데이터)
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`공공데이터 API 요청 실패: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  // API 에러 응답 처리
  if (data.response?.header?.resultCode !== '00') {
    throw new Error(`공공데이터 API 에러: ${data.response?.header?.resultMsg ?? '알 수 없는 에러'}`)
  }

  return data
}

// 페이지네이션 헬퍼 - 전체 데이터 조회
export async function fetchAllPages<T>(
  endpoint: string,
  params: Record<string, string | number | undefined>,
  options?: { maxPages?: number; rowsPerPage?: number }
): Promise<T[]> {
  const { maxPages = 100, rowsPerPage = 1000 } = options ?? {}
  const allItems: T[] = []
  let pageNo = 1
  let hasMore = true

  while (hasMore && pageNo <= maxPages) {
    const response = await fetchPublicData<T>(endpoint, {
      ...params,
      pageNo,
      numOfRows: rowsPerPage,
    })

    const items = response.response.body.items?.item ?? []
    allItems.push(...items)

    const { totalCount, numOfRows } = response.response.body
    hasMore = pageNo * numOfRows < totalCount
    pageNo++

    // Rate limiting - 요청 간 딜레이
    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return allItems
}
```

### 파일: `shared/lib/public-data/apis/stock-info.ts`

```typescript
import { fetchAllPages, fetchPublicData } from '../client'
import type { KrxStockItem, StockListParams, PublicDataResponse } from '../types'

const ENDPOINT = '/GetKrxListedInfoService/getItemInfo'

// 단일 페이지 조회
export async function getKrxStockList(
  params?: StockListParams
): Promise<PublicDataResponse<KrxStockItem>> {
  return fetchPublicData<KrxStockItem>(ENDPOINT, {
    basDt: params?.basDt,
    mrktCtg: params?.mrktCtg,
    pageNo: params?.pageNo ?? 1,
    numOfRows: params?.numOfRows ?? 100,
  })
}

// 전체 종목 조회 (페이지네이션 자동 처리)
export async function getAllKrxStocks(
  params?: Omit<StockListParams, 'pageNo' | 'numOfRows'>
): Promise<KrxStockItem[]> {
  return fetchAllPages<KrxStockItem>(ENDPOINT, {
    basDt: params?.basDt,
    mrktCtg: params?.mrktCtg,
  })
}
```

### 파일: `shared/lib/public-data/apis/stock-price.ts`

```typescript
import { fetchAllPages, fetchPublicData } from '../client'
import type { StockPriceItem, StockPriceParams, PublicDataResponse } from '../types'

const ENDPOINT = '/GetStockSecuritiesInfoService/getStockPriceInfo'

// 단일 페이지 조회
export async function getStockPrices(
  params?: StockPriceParams
): Promise<PublicDataResponse<StockPriceItem>> {
  return fetchPublicData<StockPriceItem>(ENDPOINT, {
    basDt: params?.basDt,
    srtnCd: params?.srtnCd,
    mrktCtg: params?.mrktCtg,
    pageNo: params?.pageNo ?? 1,
    numOfRows: params?.numOfRows ?? 100,
  })
}

// 전체 시세 조회 (페이지네이션 자동 처리)
export async function getAllStockPrices(
  params?: Omit<StockPriceParams, 'pageNo' | 'numOfRows'>
): Promise<StockPriceItem[]> {
  return fetchAllPages<StockPriceItem>(ENDPOINT, {
    basDt: params?.basDt,
    srtnCd: params?.srtnCd,
    mrktCtg: params?.mrktCtg,
  })
}
```

### 파일: `shared/lib/public-data/index.ts`

```typescript
// Client
export { fetchPublicData, fetchAllPages } from './client'

// APIs
export { getKrxStockList, getAllKrxStocks } from './apis/stock-info'
export { getStockPrices, getAllStockPrices } from './apis/stock-price'

// Types
export type {
  PublicDataResponse,
  KrxStockItem,
  StockPriceItem,
  CompanyInfoItem,
  StockListParams,
  StockPriceParams,
} from './types'
```

---

## 5. 동기화 서비스 구현

### 파일: `features/stock-sync/api/sync-stocks.ts`

```typescript
'use server'

import { prisma } from '@/shared/lib/prisma'
import { getAllKrxStocks, getAllStockPrices } from '@/shared/lib/public-data'
import type { KrxStockItem, StockPriceItem } from '@/shared/lib/public-data'
import type { Market, SyncType, SyncStatus } from '@prisma/client'

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
                name: item.itmsNm,
                market,
                isActive: true,
                syncedAt: new Date(),
              },
              create: {
                symbol: item.srtnCd,
                isinCode: item.isinCd,
                name: item.itmsNm,
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
                marketCap: item.mrktTotAmt ? BigInt(item.mrktTotAmt) : null,
                listedShares: item.lstgStCnt ? BigInt(item.lstgStCnt) : null,
                priceDate: new Date(
                  `${item.basDt.slice(0, 4)}-${item.basDt.slice(4, 6)}-${item.basDt.slice(6, 8)}`
                ),
                syncedAt: new Date(),
              },
            })
            successCount++
          } catch (error) {
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
```

### 파일: `features/stock-sync/index.ts`

```typescript
export { syncStockList, syncStockPrices, syncAll } from './api/sync-stocks'
```

---

## 6. Cron Job 설정 (Vercel)

### 파일: `app/api/cron/sync-stocks/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { syncAll } from '@/features/stock-sync'

// Vercel Cron Job 인증
function isValidCronRequest(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // CRON_SECRET이 설정되어 있으면 검증
  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`
  }

  // 개발 환경에서는 허용
  return process.env.NODE_ENV === 'development'
}

export async function GET(request: Request) {
  // 인증 확인
  if (!isValidCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('[Cron] 종목 동기화 시작...')

    const result = await syncAll()

    console.log('[Cron] 종목 동기화 완료:', result)

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Cron] 종목 동기화 실패:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Vercel Cron 설정
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5분 타임아웃
```

### 파일: `vercel.json` (루트 디렉토리)

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-stocks",
      "schedule": "0 14 * * 1-5"
    }
  ]
}
```

> **스케줄 설명**: 매주 월~금 14:00 UTC (한국시간 23:00) 실행
>
> - 공공데이터는 영업일 D+1 오후 1시(KST)에 갱신
> - 여유를 두고 오후 11시에 동기화

---

## 7. 환경변수 추가

### 파일: `apps/web/.env.local` (최종)

```bash
# Supabase PostgreSQL
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# 공공데이터포털 API
PUBLIC_DATA_API_KEY="YOUR_SERVICE_KEY"

# Cron Job 인증 (선택사항)
CRON_SECRET="your-random-secret-string"

# 환경
NODE_ENV="development"
```

---

## 8. 수동 동기화 UI (선택사항)

### 파일: `app/admin/sync/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { syncStockList, syncStockPrices, syncAll } from '@/features/stock-sync'

export default function SyncPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>(null)

  const handleSync = async (type: 'list' | 'price' | 'all') => {
    setLoading(true)
    setResult(null)

    try {
      let syncResult
      switch (type) {
        case 'list':
          syncResult = await syncStockList()
          break
        case 'price':
          syncResult = await syncStockPrices()
          break
        case 'all':
          syncResult = await syncAll()
          break
      }
      setResult(syncResult)
    } catch (error) {
      setResult({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">종목 데이터 동기화</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleSync('list')}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          종목 목록 동기화
        </button>
        <button
          onClick={() => handleSync('price')}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          시세 동기화
        </button>
        <button
          onClick={() => handleSync('all')}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          전체 동기화
        </button>
      </div>

      {loading && <p>동기화 중...</p>}

      {result && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
```

---

## 9. 마이그레이션

### 스키마 변경 적용

```bash
cd apps/web

# 개발 환경: 스키마 직접 푸시
pnpm prisma db push

# 또는 마이그레이션 생성
pnpm prisma migrate dev --name add_stock_price_fields
```

---

## 체크리스트

### API 설정

- [ ] 공공데이터포털 회원가입
- [ ] KRX상장종목정보 API 활용신청
- [ ] 주식시세정보 API 활용신청
- [ ] API 인증키 발급 및 환경변수 설정

### 개발

- [ ] Prisma 스키마 확장 (시세 필드, 로고 필드, SyncLog)
- [ ] 공공데이터 API 클라이언트 구현
- [ ] 동기화 서비스 구현
- [ ] Cron Job 엔드포인트 구현
- [ ] 관리자 수동 동기화 UI (선택)

### 배포

- [ ] Vercel 환경변수 설정
- [ ] vercel.json cron 설정
- [ ] 프로덕션 마이그레이션

### 로고 (추후 구현)

- [ ] 시총 상위 종목 도메인 매핑 데이터 준비
- [ ] Logo API 연동 (Logo.dev 또는 대안)
- [ ] 플레이스홀더 컴포넌트 구현

---

## 10. 로고 구현 계획 (추후)

> 현재 단계에서는 `logoUrl`, `domain` 필드만 스키마에 추가하고, 실제 로고 연동은 추후 구현합니다.

### 스키마 필드

```prisma
model Stock {
  // ...
  logoUrl   String?  @map("logo_url")   // 로고 이미지 URL
  domain    String?  @db.VarChar(100)   // 기업 도메인 (Logo API 연동용)
}
```

### 향후 구현 방안

1. **도메인 매핑 데이터 준비**
   - 시가총액 상위 100~300개 종목의 도메인 수집
   - CSV/JSON 형태로 시드 데이터 준비

2. **Logo API 연동**
   - [Logo.dev](https://logo.dev) 또는 [Brandfetch](https://brandfetch.com) 활용
   - `domain` 필드 기반으로 로고 URL 동적 생성

3. **플레이스홀더**
   - 도메인 미등록 종목은 종목명 첫 글자로 플레이스홀더 생성
   - 예: 삼성전자 → "삼" 또는 "S"

### 프론트엔드 유틸 (예시)

```typescript
function getStockLogoUrl(stock: Stock): string {
  // 1순위: 직접 등록된 로고 URL
  if (stock.logoUrl) {
    return stock.logoUrl
  }

  // 2순위: 도메인 기반 Logo API
  if (stock.domain) {
    return `https://img.logo.dev/${stock.domain}?token=${LOGO_API_KEY}`
  }

  // 3순위: 플레이스홀더
  return `/api/placeholder?name=${encodeURIComponent(stock.name)}`
}
```

---

## 참고 자료

- [공공데이터포털](https://www.data.go.kr)
- [KRX상장종목정보 API](https://www.data.go.kr/data/15094775/openapi.do)
- [주식시세정보 API](https://www.data.go.kr/data/15094808/openapi.do)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Logo.dev](https://logo.dev) - 로고 API (추후 연동)
