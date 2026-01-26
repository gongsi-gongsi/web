# 01. Supabase + Prisma 설정 및 종목 정보 구현

## 개요

DailyStock 서비스의 데이터 레이어 구현 가이드입니다. Supabase PostgreSQL을 데이터베이스로 사용하고, Prisma를 ORM으로 활용하여 종목 정보를 저장하고 조회하는 기능을 구현합니다.

---

## 1. 패키지 설치

```bash
# web 앱에 Prisma 및 TanStack Query 추가
pnpm --filter web add @prisma/client @tanstack/react-query @tanstack/react-query-devtools

# web 앱에 Prisma CLI를 dev dependency로 추가
pnpm --filter web add -D prisma tsx
```

---

## 2. 폴더 구조 (FSD 아키텍처)

```
apps/web/
├── prisma/
│   ├── schema.prisma             # Prisma 스키마 정의
│   └── seed.ts                   # 시드 데이터
├── app/
│   ├── providers.tsx             # QueryClient Provider
│   └── layout.tsx
├── entities/
│   └── stock/
│       ├── api/
│       │   └── get-stocks.ts     # Prisma 기반 fetch 함수
│       ├── model/
│       │   └── use-stocks.ts     # TanStack Query 훅
│       ├── types/
│       │   └── index.ts          # Stock 타입 정의
│       └── index.ts              # barrel export
└── shared/
    ├── lib/
    │   └── prisma/
    │       ├── index.ts          # Prisma 클라이언트 싱글톤
    │       ├── errors.ts         # Prisma 에러 핸들링 유틸
    │       └── types.ts          # Prisma 관련 타입
    └── config/
        └── env.ts                # 환경변수 타입 안전하게
```

---

## 3. 환경변수 설정

### 파일: `apps/web/.env.local`

```bash
# Supabase PostgreSQL 연결 문자열
# Supabase 대시보드 > Settings > Database > Connection string (URI) 에서 복사

# Transaction Mode (포트 6543) - 일반 쿼리용
# PgBouncer를 통한 connection pooling 사용
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10"

# Session Mode (포트 5432) - 마이그레이션, 스키마 변경용
# PgBouncer를 우회하여 직접 연결
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# 환경 설정
NODE_ENV="development"
```

### 파일: `apps/web/.env.example`

```bash
# Supabase PostgreSQL 연결 (Transaction Mode - 포트 6543)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10"

# Supabase PostgreSQL 직접 연결 (Session Mode - 포트 5432)
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

NODE_ENV="development"
```

### Connection Pooling 참고사항

| 연결 방식        | 포트 | 용도                              | PgBouncer |
| ---------------- | ---- | --------------------------------- | --------- |
| Transaction Mode | 6543 | 일반 쿼리, API 호출               | 사용      |
| Session Mode     | 5432 | 마이그레이션, Prepared Statements | 미사용    |

- **connection_limit**: 동시 연결 수 제한 (서버리스 환경에서 중요)
- **pgbouncer=true**: PgBouncer 호환 모드 활성화

---

## 4. Prisma 스키마 설정

### 파일: `apps/web/prisma/schema.prisma`

```prisma
generator client {
  provider        = "prisma-client-js"
  // Vercel 등 서버리스 환경을 위한 바이너리 타겟
  binaryTargets   = ["native", "rhel-openssl-3.0.x"]
  // 미리보기 기능 (필요시 활성화)
  // previewFeatures = ["fullTextSearch"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ==================== Enums ====================

enum Market {
  KOSPI
  KOSDAQ
}

// ==================== Models ====================

model Stock {
  id        String   @id @default(uuid()) @db.Uuid
  symbol    String   @unique @db.VarChar(10)   // 종목 코드 (예: 005930)
  name      String   @db.VarChar(100)          // 종목명 (예: 삼성전자)
  market    Market                              // 시장 구분
  sector    String?  @db.VarChar(50)           // 업종 (예: 전기전자)
  isActive  Boolean  @default(true) @map("is_active")  // 상장 여부
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // 인덱스 설정
  @@index([symbol])
  @@index([market])
  @@index([name])
  @@index([isActive, market])  // 복합 인덱스

  // 테이블명 매핑 (snake_case)
  @@map("stocks")
}
```

