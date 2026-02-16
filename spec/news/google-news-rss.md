# 구글 뉴스 RSS 기반 뉴스 목록 기능 명세서

## 📋 기능 개요

Google News RSS를 활용하여 기업 관련 뉴스를 수집하고, 홈 페이지와 기업 상세 페이지에서 표시하는 기능입니다.

### 목적

- 투자자에게 기업 관련 최신 뉴스를 실시간 제공
- 기업 상세 페이지의 '뉴스' 탭 활성화 (현재 "준비중" 상태)
- 홈 페이지에 주요 뉴스 섹션 추가

### 데이터 소스

- **Google News RSS**: `https://news.google.com/rss/search?q={기업명}&hl=ko&gl=KR&ceid=KR:ko`
- XML 파싱: 프로젝트에 이미 설치된 `xml2js` 사용
- 검색 쿼리: DB의 `corpName`(기업명) 사용

---

## 🎯 요구사항

### 1. 기업 상세 페이지 — 뉴스 탭

- **위치**: `/companies/[corpCode]` → 뉴스 탭
- **동작**:
  - `corpCode`로 기업명 조회 → 기업명으로 Google News RSS 검색
  - 최대 10건 표시
  - 뉴스 클릭 시 원문 링크 새 탭 열기
- **표시 정보**:
  - 뉴스 제목
  - 뉴스 매체명 (예: 한국경제, 매일경제)
  - 게시 시간 (상대 시간: "5분 전", "2시간 전")

### 2. 홈 페이지 — AI 선별 주요 경제 뉴스 섹션

- **위치**: `PopularCompaniesSection` 아래
- **동작**:
  1. Google News RSS로 경제/증시 뉴스 30~50건 수집 (`q=한국 경제 증시 주식`)
  2. Gemini API에 뉴스 제목 목록 전달 → 투자자에게 중요한 뉴스 5건 선별
  3. 선별된 뉴스만 표시
- **AI 선별 기준**: 시장 영향력, 투자 의사결정 관련성, 중복 제거
- **표시 정보**: 뉴스 제목, 매체명, 게시 시간
- **캐싱**: AI 응답 포함 10분 캐싱 (API 비용 절감)

### 3. 서버 캐싱

- **캐싱 전략**: Next.js fetch `revalidate: 300` (5분)
- **태그**: `['news', query]`
- **이유**: Google News RSS는 실시간성이 낮고, 과도한 요청 시 차단 가능

---

## 🎨 UI/UX 상세

### 기업 상세 — 뉴스 탭 (모바일)

```
┌─────────────────────────────────────────┐
│  [요약] [재무제표] [공시] [뉴스] [커뮤니티]  │
├─────────────────────────────────────────┤
│                                         │
│  삼성전자, 반도체 초격차 전략 발표         │
│  한국경제 · 2시간 전                      │
│  ─────────────────────────────────────  │
│  삼성전자 4분기 영업이익 시장 기대 상회      │
│  매일경제 · 5시간 전                      │
│  ─────────────────────────────────────  │
│  삼성전자, AI 반도체 투자 확대 계획         │
│  조선비즈 · 8시간 전                      │
│  ─────────────────────────────────────  │
│  ...                                    │
│                                         │
└─────────────────────────────────────────┘
```

### 기업 상세 — 뉴스 탭 (PC)

