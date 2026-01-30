# 공시 목록 페이지 기획서

## 📋 페이지 개요

오늘 등록된 모든 공시를 시장별로 필터링하여 확인할 수 있는 전체 목록 페이지입니다.

### 목적

- 오늘의 공시 위젯에서 보여주지 못한 나머지 공시 확인
- 시장별 전체 공시 탐색 및 검색
- 공시 상세 정보 접근

### 접근 경로

- **URL**: `/disclosures`
- **진입점**: 오늘의 공시 위젯의 "더보기" 버튼
- **쿼리 파라미터**: `?market=kospi` (선택한 시장 유지)

---

## 🎯 요구사항

### 1. 페이지 헤더

- **제목**: "공시 목록"
- **설명**: "오늘 등록된 모든 공시를 확인하세요"
- **레이아웃**: 페이지 상단, 고정 위치

### 2. 시장별 필터링

- **탭 네비게이션**: 전체, 코스피, 코스닥, 코스넥
- **URL 연동**: 탭 선택 시 쿼리 파라미터 업데이트
- **초기 상태**:
  - 쿼리 파라미터가 있으면 해당 시장 선택
  - 없으면 "전체" 선택

### 3. 공시 목록 표시

- **표시 개수**: 모든 공시 (최대 100개, DART API 제한)
- **정렬**: 최신순 (접수 시간 기준 내림차순)
- **빈 목록**: "등록된 공시가 없습니다" 메시지

### 4. 반응형 디자인

#### PC 버전 (768px 이상)

- **레이아웃**: 테이블 형식
- **컬럼**:
  - 접수시각 (HH:MM)
  - 회사명 (종목코드)
  - 시장구분 (뱃지)
  - 공시제목
  - 공시유형
- **인터랙션**:
  - 행 hover 시 배경색 변경
  - 행 클릭 시 DART 공시 상세 페이지로 이동 (새 탭)

#### 모바일 버전 (768px 미만)

- **레이아웃**: 카드 리스트
- **카드 구성**:
  - 시장 뱃지
  - 회사명
  - 공시제목
  - 접수일자
- **인터랙션**:
  - 카드 터치 시 피드백
  - 카드 클릭 시 DART 공시 상세 페이지로 이동

---

## 🎨 UI/UX 상세

### 모바일 디자인 (최종 기획)

#### 1. 헤더 컴포넌트

```
┌─────────────────────────────────────────┐
│  ← (뒤로가기)                            │
└─────────────────────────────────────────┘
```

- **좌측**: 뒤로가기 버튼 (`<` 아이콘)
  - 클릭 시 이전 페이지로 이동 (`router.back()`)
  - 크기: 44x44px (터치 영역)
  - 색상: `text-foreground`
- **우측**: 빈 공간 (향후 필터/검색 아이콘 배치 가능)
- **배경**: `bg-card` (카드 배경색)
- **높이**: 56px
- **하단 구분선**: `border-b border-border`

#### 2. 타이틀 영역

```
┌─────────────────────────────────────────┐
│  오늘의 공시                              │
│  오늘 올라온 공시 목록입니다              │
└─────────────────────────────────────────┘
```

- **제목**: "오늘의 공시"
  - 폰트: `text-xl font-bold` (20px, 굵게)
  - 색상: `text-foreground`
  - 여백: `px-4 pt-6 pb-2`
- **설명**: "오늘 올라온 공시 목록입니다"
  - 폰트: `text-sm` (14px)
  - 색상: `text-muted-foreground`
  - 여백: `px-4 pb-4`

#### 3. 탭바 (시장 필터)

참고 이미지의 "전체 / 국내 / 해외" 디자인 적용

```
┌─────────────────────────────────────────┐
│  전체   유가증권   코스닥   코스닥        │
│  ──                                      │
└─────────────────────────────────────────┘
```

- **탭 항목**: 전체, 유가증권, 코스닥, 코넥스
- **레이아웃**:
  - 수평 스크롤 가능 (`overflow-x-auto`)
  - 탭 간 간격: `gap-6`
  - 패딩: `px-4`
- **비활성 탭**:
  - 색상: `text-muted-foreground`
  - 폰트: `text-sm font-medium`
