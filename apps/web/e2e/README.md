# E2E 테스트 가이드

> Playwright 기반 E2E 테스트 구현 과정, 핵심 개념, 트러블슈팅 기록.

---

## 목차

1. [테스트 실행](#1-테스트-실행)
2. [테스트 파일 구조](#2-테스트-파일-구조)
3. [Playwright 핵심 개념](#3-playwright-핵심-개념)
4. [트러블슈팅: 겪은 문제들과 해결 방법](#4-트러블슈팅-겪은-문제들과-해결-방법)
5. [CI 환경 설정](#5-ci-환경-설정)

---

## 1. 테스트 실행

```bash
# 전체 E2E 테스트 실행 (chromium + mobile-chrome)
pnpm --filter web test:e2e

# UI 모드로 실행 (인터랙티브하게 디버깅)
pnpm --filter web exec playwright test --ui

# 특정 파일만 실행
pnpm --filter web exec playwright test e2e/glossary.spec.ts

# 특정 프로젝트(뷰포트)만 실행
pnpm --filter web exec playwright test --project=chromium
pnpm --filter web exec playwright test --project=mobile-chrome
```

---

## 2. 테스트 파일 구조

```
e2e/
├── glossary.spec.ts   # 투자 용어집 (데스크톱 패널 + 모바일 바텀시트)
├── home.spec.ts       # 홈페이지 기본 네비게이션
├── notices.spec.ts    # 공지사항 목록 (SSR + 카테고리 필터)
└── search.spec.ts     # 기업 검색 자동완성
```

### `playwright.config.ts` 핵심 설정

```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } }, // 1280x720
  { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } }, // 393x851
]
```

두 프로젝트를 동시에 실행하므로 **같은 테스트가 데스크톱/모바일 두 환경에서 모두 통과**해야 합니다.

---

## 3. Playwright 핵심 개념

### Locator 종류와 차이

| Locator               | 동작 방식             | 주의사항                             |
| --------------------- | --------------------- | ------------------------------------ |
| `getByRole()`         | ARIA 트리 기반 탐색   | `display:none` 요소 자동 제외        |
| `getByText()`         | DOM 텍스트 기반 탐색  | 숨겨진 요소도 찾음, 기본값 부분 매칭 |
| `getByPlaceholder()`  | placeholder 속성 기반 | 숨겨진 input도 찾음                  |
| `locator(':visible')` | CSS visibility 체크   | 조상에 `display:none`이면 제외       |
| `locator('role')`     | CSS 선택자 + role     | 유연하게 조합 가능                   |

### Strict Mode

Playwright는 기본적으로 **strict mode**입니다. Locator가 여러 요소를 매칭하면 에러가 발생합니다.

```typescript
// ❌ "삼성전자우"도 "삼성전자" 포함 → 2개 매칭 → strict mode 에러
await page.getByText('삼성전자').click()

// ✅ exact: true로 정확히 일치하는 요소만
await page.getByRole('link', { name: '삼성전자', exact: true }).click()

// ✅ .first()로 strict mode 우회 (의도적으로 첫 번째 선택)
await page.getByRole('button', { name: /^PER/ }).first().click()
```

### `page.route()` — API 모킹

```typescript
// 브라우저에서 발생하는 HTTP 요청만 인터셉트 가능
await page.route('**/api/stocks/suggest**', route => {
  route.fulfill({ json: { suggestions: [...] } })
})
```

> **중요**: `page.route()`는 **브라우저 요청만** 인터셉트합니다.
> Next.js SSR 단계에서 서버가 직접 DB를 호출하는 요청은 인터셉트할 수 없습니다.

### Auto-wait

Playwright의 `click()`, `fill()`, `expect()` 등은 모두 **자동으로 대기**합니다.

```typescript
// 별도 sleep 없이도, 요소가 나타날 때까지 자동 대기 (기본 5초)
await page.getByRole('link', { name: '삼성전자' }).click()

// expect도 마찬가지 (조건이 충족될 때까지 polling)
await expect(page.getByRole('dialog')).toBeVisible()
```

---

## 4. 트러블슈팅: 겪은 문제들과 해결 방법

### 문제 1 — 듀얼 DOM 구조 (glossary.spec.ts)

**상황**: GlossaryPage와 SearchPage는 데스크톱/모바일 섹션을 **동시에 DOM에 렌더링**하고 CSS로 하나를 숨깁니다.

```tsx
<div className="hidden md:flex">  {/* 데스크톱 전용 */}
  <GlossarySidebar />
</div>
<div className="md:hidden">       {/* 모바일 전용 */}
  <GlossaryMobile />
</div>
```

**문제**: `getByText('PER')`는 숨겨진 섹션의 요소도 찾음 → `toBeVisible()` 실패.

```typescript
// ❌ 두 섹션 모두에서 'PER' 찾음 → 하나는 hidden → 실패
await expect(page.getByText('PER')).toBeVisible()

// ✅ getByRole은 ARIA 트리 탐색 → hidden 요소 자동 제외
await expect(page.getByRole('button', { name: /^PER/ }).first()).toBeVisible()

// ✅ :visible 필터 적용
await page.locator('span:visible').filter({ hasText: '재무제표' }).first().click()
await expect(page.locator('p:visible').filter({ hasText: /검색 결과/ })).toBeVisible()

// ✅ dialog scope로 모달 내부만 탐색
await expect(page.getByRole('dialog').getByText('설명')).toBeVisible()
```

---

### 문제 2 — 검색 Input Hidden (home.spec.ts, search.spec.ts)

**상황**: `/search` 페이지에 input이 두 개 동시 렌더링됩니다.

```tsx
// 모바일 헤더 (md:hidden) → placeholder: "회사명 검색"
<MobileHeader center={<SearchAutocomplete />} />

// 데스크톱 (hidden md:block) → placeholder: "기업명으로 검색해보세요"
<div className="hidden md:block">
  <SearchAutocomplete variant="banner" placeholder="기업명으로 검색해보세요" />
</div>
```

**문제**: 데스크톱(chromium)에서 `getByPlaceholder(/회사명/)` → MobileHeader 안의 input(hidden) 찾음 → 실패.

```typescript
// ❌ 데스크톱에서 MobileHeader input은 display:none
await page.getByPlaceholder(/회사명/).fill('삼성')

// ✅ :visible로 현재 뷰포트에서 보이는 input만 선택
// "회사명 검색", "기업명으로 검색해보세요" 모두 "검색" 포함
const searchInput = (page: Page) => page.locator('input:visible[placeholder*="검색"]')
```

---

### 문제 3 — API Mock 포맷 불일치 (search.spec.ts)

**상황**: mock 응답 키와 실제 API 응답 키가 다릅니다.

```typescript
// 실제 클라이언트 코드 (suggest-companies/client.ts)
const data: SuggestCompaniesResponse = await response.json()
return data.suggestions // "suggestions" 키를 기대

// ❌ mock이 "items" 키를 반환 → data.suggestions === undefined → 에러
route.fulfill({ json: { items: MOCK_SEARCH_RESULTS } })

// ✅
route.fulfill({ json: { suggestions: MOCK_SEARCH_RESULTS } })
```

---

### 문제 4 — SSR이 `page.route()` 우회 (notices.spec.ts)

**상황**: 공지사항 페이지는 SSR에서 `prefetchNotices()`로 DB를 직접 조회합니다.

```
[브라우저] page.route() mock ──→ 브라우저 fetch만 차단 ✓
[서버] prefetchNotices() SSR ──→ Node.js에서 DB 직접 호출 → mock 우회 ✗
```

**추가로** mock 포맷도 틀렸습니다.

```typescript
// 실제 API 응답 타입 (NoticeListResponse)
{ data: NoticeListItem[], pagination: { page, limit, total, totalPages } }

// ❌ 기존 mock (포맷 완전 불일치)
{ items: [...], total: 2, page: 1, limit: 10 }
```

**해결**: DB 데이터에 의존하지 않고 **항상 렌더링되는 정적 요소만** 테스트.

```typescript
// ✅ h1은 서버 렌더링 HTML에 항상 존재 (데이터 무관)
await expect(page.getByRole('heading', { name: '공지사항' })).toBeVisible()

// ✅ 카테고리 버튼은 NOTICE_CATEGORY_LABELS 상수에서 렌더링 → DB 무관
await expect(page.getByRole('button', { name: '전체' })).toBeVisible()
await expect(page.getByRole('button', { name: '서비스' })).toBeVisible()

// ✅ 카테고리 클릭 후 발생하는 클라이언트 fetch는 mock 적용 가능
//    (SSR은 초기 렌더링만, 이후 상태 변경 fetch는 브라우저에서 발생)
await page.route('**/api/notices**', route => {
  route.fulfill({
    json: { data: [], pagination: { page: 1, limit: 5, total: 0, totalPages: 0 } },
  })
})
await page.getByRole('button', { name: '서비스' }).click()
await expect(page.getByRole('button', { name: '서비스' })).toHaveClass(/bg-primary/)
```

---

### 문제 5 — Next.js App Router 네비게이션 타이밍 (search.spec.ts)

**상황**: 검색 결과 링크 클릭 후 URL이 바뀌지 않음 (chromium 한정).

**원인**: Next.js App Router는 서버 컴포넌트 fetch가 완료될 때까지 URL을 업데이트하지 않습니다. SSR이 느리면 `toHaveURL` timeout 발생.

```typescript
// ❌ SSR 응답 전까지 URL이 바뀌지 않아 5초 안에 timeout
await link.click()
await expect(page).toHaveURL(/\/companies\/00126380/)

// ✅ href 속성으로 링크 목적지 확인 → SSR 타이밍 무관
await expect(companyLink).toHaveAttribute('href', '/companies/00126380')
```

> **교훈**: `toHaveURL`은 실제 SSR 네비게이션 완료를 기다립니다.
> 단순히 "링크가 올바른 URL을 가리키는가"를 검증할 때는 `toHaveAttribute('href', ...)`가 더 안정적입니다.

---

### 문제 6 — CI 환경 설정

**문제 1** — Supabase env vars 없어서 미들웨어 크래시:

```typescript
// middleware.ts 에 가드 추가
export async function updateSession(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request }) // env 없으면 그냥 통과
  }
  // ...
}
```

**문제 2** — `@gs/ui` 패키지 빌드 안 된 채로 테스트 실행:

```yaml
# .github/workflows/ci.yml
- name: Build UI package
  run: pnpm --filter @gs/ui build # 먼저 빌드

- name: Install Playwright browsers
  run: pnpm --filter web exec playwright install chromium --with-deps

- name: Run E2E tests
  run: pnpm --filter web test:e2e
```

---

## 5. CI 환경 설정

```yaml
e2e:
  runs-on: ubuntu-latest
  env:
    # Supabase 없이 테스트 통과 (미들웨어 가드로 처리)
    NEXT_PUBLIC_SUPABASE_URL: ''
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ''
  steps:
    - name: Build UI package # @gs/ui 먼저 빌드 필수
    - name: Install Playwright # chromium만 설치 (용량 절약)
    - name: Run E2E tests
```

### 로컬 vs CI 동작 차이

|             | 로컬                        | CI                          |
| ----------- | --------------------------- | --------------------------- |
| 서버 재사용 | `reuseExistingServer: true` | 매번 새로 시작              |
| Supabase    | `.env.local` 있음           | env vars 없음 (가드로 처리) |
| DB 접근     | 가능                        | 없음                        |
| Retry       | 0회                         | 2회                         |
| Workers     | 멀티                        | 1 (순차 실행)               |