### Prisma 스키마 규칙

- **테이블명**: `@@map("snake_case")` 사용하여 PostgreSQL 컨벤션 준수
- **컬럼명**: `@map("snake_case")` 사용 (createdAt → created_at)
- **UUID**: `@default(uuid()) @db.Uuid` 사용
- **인덱스**: 자주 조회하는 필드에 `@@index` 추가
- **Enum**: 데이터베이스 레벨 제약조건 활용

---

## 5. Prisma 클라이언트 설정

### 파일: `shared/lib/prisma/index.ts`

```typescript
import { PrismaClient } from '@prisma/client'

// 로깅 레벨 타입 정의
type LogLevel = 'query' | 'info' | 'warn' | 'error'

// 환경별 로깅 설정
const getLogLevels = (): LogLevel[] => {
  if (process.env.NODE_ENV === 'development') {
    return ['query', 'error', 'warn']
  }
  return ['error']
}

// Prisma 클라이언트 생성 함수
function createPrismaClient() {
  return new PrismaClient({
    log: getLogLevels().map(level => ({
      emit: 'stdout',
      level,
    })),
    // 에러 포맷팅
    errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
  })
}

// 전역 싱글톤 패턴 (개발 환경 Hot Reload 대응)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// 타입 재export
export type { PrismaClient } from '@prisma/client'
```

### 파일: `shared/lib/prisma/errors.ts`

```typescript
import { Prisma } from '@prisma/client'

// Prisma 에러 코드 상수
export const PRISMA_ERROR_CODES = {
  UNIQUE_CONSTRAINT: 'P2002',
  FOREIGN_KEY_CONSTRAINT: 'P2003',
  RECORD_NOT_FOUND: 'P2025',
  CONNECTION_ERROR: 'P1001',
  TIMEOUT: 'P1008',
} as const

// 사용자 친화적 에러 메시지 매핑
const ERROR_MESSAGES: Record<string, string> = {
  P2002: '이미 존재하는 데이터입니다.',
  P2003: '참조하는 데이터가 존재하지 않습니다.',
  P2025: '요청한 데이터를 찾을 수 없습니다.',
  P1001: '데이터베이스 연결에 실패했습니다.',
  P1008: '요청 시간이 초과되었습니다.',
}

// 에러 타입 가드
export function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError
}

export function isPrismaValidationError(
  error: unknown
): error is Prisma.PrismaClientValidationError {
  return error instanceof Prisma.PrismaClientValidationError
}

// 에러 메시지 변환
export function getPrismaErrorMessage(error: unknown): string {
  if (isPrismaError(error)) {
    return ERROR_MESSAGES[error.code] ?? '데이터베이스 오류가 발생했습니다.'
  }
  if (isPrismaValidationError(error)) {
    return '잘못된 데이터 형식입니다.'
  }
  if (error instanceof Error) {
    return error.message
  }
  return '알 수 없는 오류가 발생했습니다.'
}

// Unique constraint 위반 필드 추출
export function getUniqueConstraintField(
  error: Prisma.PrismaClientKnownRequestError
): string | null {
  if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT) {
    const target = error.meta?.target as string[] | undefined
    return target?.[0] ?? null
  }
  return null
}
```

### 파일: `shared/lib/prisma/types.ts`

```typescript
import type { Prisma } from '@prisma/client'

// 공통 페이지네이션 파라미터
export interface PaginationParams {
  limit?: number
  offset?: number
}

// 정렬 파라미터
export interface SortParams<T extends string = string> {
  sortBy?: T
  sortOrder?: 'asc' | 'desc'
}

// 트랜잭션 클라이언트 타입
export type TransactionClient = Prisma.TransactionClient

// 공통 응답 타입
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}
```

---

## 6. 타입 정의

### 파일: `entities/stock/types/index.ts`

