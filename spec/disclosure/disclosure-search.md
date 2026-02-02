# 공시 검색 기능 명세서

## 📋 기능 개요

공시를 회사명 또는 공시 제목 키워드로 검색할 수 있는 기능입니다.

### 목적

- 투자자가 특정 회사 또는 키워드로 공시를 빠르게 찾을 수 있도록 지원
- 메인 페이지 검색바를 통한 간편한 진입
- 검색 결과 페이지에서 필터 및 정렬 제공

### 검색 방식

DART 공시검색 API(`https://opendart.fss.or.kr/api/list.json`)를 활용하여 공시를 조회합니다.

#### API 지원 파라미터

| 파라미터                 | 설명                                              | 비고                       |
| ------------------------ | ------------------------------------------------- | -------------------------- |
| `corp_code`              | 고유번호 (8자리)                                  | 3개월 이상 조회 시 필수    |
| `bgn_de` / `end_de`      | 시작일 / 종료일 (YYYYMMDD)                        |                            |
| `pblntf_ty`              | 공시유형 (A~J)                                    |                            |
| `corp_cls`               | 법인구분 (Y: 유가, K: 코스닥, N: 코넥스, E: 기타) |                            |
| `last_reprt_at`          | 최종보고서만 검색 (Y/N)                           |                            |
| `sort` / `sort_mth`      | 정렬 기준 / 정렬 방식                             | date, crp, rpt / asc, desc |
| `page_no` / `page_count` | 페이지 번호 / 페이지당 건수                       | 최대 100건                 |

#### 검색 전략

- API가 자유 텍스트 키워드 검색은 지원하지 않으므로, 날짜 범위 + 필터 조건으로 DART API를 조회한 뒤 **서버에서 키워드 필터링**합니다
- 검색어를 `corp_name`(회사명)과 `report_nm`(공시 제목) 모두에 대해 매칭
- 별도 로컬 DB 없이 DART API 응답만으로 처리
- `corp_code` 없이 조회 시 최대 3개월까지만 검색 가능

---

## 🎯 요구사항

### 1. 검색 입력

- **위치**: 메인 페이지 상단 검색바 + 검색 결과 페이지 상단
- **플레이스홀더**: `회사명 또는 공시 키워드 검색`
- **동작**:
  - Enter 키 또는 검색 버튼 클릭 시 검색 결과 페이지로 이동
  - 검색어는 URL 쿼리 파라미터로 관리 (`?q=삼성전자`)
  - 빈 검색어 제출 시 검색 실행하지 않음

### 2. 검색 필터

- **기간 필터**: 오늘 / 1주일 / 1개월 / 3개월 / 직접 입력 (기본: 1주일)
- **시장 필터**: 전체 / 코스피 / 코스닥 / 코스넥 (기본: 전체)
- **공시 유형 필터**: 전체 / 정기공시(A) / 주요사항보고(B) / 발행공시(C) / 지분공시(D) / 기타공시(E) / 외부감사관련(F) / 펀드공시(G) / 자산유동화(H) / 거래소공시(I) / 공정위공시(J) (기본: 전체)
- **필터 설정 UI**:
  - **PC**: 검색바 옆 필터 아이콘 클릭 시 **Dialog**로 필터 옵션 표시
  - **모바일**: 검색바 옆 필터 아이콘 클릭 시 **Bottom Sheet**로 필터 옵션 표시
  - PC/모바일 환경에 따라 자동 전환 (반응형 모달 공통 컴포넌트 활용)
- **동작**:
  - 필터 변경 후 적용 버튼 클릭 시 검색 재실행
  - 모든 필터 상태를 URL 쿼리 파라미터로 관리 (`?q=삼성&period=1w&market=kospi&type=A`)

### 3. 검색 결과 표시

- **정렬**: 최신순 (접수일자 기준, 기본)
- **페이지네이션**: 무한 스크롤 (기존 공시 목록 패턴 재사용)
- **표시 정보**: 기존 공시 목록과 동일 (제목, 회사명, 접수시간, 공시유형, 시장)
- **빈 결과**: `검색 결과가 없습니다` 메시지 + 검색어 확인 안내
- **검색어 하이라이팅**: 결과 목록에서 검색 키워드 하이라이팅 (선택사항)

### 4. URL 상태 관리

검색 상태를 URL 쿼리 파라미터로 관리하여 공유 및 브라우저 뒤로가기를 지원합니다.

```
/disclosures/search?q=삼성전자&period=1w&market=all&type=all&page=1
```

