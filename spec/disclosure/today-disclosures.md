# 오늘의 공시 기능 명세서

## 📋 기능 개요

오늘 발생한 주요 공시를 시장별로 분류하여 실시간으로 제공하는 기능입니다.

### 목적

- 투자자에게 최신 공시 정보를 빠르게 제공
- 시장별(전체/코스피/코스닥/코스넥) 공시 분류 제공
- 실시간 갱신을 통한 최신 정보 유지

---

## 🎯 요구사항

### 1. 탭 네비게이션

- **탭 목록**: 전체, 코스피, 코스닥, 코스넥
- **기본 선택**: 전체
- **동작**:
  - 탭 클릭 시 해당 시장의 공시 목록으로 전환
  - 선택된 탭은 시각적으로 구분 (active state)
  - URL 쿼리 파라미터로 현재 탭 상태 저장 (`?market=kospi`)

### 2. 공시 목록 렌더링

- **표시 개수**: 각 시장별 최근 5개
- **정렬**: 최신순 (공시 접수 시간 기준)
- **표시 정보**:
  - 공시 제목
  - 회사명 (종목 코드)
  - 접수 시간 (상대 시간: "5분 전", "2시간 전")
  - 공시 유형 (정기공시/주요사항보고/공정공시 등)

### 3. 자동 갱신

- **갱신 주기**: 30초마다 자동 갱신
- **동작**:
  - 백그라운드에서 자동으로 새 데이터 fetch
  - 새 공시가 있을 경우 목록 업데이트
  - 갱신 중에도 사용자 인터랙션 가능 (optimistic UI)
- **갱신 중지 조건**:
  - 사용자가 탭을 벗어난 경우 (visibility API 활용)
  - 사용자가 공시 상세를 보는 중일 경우 (선택사항)

### 4. 서버 캐싱

- **캐싱 전략**: Server-side caching with revalidation
- **캐시 유효기간**: 30초
- **동작**:
  - 서버에서 DART API 응답을 캐싱
  - 30초 이내 동일한 요청은 캐시된 데이터 반환
  - 모든 사용자가 동일한 캐시 데이터 사용 (동시 API 호출 최소화)
  - Next.js의 `fetch` API + `revalidate` 옵션 활용

---

## 🎨 UI/UX 상세

### PC 버전 (데스크톱/태블릿)

DART 공식 홈페이지와 유사한 **테이블 형태**로 구성합니다.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  오늘의 공시                                                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│  [전체] [코스피] [코스닥] [코스넥]                                  🔄 새로고침  │
├──────────────────────────────────────────────────────────────────────────────┤
│  접수시각    │  회사명         │  시장  │  공시제목                │  공시유형  │
├──────────────────────────────────────────────────────────────────────────────┤
│  14:23      │ 삼성전자(005930)│ 코스피 │ 2024년 4분기 실적 발표    │ 정기공시   │
├──────────────────────────────────────────────────────────────────────────────┤
│  14:15      │ SK하이닉스(...) │ 코스피 │ 자사주 매입 결정         │ 주요사항   │
├──────────────────────────────────────────────────────────────────────────────┤
│  13:58      │ 카카오(035720)  │ 코스피 │ 최대주주 변경            │ 공정공시   │
├──────────────────────────────────────────────────────────────────────────────┤
│  13:42      │ 네이버(035420)  │ 코스피 │ 임원 인사 공시           │ 기타      │
├──────────────────────────────────────────────────────────────────────────────┤
│  13:30      │ LG에너지솔루션  │ 코스피 │ 주주총회 소집 결정       │ 주요사항   │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### PC 버전 특징

- **테이블 레이아웃**: 깔끔한 표 형태로 정보 밀도 높음
- **컬럼 구성**:
  - 접수시각 (HH:MM 형식)
  - 회사명 (종목코드)
  - 시장구분 (코스피/코스닥/코스넥)
  - 공시제목 (hover 시 전체 제목 툴팁)
  - 공시유형 (정기공시/주요사항/공정공시/기타)
- **정렬**: 모든 컬럼 클릭 시 정렬 가능 (기본: 접수시각 내림차순)
- **행 hover**: 배경색 변경 + 커서 포인터
- **행 클릭**: DART 공시 상세 페이지로 새 탭 이동

### 모바일 버전