```typescript
import type { Stock as PrismaStock, Market as PrismaMarket } from '@prisma/client'

// Prisma 타입 재사용
export type Stock = PrismaStock
export type Market = PrismaMarket

// API 파라미터 타입
export interface StockListParams {
  market?: Market
  sector?: string
  limit?: number
  offset?: number
}

// 종목 생성 입력 타입
export interface CreateStockInput {
  symbol: string
  name: string
  market: Market
  sector?: string
}

// 종목 수정 입력 타입
export interface UpdateStockInput {
  name?: string
  market?: Market
  sector?: string | null
  isActive?: boolean
}

// 종목 검색 결과 타입
export interface StockSearchResult {
  stocks: Stock[]
  query: string
  total: number
}
```

---

## 7. API 함수

### 파일: `entities/stock/api/get-stocks.ts`

```typescript
'use server'

import { prisma } from '@/shared/lib/prisma'
import { getPrismaErrorMessage, isPrismaError } from '@/shared/lib/prisma/errors'
import type { PaginatedResponse } from '@/shared/lib/prisma/types'
import type { StockListParams, Stock } from '../types'

// 타입 안전한 결과 타입
interface ActionResult<T> {
  success: true
  data: T
} | {
  success: false
  error: string
}

// 종목 목록 조회 (페이지네이션 포함)
export async function getStocks(
  params?: StockListParams
): Promise<ActionResult<PaginatedResponse<Stock>>> {
  try {
    const { market, sector, limit = 50, offset = 0 } = params ?? {}

    const where = {
      isActive: true,
      ...(market && { market }),
      ...(sector && { sector }),
    }

    // 병렬로 데이터와 총 개수 조회
    const [stocks, total] = await Promise.all([
      prisma.stock.findMany({
        where,
        orderBy: { name: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.stock.count({ where }),
    ])

    return {
      success: true,
      data: {
        data: stocks,
        total,
        limit,
        offset,
        hasMore: offset + stocks.length < total,
      },
    }
  } catch (error) {
    console.error('[getStocks] Error:', error)
    return {
      success: false,
      error: getPrismaErrorMessage(error),
    }
  }
}

// 단일 종목 조회
export async function getStockBySymbol(
  symbol: string
): Promise<ActionResult<Stock | null>> {
  try {
    const stock = await prisma.stock.findUnique({
      where: { symbol },
    })

    return { success: true, data: stock }
  } catch (error) {
    console.error('[getStockBySymbol] Error:', error)
    return {
      success: false,
      error: getPrismaErrorMessage(error),
    }
  }
}

// 종목 검색
export async function searchStocks(
  query: string
): Promise<ActionResult<Stock[]>> {
  try {
    if (query.length < 2) {
      return { success: true, data: [] }
    }

    const stocks = await prisma.stock.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { symbol: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
      take: 20,
    })

    return { success: true, data: stocks }
  } catch (error) {
    console.error('[searchStocks] Error:', error)
    return {
      success: false,
      error: getPrismaErrorMessage(error),
    }
  }
}
```

---

## 8. TanStack Query 훅

### 파일: `entities/stock/model/use-stocks.ts`

```typescript
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getStocks, getStockBySymbol, searchStocks } from '../api/get-stocks'
import type { StockListParams } from '../types'

// Query Key Factory 패턴
export const stockKeys = {
  all: ['stocks'] as const,
  lists: () => [...stockKeys.all, 'list'] as const,
  list: (params?: StockListParams) => [...stockKeys.lists(), params] as const,
  details: () => [...stockKeys.all, 'detail'] as const,
  detail: (symbol: string) => [...stockKeys.details(), symbol] as const,
  search: (query: string) => [...stockKeys.all, 'search', query] as const,
}

// 종목 목록 훅
export function useStocks(params?: StockListParams) {
  return useQuery({
    queryKey: stockKeys.list(params),
    queryFn: async () => {
      const result = await getStocks(params)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    // 페이지네이션 시 이전 데이터 유지
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// 단일 종목 훅
export function useStock(symbol: string) {
  return useQuery({
    queryKey: stockKeys.detail(symbol),
    queryFn: async () => {
      const result = await getStockBySymbol(symbol)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// 종목 검색 훅
export function useStockSearch(query: string) {
  return useQuery({
    queryKey: stockKeys.search(query),
    queryFn: async () => {
      const result = await searchStocks(query)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000, // 30초
  })
}
```

---