| 파라미터 | 설명                  | 기본값 | 예시                                |
| -------- | --------------------- | ------ | ----------------------------------- |
| `q`      | 검색어                | (필수) | `삼성전자`                          |
| `period` | 기간 필터             | `1w`   | `today`, `1w`, `1m`, `3m`, `custom` |
| `bgn_de` | 시작일 (직접 입력 시) | -      | `20260101`                          |
| `end_de` | 종료일 (직접 입력 시) | -      | `20260130`                          |
| `market` | 시장 필터             | `all`  | `kospi`, `kosdaq`, `konex`          |
| `type`   | 공시 유형             | `all`  | `A`, `B`, `C`, ...                  |

---

## 🎨 UI/UX 상세

### 메인 페이지 검색바

#### PC 버전

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────┐  ┌────┐  │
│   │ 🔍  회사명 또는 공시 키워드 검색                               │  │검색│  │
│   └──────────────────────────────────────────────────────────────┘  └────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 모바일 버전

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🔍  회사명 또는 공시 키워드 검색    │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

- 검색바 클릭/포커스 시 검색 결과 페이지로 이동 (모바일에서는 페이지 전환)
- Enter 키로 검색 실행

### 검색 결과 페이지

#### PC 버전

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← 뒤로   공시 검색                                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────┐ ┌──┐ ┌────┐  │
│  │ 🔍  삼성전자                                              │ │⚙│ │검색│  │
│  └──────────────────────────────────────────────────────────┘ └──┘ └────┘  │
│                                                                              │
│  [1주일] [전체] [전체]  ← 현재 적용된 필터 요약 (칩 형태)                    │
│                                                                              │
│  "삼성전자" 검색 결과 (42건)                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│  접수시각    │  회사명         │  시장  │  공시제목                │  공시유형  │
├──────────────────────────────────────────────────────────────────────────────┤
│  2026-01-30  │ 삼성전자(005930)│ 코스피 │ 2025년 4분기 실적 발표   │ 정기공시  │
├──────────────────────────────────────────────────────────────────────────────┤
│  2026-01-29  │ 삼성전자(005930)│ 코스피 │ 임원 선임 결정           │ 주요사항  │
├──────────────────────────────────────────────────────────────────────────────┤
│  ...                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### PC 필터 Dialog

```
┌────────────────────────────────────────────┐
│  검색 필터 설정                          ✕  │
├────────────────────────────────────────────┤
│                                            │
│  기간                                      │
│  [오늘] [1주일] [1개월] [3개월] [직접입력]  │
│                                            │
│  시장                                      │
│  [전체] [코스피] [코스닥] [코스넥]          │
│                                            │
│  공시 유형                                  │
│  [전체] [정기공시] [주요사항] [발행공시]     │
│  [지분공시] [기타공시] [외부감사] [...]      │
│                                            │
├────────────────────────────────────────────┤
│                    [초기화]      [적용하기]  │
└────────────────────────────────────────────┘
```

#### 모바일 버전

```
┌─────────────────────────────────────────┐
│  ← 뒤로   공시 검색                      │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────┐ ┌──┐  │
│  │ 🔍  삼성전자              ✕  │ │⚙│  │
│  └─────────────────────────────┘ └──┘  │
│                                         │
│  [1주일] [전체] [전체]  ← 필터 칩        │
│                                         │
│  "삼성전자" 검색 결과 (42건)             │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │ [정기공시]         2026-01-30     │  │
│  │                                   │  │
│  │ 2025년 4분기 실적 발표            │  │
│  │                                   │  │
│  │ 삼성전자 (005930)                │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ [주요사항]         2026-01-29     │  │
│  │                                   │  │
│  │ 임원 선임 결정                    │  │
│  │                                   │  │
│  │ 삼성전자 (005930)                │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ... (무한 스크롤)                       │
└─────────────────────────────────────────┘
```

#### 모바일 필터 Bottom Sheet

```
┌─────────────────────────────────────────┐
│                                         │
│  (검색 결과 페이지 - 흐리게 처리)       │
│                                         │
├─────────────────────────────────────────┤  ← 드래그 핸들
│  검색 필터 설정                          │
│                                         │
│  기간                                    │
│  [오늘] [1주일] [1개월] [3개월]          │
│  [직접입력]                              │
│                                         │
│  시장                                    │
│  [전체] [코스피] [코스닥] [코스넥]       │
│                                         │
│  공시 유형                               │
│  [전체] [정기공시] [주요사항]            │
│  [발행공시] [지분공시] [기타공시]        │
│  [외부감사] [펀드공시] [자산유동화]      │
│  [거래소공시] [공정위공시]               │
│                                         │
│  ┌───────────────┐ ┌───────────────┐   │
│  │    초기화       │ │   적용하기     │   │
│  └───────────────┘ └───────────────┘   │
└─────────────────────────────────────────┘
```

