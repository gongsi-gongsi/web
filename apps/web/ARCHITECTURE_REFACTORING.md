# 🏗️ 서버/클라이언트 API 분리 및 Prefetch 패턴 적용

> **작업 날짜**: 2026-02-06
> **브랜치**: `refactor/architecture-optimization`
> **커밋**: `3815604`

---

## 📋 목차

- [개요](#개요)
- [배경 및 문제점](#배경-및-문제점)
- [해결 방안](#해결-방안)
- [주요 변경사항](#주요-변경사항)
- [파일 구조](#파일-구조)
- [마이그레이션 가이드](#마이그레이션-가이드)
- [성능 개선 효과](#성능-개선-효과)
- [Breaking Changes](#breaking-changes)

---

## 🎯 개요

Next.js 15 App Router 환경에서 **서버 컴포넌트를 최대한 활용**하여 SEO와 FCP를 개선하고, **서버/클라이언트 코드를 명확히 분리**하여 번들 사이즈를 최적화하는 대규모 아키텍처 리팩토링 작업입니다.

### 핵심 목표

- ✅ 서버 컴포넌트에서 데이터를 prefetch하여 초기 HTML에 포함
- ✅ 서버 전용 코드(Prisma, DART API 키)가 클라이언트 번들에서 완전히 제외
- ✅ TanStack Query의 prefetch + hydration 패턴 적용
- ✅ API Route Handler 중복 코드 제거 및 간소화

---

## ❌ 배경 및 문제점

### 1. 서버/클라이언트 코드 혼재

```typescript
// ❌ 기존: 서버/클라이언트 구분 없음
// entities/disclosure/api/get-today-disclosures.ts
export async function getTodayDisclosures(market: Market) {
  const baseUrl = getBaseUrl() // 서버/클라이언트 모두에서 동작
  const response = await fetch(`${baseUrl}/api/disclosures/today?market=${market}`)
  return response.json()
}
```

**문제점:**

- 서버 컴포넌트에서도 API Route를 통해 우회 (불필요한 네트워크 홉)
- 서버 전용 코드와 클라이언트 코드가 같은 파일에 존재
- Prisma/pg 같은 서버 전용 라이브러리가 클라이언트 번들에 포함될 위험

### 2. Prefetch/Hydration 미활용

```typescript
// ❌ 기존: 클라이언트에서 데이터 페칭
export default function DisclosuresPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DisclosureList /> {/* 클라이언트에서 fetch 시작 */}
    </Suspense>
  )
}
```

**문제점:**

- 초기 HTML에 데이터가 없어 SEO 불리
- 클라이언트에서 JS 로드 후 데이터 페칭 시작 (느린 FCP)
- 서버 컴포넌트의 장점을 활용하지 못함

### 3. API Route Handler 중복 코드

```typescript
// ❌ 기존: 70+ lines의 중복 코드
export async function GET(request: NextRequest) {
  const dartUrl = new URL('https://opendart.fss.or.kr/api/list.json')
  dartUrl.searchParams.append('crtfc_key', getDartApiKey())
  dartUrl.searchParams.append('bgn_de', today)
  // ... 70+ lines of code
}
```

**문제점:**

- DART API 호출 로직이 Route Handler에 직접 구현됨
- 서버 컴포넌트에서 재사용 불가
- 유지보수 어려움

---

## ✅ 해결 방안

### 아키텍처 개선 방향

```
┌─────────────────────────────────────────────────────────┐
│                     서버 환경                              │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Server Component (RSC)          API Route Handler       │
│         │                              │                 │
│         │                              │                 │
│         ▼                              ▼                 │
│  ┌──────────────────────────────────────────────┐       │
│  │   entities/disclosure/server.ts              │       │
│  │                                               │       │
│  │   - getTodayDisclosuresFromDart()            │       │
│  │   - searchDisclosuresFromDart()              │       │
│  │   - prefetchTodayDisclosures()               │       │
│  └──────────────────────────────────────────────┘       │
│         │                                                │
│         ▼                                                │
│    DART API / Prisma                                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Prefetch + Hydration
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   클라이언트 환경                          │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Client Component                                        │
│         │                                                │
│         ▼                                                │
│  ┌──────────────────────────────────────────────┐       │
│  │   entities/disclosure/index.ts               │       │
│  │                                               │       │
│  │   - useTodayDisclosures()                    │       │
│  │   - useSearchDisclosures()                   │       │
│  └──────────────────────────────────────────────┘       │
│         │                                                │
│         ▼                                                │
│    API Route (필요 시에만)                                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 주요 변경사항

### 1. API 레이어 분리

#### Before

```
entities/disclosure/api/
└── get-today-disclosures.ts    # 서버/클라이언트 혼재
```

#### After

```
entities/disclosure/api/
├── server.ts                    # ✅ 서버 전용
├── client.ts                    # ✅ 클라이언트 전용
├── search-server.ts             # ✅ 서버 전용
├── search-disclosures.ts        # ✅ 클라이언트 전용
└── index.ts                     # 클라이언트 exports만
```

#### 코드 예시

**서버 전용 API (api/server.ts)**

```typescript
// 서버에서만 사용 - DART API 직접 호출
export async function getTodayDisclosuresFromDart(market: Market) {
  const dartUrl = new URL('https://opendart.fss.or.kr/api/list.json')
  dartUrl.searchParams.append('crtfc_key', getDartApiKey()) // 서버 환경변수
  dartUrl.searchParams.append('bgn_de', today)

  const response = await fetch(dartUrl.toString(), {
    next: { revalidate: 60, tags: ['disclosures', 'today', market] }
  })

  const data = await response.json()
  return { disclosures: data.list.map(formatDisclosure), ... }
}
```

**클라이언트 전용 API (api/client.ts)**

```typescript
'use client'

// 클라이언트에서만 사용 - API Route 호출
export async function getTodayDisclosures(market: Market) {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/disclosures/today?market=${market}`)
  return response.json()
}
```

### 2. Query 레이어 구조화

#### Before

```
entities/disclosure/model/
├── use-today-disclosures.ts       # 중복
├── use-infinite-today-disclosures.ts  # 중복
├── use-search-disclosures.ts      # 중복
└── use-popular-companies.ts       # 중복
```

#### After

```
entities/disclosure/queries/
├── prefetch.ts    # ✅ 서버 컴포넌트용 prefetch 함수
├── hooks.ts       # ✅ 클라이언트용 통합 hooks
└── index.ts
```

#### 코드 예시

**서버 Prefetch (queries/prefetch.ts)**

```typescript
// 서버 컴포넌트에서 사용
export async function prefetchTodayDisclosures(market: Market) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: queries.disclosures.today(market).queryKey,
    queryFn: () => getTodayDisclosuresFromDart(market), // 서버 API 직접 호출
    staleTime: 60000,
  })

  return dehydrate(queryClient) // 클라이언트로 전달할 상태
}
```

**클라이언트 Hooks (queries/hooks.ts)**

```typescript
'use client'

// 클라이언트 컴포넌트에서 사용
export function useTodayDisclosures(market: Market) {
  return useSuspenseQuery({
    queryKey: queries.disclosures.today(market).queryKey,
    queryFn: () => getTodayDisclosures(market), // 클라이언트 API 호출
    staleTime: 60000,
  })
}
```

### 3. 서버 전용 Exports 분리

#### Before

```typescript
// entities/disclosure/index.ts - 모든 것을 export
export { getTodayDisclosuresFromDart } from './api/server' // ❌ 위험!
export { useTodayDisclosures } from './queries/hooks'
```

#### After

```typescript
// entities/disclosure/index.ts - 클라이언트 안전
export { useTodayDisclosures } from './queries/hooks'
// 서버 함수는 export 하지 않음

// entities/disclosure/server.ts - 서버 전용
export { getTodayDisclosuresFromDart } from './api/server'
export { prefetchTodayDisclosures } from './queries/prefetch'
```

### 4. Prefetch + Hydration 패턴 적용

#### Before

```typescript
// ❌ 클라이언트에서 데이터 페칭
export default function DisclosuresPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DisclosureList /> {/* 클라이언트에서 fetch */}
    </Suspense>
  )
}
```

#### After

```typescript
// ✅ 서버에서 prefetch
export default async function DisclosuresPage({ searchParams }) {
  const market = (await searchParams).market || 'all'

  // 서버에서 데이터 prefetch
  const dehydratedState = await prefetchTodayDisclosures(market)

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loading />}>
        <DisclosureList initialMarket={market} /> {/* 즉시 렌더링 */}
      </Suspense>
    </HydrationBoundary>
  )
}
```

```typescript
// 클라이언트 컴포넌트
'use client'

export function DisclosureList({ initialMarket }) {
  // 서버에서 prefetch된 데이터가 있으면 즉시 반환
  const { data } = useTodayDisclosures(initialMarket)

  return <div>{data.disclosures.map(...)}</div>
}
```

### 5. API Route Handler 간소화

#### Before (70+ lines)

```typescript
export async function GET(request: NextRequest) {
  const market = searchParams.get('market') || 'all'
  const corpCls = getCorpClsFromMarket(market)
  const today = formatDateToYYYYMMDD(new Date())

  // DART API 호출
  const dartUrl = new URL('https://opendart.fss.or.kr/api/list.json')
  dartUrl.searchParams.append('crtfc_key', getDartApiKey())
  dartUrl.searchParams.append('bgn_de', today)
  // ... 70+ lines
}
```

#### After (15 lines)

```typescript
export async function GET(request: NextRequest) {
  const market = searchParams.get('market') || 'all'

  // 서버 전용 API 함수 재사용
  const result = await getTodayDisclosuresFromDart(market)

  return NextResponse.json(result)
}
```

---

## 📁 파일 구조

### 최종 구조

```
entities/disclosure/
├── index.ts                      # 클라이언트용 exports ✅
├── server.ts                     # 서버용 exports ✅
│
├── api/
│   ├── server.ts                 # 서버 전용 (Today)
│   ├── client.ts                 # 클라이언트 전용 (Today)
│   ├── search-server.ts          # 서버 전용 (Search)
│   ├── search-disclosures.ts     # 클라이언트 전용 (Search)
│   ├── get-popular-companies-server.ts
│   ├── get-popular-companies.ts
│   ├── suggest-companies-server.ts
│   ├── suggest-companies.ts
│   └── index.ts                  # 클라이언트 exports만
│
├── queries/
│   ├── prefetch.ts               # 서버 prefetch 함수
│   ├── hooks.ts                  # 클라이언트 hooks (통합)
│   └── index.ts
│
├── model/
│   └── types.ts                  # 타입 정의
│
└── lib/
    ├── format-disclosure.ts
    ├── get-disclosure-type-color.ts
    └── ...
```

### Import 규칙

```typescript
// ✅ 클라이언트 컴포넌트
import { useTodayDisclosures } from '@/entities/disclosure'

// ✅ 서버 컴포넌트
import { prefetchTodayDisclosures } from '@/entities/disclosure/server'

// ✅ API Route Handler
import { getTodayDisclosuresFromDart } from '@/entities/disclosure/server'

// ❌ 절대 하지 말 것
import { getTodayDisclosuresFromDart } from '@/entities/disclosure' // 클라이언트 번들 오염!
```

---

## 🔄 마이그레이션 가이드

### 1. 클라이언트 컴포넌트

#### Before

```typescript
import { useTodayDisclosures } from '@/entities/disclosure/model/use-today-disclosures'

export function MyComponent() {
  const { data } = useTodayDisclosures('all')
  // ...
}
```

#### After

```typescript
import { useTodayDisclosures } from '@/entities/disclosure'

export function MyComponent() {
  const { data } = useTodayDisclosures('all')
  // ...
}
```

### 2. 서버 컴포넌트 (신규)

```typescript
import { prefetchTodayDisclosures } from '@/entities/disclosure/server'
import { HydrationBoundary } from '@tanstack/react-query'

export default async function Page({ searchParams }) {
  const market = (await searchParams).market || 'all'

  // 서버에서 prefetch
  const dehydratedState = await prefetchTodayDisclosures(market)

  return (
    <HydrationBoundary state={dehydratedState}>
      <YourClientComponent initialMarket={market} />
    </HydrationBoundary>
  )
}
```

### 3. API Route Handler

#### Before

```typescript
export async function GET(request: NextRequest) {
  // 70+ lines of DART API logic
}
```

#### After

```typescript
import { getTodayDisclosuresFromDart } from '@/entities/disclosure/server'

export async function GET(request: NextRequest) {
  const market = searchParams.get('market') || 'all'
  const result = await getTodayDisclosuresFromDart(market)
  return NextResponse.json(result)
}
```

---

## 📈 성능 개선 효과

### 1. 번들 사이즈

| 항목            | Before    | After         | 개선 |
| --------------- | --------- | ------------- | ---- |
| API Routes      | 115 KB    | 115 KB        | -    |
| 클라이언트 번들 | 포함 위험 | **완전 제외** | ✅   |
| 서버 전용 코드  | 혼재      | **분리됨**    | ✅   |

### 2. 초기 로딩

| 지표        | Before          | After     | 개선          |
| ----------- | --------------- | --------- | ------------- |
| HTML 콘텐츠 | ❌ 없음         | ✅ 포함   | **SEO 향상**  |
| FCP         | 늦음            | 빠름      | **UX 향상**   |
| 데이터 페칭 | 클라이언트 시작 | 서버 완료 | **성능 향상** |

### 3. 네트워크

```
Before: Client Component → API Route → DART API (2 hops)
After:  Server Component → DART API (1 hop)
```

### 4. 코드 품질

| 항목        | Before | After  |
| ----------- | ------ | ------ |
| 중복 코드   | 많음   | 제거됨 |
| 유지보수성  | 어려움 | 쉬움   |
| 타입 안전성 | ✅     | ✅     |

---

## ⚠️ Breaking Changes

### 1. Import 경로 변경

```typescript
// ❌ 더 이상 작동하지 않음
import { useTodayDisclosures } from '@/entities/disclosure/model/use-today-disclosures'

// ✅ 변경 필요
import { useTodayDisclosures } from '@/entities/disclosure'
```

### 2. 서버 함수 Import

```typescript
// ❌ 클라이언트 컴포넌트에서 절대 금지
import { getTodayDisclosuresFromDart } from '@/entities/disclosure'

// ✅ 서버 컴포넌트/Route Handler에서만
import { getTodayDisclosuresFromDart } from '@/entities/disclosure/server'
```

### 3. 삭제된 파일

다음 파일들은 더 이상 존재하지 않습니다:

- `entities/disclosure/api/get-today-disclosures.ts`
- `entities/disclosure/model/use-today-disclosures.ts`
- `entities/disclosure/model/use-infinite-today-disclosures.ts`
- `entities/disclosure/model/use-search-disclosures.ts`
- `entities/disclosure/model/use-popular-companies.ts`
- `entities/disclosure/model/use-suggest-companies.ts`

---

## 📊 변경 통계

```
27 files changed, 800 insertions(+), 473 deletions(-)

✅ Added:    13 files (API 분리, Query 레이어)
❌ Deleted:  6 files (중복 제거)
📝 Modified: 8 files (Route Handlers, Pages)
```

### 주요 파일 변경

| 파일                                       | 변경 라인 | 설명            |
| ------------------------------------------ | --------- | --------------- |
| `app/api/disclosures/search/route.ts`      | -213      | 서버 API 재사용 |
| `app/api/disclosures/today/route.ts`       | -77       | 서버 API 재사용 |
| `app/api/stocks/popular/route.ts`          | -47       | 서버 API 재사용 |
| `entities/disclosure/queries/hooks.ts`     | +158      | 통합 hooks      |
| `entities/disclosure/api/search-server.ts` | +221      | 서버 API        |

---

## 🎯 결론

이번 리팩토링으로:

1. **서버/클라이언트 코드가 명확히 분리**되어 번들 오염 방지
2. **Prefetch + Hydration 패턴**으로 SEO와 FCP 개선
3. **중복 코드 제거**로 유지보수성 향상 (473 lines 삭제)
4. **API Route Handler 간소화**로 가독성 향상 (70+ lines → 15 lines)
5. **타입 안전성 유지**하면서 성능 최적화 달성

---

## 📚 참고 자료

- [Next.js 15 Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [TanStack Query Prefetching](https://tanstack.com/query/latest/docs/framework/react/guides/prefetching)
- [Next.js 15 Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**문서 작성일**: 2026-02-06
**작성자**: Claude Sonnet 4.5 + Hyunjae Kim