## 9. Barrel Export

### 파일: `entities/stock/index.ts`

```typescript
// API (Server Actions)
export { getStocks, getStockBySymbol, searchStocks } from './api/get-stocks'

// Hooks
export { useStocks, useStock, useStockSearch, stockKeys } from './model/use-stocks'

// Types
export type { Stock, StockListParams, Market } from './types'
```

### 파일: `shared/lib/prisma/index.ts` (export 추가)

```typescript
// 기존 export
export { prisma } from './client'

// 에러 핸들링 유틸
export {
  isPrismaError,
  isPrismaValidationError,
  getPrismaErrorMessage,
  getUniqueConstraintField,
  PRISMA_ERROR_CODES,
} from './errors'

// 타입
export type { PaginationParams, SortParams, TransactionClient, PaginatedResponse } from './types'
```

---

## 10. QueryClient Provider 설정

### 파일: `app/providers.tsx`

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### 파일: `app/layout.tsx` (수정)

```typescript
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

---

## 11. Prisma 명령어

### 초기 설정

```bash
# apps/web 디렉토리에서 실행
cd apps/web

# 1. Prisma 초기화 (최초 1회)
pnpm prisma init

# 2. Prisma 클라이언트 생성
pnpm prisma generate

# 3. 개발 환경: 스키마를 DB에 직접 푸시 (마이그레이션 없이)
pnpm prisma db push

# 4. 프로덕션 환경: 마이그레이션 생성 및 적용
pnpm prisma migrate dev --name init

# 5. 프로덕션 배포: 마이그레이션만 적용
pnpm prisma migrate deploy
```

### package.json 스크립트 추가

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:migrate": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:reset": "prisma migrate reset",
    "prisma:seed": "prisma db seed",
    "postinstall": "prisma generate"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### Prisma 명령어 참고

| 명령어                  | 용도                                 | 환경          |
| ----------------------- | ------------------------------------ | ------------- |
| `prisma generate`       | 클라이언트 타입 생성                 | 개발/프로덕션 |
| `prisma db push`        | 스키마 직접 푸시 (마이그레이션 없음) | 개발          |
| `prisma migrate dev`    | 마이그레이션 생성 + 적용             | 개발          |
| `prisma migrate deploy` | 마이그레이션만 적용                  | 프로덕션      |
| `prisma migrate reset`  | DB 초기화 + 마이그레이션 재적용      | 개발          |
| `prisma studio`         | DB GUI 실행                          | 개발          |
| `prisma db seed`        | 시드 데이터 삽입                     | 개발          |

---

## 12. 트랜잭션 사용 예시

### 파일: `entities/stock/api/mutations.ts`

```typescript
'use server'

import { prisma } from '@/shared/lib/prisma'
import { getPrismaErrorMessage, isPrismaError, PRISMA_ERROR_CODES } from '@/shared/lib/prisma/errors'
import type { Market } from '../types'

interface CreateStockInput {
  symbol: string
  name: string
  market: Market
  sector?: string
}

interface ActionResult<T> {
  success: true
  data: T
} | {
  success: false
  error: string
  code?: string
}

// 종목 생성
export async function createStock(
  input: CreateStockInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const stock = await prisma.stock.create({
      data: input,
      select: { id: true },
    })

    return { success: true, data: stock }
  } catch (error) {
    if (isPrismaError(error) && error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT) {
      return {
        success: false,
        error: '이미 등록된 종목 코드입니다.',
        code: 'DUPLICATE_SYMBOL',
      }
    }
    return {
      success: false,
      error: getPrismaErrorMessage(error),
    }
  }
}

// 트랜잭션 예시: 여러 종목 일괄 등록
export async function createStocksBatch(
  inputs: CreateStockInput[]
): Promise<ActionResult<{ count: number }>> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      let count = 0

      for (const input of inputs) {
        await tx.stock.upsert({
          where: { symbol: input.symbol },
          update: {
            name: input.name,
            market: input.market,
            sector: input.sector,
          },
          create: input,
        })
        count++
      }

      return { count }
    }, {
      // 트랜잭션 타임아웃 설정 (ms)
      timeout: 30000,
      // 격리 수준 (선택사항)
      isolationLevel: 'ReadCommitted',
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('[createStocksBatch] Transaction failed:', error)
    return {
      success: false,
      error: getPrismaErrorMessage(error),
    }
  }
}

