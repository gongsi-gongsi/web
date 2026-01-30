# 오늘의 공시 무한 스크롤 구현 스펙

## 📋 요구사항

- 초기 로드: 20개 (서버 prefetch)
- 추가 로드: 20개씩 무한 스크롤 (클라이언트)
- Intersection Observer는 재사용 가능한 커스텀 훅으로 분리 (`shared/hooks`)
- 기존 메인 페이지 위젯(`useTodayDisclosures`)은 변경하지 않음

---

## 🔧 구현 대상

### 새로 생성 (3개)

| 파일                                                                   | 설명                            |
| ---------------------------------------------------------------------- | ------------------------------- |
| `apps/web/shared/hooks/use-in-view.ts`                                 | Intersection Observer 커스텀 훅 |
| `apps/web/shared/hooks/index.ts`                                       | 훅 export                       |
| `apps/web/entities/disclosure/model/use-infinite-today-disclosures.ts` | 무한 스크롤 쿼리 훅             |

### 수정 (6개)

| 파일                                                              | 변경 내용                                                                          |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `apps/web/entities/disclosure/model/types.ts`                     | `DartApiResponse` 페이지네이션 필드 추가, `PaginatedDisclosuresResponse` 타입 추가 |
| `apps/web/app/api/disclosures/today/route.ts`                     | `page_no`, `page_count` 파라미터 수용, 페이지네이션 메타데이터 응답                |
| `apps/web/entities/disclosure/api/get-today-disclosures.ts`       | `getTodayDisclosuresPaginated` 함수 추가                                           |
| `apps/web/entities/disclosure/index.ts`                           | 신규 함수/타입 export                                                              |
| `apps/web/widgets/disclosure-list-page/ui/disclosure-content.tsx` | `useInfiniteTodayDisclosures` + `useInView`로 교체                                 |
| `apps/web/app/disclosures/today/page.tsx`                         | `prefetchInfiniteQuery`로 변경                                                     |

---

## 📐 타입 변경

### `DartApiResponse` 수정

```typescript
export interface DartApiResponse {
  status: string
  message: string
  page_no: number // 추가
  page_count: number // 추가
  total_count: number // 추가
  total_page: number // 추가
  list: DartDisclosureItem[]
}
```

### `PaginatedDisclosuresResponse` 추가

```typescript
export interface PaginatedDisclosuresResponse {
  disclosures: Disclosure[]
  totalCount: number
  totalPage: number
  pageNo: number
  pageCount: number
  lastUpdated: string
}
```

> `TodayDisclosuresResponse`는 메인 위젯에서 사용 중이므로 변경하지 않음

---

## 🌐 API 라우트 변경

### 파라미터 추가

```
GET /api/disclosures/today?market=all&page_no=1&page_count=20
```

- `page_no`: 페이지 번호 (기본값: 1)
- `page_count`: 페이지당 건수 (기본값: 100, 하위호환)

### 응답 변경

기존 `{ disclosures, totalCount, lastUpdated }`에서 페이지네이션 필드 추가:

```typescript
{
  disclosures: Disclosure[],
  totalCount: number,     // DART total_count
  totalPage: number,      // DART total_page
  pageNo: number,         // DART page_no
  pageCount: number,      // DART page_count
  lastUpdated: string
}
```

> 기존 호출(`page_no`/`page_count` 미전달)은 `page_count=100`으로 동작하여 하위호환 유지.
> 응답에 추가 필드가 포함되지만, 기존 `TodayDisclosuresResponse` 타입 소비자는 런타임에서 무시.

---

## 🪝 커스텀 훅

### `useInView` (`shared/hooks/use-in-view.ts`)

```typescript
interface UseInViewOptions {
  threshold?: number // 기본값: 0
  rootMargin?: string // 기본값: '0px'
  enabled?: boolean // 기본값: true
}

function useInView(options?: UseInViewOptions): {
  ref: (node: HTMLElement | null) => void // callback ref
  inView: boolean
}
```

- callback ref 패턴 사용 (useEffect + useRef 대비 stale ref 문제 없음)
- `enabled=false` 시 observer disconnect 및 inView를 false로 설정

### `useInfiniteTodayDisclosures`

```typescript
function useInfiniteTodayDisclosures(market: Market): UseSuspenseInfiniteQueryResult

// queryKey: ['disclosures', 'todayInfinite', market]
// queryFn: getTodayDisclosuresPaginated(market, pageParam, 20)
// getNextPageParam: pageNo < totalPage ? pageNo + 1 : undefined
// initialPageParam: 1
```

- `useSuspenseInfiniteQuery` 사용 (기존 Suspense/ErrorBoundary 호환)
- 쿼리 키를 `todayInfinite`로 분리하여 기존 `today` 쿼리 캐시와 충돌 방지

---

## 🖥 컴포넌트 변경

### `disclosure-content.tsx`

**변경 전**: `useTodayDisclosures` → `data.disclosures` 렌더링
**변경 후**: `useInfiniteTodayDisclosures` → `data.pages.flatMap(p => p.disclosures)` 렌더링

추가되는 요소:

1. `useInView` 훅으로 스크롤 하단 감지 (rootMargin: 200px)
2. `useEffect`로 inView 시 `fetchNextPage()` 호출
3. 로딩 인디케이터 (`isFetchingNextPage` 시)
4. 끝 메시지 (`!hasNextPage` 시)

### `page.tsx`

- `prefetchQuery` → `prefetchInfiniteQuery`
- `getTodayDisclosures` → `getTodayDisclosuresPaginated`
- queryKey: `['disclosures', 'todayInfinite', market]`

---

## 📊 데이터 흐름

```
[서버] prefetchInfiniteQuery → 첫 20개 (page_no=1)
  ↓ HydrationBoundary
[클라이언트] useSuspenseInfiniteQuery → 즉시 렌더링
  ↓ 스크롤
[Intersection Observer] inView = true
  ↓
fetchNextPage() → page_no=2 → 20개 추가
  ↓ 반복
pageNo >= totalPage → 끝 메시지
```

---

## 구현 순서

1. `types.ts` - 타입 추가
2. `route.ts` - API 라우트 수정
3. `get-today-disclosures.ts` - 페이지네이션 API 클라이언트 추가
4. `shared/hooks/use-in-view.ts` + `index.ts` - 커스텀 훅 생성
5. `use-infinite-today-disclosures.ts` - 무한 스크롤 훅 생성
6. `entities/disclosure/index.ts` - export 추가
7. `disclosure-content.tsx` - 무한 스크롤 적용
8. `page.tsx` - prefetch 변경