#### 필터 UI 특징

- **진입점**: 검색바 옆 필터(⚙) 아이콘 버튼
- **PC**: Dialog 형태로 중앙에 표시
- **모바일**: Bottom Sheet 형태로 하단에서 올라옴
- `@ds/ui`의 `useIsMobile` 훅으로 환경 자동 감지 (breakpoint: 768px)
- 현재 적용된 필터는 검색바 아래에 칩(Chip) 형태로 요약 표시
- 필터 변경 후 "적용하기" 버튼 클릭 시 검색 재실행 및 모달 닫힘

### 공통 인터랙션

- **로딩**: 스켈레톤 UI (기존 공시 목록 스켈레톤 재사용)
- **에러 처리**:
  - API 오류: `검색 결과를 불러오는데 실패했습니다` + 재시도 버튼
  - 네트워크 오류: `네트워크 연결을 확인해주세요` + 재시도 버튼
- **빈 상태**:
  - 검색어 없음: `검색어를 입력해주세요`
  - 결과 없음: `"[검색어]"에 대한 검색 결과가 없습니다` + 검색 팁 안내
- **무한 스크롤**: 기존 공시 목록 페이지와 동일한 패턴

### 반응형 분기점

- **모바일**: `< 768px` - 카드 리스트 + Bottom Sheet 필터 모달
- **태블릿**: `768px ~ 1024px` - 테이블 + Dialog 필터 모달
- **데스크톱**: `> 1024px` - 테이블 + Dialog 필터 모달

---

## 🔧 기술 구현 방안

### 아키텍처 (FSD)

```
apps/web/
├── app/
│   ├── (routes)/
│   │   └── disclosures/
│   │       └── search/
│   │           └── page.tsx                         # 검색 결과 페이지
│   └── api/
│       └── disclosures/
│           └── search/
│               └── route.ts                         # 검색 API 프록시
│
├── widgets/
│   └── disclosure-search/
│       ├── index.ts
│       ├── disclosure-search-page.tsx               # 검색 결과 페이지 위젯
│       └── ui/
│           ├── search-bar.tsx                       # 검색바 (메인 페이지용)
│           ├── search-input.tsx                     # 검색 입력 필드
│           ├── search-filter-modal.tsx              # 필터 모달 (반응형: Dialog/Sheet 자동 전환)
│           ├── search-filter-content.tsx            # 필터 내부 콘텐츠 (기간/시장/유형)
│           ├── search-filter-chips.tsx              # 적용된 필터 칩 표시
│           ├── period-filter.tsx                    # 기간 필터
│           ├── search-result-header.tsx             # 검색 결과 헤더 (건수 표시)
│           └── search-result-content.tsx            # 검색 결과 목록 (무한 스크롤)
│
├── features/
│   └── search-disclosures/
│       ├── index.ts
│       └── model/
│           └── use-search-params.ts                 # URL 쿼리 파라미터 관리 훅
│
├── entities/
│   └── disclosure/
│       ├── api/
│       │   └── search-disclosures.ts                # 검색 API 호출 함수
│       └── model/
│           ├── use-search-disclosures.ts            # 검색 React Query 훅
│           └── types.ts                             # 기존 타입 + 검색 관련 타입 추가
│
└── shared/
    └── lib/
        └── query-keys.ts                            # 검색 쿼리 키 추가
```

### 반응형 모달 컴포넌트 (PC: Dialog / 모바일: Bottom Sheet)

`@ds/ui` 패키지에 `Dialog`, `Sheet`, `useIsMobile` 훅이 이미 존재하며, `Sidebar` 컴포넌트에서 `useIsMobile`로 Sheet/비Sheet를 분기하는 패턴이 사용되고 있습니다. 이 패턴을 활용하여 **반응형 모달 공통 컴포넌트**를 `@ds/ui`에 추가합니다.

#### 기존 자산 확인

- `packages/ui/src/components/dialog/` - Dialog 컴포넌트 (Radix UI 기반)
- `packages/ui/src/components/sheet/` - Sheet 컴포넌트 (Radix UI 기반, side 옵션 지원)
- `packages/ui/src/hooks/use-mobile/` - `useIsMobile` 훅 (breakpoint: 768px)
- `packages/ui/src/components/sidebar/sidebar.tsx` (line 170~193) - Sheet/Desktop 분기 참고 패턴

