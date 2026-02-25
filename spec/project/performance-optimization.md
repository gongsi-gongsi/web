# 성능 최적화 가이드

## Context

배포된 서비스가 느리다는 피드백. 특히 오늘의 공시 탭 전환 시 매번 스켈레톤이 노출되는 문제가 가장 심각. 회사 상세 페이지는 모든 탭 콘텐츠(recharts 포함)가 한번에 로드되어 초기 번들이 큼. API 라우트 대부분에 캐시 헤더가 없음.

---

## 작업 1: 오늘의 공시 탭 전환 성능 개선 (HIGH)

**문제:** `router.replace()`로 URL을 변경하면 Next.js가 라우트 전체를 재평가하고, `<Suspense key={selectedMarket}>`이 언마운트/리마운트되어 매 탭 클릭마다 스켈레톤이 노출됨 (300~500ms 지연)

### 수정 파일

#### `widgets/disclosure-list-page/ui/disclosure-list.tsx`

- `router.replace()` 제거 → `useState`로 변경
- 모바일/PC에서 `DisclosureContent`를 2개 마운트하는 구조 → 1개로 통합 (쿼리 인스턴스 절반 감소)

```tsx
// Before: router.replace() + DisclosureContent 2개 인스턴스
const router = useRouter()
const searchParams = useSearchParams()
const marketParam = searchParams.get('market')
const selectedMarket = isValidMarket(marketParam) ? marketParam : 'all'

function handleMarketChange(market: Market) {
  const params = new URLSearchParams(searchParams.toString())
  params.set('market', market)
  router.replace(`?${params.toString()}`, { scroll: false })
}

// After: useState + DisclosureContent 1개
const [selectedMarket, setSelectedMarket] = useState<Market>('all')

return (
  <>
    {/* 모바일 탭 */}
    <div className="sticky top-14 z-10 bg-card will-change-transform md:hidden">
      <MarketTabs selectedMarket={selectedMarket} onMarketChange={setSelectedMarket} />
    </div>
    {/* PC 탭 */}
    <div className="mb-6 hidden md:block">
      <MarketTabs selectedMarket={selectedMarket} onMarketChange={setSelectedMarket} />
    </div>
    {/* 콘텐츠 1개 */}
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense key={selectedMarket} fallback={<DisclosureListSkeleton />}>
        <DisclosureContent selectedMarket={selectedMarket} />
      </Suspense>
    </ErrorBoundary>
  </>
)
```

#### `widgets/disclosure-list-page/ui/disclosure-content.tsx`

- `deduplicateDisclosures` 결과를 `useMemo`로 메모이제이션

```tsx
// Before: 매 렌더마다 재계산
const disclosures = deduplicateDisclosures(data.pages.flatMap(page => page.disclosures))

// After: data.pages가 변경될 때만 재계산
const disclosures = useMemo(
  () => deduplicateDisclosures(data.pages.flatMap(page => page.disclosures)),
  [data.pages]
)
```

#### `widgets/today-disclosures/ui/market-tabs.tsx`

- window resize 리스너에 디바운스 추가 (150ms)

```tsx
// Before: 매 픽셀마다 DOM 쿼리
window.addEventListener('resize', updateIndicator)

// After: 150ms 디바운스
let timeoutId: ReturnType<typeof setTimeout>
const debouncedUpdate = () => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(updateIndicator, 150)
}
window.addEventListener('resize', debouncedUpdate)
```

#### `widgets/company-detail-page/ui/company-detail-page.tsx` (CompanyTabs 함수)

- 동일하게 resize 리스너 디바운스 추가

### 기대 효과

- 탭 전환 체감 지연: 300~500ms → 즉시
- 쿼리 인스턴스 2개 → 1개 (메모리 절감)
- resize 이벤트 DOM 접근 빈도 대폭 감소

---

## 작업 2: 회사 상세 페이지 탭 lazy loading (HIGH)

**문제:** 5개 탭의 모든 컴포넌트가 즉시 로드됨. SummarySection/FinancialSection이 recharts(~40KB gzipped)를 import하므로, 공시/뉴스 탭만 볼 사용자도 차트 라이브러리를 다운로드

### 수정 파일

#### `widgets/company-detail-page/ui/company-detail-page.tsx`

- 4개 탭 컴포넌트를 `next/dynamic`으로 lazy loading 변경
- `ssr: false` (이미 `'use client'` 컴포넌트)

```tsx
// Before: 즉시 import
import { FinancialSection, SummarySection } from '@/widgets/financial-statements'
import { CompanyDisclosureSection } from './company-disclosure-section'
import { CompanyNewsSection } from './company-news-section'

// After: dynamic import
import dynamic from 'next/dynamic'

const SummarySection = dynamic(
  () =>
    import('@/widgets/financial-statements/ui/financial-section').then(m => ({
      default: m.SummarySection,
    })),
  { ssr: false }
)
const FinancialSection = dynamic(
  () =>
    import('@/widgets/financial-statements/ui/financial-section').then(m => ({
      default: m.FinancialSection,
    })),
  { ssr: false }
)
const CompanyDisclosureSection = dynamic(
  () => import('./company-disclosure-section').then(m => ({ default: m.CompanyDisclosureSection })),
  { ssr: false }
)
const CompanyNewsSection = dynamic(
  () => import('./company-news-section').then(m => ({ default: m.CompanyNewsSection })),
  { ssr: false }
)
```