// 종목 삭제 (soft delete)
export async function deleteStock(
  symbol: string
): Promise<ActionResult<void>> {
  try {
    await prisma.stock.update({
      where: { symbol },
      data: { isActive: false },
    })

    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: getPrismaErrorMessage(error),
    }
  }
}
```

---

## 13. Supabase RLS 설정 (선택사항)

Prisma 사용 시에도 Supabase RLS를 활용할 수 있습니다. 단, Prisma는 Service Role Key를 사용하므로 RLS를 우회합니다.

RLS를 적용하려면 Supabase 대시보드에서 설정:

```sql
-- RLS 활성화
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 읽기 허용
CREATE POLICY "Public read access" ON stocks
  FOR SELECT USING (true);
```

---

## 14. 사용 예시

### 컴포넌트에서 사용

```typescript
'use client'

import { useStocks, useStockSearch } from '@/entities/stock'
import { useState } from 'react'

export function StockList() {
  const { data: stocks, isLoading, error } = useStocks({ market: 'KOSPI' })

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러: {error.message}</div>

  return (
    <ul>
      {stocks?.map((stock) => (
        <li key={stock.id}>
          {stock.name} ({stock.symbol})
        </li>
      ))}
    </ul>
  )
}

export function StockSearchInput() {
  const [query, setQuery] = useState('')
  const { data: results } = useStockSearch(query)

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="종목명 또는 코드 검색"
      />
      {results?.map((stock) => (
        <div key={stock.id}>{stock.name}</div>
      ))}
    </div>
  )
}
```

### Server Action에서 사용

```typescript
'use server'

import { createStock } from '@/entities/stock'

export async function handleCreateStock(formData: FormData) {
  const result = await createStock({
    symbol: formData.get('symbol') as string,
    name: formData.get('name') as string,
    market: formData.get('market') as 'KOSPI' | 'KOSDAQ',
    sector: formData.get('sector') as string | undefined,
  })

  if (!result.success) {
    return { error: result.error }
  }

  return { data: result.data }
}
```

---

## 15. 종목 데이터 시딩

### 파일: `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleStocks = [
  { symbol: '005930', name: '삼성전자', market: 'KOSPI' as const, sector: '전기전자' },
  { symbol: '000660', name: 'SK하이닉스', market: 'KOSPI' as const, sector: '전기전자' },
  { symbol: '035420', name: 'NAVER', market: 'KOSPI' as const, sector: '서비스업' },
  { symbol: '035720', name: '카카오', market: 'KOSPI' as const, sector: '서비스업' },
  { symbol: '068270', name: '셀트리온', market: 'KOSPI' as const, sector: '의약품' },
]

async function main() {
  console.log('Seeding stocks...')

  for (const stock of sampleStocks) {
    await prisma.stock.upsert({
      where: { symbol: stock.symbol },
      update: stock,
      create: stock,
    })
  }

  console.log('Seeding completed.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### package.json에 시드 스크립트 추가

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### 시드 실행

```bash
pnpm --filter web add -D tsx
pnpm --filter web prisma db seed
```

---

## 체크리스트

- [ ] Supabase 프로젝트 생성
- [ ] 환경변수 설정 (.env.local에 DATABASE_URL, DIRECT_URL)
- [ ] 패키지 설치 (prisma, @prisma/client, @tanstack/react-query)
- [ ] Prisma 스키마 작성 (prisma/schema.prisma)
- [ ] Prisma 클라이언트 생성 (prisma generate)
- [ ] 데이터베이스 마이그레이션 (prisma db push 또는 migrate)
- [ ] shared/lib/prisma 클라이언트 구현
- [ ] entities/stock 구조 생성
- [ ] QueryClient Provider 설정
- [ ] 종목 데이터 시딩

---

## 참고 자료

- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Prisma + Supabase 가이드](https://www.prisma.io/docs/guides/database/supabase)
- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [KRX 정보데이터시스템](http://data.krx.co.kr)