첨부 이미지(SAVE 앱)와 유사한 **카드 리스트 형태**로 구성합니다.

```
┌─────────────────────────────────────────┐
│  오늘의 공시                        🔔   │
├─────────────────────────────────────────┤
│  [전체] [코스피] [코스닥] [코스넥] ...   │  ← 스크롤 가능
├─────────────────────────────────────────┤
│  🔄                                      │  ← 새로고침 버튼
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │ [정기공시]         5분 전      ⭐  │  │
│  │                                   │  │
│  │ 2024년 4분기 실적 발표             │  │
│  │                                   │  │
│  │ 삼성전자 (005930)                 │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ [주요사항]         12분 전     ⭐  │  │
│  │                                   │  │
│  │ 자사주 매입 결정                  │  │
│  │                                   │  │
│  │ SK하이닉스 (000660)               │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ [공정공시]         1시간 전    ⭐  │  │
│  │                                   │  │
│  │ 최대주주 변경 공시                │  │
│  │                                   │  │
│  │ 카카오 (035720)                   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### 모바일 버전 특징

- **카드 레이아웃**: 각 공시를 독립된 카드로 표시
- **카드 구성**:
  - 상단 좌측: 공시유형 태그 (색상 배경)
    - 정기공시: 주황색 (`bg-orange-100 text-orange-700`)
    - 주요사항: 파란색 (`bg-blue-100 text-blue-700`)
    - 공정공시: 초록색 (`bg-green-100 text-green-700`)
    - 기타: 회색 (`bg-gray-100 text-gray-700`)
  - 상단 우측: 상대 시간 (방금 전, 5분 전, 1시간 전 등)
  - 중앙: 공시 제목 (최대 2-3줄, 말줄임표)
  - 하단: 회사명 (종목코드) - 작은 폰트, 회색
  - 우측 상단: 북마크 아이콘 (선택사항)
- **카드 간격**: 16px
- **카드 배경**: 흰색 (다크모드: dark gray)
- **카드 border**: 얇은 회색 테두리
- **카드 클릭**: DART 공시 상세 페이지로 이동

### 공통 인터랙션

- **탭 전환**: 부드러운 전환 애니메이션
- **로딩**: 스켈레톤 UI 표시 (테이블/카드 구조 유지)
- **에러**: 에러 메시지 + 재시도 버튼
- **빈 목록**: "오늘 등록된 공시가 없습니다" 메시지
- **새로고침**: 버튼 클릭 시 즉시 데이터 refetch (로딩 인디케이터 표시)

### 반응형 분기점

- **모바일**: `< 768px` - 카드 리스트
- **태블릿**: `768px ~ 1024px` - 테이블 (컬럼 일부 축약)
- **데스크톱**: `> 1024px` - 테이블 (전체 컬럼 표시)

---

## 🔧 기술 구현 방안

### 아키텍처 (FSD)

```
apps/web/
├── app/
│   ├── (routes)/
│   │   └── page.tsx                         # 메인 페이지 (오늘의 공시 포함)
│   └── api/
│       └── disclosures/
│           └── today/
│               └── route.ts                 # DART API 프록시 (서버 캐싱)
│
├── widgets/
│   └── today-disclosures/
│       ├── index.ts
│       ├── today-disclosures.tsx            # 메인 위젯 (탭 + 반응형 목록)
│       └── ui/
│           ├── market-tabs.tsx              # 시장 탭 네비게이션
│           ├── disclosure-table.tsx         # 공시 테이블 (PC용)
│           ├── disclosure-card-list.tsx     # 공시 카드 리스트 (모바일용)
│           ├── disclosure-card.tsx          # 공시 카드 (모바일)
│           ├── disclosure-table-row.tsx     # 테이블 행 (PC)
│           └── disclosure-skeleton.tsx      # 로딩 스켈레톤
│
├── entities/
│   └── disclosure/
│       ├── index.ts
│       ├── api/
│       │   └── get-today-disclosures.ts     # API 호출 함수
│       ├── model/
│       │   ├── use-today-disclosures.ts     # React Query hook
│       │   └── types.ts                     # 타입 정의
│       └── lib/
│           ├── format-disclosure.ts         # 공시 포맷팅 유틸
│           └── get-disclosure-type-color.ts # 공시 유형별 색상
│
└── shared/
    ├── api/
    │   └── dart-client.ts                   # DART API 클라이언트
    └── lib/
        ├── format-relative-time.ts          # 상대 시간 포맷팅
        └── cn.ts                            # 클래스명 유틸 (clsx + twMerge)