```
┌──────────────────────────────────────────────────────────────────┐
│  [요약] [재무제표] [공시] [뉴스] [커뮤니티]                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  삼성전자, 반도체 초격차 전략 발표                                    │
│  한국경제 · 2시간 전                                                │
│                                                                  │
│  삼성전자 4분기 영업이익 시장 기대 상회                                │
│  매일경제 · 5시간 전                                                │
│                                                                  │
│  삼성전자, AI 반도체 투자 확대 계획                                   │
│  조선비즈 · 8시간 전                                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 홈 — AI 선별 주요 뉴스 섹션

```
┌─────────────────────────────────────────┐
│  🤖 AI가 선별한 주요 경제 뉴스             │
├─────────────────────────────────────────┤
│  코스피, 외국인 매수에 2700 돌파          │
│  한국경제 · 1시간 전                      │
│  ─────────────────────────────────────  │
│  반도체 수출 역대 최대... 삼성·SK 수혜     │
│  매일경제 · 3시간 전                      │
│  ─────────────────────────────────────  │
│  한은 기준금리 동결... 하반기 인하 가능성   │
│  조선비즈 · 5시간 전                      │
│  ─────────────────────────────────────  │
│  ...                                    │
└─────────────────────────────────────────┘
```

### 공통 인터랙션

- **로딩**: 스켈레톤 UI (제목 + 매체명 라인)
- **에러**: "뉴스를 불러올 수 없습니다" + 재시도 버튼
- **빈 목록**: "관련 뉴스가 없습니다" 메시지
- **외부 링크**: `target="_blank" rel="noopener noreferrer"`

---

## 🔧 기술 구현 방안

### 아키텍처 (FSD)

```
apps/web/
├── app/
│   └── api/
│       └── news/
│           ├── route.ts                        # 기업 뉴스 (RSS 직접)
│           └── curated/
│               └── route.ts                    # AI 선별 뉴스 (RSS + Gemini)
│
├── entities/
│   └── news/
│       ├── index.ts                            # 클라이언트 export
│       ├── server.ts                           # 서버 export
│       ├── model/
│       │   └── types.ts                        # NewsItem, CuratedNewsResponse 타입
│       ├── api/
│       │   └── google-news/
│       │       ├── server.ts                   # [서버] RSS fetch + xml2js 파싱
│       │       ├── curate.ts                   # [서버] Gemini로 뉴스 선별
│       │       └── client.ts                   # [클라이언트] /api/news 호출
│       ├── lib/
│       │   └── format-news.ts                  # RSS XML → NewsItem 변환
│       └── queries/
│           ├── hooks.ts                        # useCompanyNews, useCuratedNews 훅
│           └── index.ts                        # export
│
├── widgets/
│   ├── company-detail-page/
│   │   └── ui/
│   │       └── company-news-section.tsx        # 기업 상세 뉴스 섹션 (신규)
│   └── home-news-section/
│       ├── index.ts                            # export
│       └── home-news-section.tsx               # 홈 AI 선별 뉴스 섹션 (신규)
│
└── shared/
    └── lib/
        ├── query-keys.ts                       # news 쿼리 키 추가
        └── gemini/
            └── client.ts                       # Gemini API 클라이언트 (신규)
```

### Google News RSS 응답 구조

```xml
<rss version="2.0">
  <channel>
    <title>삼성전자 - Google 뉴스</title>
    <item>
      <title>삼성전자, 반도체 초격차 전략 발표</title>
      <link>https://news.google.com/rss/articles/CBMi...</link>
      <guid>unique-id-hash</guid>
      <pubDate>Fri, 13 Feb 2026 07:04:59 GMT</pubDate>
      <description>HTML snippet with source info</description>
      <source url="https://www.hankyung.com">한국경제</source>
    </item>
    ...
  </channel>
</rss>
```

### 데이터 모델

```typescript
// entities/news/model/types.ts

export interface NewsItem {
  title: string // 뉴스 제목
  link: string // Google News 리다이렉트 링크
  pubDate: string // 게시 시간 (ISO 8601)
  source: string // 매체명 (예: 한국경제)
  sourceUrl: string // 매체 URL
}

export interface NewsResponse {
  items: NewsItem[]
  query: string // 검색 쿼리 (기업명)
  fetchedAt: string // 조회 시간 (ISO 8601)
}

// 홈 AI 선별 뉴스용
export interface CuratedNewsResponse {
  items: NewsItem[] // AI가 선별한 뉴스 (5건)
  fetchedAt: string
}
```

### Gemini API — 뉴스 선별

```typescript
// shared/lib/gemini/client.ts
// @google/generative-ai 패키지 사용