#### 공통 컴포넌트 설계

```typescript
// packages/ui/src/components/responsive-modal/responsive-modal.tsx
'use client'

import { useIsMobile } from '../../hooks/use-mobile'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from '../dialog'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
  SheetDescription, SheetFooter, SheetClose,
} from '../sheet'

interface ResponsiveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          {children}
          {footer && <SheetFooter>{footer}</SheetFooter>}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
```

#### 사용 예시 (검색 필터)

```typescript
// widgets/disclosure-search/ui/search-filter-modal.tsx
import { ResponsiveModal } from '@ds/ui'

export function SearchFilterModal({ open, onOpenChange, params, onApply }: Props) {
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="검색 필터 설정"
      footer={
        <>
          <Button variant="outline" onClick={handleReset}>초기화</Button>
          <Button onClick={handleApply}>적용하기</Button>
        </>
      }
    >
      <SearchFilterContent params={params} onChange={setLocalParams} />
    </ResponsiveModal>
  )
}
```

### API 설계

#### Route Handler

```typescript
// apps/web/app/api/disclosures/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { formatDisclosure } from '@/entities/disclosure'
import type { DartApiResponse, Market, DisclosureType } from '@/entities/disclosure'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const market = (searchParams.get('market') as Market) || 'all'
  const type = searchParams.get('type') || 'all'
  const bgnDe = searchParams.get('bgn_de') || '' // YYYYMMDD
  const endDe = searchParams.get('end_de') || '' // YYYYMMDD
  const pageNo = searchParams.get('page_no') || '1'
  const pageCount = searchParams.get('page_count') || '100'

  // 1. DART API 호출 (날짜 범위 + 시장/유형 필터)
  // 2. corp_name, report_nm에서 query 키워드 필터링 (서버 사이드)
  // 3. 결과 반환

  return NextResponse.json({
    disclosures,
    totalCount,
    totalPage,
    pageNo,
    pageCount,
    query,
    lastUpdated: new Date().toISOString(),
  })
}
```

#### 검색 전략 상세

```typescript
// 검색 로직 (서버 사이드)
async function searchDisclosures(params: SearchParams) {
  const { query, market, type, bgnDe, endDe, pageNo, pageCount } = params

  // 1. DART API 조회 (날짜 범위 + 시장/유형 필터)
  // 2. 응답의 corp_name(회사명)과 report_nm(공시 제목)에서 query 키워드 포함 여부 필터링
  // 3. 필터링된 결과 반환
  //
  // 제약사항:
  // - DART API는 페이지당 최대 100건 반환
  // - 서버 사이드 필터링이므로 필터링 후 결과 건수가 page_count보다 적을 수 있음
  // - 충분한 결과를 확보하기 위해 여러 페이지를 순회하여 필터링할 수 있음
}
```

### 타입 정의

```typescript
// entities/disclosure/model/types.ts에 추가 (NEW)

export type SearchPeriod = 'today' | '1w' | '1m' | '3m' | 'custom'

export interface SearchDisclosuresParams {
  q: string // 검색어
  period: SearchPeriod // 기간 필터
  bgnDe?: string // 시작일 (YYYYMMDD, custom일 때)
  endDe?: string // 종료일 (YYYYMMDD, custom일 때)
  market: Market // 시장 필터
  type: DisclosureType | 'all' // 공시 유형 필터
  pageNo: number // 페이지 번호
  pageCount: number // 페이지당 건수
}

// PaginatedDisclosuresResponse를 확장하여 query 필드 추가
export interface SearchDisclosuresResponse extends PaginatedDisclosuresResponse {
  query: string
}
```

### React Query 설정

```typescript
// entities/disclosure/model/use-search-disclosures.ts
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { searchDisclosures } from '../api/search-disclosures'
import type { SearchDisclosuresParams } from './types'

export function useSearchDisclosures(params: SearchDisclosuresParams) {
  return useSuspenseInfiniteQuery({
    queryKey: queries.disclosures.search(params),
    queryFn: ({ pageParam }) => searchDisclosures({ ...params, pageNo: pageParam }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.pageNo < lastPage.totalPage ? lastPage.pageNo + 1 : undefined,
    staleTime: 60000, // 1분간 fresh 상태 유지
    enabled: params.q.length > 0, // 검색어가 있을 때만 실행
  })
}
```