- **활성 탭**:
  - 색상: `text-foreground`
  - 폰트: `text-sm font-bold`
  - 하단 언더라인: 2px 두께, `bg-foreground`
  - 애니메이션: 부드러운 전환 (`transition-all duration-300`)
- **하단 구분선**: `border-b border-border`
- **높이**: 48px (탭 영역 + 구분선)

#### 4. 공시 목록 (카드 리스트)

기존 DisclosureCard 유지, 무한 스크롤 추가

```
┌─────────────────────────────────────────┐
│  [유] 삼성전자     2024년 4분기...  01.29│
│  [코] SK하이닉스   자사주 매입...   01.29│
│  [넥] 카카오       최대주주 변경... 01.28│
│  ...                                     │
│  (스크롤)                                │
│  ...                                     │
│  [로딩 스피너] 더 불러오는 중...         │
└─────────────────────────────────────────┘
```

- **카드 디자인**: 기존 DisclosureCard 재사용
  - 배경: `bg-card`
  - 테두리: `rounded-xl`
  - 패딩: `px-4 py-3`
  - 간격: `gap-2`
- **리스트 컨테이너**:
  - 패딩: `px-4 pb-4`
  - 카드 간 간격: `gap-2`
- **무한 스크롤**:
  - 스크롤이 하단 500px 이내로 도달 시 다음 페이지 로드
  - 로딩 인디케이터: 하단에 스피너 표시
  - 더 이상 데이터 없을 시: "모든 공시를 불러왔습니다" 메시지
- **가상화 (Virtual Scroll)**:
  - 라이브러리: `@tanstack/react-virtual` 또는 `react-window`
  - 뷰포트에 보이는 아이템만 렌더링
  - 성능 최적화 (1000+ 아이템 대응)

#### 5. 전체 레이아웃

```
┌─────────────────────────────────────────┐
│  ← (뒤로가기)                     [헤더] │
├─────────────────────────────────────────┤
│  오늘의 공시                      [타이틀]│
│  오늘 올라온 공시 목록입니다               │
├─────────────────────────────────────────┤
│  전체   유가증권   코스닥   코넥스  [탭바]│
│  ──                                      │
├─────────────────────────────────────────┤
│                                   [목록] │
│  [유] 삼성전자     ...           01.29   │
│  [코] SK하이닉스   ...           01.29   │
│  [넥] 카카오       ...           01.28   │
│  ...                                     │
│  (무한 스크롤)                           │
│  ...                                     │
│  [로딩 중...]                            │
│                                          │
└─────────────────────────────────────────┘
```

- **배경색**:
  - 전체 페이지: `bg-background`
  - 헤더/타이틀/탭바: `bg-card`
  - 목록 영역: `bg-background`
- **스크롤 영역**: 목록 영역 전체 (헤더/타이틀/탭바는 고정)
- **Sticky Header**:
  - 헤더는 상단 고정 (`sticky top-0`)
  - 탭바도 헤더 아래 고정 가능 (선택사항)

### 페이지 구조

```
┌─────────────────────────────────────────────────────────┐
│  공시 목록                                                │
│  오늘 등록된 모든 공시를 확인하세요                        │
├─────────────────────────────────────────────────────────┤
│  [전체] [코스피] [코스닥] [코스넥]                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [공시 목록 테이블 또는 카드]                              │
│                                                          │
│  ... (모든 공시)                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 페이지 헤더

```tsx
<div className="mb-8">
  <h1 className="text-2xl font-bold md:text-3xl">공시 목록</h1>
  <p className="mt-2 text-sm text-muted-foreground">오늘 등록된 모든 공시를 확인하세요</p>
</div>
```

### 로딩 상태

- **Suspense Fallback**: 탭 스켈레톤 + 테이블/카드 스켈레톤
- **애니메이션**: pulse 효과

### 에러 상태

- **ErrorBoundary Fallback**:
  - 에러 메시지: "공시 정보를 불러오는데 실패했습니다"
  - "다시 시도" 버튼

### 빈 목록 상태

```tsx
<div className="py-12 text-center">
  <p className="text-sm text-muted-foreground">등록된 공시가 없습니다</p>