// entities/news/api/google-news/curate.ts
export async function getCuratedEconomicNews(): Promise<CuratedNewsResponse>
// 1. RSS로 "한국 경제 증시 주식" 뉴스 30~50건 수집
// 2. 뉴스 제목 목록을 Gemini에 전달
// 3. 프롬프트: "투자자에게 가장 중요한 뉴스 5건의 인덱스를 JSON 배열로 반환"
// 4. Gemini 응답으로 원본 NewsItem 필터링
// 5. revalidate: 600 (10분 캐싱)
```

**Gemini 프롬프트 예시:**

```
다음은 오늘의 한국 경제/증시 뉴스 제목 목록입니다.
개인 투자자에게 가장 중요하고 영향력 있는 뉴스 5건을 선별해주세요.
중복되는 주제는 하나만 선택하세요.

뉴스 목록:
1. 코스피, 외국인 매수에 2700 돌파
2. 삼성전자 반도체 투자 확대...
...

응답 형식 (JSON만 반환):
[1, 5, 12, 23, 31]
```

### API 설계

#### Route Handler

```typescript
// app/api/news/route.ts
// GET /api/news?q=삼성전자&limit=10
// → Google News RSS fetch → xml2js 파싱 → JSON 응답
```

#### 서버 함수

```typescript
// entities/news/api/google-news/server.ts
export async function getGoogleNews(query: string, limit: number = 10): Promise<NewsResponse>
// - fetch RSS with revalidate: 300, tags: ['news', query]
// - xml2js.parseStringPromise() → NewsItem[] 변환
```

#### 클라이언트 함수

```typescript
// entities/news/api/google-news/client.ts
export async function getNewsByCorpName(corpName: string, limit?: number): Promise<NewsResponse>
// - fetch('/api/news?q={corpName}&limit={limit}')
```

### Query Keys

```typescript
// shared/lib/query-keys.ts에 추가
news: {
  company: (corpName: string) => [corpName],  // 기업 뉴스
  curated: null,                               // AI 선별 뉴스
},
```

### React Query 설정

```typescript
// entities/news/queries/hooks.ts
export function useCompanyNews(corpName: string, limit?: number) {
  return useSuspenseQuery({
    queryKey: queries.news.company(corpName).queryKey,
    queryFn: () => getNewsByCorpName(corpName, limit),
    staleTime: 5 * 60 * 1000, // 5분간 fresh
  })
}