```

### API 설계

#### Route Handler (Next.js App Router)

```typescript
// apps/web/app/api/disclosures/today/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const market = searchParams.get('market') // 'all' | 'kospi' | 'kosdaq' | 'konex'

  // DART API 호출 (30초 캐싱)
  const data = await fetch('https://opendart.fssnet.or.kr/api/list.json', {
    next: { revalidate: 30 },
  })

  // 데이터 가공 및 반환
  return NextResponse.json(data)
}
```

#### DART API 파라미터

```typescript
interface DartApiParams {
  crtfc_key: string // API 인증키
  corp_code?: string // 회사 고유번호 (선택)
  bgn_de: string // 시작일 (YYYYMMDD)
  end_de: string // 종료일 (YYYYMMDD)
  last_reprt_at?: 'Y' | 'N' // 최종보고서만 조회 (선택)
  pblntf_ty?: string // 공시유형 (선택)
  pblntf_detail_ty?: string // 공시상세유형 (선택)
  corp_cls?: 'Y' | 'K' | 'N' | 'E' // 법인구분 (전체/코스피/코스닥/코스넥)
  sort?: 'date' | 'crp' // 정렬 (접수일자/회사명)
  sort_mth?: 'asc' | 'desc' // 정렬방법
  page_no?: number // 페이지 번호
  page_count?: number // 페이지당 건수 (최대 100)
}
```

### 데이터 모델

```typescript
// entities/disclosure/model/types.ts

export type Market = 'all' | 'kospi' | 'kosdaq' | 'konex'

export type DisclosureType =
  | 'regular' // 정기공시
  | 'major' // 주요사항보고
  | 'fair' // 공정공시
  | 'other' // 기타

export interface Disclosure {
  id: string // 공시 고유 ID (rcept_no)
  title: string // 공시 제목 (report_nm)
  companyName: string // 회사명 (corp_name)
  stockCode: string // 종목 코드 (stock_code)
  corpCode: string // 회사 고유번호 (corp_code)
  market: Market // 시장 구분 (corp_cls)
  type: DisclosureType // 공시 유형
  receivedAt: Date // 접수 시간 (rcept_dt)
  submitter: string // 제출인 (flr_nm)
  reportUrl: string // 보고서 URL (DART)
}

export interface TodayDisclosuresResponse {
  disclosures: Disclosure[]
  totalCount: number
  lastUpdated: Date
}

// DART API 원본 응답 타입
export interface DartDisclosureItem {
  corp_code: string // 회사 고유번호
  corp_name: string // 회사명
  stock_code: string // 종목코드
  corp_cls: string // 법인구분 (Y: 전체, K: 코스피, N: 코스닥, E: 코넥스)
  report_nm: string // 보고서명
  rcept_no: string // 접수번호
  flr_nm: string // 공시제출인명
  rcept_dt: string // 접수일자 (YYYYMMDD)
  rm: string // 비고
}

export interface DartApiResponse {
  status: string // 응답 상태
  message: string // 응답 메시지
  list: DartDisclosureItem[] // 공시 목록
}
```

### React Query 설정

```typescript
// entities/disclosure/model/use-today-disclosures.ts
import { useSuspenseQuery } from '@tanstack/react-query'
import { getTodayDisclosures } from '../api/get-today-disclosures'
import type { Market } from './types'

export function useTodayDisclosures(market: Market = 'all') {
  return useSuspenseQuery({
    queryKey: ['disclosures', 'today', market],
    queryFn: () => getTodayDisclosures(market),
    refetchInterval: 30000, // 30초마다 자동 refetch
    refetchIntervalInBackground: false, // 탭이 백그라운드면 중지
    staleTime: 30000, // 30초간 fresh 상태 유지
  })
}
```

**주요 변경사항**:

- `useQuery` → `useSuspenseQuery` 사용
- `@suspensive/react`의 Suspense와 ErrorBoundary를 통한 선언적 로딩/에러 처리
- 컴포넌트 내부에서 `isLoading`, `error` 체크 불필요
- `data`는 항상 존재 (undefined 체크 불필요)

### 선언적 로딩/에러 처리 (@suspensive/react)

```typescript
// widgets/today-disclosures/today-disclosures.tsx
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'