</div>
```

---

## 🔧 기술 구현

### 라우팅 및 컴포넌트 구조

```
apps/web/app/disclosures/
├── page.tsx                         # 메인 페이지
└── ui/
    ├── mobile-header.tsx            # 모바일 헤더 (뒤로가기)
    ├── page-title.tsx               # 페이지 타이틀 영역
    ├── disclosure-list.tsx          # 공시 목록 컴포넌트
    ├── disclosure-list-skeleton.tsx # 로딩 스켈레톤
    └── virtual-disclosure-list.tsx  # 가상화된 공시 목록 (선택)
```

#### 컴포넌트별 역할

##### 1. `mobile-header.tsx` - 모바일 헤더

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react' // 또는 다른 아이콘 라이브러리

export function MobileHeader() {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-card px-4 md:hidden">
      <button
        onClick={() => router.back()}
        className="flex size-11 items-center justify-center rounded-lg hover:bg-accent"
        aria-label="뒤로가기"
      >
        <ChevronLeft className="size-6" />
      </button>
    </header>
  )
}
```

##### 2. `page-title.tsx` - 타이틀 영역

```tsx
export function PageTitle() {
  return (
    <div className="bg-card px-4 pb-4 pt-6 md:hidden">
      <h1 className="text-xl font-bold">오늘의 공시</h1>
      <p className="mt-1 text-sm text-muted-foreground">오늘 올라온 공시 목록입니다</p>
    </div>
  )
}
```

### 페이지 컴포넌트

```tsx
// apps/web/app/disclosures/page.tsx
import { Suspense } from 'react'
import { ErrorBoundary } from '@suspensive/react'
import { DisclosureList } from './ui/disclosure-list'
import { DisclosureListSkeleton } from './ui/disclosure-list-skeleton'

export default function DisclosuresPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl">공시 목록</h1>
          <p className="mt-2 text-sm text-muted-foreground">오늘 등록된 모든 공시를 확인하세요</p>
        </div>

        <ErrorBoundary fallback={ErrorFallback}>
          <Suspense fallback={<DisclosureListSkeleton />}>
            <DisclosureList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  )
}
```

### 공시 목록 컴포넌트

```tsx
// apps/web/app/disclosures/ui/disclosure-list.tsx
'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTodayDisclosures, type Market } from '@/entities/disclosure'
import { MarketTabs } from '@/widgets/today-disclosures/ui/market-tabs'
import { DisclosureTable } from '@/widgets/today-disclosures/ui/disclosure-table'
import { DisclosureCardList } from '@/widgets/today-disclosures/ui/disclosure-card-list'

export function DisclosureList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMarket = (searchParams.get('market') as Market) || 'all'
  const [selectedMarket, setSelectedMarket] = useState<Market>(initialMarket)

  const { data } = useTodayDisclosures(selectedMarket)

  function handleMarketChange(market: Market) {
    setSelectedMarket(market)
    const params = new URLSearchParams(searchParams.toString())
    params.set('market', market)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <MarketTabs selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
      </div>

      {/* PC 버전 - 테이블 */}
      <div className="hidden md:block">
        <DisclosureTable disclosures={data.disclosures} />
      </div>

      {/* 모바일 버전 - 카드 */}
      <div className="md:hidden">
        <DisclosureCardList disclosures={data.disclosures} />
      </div>

      {/* 빈 목록 상태 */}
      {data.disclosures.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">등록된 공시가 없습니다</p>
        </div>
      )}
    </div>
  )
}
```

### 데이터 Fetching

#### 기본 전략

- **Hook**: `useTodayDisclosures(market)` (기존 재사용)
- **API**: `/api/disclosures/today?market={market}`
- **캐싱**: 30초 서버 캐싱 + React Query 클라이언트 캐싱
- **자동 갱신**: 30초마다 refetch (탭 활성 시)

#### 무한 스크롤 (Infinite Scroll)

```tsx
// entities/disclosure/model/use-infinite-disclosures.ts
import { useInfiniteQuery } from '@tanstack/react-query'

export function useInfiniteDisclosures(market: Market = 'all') {
  return useInfiniteQuery({
    queryKey: ['disclosures', 'infinite', market],
    queryFn: ({ pageParam = 1 }) => getDisclosures(market, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // 다음 페이지가 있으면 페이지 번호 반환, 없으면 undefined
      return lastPage.hasMore ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 30000,
  })
}
```

