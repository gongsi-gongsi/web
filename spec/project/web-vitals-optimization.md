# Web Vitals 최적화 가이드

## Context

배포 후 PageSpeed Insights 측정 결과 FCP, LCP, Speed Index가 여전히 높게 측정됨.
이전 최적화(스트리밍 렌더링, 탭 전환 개선)로 구조적 문제는 해결했으나, 리소스 로딩 및 번들 측면의 병목이 남아있음.

---

## 작업 1: 폰트 서브셋팅 (CRITICAL)

**문제:** `PretendardVariable.woff2`가 **2MB**. 전체 유니코드 범위(CJK 전체 + 라틴 + 키릴 등)를 포함하고 있어 다운로드에 1~3초 소요. `display: swap` 적용으로 FCP는 시스템 폰트로 먼저 렌더링되지만, 폰트 로드 완료 시 텍스트 리플로우(FOUT)가 발생해 Speed Index와 LCP 점수 하락.

**해결:** subset-font 또는 fonttools(pyftsubset)로 한글(가~힣) + 라틴 + 숫자 + 기호만 추출

```bash
# fonttools 사용 예시
pyftsubset PretendardVariable.woff2 \
  --output-file=PretendardVariable-subset.woff2 \
  --flavor=woff2 \
  --unicodes="U+0020-007E,U+2000-206F,U+2190-21FF,U+2200-22FF,U+25A0-25FF,U+3000-303F,U+3131-318E,U+AC00-D7A3,U+FF01-FF60"
```

**수정 파일:**

- `apps/web/public/fonts/PretendardVariable.woff2` → 서브셋 파일로 교체

**기대 효과:** 2MB → ~300-500KB (70-85% 감소), FOUT 시간 대폭 단축

---

## 작업 2: ReactQueryDevtools 프로덕션 제거 (CRITICAL)

**문제:** `providers.tsx`에서 `ReactQueryDevtools`가 조건 없이 렌더링. 프로덕션에서도 DevTools 번들(~50-100KB)이 포함됨.

**수정 파일:** `apps/web/app/providers.tsx`

```tsx
// Before: 항상 로드
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
;<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />

// After: 개발 환경에서만 lazy 로드
import { lazy } from 'react'
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then(m => ({
    default: m.ReactQueryDevtools,
  }))
)

{
  process.env.NODE_ENV === 'development' && (
    <Suspense fallback={null}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </Suspense>
  )
}
```

**기대 효과:** 프로덕션 JS 번들 ~50-100KB 감소

---

## 작업 3: force-dynamic 제거 및 ISR 적용 (HIGH)

**문제:** `page.tsx`에 `export const dynamic = 'force-dynamic'` 설정으로 매 요청마다 서버에서 렌더링. Vercel CDN Edge 캐시가 무효화되어 TTFB 증가.

**수정 파일:** `apps/web/app/page.tsx`

```tsx
// Before: 매 요청마다 서버 렌더링
export const dynamic = 'force-dynamic'

// After: 30초 ISR 적용
export const revalidate = 30
```

**주의사항:**

- 빌드 시 DB 연결이 불가능하면 빌드 에러 발생 가능 → 각 prefetch 함수에 try-catch 추가 필요
- 또는 `dynamicParams`와 함께 사용

**기대 효과:** CDN 캐시 히트 시 TTFB 200-500ms → <50ms, FCP/LCP 전반적 개선

---

## 작업 4: API 라우트 Cache-Control 헤더 추가 (HIGH)

**문제:** `/api/stocks/popular`만 캐시 헤더가 있고, 나머지 API는 매 요청마다 원본 서버 호출

**수정 파일 및 캐시 정책:**

| API 라우트                       | s-maxage | stale-while-revalidate | 이유                |
| -------------------------------- | -------- | ---------------------- | ------------------- |
| `api/disclosures/today/route.ts` | 30s      | 60s                    | 실시간성 필요       |
| `api/news/major/route.ts`        | 300s     | 600s                   | 뉴스는 자주 안 바뀜 |
| `api/stocks/suggest/route.ts`    | 3600s    | 7200s                  | 기업 목록 거의 불변 |

```tsx
return NextResponse.json(data, {
  headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
})
```

**기대 효과:** CDN 캐시 히트 시 API 응답 200-500ms → <50ms

---

## 작업 5: 회사 상세 페이지 탭 lazy loading (MEDIUM)

**문제:** 5개 탭 컴포넌트가 모두 즉시 로드됨. recharts(~40KB gzipped) 포함.

**수정 파일:** `widgets/company-detail-page/ui/company-detail-page.tsx`

```tsx
import dynamic from 'next/dynamic'

const SummarySection = dynamic(
  () =>
    import('@/widgets/financial-statements/ui/financial-section').then(m => ({
      default: m.SummarySection,
    })),
  { ssr: false }
)
// FinancialSection, CompanyDisclosureSection, CompanyNewsSection 동일 패턴
```

**기대 효과:** 초기 JS 번들 ~40-60KB 감소, 활성 탭 코드만 로드

---

## 작업 6: 마이페이지 아바타 next/image 적용 (LOW)

**문제:** `<img>` 태그 직접 사용으로 이미지 최적화 미적용

**수정 파일:**

- `widgets/mypage/ui/mypage-page.tsx` - `<img>` → `<Image>` 교체
- `next.config.ts` - Google OAuth 아바타 도메인 remotePatterns 추가

**기대 효과:** 아바타 자동 WebP 변환 및 lazy loading 적용

---

## 수정 대상 파일 요약

| 파일                                                            | 작업 | 변경 유형                  |
| --------------------------------------------------------------- | ---- | -------------------------- |
| `apps/web/public/fonts/PretendardVariable.woff2`                | 1    | 서브셋 파일로 교체         |
| `apps/web/app/providers.tsx`                                    | 2    | DevTools 조건부 로드       |
| `apps/web/app/page.tsx`                                         | 3    | force-dynamic → revalidate |
| `app/api/disclosures/today/route.ts`                            | 4    | Cache-Control 헤더         |
| `app/api/news/major/route.ts`                                   | 4    | Cache-Control 헤더         |
| `app/api/stocks/suggest/route.ts`                               | 4    | Cache-Control 헤더         |
| `widgets/company-detail-page/ui/company-detail-page.tsx`        | 5    | dynamic import             |
| `widgets/company-detail-page/ui/company-disclosure-section.tsx` | 5    | useMemo 추가               |
| `widgets/mypage/ui/mypage-page.tsx`                             | 6    | img → next/image           |
| `next.config.ts`                                                | 6    | remotePatterns 추가        |

## 검증 방법

- PageSpeed Insights 재측정 (FCP, LCP, Speed Index 확인)
- 폰트 파일 크기 확인 (목표: 500KB 이하)
- 프로덕션 빌드 시 ReactQueryDevtools 번들 미포함 확인
- API 응답 헤더에 Cache-Control 포함 확인 (`curl -I`)
- 회사 상세 페이지 네트워크 탭에서 탭 클릭 시 동적 청크 로드 확인
- `pnpm build` 성공 확인