#### `widgets/company-detail-page/ui/company-disclosure-section.tsx`

- `deduplicateDisclosures` 결과를 `useMemo`로 메모이제이션 (작업 1과 동일 패턴)

```tsx
// Before
const disclosures = deduplicateDisclosures(data.pages.flatMap(page => page.disclosures))

// After
const disclosures = useMemo(
  () => deduplicateDisclosures(data.pages.flatMap(page => page.disclosures)),
  [data.pages]
)
```

### 기대 효과

- 초기 JS 번들 ~40-60KB gzipped 감소 (recharts + 탭별 코드)
- 활성 탭의 코드만 로드, 비활성 탭은 클릭 시 로드
- 기존 Suspense fallback 스켈레톤이 동적 로딩 중 표시됨

---

## 작업 3: API 라우트 Cache-Control 헤더 추가 (MEDIUM)

**문제:** `/api/stocks/popular`만 캐시 헤더가 있고, 나머지 API는 매 요청마다 원본 서버 호출

### 수정 파일 및 캐시 정책

| API 라우트                       | s-maxage | stale-while-revalidate | 이유                                    |
| -------------------------------- | -------- | ---------------------- | --------------------------------------- |
| `api/disclosures/today/route.ts` | 30s      | 60s                    | 실시간성 필요, 클라이언트 staleTime 60s |
| `api/news/major/route.ts`        | 300s     | 600s                   | 뉴스는 자주 안 바뀜                     |
| `api/stocks/suggest/route.ts`    | 3600s    | 7200s                  | 기업 목록 거의 불변                     |

각 라우트의 `NextResponse.json()` 호출에 headers 옵션 추가:

```tsx
// api/disclosures/today/route.ts
return NextResponse.json(result, {
  headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
})

// api/news/major/route.ts
return NextResponse.json(data, {
  headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
})

// api/stocks/suggest/route.ts
return NextResponse.json(
  { suggestions },
  {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
  }
)
```

### 기대 효과

- CDN 캐시 히트 시 응답 시간: 200~500ms → <50ms
- 서버 부하 감소
- 특히 검색 자동완성(suggest) 1시간 캐시로 반복 요청 대폭 감소

---

## 작업 4: 마이페이지 아바타 next/image 적용 (LOW)

### 수정 파일

#### `widgets/mypage/ui/mypage-page.tsx`

- `<img>` 2곳(71행, 133행) → `next/image` Image 컴포넌트로 교체

```tsx
// Before
;<img src={avatarUrl} alt={name} className="size-16 rounded-full object-cover" />

// After
import Image from 'next/image'
;<Image
  src={avatarUrl}
  alt={name}
  width={64}
  height={64}
  className="size-16 rounded-full object-cover"
/>
```

#### `next.config.ts`

- `images.remotePatterns`에 Google OAuth 아바타 도메인 추가:

```tsx
const nextConfig: NextConfig = {
  // ... 기존 설정
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'lh3.googleusercontent.com' }],
  },
}
```

### 기대 효과

- 아바타 이미지 자동 WebP 변환 및 크기 최적화
- lazy loading 자동 적용

---

## 수정 대상 파일 요약

| 파일                                                            | 작업 | 변경 유형                                |
| --------------------------------------------------------------- | ---- | ---------------------------------------- |
| `widgets/disclosure-list-page/ui/disclosure-list.tsx`           | 1    | router.replace → useState, 컴포넌트 통합 |
| `widgets/disclosure-list-page/ui/disclosure-content.tsx`        | 1    | useMemo 추가                             |
| `widgets/today-disclosures/ui/market-tabs.tsx`                  | 1    | resize 디바운스                          |
| `widgets/company-detail-page/ui/company-detail-page.tsx`        | 1, 2 | resize 디바운스, dynamic import          |
| `widgets/company-detail-page/ui/company-disclosure-section.tsx` | 2    | useMemo 추가                             |
| `app/api/disclosures/today/route.ts`                            | 3    | Cache-Control 헤더                       |
| `app/api/news/major/route.ts`                                   | 3    | Cache-Control 헤더                       |
| `app/api/stocks/suggest/route.ts`                               | 3    | Cache-Control 헤더                       |
| `widgets/mypage/ui/mypage-page.tsx`                             | 4    | img → next/image                         |
| `next.config.ts`                                                | 4    | remotePatterns 추가                      |

## 검증 방법

- 오늘의 공시 탭 전환 시 스켈레톤 없이 즉시 전환 확인
- 회사 상세 페이지 → 공시/뉴스 탭에서 recharts 청크가 로드되지 않는지 네트워크 탭 확인
- `curl -I` 로 API 응답 헤더에 Cache-Control 포함 확인
- 마이페이지 아바타 정상 렌더링 확인
- `pnpm build` 성공 확인