- **TanStack Query의 `useInfiniteQuery` 사용**
- **페이지네이션**: 페이지 번호 기반 (1, 2, 3, ...)
- **트리거**: 스크롤이 하단 500px 이내 도달 시
- **Intersection Observer 활용**: `useInView` 훅

#### 가상화 (Virtual Scroll)

```tsx
// 라이브러리: @tanstack/react-virtual
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualDisclosureList({ disclosures }: Props) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: disclosures.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // 카드 예상 높이 (px)
    overscan: 5, // 뷰포트 외곽에 추가 렌더링할 아이템 수
  })

  return (
    <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <DisclosureCard disclosure={disclosures[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- **라이브러리**: `@tanstack/react-virtual`
- **렌더링 최적화**: 뷰포트에 보이는 아이템만 DOM에 렌더링
- **메모리 절약**: 1000+ 아이템도 부드러운 스크롤
- **Overscan**: 스크롤 시 깜빡임 방지

### 상태 관리

- **Suspense**: 로딩 상태 (선언적)
- **ErrorBoundary**: 에러 상태 (선언적)
- **URL Query**: 선택된 시장 상태 (`useSearchParams`)

---

## 🚀 개선 사항 (향후)

### Phase 1: 기본 기능

- [x] 전체 공시 목록 표시
- [x] 시장별 필터링
- [x] 반응형 디자인
- [x] 로딩/에러 처리

### Phase 2: 검색 및 필터링

- [ ] 공시 제목/회사명 검색
- [ ] 공시 유형별 필터링 (정기공시, 주요사항, 공정공시)
- [ ] 날짜 범위 선택 (오늘, 3일, 1주일, 1개월)

### Phase 3: 페이지네이션

- [ ] 무한 스크롤 (모바일)
- [ ] 페이지네이션 (PC)
- [ ] "더 불러오기" 버튼

### Phase 4: 정렬 및 보기 옵션

- [ ] 정렬 기준 선택 (최신순, 회사명순)
- [ ] 보기 방식 전환 (테이블/카드) - PC 전용
- [ ] 목록 개수 선택 (20, 50, 100)

### Phase 5: 상세 기능

- [ ] 공시 북마크/즐겨찾기
- [ ] 공시 알림 설정
- [ ] 공시 공유 기능
- [ ] 공시 상세 모달 (DART 페이지 대신)

---

## 📊 성능 목표

- **초기 로딩**: 2초 이내
- **탭 전환**: 즉시 (캐시 hit 시)
- **스크롤 성능**: 60fps 유지
- **메모리 사용**: 공시 100개 기준 10KB 이하

---

## 🔄 데이터 흐름

```
1. 사용자 접근 (/disclosures?market=kospi)
   ↓
2. DisclosuresPage 렌더링
   ↓
3. Suspense fallback 표시
   ↓
4. DisclosureList 마운트
   ↓
5. useTodayDisclosures('kospi') 호출
   ↓
6. API 요청: /api/disclosures/today?market=kospi
   ↓
7. 서버 캐시 확인 (30초 이내면 캐시 반환)
   ↓
8. DART API 호출 (캐시 미스 시)
   ↓
9. 데이터 변환 및 반환
   ↓
10. 공시 목록 렌더링
    ↓
11. 사용자 탭 전환 시 → 5번으로
```

---

## 🎯 성공 지표

### 사용성

- 페이지 이탈률 < 30%
- 평균 체류 시간 > 2분
- 탭 전환율 > 40%

### 성능

- LCP (Largest Contentful Paint) < 2.5초
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

---

## 📝 참고 자료

- [오늘의 공시 위젯 명세서](./today-disclosures.md)
- [DART API 문서](https://opendart.fssnet.or.kr/guide/main.do)
- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [@suspensive/react](https://suspensive.org/)

---

## 🔗 관련 페이지

- **메인 페이지** (`/`): 오늘의 공시 위젯 포함
- **공시 목록 페이지** (`/disclosures`): 전체 공시 목록
- **공시 상세 페이지** (향후): 개별 공시 상세 정보

---

**최종 업데이트**: 2026-01-30