function ErrorFallback({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-12 text-center">
      <p className="mb-4 text-sm text-destructive">공시 정보를 불러오는데 실패했습니다</p>
      <Button variant="outline" onClick={reset}>
        다시 시도
      </Button>
    </div>
  )
}

function TodayDisclosuresContent({ selectedMarket }: { selectedMarket: Market }) {
  const { data } = useTodayDisclosures(selectedMarket)
  const disclosures = data.disclosures.slice(0, 7)

  return <DisclosureList disclosures={disclosures} />
}

export function TodayDisclosures() {
  const { reset } = useQueryErrorResetBoundary()
  const [selectedMarket, setSelectedMarket] = useState<Market>('all')

  return (
    <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
      <Suspense fallback={<DisclosureTableSkeleton />}>
        <TodayDisclosuresContent selectedMarket={selectedMarket} />
      </Suspense>
    </ErrorBoundary>
  )
}
```

**장점**:

- 선언적인 로딩/에러 처리
- 컴포넌트 분리로 관심사 명확화
- 삼항 연산자 중첩 제거로 가독성 향상
- 타입 안전성 (data는 항상 존재)

### 캐싱 전략

#### 1. Server-side Caching (Next.js)

```typescript
// Next.js fetch with revalidate
const data = await fetch(dartApiUrl, {
  next: {
    revalidate: 30, // 30초 캐시
    tags: ['disclosures', 'today'],
  },
})
```

**장점**:

- 모든 사용자가 동일한 캐시 사용
- DART API 호출 최소화
- CDN 캐싱 가능

#### 2. Client-side Caching (React Query)

```typescript
// React Query 설정
{
  staleTime: 30000,        // 30초간 fresh
  gcTime: 5 * 60 * 1000,   // 5분간 메모리 유지
  refetchInterval: 30000,  // 30초마다 refetch
}
```

**장점**:

- 네트워크 요청 최소화
- 빠른 화면 전환
- Optimistic UI 구현 용이

---

## 🚀 구현 단계

### Phase 1: 기본 구조 및 데이터 레이어 (MVP)

1. **환경 설정**
   - DART API 키 환경변수 추가 (`.env.local`)
   - TanStack Query Provider 설정 확인
   - `@suspensive/react` 패키지 설치 (`pnpm --filter web add @suspensive/react`)

2. **entities/disclosure 생성**
   - 타입 정의 (`types.ts`)
   - DART API 응답 변환 유틸 (`lib/format-disclosure.ts`)
   - API 호출 함수 (`api/get-today-disclosures.ts`)
   - React Query hook with `useSuspenseQuery` (`model/use-today-disclosures.ts`)

3. **API Route Handler 작성**
   - `app/api/disclosures/today/route.ts`
   - DART API 프록시 구현
   - 30초 서버 캐싱 설정
   - 에러 핸들링

### Phase 2: UI 컴포넌트 (모바일 우선)

1. **모바일 UI 구현**
   - 공시 카드 컴포넌트 (`disclosure-card.tsx`)
   - 카드 리스트 컴포넌트 (`disclosure-card-list.tsx`)
   - 공시 유형별 색상 유틸 (`lib/get-disclosure-type-color.ts`)
   - 상대 시간 포맷팅 (`shared/lib/format-relative-time.ts`)

2. **탭 네비게이션**
   - 시장 탭 컴포넌트 (`market-tabs.tsx`)
   - URL 쿼리 파라미터 연동
   - 탭 전환 애니메이션

3. **메인 위젯 조합**
   - `today-disclosures.tsx` 작성
   - 탭과 카드 리스트 통합
   - `@suspensive/react`의 Suspense, ErrorBoundary로 선언적 상태 처리
   - `TodayDisclosuresContent` 컴포넌트 분리 (데이터 렌더링 전용)
   - `ErrorFallback` 컴포넌트 작성

### Phase 3: PC UI 및 반응형

1. **PC 테이블 UI 구현**
   - 테이블 컴포넌트 (`disclosure-table.tsx`)
   - 테이블 행 컴포넌트 (`disclosure-table-row.tsx`)
   - 컬럼 정렬 기능
   - hover 효과

2. **반응형 분기**
   - useMediaQuery 또는 Tailwind breakpoints 활용
   - 768px 미만: 카드 리스트
   - 768px 이상: 테이블

### Phase 4: 실시간 갱신 및 최적화

1. **자동 갱신**
   - React Query refetchInterval: 30초
   - Visibility API 통합 (백그라운드 탭 중지)
   - 수동 새로고침 버튼

2. **UX 개선**
   - 스켈레톤 로딩 UI (`disclosure-skeleton.tsx`, `disclosure-table-skeleton.tsx`)
   - ErrorBoundary의 `ErrorFallback` 컴포넌트로 에러 처리
   - `useQueryErrorResetBoundary`로 에러 리셋
   - 빈 목록 상태 UI
   - 새 공시 알림 (선택사항)

3. **성능 최적화**
   - 메모이제이션 (useMemo, React.memo)
   - 가상 스크롤 (virtualization) 검토
   - 이미지/폰트 최적화

### Phase 5: 추가 기능 (선택사항)

1. 무한 스크롤 또는 페이지네이션
2. 공시 상세 모달/페이지
3. 공시 유형별 필터링
4. 북마크/즐겨찾기 기능
5. 공시 검색 기능

---

## 📊 성능 목표

- **초기 로딩**: 2초 이내
- **갱신 시간**: 1초 이내 (캐시 hit 시)
- **DART API 호출**: 30초당 최대 1회
- **메모리 사용**: 공시 목록당 5KB 이하

---

## 🔒 보안 고려사항

- DART API 키는 서버 환경변수로 관리 (`.env.local`)
- 클라이언트에 API 키 노출 금지
- Rate limiting 적용 (필요시)

---

## ✅ 구현 현황 (2026-01-29)

### 완료된 작업

#### Phase 1: 데이터 레이어 ✅

- [x] `@suspensive/react` 패키지 설치
- [x] `entities/disclosure` 구조 생성
  - [x] 타입 정의 (`model/types.ts`)
  - [x] API 호출 함수 (`api/get-today-disclosures.ts`)
  - [x] `useSuspenseQuery` 기반 훅 (`model/use-today-disclosures.ts`)
  - [x] 유틸리티 함수들
    - `lib/format-disclosure.ts`
    - `lib/get-disclosure-type-color.ts`
    - `lib/get-market-badge.ts`
- [x] API Route Handler (`app/api/disclosures/today/route.ts`)

#### Phase 2 & 3: UI 컴포넌트 ✅

- [x] `widgets/today-disclosures` 위젯 생성
  - [x] 메인 컴포넌트 (`today-disclosures.tsx`)
    - Suspense + ErrorBoundary 선언적 처리
    - `TodayDisclosuresContent` 분리
    - `ErrorFallback` 컴포넌트
  - [x] 탭 네비게이션 (`ui/market-tabs.tsx`)
  - [x] 모바일 UI
    - `ui/disclosure-card.tsx`
    - `ui/disclosure-card-list.tsx`
  - [x] PC UI
    - `ui/disclosure-list.tsx`
    - `ui/disclosure-row.tsx`
  - [x] 로딩 스켈레톤
    - `ui/disclosure-skeleton.tsx` (모바일)
    - `ui/disclosure-table-skeleton.tsx` (PC)
- [x] 반응형 분기 (768px 기준)
- [x] 상대 시간 포맷팅 (`shared/lib/format-relative-time.ts`)

#### 기술 스택

- ✅ TanStack Query (`useSuspenseQuery`)
- ✅ `@suspensive/react` (Suspense, ErrorBoundary)
- ✅ Next.js App Router
- ✅ TypeScript
- ✅ Tailwind CSS v4

### 다음 단계

#### Phase 4: 실시간 갱신 및 최적화

- [ ] Visibility API 통합 (백그라운드 탭 갱신 중지)
- [ ] 새 공시 알림 기능
- [ ] 성능 최적화
  - 메모이제이션 적용
  - 번들 크기 최적화

#### Phase 5: 추가 기능 (선택사항)

- [ ] 무한 스크롤/페이지네이션
- [ ] 공시 상세 모달
- [ ] 공시 유형별 필터링
- [ ] 북마크 기능

---

## 📝 참고 자료

- [DART API 문서](https://opendart.fssnet.or.kr/guide/main.do)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [@suspensive/react](https://suspensive.org/)