### 쿼리 키 추가

```typescript
// shared/lib/query-keys.ts
export const queries = createQueryKeyStore({
  disclosures: {
    today: (market: Market) => [market],
    todayInfinite: (market: Market) => [market],
    search: (params: SearchDisclosuresParams) => [params],
  },
})
```

### URL 쿼리 파라미터 관리 훅

```typescript
// features/search-disclosures/model/use-search-params.ts
import { useSearchParams, useRouter } from 'next/navigation'
import type {
  SearchDisclosuresParams,
  SearchPeriod,
  Market,
  DisclosureType,
} from '@/entities/disclosure'

export function useDisclosureSearchParams() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const params: SearchDisclosuresParams = {
    q: searchParams.get('q') || '',
    period: (searchParams.get('period') as SearchPeriod) || '1w',
    bgnDe: searchParams.get('bgn_de') || undefined,
    endDe: searchParams.get('end_de') || undefined,
    market: (searchParams.get('market') as Market) || 'all',
    type: (searchParams.get('type') as DisclosureType | 'all') || 'all',
    pageNo: 1,
    pageCount: 100,
  }

  function updateParams(updates: Partial<SearchDisclosuresParams>) {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        newParams.set(key, String(value))
      } else {
        newParams.delete(key)
      }
    })
    router.push(`/disclosures/search?${newParams.toString()}`)
  }

  return { params, updateParams }
}
```

### 선언적 로딩/에러 처리

```typescript
// widgets/disclosure-search/disclosure-search-page.tsx
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'

function ErrorFallback({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-12 text-center">
      <p className="mb-4 text-sm text-destructive">검색 결과를 불러오는데 실패했습니다</p>
      <Button variant="outline" onClick={reset}>
        다시 시도
      </Button>
    </div>
  )
}

export function DisclosureSearchPage() {
  const { reset } = useQueryErrorResetBoundary()
  const { params, updateParams } = useDisclosureSearchParams()

  return (
    <div>
      <SearchInput value={params.q} onSearch={(q) => updateParams({ q })} />
      <SearchFilters params={params} onFilterChange={updateParams} />
      <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
        <Suspense fallback={<DisclosureTableSkeleton />}>
          <SearchResultContent params={params} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
```

### 캐싱 전략

#### Server-side Caching (Next.js)

```typescript
// 검색 API는 캐시 시간을 짧게 설정 (검색 결과는 자주 변하지 않지만 새 공시 반영 필요)
const response = await fetch(dartUrl.toString(), {
  next: {
    revalidate: 60, // 1분 캐시
    tags: ['disclosures', 'search', query],
  },
})
```

#### Client-side Caching (React Query)

```typescript
{
  staleTime: 60000,         // 1분간 fresh
  gcTime: 5 * 60 * 1000,   // 5분간 메모리 유지
}
```

---

## 🚀 구현 단계

### Phase 1: 검색 API 및 데이터 레이어

1. **타입 정의 확장**
   - `SearchDisclosuresParams`, `SearchDisclosuresResponse` 타입 추가
   - `SearchPeriod` 타입 추가

2. **검색 API Route Handler 작성**
   - `app/api/disclosures/search/route.ts` 생성
   - DART API 조회 후 서버 사이드 키워드 필터링 (회사명 + 공시 제목)
   - 기간/시장/유형 필터 처리

3. **검색 API 호출 함수 및 React Query 훅**
   - `entities/disclosure/api/search-disclosures.ts` 생성
   - `entities/disclosure/model/use-search-disclosures.ts` 생성
   - `shared/lib/query-keys.ts`에 검색 쿼리 키 추가

### Phase 2: 반응형 모달 공통 컴포넌트

1. **ResponsiveModal 컴포넌트 생성**
   - `packages/ui/src/components/responsive-modal/responsive-modal.tsx` 생성
   - `useIsMobile` 훅으로 모바일 → Bottom Sheet, PC → Dialog 자동 전환
   - `index.ts` 생성 및 `@ds/ui` 메인 export에 추가
   - 기존 Sidebar의 Sheet/Desktop 분기 패턴 참고

### Phase 3: 검색 UI (메인 페이지 검색바)

1. **검색바 컴포넌트**
   - `widgets/disclosure-search/ui/search-bar.tsx` 생성
   - 메인 페이지에 검색바 배치
   - Enter/클릭 시 검색 결과 페이지로 라우팅

2. **검색 입력 컴포넌트**
   - `widgets/disclosure-search/ui/search-input.tsx` 생성
   - 검색어 입력, 초기화(X) 버튼