export function useCuratedNews() {
  return useSuspenseQuery({
    queryKey: queries.news.curated.queryKey,
    queryFn: () => getCuratedNews(),
    staleTime: 10 * 60 * 1000, // 10분간 fresh
  })
}
```

### 캐싱 전략

| 대상            | 레이어        | 캐싱 시간 | 설명                               |
| --------------- | ------------- | --------- | ---------------------------------- |
| 기업 뉴스 (RSS) | Next.js fetch | 5분       | Google News RSS 서버 캐싱          |
| 기업 뉴스       | React Query   | 5분       | 클라이언트 캐싱                    |
| AI 선별 뉴스    | Next.js fetch | 10분      | RSS + Gemini 응답 캐싱 (비용 절감) |
| AI 선별 뉴스    | React Query   | 10분      | 클라이언트 캐싱                    |

---

## 🚀 구현 단계

### Phase 1: 데이터 레이어 (RSS + 기본 API)

1. `entities/news/model/types.ts` — 타입 정의 (NewsItem, NewsResponse, CuratedNewsResponse)
2. `entities/news/lib/format-news.ts` — RSS XML → NewsItem 변환
3. `entities/news/api/google-news/server.ts` — 서버 RSS fetch
4. `entities/news/api/google-news/client.ts` — 클라이언트 API 호출
5. `app/api/news/route.ts` — 기업 뉴스 API Route
6. `shared/lib/query-keys.ts` — news 쿼리 키 추가
7. `entities/news/queries/hooks.ts` — useCompanyNews 훅
8. `entities/news/index.ts`, `entities/news/server.ts` — barrel export

### Phase 2: 기업 상세 뉴스 탭

1. `widgets/company-detail-page/ui/company-news-section.tsx` — 뉴스 섹션 컴포넌트
2. `widgets/company-detail-page/ui/company-detail-page.tsx` 수정 — `ComingSoon` → `CompanyNewsSection`

### Phase 3: AI 선별 뉴스 (홈)

1. `@google/generative-ai` 패키지 설치
2. `shared/lib/gemini/client.ts` — Gemini API 클라이언트
3. `entities/news/api/google-news/curate.ts` — RSS 수집 + Gemini 선별 로직
4. `app/api/news/curated/route.ts` — AI 선별 뉴스 API Route
5. `entities/news/queries/hooks.ts` — useCuratedNews 훅 추가
6. `widgets/home-news-section/home-news-section.tsx` — 홈 AI 뉴스 위젯
7. `widgets/home-news-section/index.ts` — barrel export
8. `app/page.tsx` 수정 — 뉴스 섹션 추가

---

## 📁 파일 목록

| 작업 | 파일 경로                                                               |
| ---- | ----------------------------------------------------------------------- |
| 신규 | `entities/news/model/types.ts`                                          |
| 신규 | `entities/news/api/google-news/server.ts`                               |
| 신규 | `entities/news/api/google-news/client.ts`                               |
| 신규 | `entities/news/api/google-news/curate.ts`                               |
| 신규 | `entities/news/lib/format-news.ts`                                      |
| 신규 | `entities/news/queries/hooks.ts`                                        |
| 신규 | `entities/news/queries/index.ts`                                        |
| 신규 | `entities/news/index.ts`                                                |
| 신규 | `entities/news/server.ts`                                               |
| 신규 | `shared/lib/gemini/client.ts`                                           |
| 신규 | `app/api/news/route.ts`                                                 |
| 신규 | `app/api/news/curated/route.ts`                                         |
| 신규 | `widgets/company-detail-page/ui/company-news-section.tsx`               |
| 신규 | `widgets/home-news-section/home-news-section.tsx`                       |
| 신규 | `widgets/home-news-section/index.ts`                                    |
| 수정 | `shared/lib/query-keys.ts` — news 키 추가                               |
| 수정 | `widgets/company-detail-page/ui/company-detail-page.tsx` — 뉴스 탭 연결 |
| 수정 | `app/page.tsx` — 홈 뉴스 섹션 추가                                      |

## 의존성 추가

- `@google/generative-ai` — Gemini API 클라이언트

## 환경변수 추가

- `GEMINI_API_KEY` — Google AI Studio에서 발급한 API 키 (키 이름: `gongsi-gongsi-news-summary-key`)

## 재사용 기존 코드

- `xml2js` (이미 설치됨) — RSS XML 파싱
- `getBaseUrl()` (`shared/lib/get-base-url.ts`) — 클라이언트 API 호출
- `queries` (`shared/lib/query-keys.ts`) — 쿼리 키 팩토리
- `useCompanyInfo()` (`entities/company`) — corpCode → corpName 조회
- `ErrorBoundaryWithFallback` (`shared/lib/error-boundary`) — 에러 처리
- `formatRelativeTime()` (`shared/lib/format-relative-time.ts`) — 상대 시간 포맷팅

---

## ⚠️ 주의사항

### Google News RSS 제한

- 요청당 최대 100건 반환
- 과도한 요청 시 IP 차단 가능 → 5분 캐싱 필수
- RSS 구조가 사전 공지 없이 변경될 수 있음
- 최근 30일 이내 뉴스만 제공

### 보안

- RSS fetch는 서버 사이드에서만 수행 (API Route 경유)
- 클라이언트에서 직접 Google News 호출 금지 (CORS 이슈)

---

## ✅ 검증

1. 기업 상세 → 뉴스 탭 → 해당 기업 관련 뉴스 표시
2. 홈 → 뉴스 섹션 표시
3. 뉴스 링크 클릭 → 새 탭에서 원문 열림
4. 에러 시 → 에러 폴백 UI 표시
5. `pnpm --filter web exec tsc --noEmit` 통과