### Phase 4: 검색 결과 페이지

1. **페이지 라우트 생성**
   - `app/(routes)/disclosures/search/page.tsx` 생성

2. **필터 모달 컴포넌트**
   - `widgets/disclosure-search/ui/search-filter-modal.tsx` 생성 (ResponsiveModal 활용)
   - `widgets/disclosure-search/ui/search-filter-content.tsx` 생성 (필터 내부 UI)
   - `widgets/disclosure-search/ui/search-filter-chips.tsx` 생성 (적용된 필터 칩 표시)
   - 기간/시장/유형 필터 UI
   - 필터 아이콘 버튼 → 모달 열기 → 적용하기 → URL 쿼리 파라미터 반영

3. **검색 결과 목록**
   - `widgets/disclosure-search/ui/search-result-content.tsx` 생성
   - 기존 공시 목록 컴포넌트(`DisclosureTable`, `DisclosureCardList`) 재사용
   - 무한 스크롤 (기존 `useIntersectionObserver` 패턴 재사용)
   - Suspense + ErrorBoundary 선언적 처리

4. **URL 쿼리 파라미터 관리 훅**
   - `features/search-disclosures/model/use-search-params.ts` 생성

### Phase 5: 최적화 및 UX 개선

1. **검색 UX 개선**
   - 디바운스 적용 (선택사항: 실시간 검색 시)
   - 최근 검색어 저장 (localStorage)
   - 검색어 하이라이팅

2. **성능 최적화**
   - 서버 캐싱 최적화
   - 검색 결과 프리페칭 검토

---

## 📊 성능 목표

- **검색 API 응답**: 2초 이내 (DART API 응답 시간 포함)
- **캐시 hit 시 응답**: 500ms 이내
- **서버 캐시 유효기간**: 1분
- **클라이언트 staleTime**: 1분
- **DART API 호출 최소화**: 동일 검색어는 캐시 활용

---

## ✅ 구현 현황

### 미완료 작업

#### Phase 1: 검색 API 및 데이터 레이어

- [ ] 타입 정의 확장 (`SearchPeriod`, `SearchDisclosuresParams`, `SearchDisclosuresResponse`)
- [ ] 검색 API Route Handler (`app/api/disclosures/search/route.ts`)
- [ ] 검색 API 호출 함수 (`entities/disclosure/api/search-disclosures.ts`)
- [ ] React Query 훅 (`entities/disclosure/model/use-search-disclosures.ts`)
- [ ] 쿼리 키 추가 (`shared/lib/query-keys.ts`)

#### Phase 2: 반응형 모달 공통 컴포넌트

- [ ] ResponsiveModal 컴포넌트 (`packages/ui/src/components/responsive-modal/responsive-modal.tsx`)
- [ ] `@ds/ui` 메인 export에 추가

#### Phase 3: 검색 UI (메인 페이지 검색바)

- [ ] 검색바 컴포넌트 (`widgets/disclosure-search/ui/search-bar.tsx`)
- [ ] 검색 입력 컴포넌트 (`widgets/disclosure-search/ui/search-input.tsx`)
- [ ] 메인 페이지에 검색바 배치

#### Phase 4: 검색 결과 페이지

- [ ] 페이지 라우트 (`app/(routes)/disclosures/search/page.tsx`)
- [ ] 필터 모달 컴포넌트 (`widgets/disclosure-search/ui/search-filter-modal.tsx`)
- [ ] 필터 내부 콘텐츠 (`widgets/disclosure-search/ui/search-filter-content.tsx`)
- [ ] 필터 칩 표시 (`widgets/disclosure-search/ui/search-filter-chips.tsx`)
- [ ] 검색 결과 목록 (`widgets/disclosure-search/ui/search-result-content.tsx`)
- [ ] URL 쿼리 파라미터 관리 훅 (`features/search-disclosures/model/use-search-params.ts`)

#### Phase 5: 최적화 및 UX 개선

- [ ] 디바운스 적용
- [ ] 최근 검색어 저장 (localStorage)
- [ ] 검색어 하이라이팅

---

## 📝 참고 자료

- [DART API 문서 - 공시검색](https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS001&apiId=2019001)
- [TanStack Query - Infinite Queries](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries)
- [@suspensive/react](https://suspensive.org/)
- 기존 구현: `spec/disclosure/today-disclosures.md`
- 기존 구현: `apps/web/widgets/disclosure-list-page/ui/disclosure-content.tsx` (무한 스크롤 패턴)
