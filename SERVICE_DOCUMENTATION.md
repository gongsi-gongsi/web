# 공시공시 (GongsiGongsi) - 서비스 종합 기술 문서

> 면접 대비용 프로젝트 전체 분석 문서.
> 모든 기술 선택의 이유, 아키텍처 설계 의도, 캐싱 전략, 데이터 흐름을 포함합니다.

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [모노레포 구조와 선택 이유](#2-모노레포-구조와-선택-이유)
3. [기술 스택과 라이브러리 선택 이유](#3-기술-스택과-라이브러리-선택-이유)
4. [FSD 아키텍처 상세](#4-fsd-아키텍처-상세)
5. [라우팅과 페이지 구조](#5-라우팅과-페이지-구조)
6. [API Route 설계](#6-api-route-설계)
7. [데이터 페칭 전략](#7-데이터-페칭-전략)
8. [캐싱 전략 상세](#8-캐싱-전략-상세)
9. [인증 시스템](#9-인증-시스템)
10. [AI 기능 아키텍처](#10-ai-기능-아키텍처)
11. [UI 컴포넌트 시스템](#11-ui-컴포넌트-시스템)
12. [보안](#12-보안)
13. [성능 최적화](#13-성능-최적화)
14. [모니터링과 분석](#14-모니터링과-분석)
15. [CI/CD와 배포](#15-cicd와-배포)
16. [파일 구조 전체 맵](#16-파일-구조-전체-맵)

---

## 1. 프로젝트 개요

**공시공시**는 개인 투자자를 위한 AI 기반 공시 분석 서비스입니다.

### 핵심 기능

- 실시간 DART 공시 수집 및 검색
- AI 공시 요약 (LLM 기반 공시 원문 분석)
- AI 기업 요약 (기업 개요 자동 생성)
- 기업 재무제표 시각화 (연간/분기별 차트)
- 관심종목(watchlist) 관리
- 투자 용어 사전
- Google News 기반 시장/기업 뉴스

### 사용자 흐름

```
홈 → 인기 종목/오늘의 공시/주요 뉴스 확인
   → 종목 검색 → 종목 상세(재무/공시/뉴스/AI 요약)
   → 공시 상세 → AI 요약 생성
   → 관심종목 등록/관리
```

---

## 2. 모노레포 구조와 선택 이유

### 구조

```
gongsi-gongsi/web/
├── apps/
│   ├── web/        # 사용자용 앱 (Next.js 15, Port 3000)
│   └── admin/      # 관리자 앱 (Next.js 15, Port 3001)
├── packages/
│   ├── ui/                  # @gs/ui - 공통 UI 컴포넌트
│   ├── tailwind-config/     # @gs/tailwind-config - 테마/스타일
│   ├── typescript-config/   # @gs/typescript-config - TS 설정
│   ├── eslint-config/       # @gs/eslint-config - 린트 규칙
│   └── prettier-config/     # @gs/prettier-config - 포맷 규칙
├── turbo.json
└── pnpm-workspace.yaml
```

### 왜 모노레포인가?

**문제**: web과 admin 두 앱이 UI 컴포넌트, 스타일 테마, 린트/포맷 규칙을 공유해야 함.

**pnpm workspace 선택 이유**:

- `workspace:*` 프로토콜로 로컬 패키지를 npm처럼 참조 (`import { Button } from '@gs/ui'`)
- phantom dependency 방지: pnpm의 strict node_modules 구조가 명시적으로 선언한 의존성만 접근 허용
- 디스크 효율: 심볼릭 링크 기반이라 동일 패키지를 여러 번 설치하지 않음

**Turborepo 선택 이유**:

- 빌드 캐싱: `turbo build`가 변경되지 않은 패키지의 빌드를 건너뜀
- 태스크 오케스트레이션: `dependsOn: ["^build"]`로 의존 패키지 먼저 빌드
- 병렬 실행: 독립적인 태스크(lint, test)를 동시 실행
- `dev` 태스크: `persistent: true`로 개발 서버를 유지하면서 다른 태스크도 실행

```json
// turbo.json 핵심
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"], // 의존 패키지 먼저 빌드
      "outputs": [".next/**", "dist/**"] // 캐시할 빌드 결과
    },
    "dev": {
      "cache": false, // 개발 서버는 캐시하지 않음
      "persistent": true // 프로세스 유지
    }
  }
}
```

### 왜 Nx가 아닌 Turborepo인가?

- Turborepo가 설정이 간단하고 Next.js와 같은 Vercel 생태계
- Nx는 기능이 많지만 이 규모(앱 2개, 패키지 5개)에는 과도함
- Vercel 배포 시 Turborepo가 네이티브 통합됨

---

## 3. 기술 스택과 라이브러리 선택 이유

### 프레임워크

| 기술             | 선택 이유                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| **Next.js 15**   | App Router의 RSC(React Server Components), Streaming, ISR 지원. API Route로 BFF 패턴 구현. Vercel 배포 최적화 |
| **React 18**     | Suspense, Concurrent Features, useTransition 등 비동기 UI 패턴                                                |
| **TypeScript 5** | 타입 안전성, IDE 자동완성, 런타임 에러 사전 방지                                                              |

**왜 Next.js App Router인가?**

- `page.tsx`에서 서버 컴포넌트로 직접 DB/외부 API 호출 → API 중간 레이어 불필요
- `layout.tsx`로 중첩 레이아웃 → 공통 헤더/네비게이션 재렌더링 방지
- `loading.tsx`/Suspense → 스트리밍 SSR로 빠른 FCP(First Contentful Paint)
- `generateMetadata()` → 동적 SEO 메타데이터 (종목별 OG 태그)

### 데이터 페칭 & 상태 관리

| 라이브러리                         | 선택 이유                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| **TanStack Query v5**              | 서버 상태 캐싱, 자동 리패치, 옵티미스틱 업데이트, Suspense 통합                                 |
| **@lukemorales/query-key-factory** | 쿼리 키를 타입 안전하게 중앙 관리. `queries.company.info(corpCode).queryKey` 형태로 일관성 유지 |

**왜 Redux/Zustand가 아닌 TanStack Query인가?**

- 이 앱의 상태 대부분이 **서버 상태**(공시 목록, 기업 정보, 뉴스)
- 클라이언트 전용 상태(테마, 모달 열림)는 `useState`로 충분
- TanStack Query가 캐싱, 중복 요청 제거, 백그라운드 리패치를 자동 처리
- `staleTime` + `gcTime`으로 세밀한 캐시 제어 가능

### ORM & 데이터베이스

| 라이브러리             | 선택 이유                                                                |
| ---------------------- | ------------------------------------------------------------------------ |
| **Prisma 7**           | 타입 안전한 DB 쿼리 자동 생성, 스키마 마이그레이션, 직관적인 스키마 정의 |
| **@prisma/adapter-pg** | Prisma의 PostgreSQL 드라이버 어댑터 (Supabase 호환)                      |
| **pg**                 | Node.js PostgreSQL 드라이버 (connection pooling 지원)                    |

**왜 Prisma인가?**

- `prisma generate`로 DB 스키마에서 TypeScript 타입을 자동 생성
- `prisma.stock.findMany()` 같은 체이너블 API가 직관적
- 마이그레이션 히스토리로 DB 스키마 변경 추적

**Connection Pooling**:

```typescript
// shared/lib/prisma/client.ts
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
  // pool: { max: 10 } — 서버리스 환경에서 커넥션 폭발 방지
})
```

### 인증

| 라이브러리                | 선택 이유                                                     |
| ------------------------- | ------------------------------------------------------------- |
| **@supabase/supabase-js** | OAuth (Kakao/Google), 세션 관리, RLS(Row Level Security) 통합 |
| **@supabase/ssr**         | 서버 사이드에서 쿠키 기반 인증 세션 관리                      |

**왜 Supabase Auth인가?**

- NextAuth 대비: Supabase가 DB + Auth + Storage를 하나의 플랫폼으로 제공
- OAuth PKCE 플로우 내장 (보안성 높음)
- RLS로 DB 레벨에서 데이터 접근 제어 가능
- 무료 티어로 시작 가능

### 스타일링

| 라이브러리                         | 선택 이유                                                    |
| ---------------------------------- | ------------------------------------------------------------ |
| **Tailwind CSS v4**                | 유틸리티 퍼스트, 빌드 타임 CSS 생성, 디자인 시스템 토큰화    |
| **class-variance-authority (CVA)** | 컴포넌트 variant 시스템 (size, color 조합을 타입 안전하게)   |
| **clsx**                           | 조건부 className 조합 (`clsx('base', isActive && 'active')`) |
| **tailwind-merge**                 | Tailwind 클래스 충돌 해결 (`'p-4 p-2'` → `'p-2'`)            |

**왜 Tailwind v4인가?**

- v4의 CSS-first 설정: `tailwind.config.js`가 사라지고 `base.css`에서 `@theme`으로 직접 토큰 정의 → 설정 파일 1개 감소
- OKLch 색상 공간으로 다크모드 색상이 더 자연스러움
- PostCSS 플러그인 `@tailwindcss/postcss` 하나만 등록하면 됨

**왜 CSS-in-JS(Emotion, styled-components)가 아닌가?**

- RSC(React Server Components)와 호환 문제 — CSS-in-JS는 런타임에 스타일 생성하므로 서버 컴포넌트에서 사용 불가
- Tailwind은 빌드 타임에 CSS 생성 → 번들 크기 최적화
- 유틸리티 클래스가 일관된 디자인 시스템 강제

### UI 컴포넌트

| 라이브러리                | 선택 이유                                                       |
| ------------------------- | --------------------------------------------------------------- |
| **Radix UI**              | Headless(스타일 없는) 접근성 컴포넌트. WAI-ARIA 패턴 내장       |
| **@phosphor-icons/react** | 6가지 weight(thin~fill)의 아이콘 세트. Tree-shakeable           |
| **lucide-react**          | 추가 아이콘 세트 (Radix와 함께 사용)                            |
| **sonner**                | 토스트 알림. 선언적 API (`toast.success('저장됨')`)             |
| **motion**                | Framer Motion 후속. 애니메이션 라이브러리                       |
| **next-themes**           | 다크모드/라이트모드 토글. `class` 속성 기반으로 SSR 깜빡임 방지 |

**왜 MUI/Ant Design이 아닌 Radix UI + shadcn/ui인가?**

- **shadcn/ui 방식**: `npx shadcn add button`으로 소스 코드를 프로젝트에 복사. npm 패키지가 아니라 소스를 직접 소유
- **내부적으로 Radix UI primitive 사용**: `@radix-ui/react-dialog` 등은 npm으로 설치된 패키지. shadcn/ui가 이를 import해서 Tailwind + CVA 스타일을 입힌 래퍼 컴포넌트를 생성
- **Headless**: Radix primitive는 스타일 없이 동작/접근성만 제공 → Tailwind으로 자유롭게 스타일링
- **접근성**: Dialog의 포커스 트래핑, 키보드 네비게이션 등이 Radix 레벨에서 자동 처리
- **번들 크기**: 필요한 컴포넌트만 import (Dialog만 쓰면 Dialog만 번들에 포함)
- MUI는 Material Design 강제 + 큰 번들, Ant Design은 한국 서비스에 안 어울림
- **커스터마이징**: 래퍼 코드가 @gs/ui 패키지 안에 있으므로 자유롭게 수정 가능. npm 패키지 의존이 아니라 업데이트 충돌 없음

### 차트 & 데이터 시각화

| 라이브러리      | 선택 이유                                                   |
| --------------- | ----------------------------------------------------------- |
| **Recharts v3** | React 기반 차트. SVG 렌더링으로 반응형 지원. Composable API |

**왜 Chart.js/D3가 아닌 Recharts인가?**

- React 컴포넌트 방식으로 차트를 선언적으로 구성 (`<LineChart><Line /><XAxis /></LineChart>`)
- 반응형(`<ResponsiveContainer>`) 내장
- D3는 저수준이라 개발 시간이 많이 소요
- Chart.js는 `new Chart(ctx, config)` + `chart.update()` 같은 명령형 API. `react-chartjs-2` 래퍼가 있지만 내부적으로 명령형을 감싸는 것이라 React의 선언적 패러다임과 완벽히 맞지 않음

### 빌드 & 개발 도구

| 도구                    | 선택 이유                                                 |
| ----------------------- | --------------------------------------------------------- |
| **Vite**                | @gs/ui 라이브러리 빌드. ESBuild 기반 빠른 빌드            |
| **Vitest**              | @gs/ui 단위 테스트. Vite 설정 재사용                      |
| **Playwright**          | E2E 테스트. 크로스 브라우저 지원, 자동 대기(auto-waiting) |
| **Storybook 8**         | UI 컴포넌트 개발/문서화. 격리된 환경에서 컴포넌트 확인    |
| **Husky + lint-staged** | 커밋 시 자동 린트/포맷. 코드 품질 게이트                  |
| **Commitlint**          | Conventional Commits 강제. 일관된 커밋 메시지             |
| **Changesets**          | 시맨틱 버전 관리. 패키지별 독립 버전 업데이트             |

### 모니터링 & 분석

| 도구                      | 선택 이유                                                     |
| ------------------------- | ------------------------------------------------------------- |
| **Sentry**                | 에러 트래킹. 소스맵 업로드로 프로덕션 에러 디버깅             |
| **Vercel Analytics**      | 페이지뷰, 방문자 분석                                         |
| **Vercel Speed Insights** | Core Web Vitals (LCP, FID, CLS) 모니터링                      |
| **Google Analytics 4**    | 사용자 행동 분석. 커스텀 이벤트 (AI 요약 사용, 관심종목 등록) |

### 기타

| 라이브러리                | 선택 이유                                                                        |
| ------------------------- | -------------------------------------------------------------------------------- |
| **@suspensive/react**     | `<Suspense>`와 `<ErrorBoundary>`를 쉽게 조합. `useSuspenseQuery` 지원            |
| **server-only**           | 서버 전용 코드에 import하면 클라이언트 번들에 포함 시 빌드 에러 발생 → 실수 방지 |
| **nextjs-toploader**      | 페이지 전환 시 상단 프로그레스 바 (NProgress 기반)                               |
| **@next/third-parties**   | Google Analytics 스크립트를 최적화된 방식으로 로드                               |
| **@next/bundle-analyzer** | 번들 크기 분석. `ANALYZE=true pnpm build`로 시각화                               |
| **xml2js**                | Google News RSS XML 파싱                                                         |
| **dotenv**                | Prisma seed 스크립트에서 환경변수 로드                                           |

---

## 4. FSD 아키텍처 상세

### Feature-Sliced Design이란?

프론트엔드를 기능 단위로 슬라이스하는 아키텍처. 각 레이어는 아래 레이어만 의존할 수 있습니다.

```
app/      ← 라우팅, 레이아웃, 프로바이더 (최상위)
  ↑ 의존
widgets/  ← 독립적 UI 블록 (여러 feature/entity 조합)
  ↑ 의존
features/ ← 사용자 기능 (비즈니스 로직 + UI)
  ↑ 의존
entities/ ← 도메인 모델 (타입, API, 포맷팅)
  ↑ 의존
shared/   ← 공유 유틸리티 (인프라 코드) (최하위)
```

### 왜 FSD인가?

**문제**: 프로젝트가 커지면 `components/`, `hooks/`, `utils/` 같은 기술 기반 분류는 파일이 어디에 속하는지 알기 어려움.

**FSD 장점**:

- **기능 단위 캡슐화**: `features/toggle-watchlist/`에 관련 코드가 모두 있음
- **의존성 방향 강제**: 상위 레이어가 하위 레이어만 import → 순환 의존 방지
- **삭제 용이**: 기능 하나를 폴더째 삭제하면 끝
- **팀 작업**: 각자 다른 feature를 독립적으로 개발 가능

### 각 레이어별 슬라이스

#### shared/ — 인프라 코드 (13개 모듈)

| 경로                         | 역할                                                        |
| ---------------------------- | ----------------------------------------------------------- |
| `shared/lib/prisma/`         | Prisma 싱글톤 클라이언트, 에러 핸들링, 타입                 |
| `shared/lib/supabase/`       | Supabase 클라이언트 3종 (browser, server, admin) + 미들웨어 |
| `shared/lib/dart/`           | DART API 기본 클라이언트, 타입, 유틸리티                    |
| `shared/lib/query-keys.ts`   | TanStack Query 키 팩토리 (전체 쿼리 키 중앙 관리)           |
| `shared/lib/query/`          | QueryClient 생성 (서버: 요청마다 새로, 브라우저: 싱글톤)    |
| `shared/lib/analytics.ts`    | GA4 커스텀 이벤트 트래킹 함수들                             |
| `shared/lib/date.ts`         | 날짜 포맷팅 유틸리티                                        |
| `shared/lib/get-base-url.ts` | 환경별 base URL 결정 (클라이언트/서버/Vercel)               |
| `shared/lib/animations.ts`   | Motion 애니메이션 variant 정의                              |
| `shared/lib/seo/`            | JSON-LD 구조화 데이터 (Organization, WebSite, Company)      |
| `shared/lib/error-boundary/` | 에러 바운더리 래퍼 컴포넌트                                 |
| `shared/hooks/`              | `useIntersectionObserver` (무한 스크롤, 뷰포트 감지)        |
| `shared/ui/`                 | `BackButton` (최소한의 공유 UI)                             |

#### entities/ — 도메인 모델 (6개 엔티티)

| 엔티티         | 설명     | 주요 파일                                                              |
| -------------- | -------- | ---------------------------------------------------------------------- |
| **disclosure** | 공시     | 타입(Market, DisclosureType A~J), DART API 연동, 포맷팅, 무한스크롤 훅 |
| **company**    | 기업     | 기업개황, 재무제표(연간/분기), 잠정실적 파싱, 계정과목 매핑            |
| **news**       | 뉴스     | Google News RSS, 상대시간 포맷, 중복제거, 48시간 필터                  |
| **user**       | 사용자   | 현재 사용자 정보, OAuth 동기화, 인증 상태 구독                         |
| **watchlist**  | 관심종목 | CRUD API, 옵티미스틱 업데이트 (추가/삭제 시 즉시 UI 반영)              |
| **glossary**   | 용어사전 | 정적 데이터, 필터링/검색, 관련 용어 추천                               |

**엔티티 내부 구조** (disclosure 예시):

```
entities/disclosure/
├── index.ts          # barrel export
├── server.ts         # 서버 전용 export (server-only)
├── model/types.ts    # Market, DisclosureType, Disclosure 등 타입
├── api/
│   ├── today-disclosures/
│   │   ├── client.ts   # 브라우저에서 호출 (fetch /api/...)
│   │   └── server.ts   # 서버에서 직접 DART API 호출
│   ├── search-disclosures/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── popular-companies/
│   │   ├── client.ts
│   │   └── server.ts
│   └── suggest-companies/
│       ├── client.ts
│       └── server.ts
├── lib/
│   ├── format-disclosure.ts      # DART 응답 → 앱 모델 변환
│   ├── get-disclosure-type-label.ts  # A → "정기공시"
│   ├── get-disclosure-type-color.ts  # A → tailwind 색상 클래스
│   ├── get-market-badge.ts       # KOSPI → "유"
│   └── deduplicate-disclosures.ts
└── queries/
    ├── hooks.ts      # useQuery/useInfiniteQuery 훅 6개
    └── prefetch.ts   # 서버 사이드 프리페치
```

**왜 client.ts / server.ts를 분리하는가?**

- **server.ts**: `server-only` directive → DART API 키가 클라이언트에 노출되지 않음
- **server.ts**: 서버에서 직접 외부 API 호출 → Next.js의 `fetch` 캐싱 활용
- **client.ts**: 브라우저에서 `/api/*` Route Handler를 경유 → API 키 보호
- 동일한 데이터를 서버/클라이언트 양쪽에서 사용 가능

#### features/ — 사용자 기능 (7개)

| Feature                   | 설명           | 주요 컴포넌트                                                    |
| ------------------------- | -------------- | ---------------------------------------------------------------- |
| **ai-disclosure-summary** | 공시 AI 요약   | AiSummaryButton, AiSummaryModal, SummaryContent, SummaryProgress |
| **ai-company-summary**    | 기업 AI 요약   | AiSummaryCard (반응형 모바일/PC)                                 |
| **auth**                  | 인증           | useSignIn (OAuth PKCE), useSignOut                               |
| **search-disclosures**    | 공시 검색 필터 | useDisclosureSearchParams (URL 파라미터 동기화)                  |
| **toggle-watchlist**      | 관심종목 토글  | ToggleWatchlistButton (하트 아이콘 + 토스트)                     |
| **withdraw-account**      | 회원탈퇴       | WithdrawDialog (확인 다이얼로그)                                 |
| **glossary-search**       | 용어 검색      | GlossarySearch (검색 + 카테고리 필터)                            |

#### widgets/ — 복합 UI 블록 (15개)

| Widget                        | 설명                                       |
| ----------------------------- | ------------------------------------------ |
| **company-detail-page**       | 종목 상세 페이지 (탭: 요약/재무/공시/뉴스) |
| **financial-statements**      | 재무제표 차트 + 테이블 (연간/분기 토글)    |
| **today-disclosures**         | 오늘의 공시 리스트 (시장 필터, 무한스크롤) |
| **disclosure-list-page**      | 공시 목록 페이지 레이아웃                  |
| **disclosure-search**         | 종목 검색 페이지 (자동완성 + 인기종목)     |
| **popular-companies-section** | 인기 종목 그리드                           |
| **major-news-section**        | 주요 시장 뉴스                             |
| **banner-slider**             | 자동 슬라이드 배너 (7초 간격)              |
| **service-banner**            | 히어로 배너                                |
| **header**                    | 데스크톱/모바일 헤더                       |
| **footer**                    | 푸터 (약관, 개인정보처리방침 링크)         |
| **bottom-nav**                | 모바일 하단 네비게이션 (4탭)               |
| **auth**                      | 로그인 폼, 사용자 메뉴                     |
| **interests-page**            | 관심종목 관리 페이지                       |
| **mypage**                    | 마이페이지                                 |

---

## 5. 라우팅과 페이지 구조

### 페이지 목록

| 경로                    | 렌더링        | 인증 | 설명                                  |
| ----------------------- | ------------- | ---- | ------------------------------------- |
| `/`                     | Dynamic (SSR) | X    | 홈: 인기종목 + 오늘의 공시 + 주요뉴스 |
| `/login`                | Static        | X    | 로그인 (Kakao/Google OAuth)           |
| `/search`               | Dynamic       | X    | 종목 검색                             |
| `/disclosures/today`    | Dynamic (SSR) | X    | 오늘의 공시 목록 (서버 프리페치)      |
| `/companies/[corpCode]` | Dynamic (SSR) | X    | 종목 상세 (동적 메타데이터)           |
| `/interests`            | CSR           | O    | 관심종목 관리                         |
| `/mypage`               | CSR           | O    | 마이페이지                            |
| `/glossary`             | Static        | X    | 투자 용어 사전                        |
| `/privacy`              | Static        | X    | 개인정보처리방침                      |
| `/terms`                | Static        | X    | 이용약관                              |
| `/disclaimer`           | Static        | X    | 투자 면책                             |

### 렌더링 전략 선택 이유

**Dynamic (SSR)**:

- 홈, 공시 목록, 종목 상세: DB/외부 API 데이터가 자주 바뀜 → 항상 최신 데이터 필요
- `force-dynamic` export로 정적 생성 방지

**Static**:

- 용어 사전: 데이터가 하드코딩됨 → `force-static` 설정 (실제로는 없어도 Next.js가 자동으로 static 판단하지만, 명시적 의도 표현용)
- 약관, 개인정보처리방침: 정적 컨텐츠

**CSR (Client-Side)**:

- 관심종목, 마이페이지: 인증된 사용자의 개인 데이터 → 서버에서 프리렌더할 수 없음

### 서버 프리페치 패턴

```typescript
// app/disclosures/today/page.tsx
export default async function TodayDisclosurePage() {
  const queryClient = getQueryClient()

  // 서버에서 미리 데이터를 가져옴
  await prefetchTodayDisclosures(queryClient)
  await prefetchPopularCompanies(queryClient)

  return (
    // 프리페치된 데이터를 클라이언트에 전달
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Skeleton />}>
        <DisclosureListPage />
      </Suspense>
    </HydrationBoundary>
  )
}
```

**왜 이 패턴인가?**

1. 서버에서 `queryClient.prefetchQuery()`로 데이터를 미리 가져옴
2. `dehydrate(queryClient)`로 직렬화하여 HTML에 포함
3. 클라이언트에서 `HydrationBoundary`가 프리페치 데이터를 TanStack Query 캐시에 주입
4. `useQuery()`가 캐시 히트 → 추가 네트워크 요청 없이 즉시 렌더링
5. 이후 `staleTime` 만료 시 백그라운드에서 자동 리패치

---

## 6. API Route 설계

### Route Handler 목록

#### 공시 관련

| 메서드 | 경로                                    | 용도                      | 캐싱                   |
| ------ | --------------------------------------- | ------------------------- | ---------------------- |
| GET    | `/api/disclosures/today`                | 오늘의 공시               | `revalidate: 60` (1분) |
| GET    | `/api/disclosures/search`               | 공시 검색                 | 없음 (동적)            |
| GET    | `/api/disclosures/company/[corpCode]`   | 기업별 공시               | 없음 (동적)            |
| GET    | `/api/disclosures/summarized-ids`       | AI 요약 완료 공시 ID 목록 | 없음                   |
| POST   | `/api/disclosures/[rceptNo]/ai-summary` | AI 공시 요약 생성         | 없음 (mutation)        |

#### 기업 관련

| 메서드 | 경로                                   | 용도         | 캐싱                        |
| ------ | -------------------------------------- | ------------ | --------------------------- |
| GET    | `/api/companies/[corpCode]`            | 기업 정보    | `revalidate: 604800` (7일)  |
| GET    | `/api/companies/[corpCode]/financials` | 재무제표     | `revalidate: 86400` (1일)   |
| GET    | `/api/companies/[corpCode]/ai-summary` | AI 기업 요약 | `revalidate: 21600` (6시간) |

#### 뉴스

| 메서드 | 경로              | 용도           | 캐싱                    |
| ------ | ----------------- | -------------- | ----------------------- |
| GET    | `/api/news`       | 뉴스 검색      | `revalidate: 300` (5분) |
| GET    | `/api/news/major` | 주요 시장 뉴스 | `revalidate: 300` (5분) |

#### 종목

| 메서드 | 경로                  | 용도      | 캐싱                               |
| ------ | --------------------- | --------- | ---------------------------------- |
| GET    | `/api/stocks/popular` | 인기 종목 | `Cache-Control: max-age=300` (5분) |
| GET    | `/api/stocks/suggest` | 자동완성  | 없음 (실시간)                      |

#### 사용자

| 메서드          | 경로                              | 용도          | 인증          |
| --------------- | --------------------------------- | ------------- | ------------- |
| GET/POST/DELETE | `/api/watchlist`                  | 관심종목 CRUD | Supabase Auth |
| GET             | `/api/watchlist/check/[corpCode]` | 관심종목 확인 | 선택적        |
| DELETE          | `/api/user/delete`                | 회원탈퇴      | Supabase Auth |
| GET             | `/auth/callback`                  | OAuth 콜백    | -             |

#### 시스템

| 메서드 | 경로                            | 용도                                             |
| ------ | ------------------------------- | ------------------------------------------------ |
| GET    | `/api/cron/cleanup-search-logs` | 7일 이상 검색 로그 삭제 (Vercel Cron, 매일 자정) |

### API Route의 역할

Next.js API Route는 **BFF(Backend For Frontend)** 패턴으로 동작합니다:

```
브라우저 → API Route → 외부 API (DART, Supabase, AI Server)
              │
              ├── 인증 확인 (Supabase 세션)
              ├── 입력 검증 (regex, 타입 체크)
              ├── 비밀 키 보호 (DART_API_KEY 등)
              ├── 응답 변환 (snake_case → camelCase)
              └── 캐싱 제어 (revalidate, Cache-Control)
```

**왜 API Route를 거치는가?**

1. **API 키 보호**: DART_API_KEY, AI_SERVER_API_KEY가 클라이언트에 노출되면 안 됨
2. **인증 게이트**: 브라우저에서 직접 AI 서버를 호출하면 인증을 우회할 수 있음
3. **Rate Limiting**: AI 요약 생성에 사용자별 시간당 10회 제한 적용
4. **데이터 변환**: 외부 API의 응답 형식을 프론트엔드 친화적으로 변환
5. **캐싱**: Next.js의 `fetch` 캐싱/ISR을 활용

---

## 7. 데이터 페칭 전략

### 서버/클라이언트 분리 패턴

이 프로젝트의 핵심 패턴은 **동일한 데이터에 대한 서버/클라이언트 이중 경로**입니다:

```
[서버 렌더링 경로]
page.tsx (Server Component)
  → entities/disclosure/api/today-disclosures/server.ts
    → DART API 직접 호출 (API 키 서버에서만 접근)
    → Next.js fetch 캐싱 (revalidate: 60)

[클라이언트 경로]
widget (Client Component)
  → entities/disclosure/queries/hooks.ts (useQuery)
    → entities/disclosure/api/today-disclosures/client.ts
      → /api/disclosures/today (Next.js Route Handler)
        → DART API
```

### TanStack Query 훅 패턴

```typescript
// entities/disclosure/queries/hooks.ts

// 1. 기본 쿼리 — 데이터 조회
export function useTodayDisclosures(market: Market) {
  return useQuery({
    queryKey: queries.disclosures.today(market).queryKey,
    queryFn: () => getTodayDisclosures(market),
    staleTime: 60 * 1000, // 1분간 fresh
  })
}

// 2. 무한 스크롤 — 페이지네이션
export function useInfiniteTodayDisclosures(market: Market) {
  return useInfiniteQuery({
    queryKey: queries.disclosures.todayInfinite(market).queryKey,
    queryFn: ({ pageParam }) => getTodayDisclosuresPaginated(market, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
  })
}

// 3. Suspense 쿼리 — 서버 프리페치와 결합
export function useCompanyInfo(corpCode: string) {
  return useSuspenseQuery({
    queryKey: queries.company.info(corpCode).queryKey,
    queryFn: () => getCompanyInfo(corpCode),
    staleTime: 24 * 60 * 60 * 1000, // 24시간
  })
}

// 4. Mutation — 데이터 변경 + 옵티미스틱 업데이트
export function useAddToWatchlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addToWatchlist,
    onMutate: async newItem => {
      // 캐시에 즉시 추가 (서버 응답 전)
      await queryClient.cancelQueries({ queryKey: ['watchlist'] })
      const previous = queryClient.getQueryData(['watchlist'])
      queryClient.setQueryData(['watchlist'], old => [...old, newItem])
      return { previous }
    },
    onError: (err, _, context) => {
      // 실패 시 롤백
      queryClient.setQueryData(['watchlist'], context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}
```

### Query Key 팩토리

```typescript
// shared/lib/query-keys.ts
export const queries = createQueryKeyStore({
  disclosures: {
    today: (market: Market) => ({ queryKey: [market] }),
    todayInfinite: (market: Market) => ({ queryKey: ['infinite', market] }),
    search: (params: SearchParams) => ({ queryKey: [params] }),
    company: (corpCode: string, params) => ({ queryKey: [corpCode, params] }),
  },
  company: {
    info: (corpCode: string) => ({ queryKey: [corpCode] }),
  },
  financial: {
    data: (corpCode: string, mode: string) => ({ queryKey: [corpCode, mode] }),
  },
  news: {
    company: (corpName: string) => ({ queryKey: [corpName] }),
    major: null,
  },
  ai: {
    companySummary: (corpCode: string) => ({ queryKey: [corpCode] }),
    disclosureSummaryIds: null,
  },
  watchlist: {
    list: null,
    check: (corpCode: string) => ({ queryKey: [corpCode] }),
  },
  stocks: {
    popular: null,
  },
})
```

**왜 Query Key Factory인가?**

- 쿼리 키가 문자열 배열이라 오타 위험 → 팩토리로 타입 안전하게 관리
- `invalidateQueries({ queryKey: queries.watchlist.list.queryKey })`처럼 일관된 무효화
- 쿼리 키 구조를 한곳에서 확인 가능

---

## 8. 캐싱 전략 상세

### 캐싱 레이어 구조

```
[브라우저]
  └─ TanStack Query (staleTime)
       │
[Next.js 서버]
  └─ fetch 캐싱 / ISR (revalidate)
       │
[AI Server]
  └─ TTLCache (인메모리, 기업 요약)
       │
[PostgreSQL]
  └─ 영속 저장 (공시 요약, 관심종목)
```

### 데이터별 캐싱 전략과 이유

#### 오늘의 공시

```
TanStack Query: staleTime = 1분
Next.js fetch:  revalidate = 60초
```

**이유**: 공시는 장중에 실시간으로 올라옴. 1분마다 새로고침하면 적절한 실시간성과 서버 부하 균형.

#### 기업 정보

```
TanStack Query: staleTime = 24시간
Next.js fetch:  revalidate = 7일
```

**이유**: 기업명, 대표이사, 업종 같은 정보는 거의 변하지 않음. 7일 캐싱으로 DART API 호출 최소화.

#### 재무제표

```
TanStack Query: staleTime = 24시간
Next.js fetch:  revalidate = 1일
```

**이유**: 재무제표는 분기마다 변경. 하루 한 번 갱신이면 충분.

#### 뉴스

```
TanStack Query: staleTime = 5분
Next.js fetch:  revalidate = 300초
```

**이유**: 뉴스는 계속 바뀌지만 5분 정도의 지연은 허용 가능. Google News RSS는 호출 제한이 있어서 너무 자주 호출하면 차단될 수 있음.

#### AI 기업 요약

```
TanStack Query: staleTime = 24시간 (클라이언트)
Next.js fetch:  revalidate = 6시간 (Next.js ISR)
Python TTLCache: ttl = 6시간, maxsize = 200 (AI 서버)
```

**이유**: AI 생성 비용이 높음(LLM 토큰 비용). 기업 개요는 잘 변하지 않으므로 6시간 캐싱. 3단계 캐싱으로 LLM 호출을 최소화:

1. 브라우저 → TanStack Query 24시간 캐시 히트
2. Next.js → ISR 6시간 캐시 히트
3. AI Server → TTLCache 6시간 캐시 히트
4. 모두 미스 시에만 LLM 호출

#### AI 공시 요약

```
TanStack Query: 없음 (useMutation)
DB:            영속 저장 (한 번 생성하면 영구 보존)
```

**이유**: 공시 요약은 한 번 생성하면 내용이 변하지 않음(공시 원문이 변하지 않으므로). DB에 영속 저장하여 같은 공시를 다시 요약하지 않음.

#### 인기 종목

```
TanStack Query: staleTime = 기본값
HTTP:          Cache-Control: max-age=300 (5분)
```

**이유**: 인기 종목은 최근 24시간 검색 로그를 집계. 5분마다 갱신하면 충분.

#### 관심종목

```
TanStack Query: 기본값 + 옵티미스틱 업데이트
DB:            영속 저장
```

**이유**: 사용자 데이터라 캐싱보다 정확성이 중요. 옵티미스틱 업데이트로 즉각적인 UI 반응 제공.

### 옵티미스틱 업데이트 (Optimistic Update)

관심종목 추가/삭제에서 사용하는 패턴:

```
1. 사용자가 하트 버튼 클릭
2. 서버 응답을 기다리지 않고 즉시 UI 업데이트 (하트 채워짐)
3. 백그라운드에서 서버에 POST/DELETE 요청
4. 성공 → 그대로 유지
5. 실패 → 이전 상태로 롤백 + 에러 토스트
```

**왜 옵티미스틱 업데이트인가?**

- 하트 버튼은 사용자가 즉각적인 피드백을 기대하는 인터랙션
- 서버 왕복(100~300ms)을 기다리면 반응이 느리게 느껴짐
- 실패율이 매우 낮아 롤백이 거의 발생하지 않음

---

## 9. 인증 시스템

### 아키텍처

```
[브라우저]
  │ 1. Kakao/Google OAuth 로그인 버튼 클릭
  ▼
[Supabase Auth]
  │ 2. OAuth PKCE 플로우 → 인증 코드 발급
  ▼
[/auth/callback Route Handler]
  │ 3. 인증 코드 → 세션 교환
  │ 4. syncUser(): Prisma DB에 사용자 upsert
  ▼
[Supabase Session Cookie]
  │ 5. 쿠키에 세션 저장
  ▼
[middleware.ts]
  │ 6. 모든 요청에서 세션 갱신 (토큰 리프레시)
  │ 7. /mypage, /interests 접근 시 인증 확인
  ▼
[보호된 페이지]
```

### Supabase 클라이언트 3종

| 클라이언트         | 파일                 | 용도                                       |
| ------------------ | -------------------- | ------------------------------------------ |
| **Browser Client** | `supabase/client.ts` | 클라이언트 컴포넌트에서 인증 상태 구독     |
| **Server Client**  | `supabase/server.ts` | 서버 컴포넌트/Route Handler에서 세션 확인  |
| **Admin Client**   | `supabase/admin.ts`  | `service_role` 키로 RLS 우회 (회원탈퇴 등) |

### 왜 PKCE 플로우인가?

- **PKCE(Proof Key for Code Exchange)**: Authorization Code + 코드 검증자(verifier)
- 일반 Authorization Code 플로우 대비 **코드 가로채기 공격** 방지
- 모바일/SPA 환경에서 권장되는 OAuth 플로우

### 인증 미들웨어

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // 1. Supabase 세션 갱신 (리프레시 토큰 → 액세스 토큰)
  const { response, user } = await updateSession(request)

  // 2. 보호된 경로 체크
  const protectedPaths = ['/mypage', '/interests']
  if (protectedPaths.includes(pathname) && !user) {
    return NextResponse.redirect('/login?callbackUrl=...')
  }

  return response
}
```

---

## 10. AI 기능 아키텍처

### 전체 구조

```
[브라우저] ──→ [Next.js Route Handler] ──→ [Python FastAPI Server]
              (인증 + Rate Limit)         (AI 로직 전체)
                                              │
                                    ┌─────────┼─────────┐
                                    ▼         ▼         ▼
                              [DART API] [LLM(Gemini)] [PostgreSQL]
```

### 왜 AI 로직을 별도 Python 서버로 분리했는가?

1. **LangChain 생태계**: Python이 LLM 통합 라이브러리가 압도적으로 풍부
2. **모델 교체 유연성**: 환경변수 하나로 Gemini → GPT → Claude 전환 가능
3. **리소스 격리**: AI 연산이 무거워 Next.js 서버에 영향을 주지 않음
4. **독립 스케일링**: AI 요청이 많을 때 Python 서버만 스케일 아웃
5. **배포 독립성**: Next.js는 Vercel, AI 서버는 Cloud Run 등 각각 최적 환경 배포

### Next.js의 역할 (Thin Proxy)

```typescript
// app/api/disclosures/[rceptNo]/ai-summary/route.ts
export async function POST(request, { params }) {
  // 1. Supabase 인증 확인 — 로그인한 사용자만
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  // 2. Rate Limiting — 시간당 10회
  if (!checkRateLimit(user.id)) return NextResponse.json({ ... }, { status: 429 })

  // 3. Python AI 서버로 전달 — camelCase → snake_case 변환
  const response = await fetch(`${AI_SERVER_URL}/api/v1/disclosures/${rceptNo}/summary`, {
    method: 'POST',
    headers: { 'X-API-Key': AI_SERVER_API_KEY },
    body: JSON.stringify({
      corp_code: body.corpCode,     // camelCase → snake_case
      corp_name: body.corpName,
    }),
  })

  // 4. 응답 역변환 — snake_case → camelCase
  return NextResponse.json({
    summary: result.summary,
    keyFigures: result.key_figures,  // snake_case → camelCase
  })
}
```

### Rate Limiting 구현

```typescript
const RATE_LIMIT_PER_HOUR = 10
const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(userId) ?? []
  const recent = timestamps.filter(t => now - t < 60 * 60 * 1000) // 1시간 이내만

  if (recent.length >= RATE_LIMIT_PER_HOUR) return false

  recent.push(now)
  rateLimitMap.set(userId, recent)
  return true
}
```

**왜 인메모리 Rate Limiter인가?**

- Redis 같은 외부 저장소 불필요 → 인프라 복잡도 감소
- 단점: 서버 재시작 시 초기화, 다중 인스턴스에서 공유 안 됨
- 현재 규모에서는 충분. 스케일링 시 Redis로 교체 고려

### 프론트엔드 AI 요약 흐름

```
AiSummaryButton (공시 목록에서 버튼 클릭)
  → type === 'A'(정기공시)만 버튼 표시
  → 클릭 시 AiSummaryModal 오픈

AiSummaryModal
  → useEffect: 모달 오픈 시 1회만 mutation 실행
  → useGenerateDisclosureSummary (useMutation)
  → SummaryProgress: 로딩 프로그레스 표시
  → SummaryContent: 요약 결과 표시
     ├── 감성 분석 뱃지 (긍정/부정/중립)
     ├── 핵심 요약 (3~5문장)
     ├── 주요 수치 테이블 (매출, 영업이익 등)
     └── 면책 문구
```

---

## 11. UI 컴포넌트 시스템

### @gs/ui 패키지 구조

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── alert/        # Alert, AlertTitle, AlertDescription
│   │   ├── avatar/       # Radix Avatar
│   │   ├── badge/        # Badge (variant: default, secondary, etc.)
│   │   ├── button/       # Button (6 variants × 5 sizes)
│   │   ├── card/         # Card, CardHeader, CardTitle, CardContent, CardFooter
│   │   ├── checkbox/     # Radix Checkbox (sm/md/lg)
│   │   ├── dialog/       # Radix Dialog (모달)
│   │   ├── dropdown-menu/ # Radix DropdownMenu
│   │   ├── input/        # Input (텍스트 입력)
│   │   ├── label/        # Radix Label
│   │   ├── pagination/   # Pagination (Previous/Next)
│   │   ├── responsive-modal/ # Dialog(PC) + Sheet(모바일) 자동 전환
│   │   ├── separator/    # Radix Separator
│   │   ├── sheet/        # 슬라이드 드로어
│   │   ├── sidebar/      # 25+ 서브컴포넌트 (SidebarProvider, Menu, Group 등)
│   │   ├── skeleton/     # 로딩 스켈레톤
│   │   ├── switch/       # Radix Switch
│   │   ├── table/        # 테이블 (Header, Body, Row, Cell, Footer)
│   │   ├── tabs/         # Radix Tabs
│   │   ├── theme-provider/ # 테마 프로바이더
│   │   ├── theme-toggle/  # 다크/라이트 토글
│   │   ├── tooltip/      # Radix Tooltip
│   │   └── sonner/       # 토스트 알림
│   ├── hooks/
│   │   └── use-is-mobile.ts  # 모바일 브레이크포인트 감지
│   ├── lib/
│   │   └── utils.ts      # cn() = clsx + tailwind-merge
│   └── index.ts          # barrel export
```

### CVA(Class Variance Authority) 패턴

```typescript
// Button 컴포넌트 예시
const buttonVariants = cva(
  // 기본 클래스
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-9 px-4 py-2',
        lg: 'h-10 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

**왜 CVA인가?**

- variant 조합을 타입 안전하게 관리 (`variant: 'default' | 'destructive' | ...`)
- Tailwind 클래스를 조건부로 조합하는 깔끔한 패턴
- `defaultVariants`로 기본값 설정

### `cn()` 유틸리티

```typescript
// lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

`clsx`가 조건부 클래스를 조합하고, `tailwind-merge`가 충돌을 해결:

```typescript
cn('p-4 p-2') // → 'p-2' (tailwind-merge가 충돌 해결)
cn('text-sm', isLarge && 'text-lg') // 조건부 클래스
```

### ResponsiveModal 패턴

```typescript
// 화면 크기에 따라 Dialog 또는 Sheet로 자동 전환
export function ResponsiveModal({ children, ...props }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <Sheet {...props}>{children}</Sheet>      // 모바일: 하단에서 올라오는 시트
  }
  return <Dialog {...props}>{children}</Dialog>      // PC: 중앙 모달
}
```

### 빌드 설정

```typescript
// vite.config.ts
build: {
  lib: {
    entry: resolve(__dirname, 'src/index.ts'),
    formats: ['es', 'cjs'],  // ESM + CommonJS 이중 출력
  },
  rollupOptions: {
    external: ['react', 'react-dom'],  // 번들에서 제외 (peerDependency)
    output: {
      banner: '"use client";',  // 모든 컴포넌트에 'use client' 자동 추가
    },
  },
}
```

**왜 `"use client"` 배너인가?**

- UI 컴포넌트는 대부분 클라이언트에서 실행 (이벤트 핸들러, 상태 사용)
- Next.js App Router에서 Server Component가 기본이므로 명시적 선언 필요

### 디자인 토큰 시스템

```css
/* packages/tailwind-config/base.css */

/* 라이트 모드 */
:root {
  --background: oklch(1 0 0); /* 순수 흰색 */
  --foreground: oklch(0.145 0.018 260); /* 거의 검정 */
  --primary: oklch(0.45 0.2 260); /* 파란 보라 */
  --destructive: oklch(0.577 0.245 27.325); /* 빨강 */
  /* ... */
}

/* 다크 모드 */
.dark {
  --background: oklch(0.17 0.014 260); /* 어두운 배경 */
  --foreground: oklch(0.95 0 0); /* 밝은 텍스트 */
  /* ... */
}

/* 시장 뱃지 색상 */
--market-kospi-bg: oklch(0.95 0.04 250);
--market-kosdaq-bg: oklch(0.95 0.04 140);

/* 공시 유형 뱃지 색상 */
--disclosure-A-bg: ...; /* 정기공시 */
--disclosure-B-bg: ...; /* 주요사항보고 */
```

**왜 OKLch 색상 공간인가?**

- HSL 대비 **인지적 균일성**: 같은 밝기(L)의 색상이 실제로 같은 밝기로 보임
- 다크모드에서 색상이 더 자연스럽게 변환됨
- Tailwind v4의 기본 색상 공간

---

## 12. 보안

### Next.js 보안 헤더

```typescript
// next.config.ts headers()
{
  'X-Content-Type-Options': 'nosniff',     // MIME 스니핑 방지
  'X-Frame-Options': 'DENY',              // 클릭재킹 방지
  'X-XSS-Protection': '1; mode=block',    // XSS 필터
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',  // HSTS
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',  // 기능 제한
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com ...",
    "connect-src 'self' https://*.supabase.co https://*.sentry.io ...",
    // ...
  ].join('; '),
}
```

### CSP(Content Security Policy) 설계 의도

- `default-src 'self'`: 기본적으로 같은 도메인 리소스만 허용
- `script-src`: Google Analytics, Vercel, Sentry 스크립트만 허용
- `connect-src`: Supabase, Sentry, Vercel Analytics API만 허용
- `img-src`: Supabase Storage, Kakao/Google OAuth 프로필 이미지만 허용
- `object-src 'none'`: Flash, Java 등 플러그인 차단

### 기타 보안 조치

- **server-only**: 서버 전용 코드가 클라이언트 번들에 포함되면 빌드 에러
- **입력 검증**: corp_code(8자리), rceptNo(14자리) 등 regex 검증
- **API 키 보호**: 모든 외부 API 키는 서버에서만 접근 (환경변수)
- **Rate Limiting**: AI 요약 시간당 10회 제한
- **OAuth PKCE**: 코드 가로채기 공격 방지
- **Prisma 파라미터 바인딩**: SQL Injection 자동 방지
- **에러 메시지 제한**: 사용자에게 내부 에러 상세를 노출하지 않음

---

## 13. 성능 최적화

### 번들 최적화

```typescript
// next.config.ts
experimental: {
  optimizePackageImports: ['@phosphor-icons/react'],
}
```

**왜 optimizePackageImports인가?**

- `@phosphor-icons/react`는 6000+개 아이콘이 있는 배럴 파일
- 일반 import: `import { Heart } from '@phosphor-icons/react'` → 전체 패키지 분석
- 최적화: 사용하는 아이콘만 번들에 포함

### 코드 분할

```typescript
// widgets/company-detail-page에서 dynamic import
const SummarySection = dynamic(() => import('./sections/summary-section'))
const FinancialSection = dynamic(() => import('./sections/financial-section'))
```

**왜 dynamic import인가?**

- 종목 상세 페이지의 탭(요약/재무/공시/뉴스)을 지연 로딩
- 사용자가 보지 않는 탭의 코드는 다운로드하지 않음

### Suspense + Streaming

```typescript
// app/page.tsx (홈)
<Suspense fallback={<PopularCompaniesSkeleton />}>
  <PopularCompaniesSection />
</Suspense>

<Suspense fallback={<TodayDisclosuresSkeleton />}>
  <TodayDisclosures />
</Suspense>
```

**장점**: 각 섹션이 독립적으로 데이터를 로드. 인기종목이 먼저 로드되면 즉시 표시되고, 공시 목록은 로딩 중이어도 됨.

### 이미지 최적화

- `next/image`의 `remotePatterns`으로 허용 도메인 제한
- OAuth 프로필 이미지만 외부 소스 허용

### QueryClient 설정

```typescript
// shared/lib/query/get-query-client.ts
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 기본 1분 → 불필요한 리패치 방지
      },
    },
  })
}

// 서버: 요청마다 새 클라이언트 (요청 간 데이터 공유 방지)
// 브라우저: 싱글톤 (SPA 동안 캐시 유지)
```

---

## 14. 모니터링과 분석

### Sentry (에러 트래킹)

```typescript
// sentry.client.config.ts / sentry.server.config.ts / sentry.edge.config.ts
// 3가지 런타임 환경에서 각각 에러 캡처

// app/error.tsx
useEffect(() => {
  Sentry.captureException(error) // 전역 에러 바운더리에서 자동 보고
}, [error])
```

**왜 3개의 Sentry 설정 파일인가?**

- Next.js는 클라이언트, 서버(Node.js), 엣지(Edge Runtime) 3가지 런타임 환경이 있음
- 각 환경에서의 에러를 별도로 캡처해야 함

### Google Analytics 4

```typescript
// shared/lib/analytics.ts
export function trackSignUp(method: AuthProvider) {
  gtag('event', 'sign_up', { method })
}

export function trackAiDisclosureSummary(companyName: string) {
  gtag('event', 'ai_disclosure_summary', { company_name: companyName })
}

export function trackAddWatchlist(corpCode: string) {
  gtag('event', 'add_watchlist', { corp_code: corpCode })
}
```

**추적하는 이벤트**:

- 회원가입 (method: kakao/google)
- AI 공시 요약 생성 (기업명)
- AI 기업 분석 (기업코드)
- 관심종목 추가 (기업코드)

### Vercel Analytics + Speed Insights

```typescript
// app/layout.tsx
<Analytics />         // 페이지뷰, 방문자
<SpeedInsights />     // Core Web Vitals (LCP, FID, CLS)
```

---

## 15. CI/CD와 배포

### Vercel 배포

```json
// vercel.json
{
  "buildCommand": "pnpm turbo build --filter=web",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next",
  "crons": [
    {
      "path": "/api/cron/cleanup-search-logs",
      "schedule": "0 0 * * *" // 매일 자정
    }
  ]
}
```

### 빌드 파이프라인

```
pnpm install
  → turbo build --filter=web
    → @gs/tailwind-config 빌드 (CSS)
    → @gs/ui 빌드 (Vite → dist/)
    → web 빌드 (prisma generate → next build)
      → Sentry 소스맵 업로드
```

### Git 훅

```
git commit
  → husky pre-commit
    → lint-staged
      → prettier --write (포맷팅)
      → eslint --fix (린트)
  → commitlint
    → Conventional Commits 검증
```

### Cron Job

- `/api/cron/cleanup-search-logs`: 매일 자정 7일 이상 된 검색 로그 삭제
- Vercel Cron이 자동 호출

---

## 16. 파일 구조 전체 맵

```
web/
├── apps/web/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃 (폰트, 메타데이터, 프로바이더)
│   │   ├── page.tsx                # 홈 (인기종목 + 공시 + 뉴스)
│   │   ├── providers.tsx           # QueryClient + ThemeProvider
│   │   ├── error.tsx               # 전역 에러 바운더리
│   │   ├── not-found.tsx           # 404
│   │   ├── login/page.tsx          # 로그인
│   │   ├── search/page.tsx         # 종목 검색
│   │   ├── disclosures/today/page.tsx  # 오늘의 공시
│   │   ├── companies/[corpCode]/page.tsx  # 종목 상세
│   │   ├── interests/page.tsx      # 관심종목
│   │   ├── mypage/page.tsx         # 마이페이지
│   │   ├── glossary/page.tsx       # 용어사전
│   │   ├── privacy/page.tsx        # 개인정보
│   │   ├── terms/page.tsx          # 이용약관
│   │   ├── disclaimer/page.tsx     # 면책조항
│   │   ├── auth/callback/route.ts  # OAuth 콜백
│   │   └── api/                    # API Routes (16개)
│   │       ├── companies/[corpCode]/
│   │       │   ├── route.ts        # GET 기업정보
│   │       │   ├── financials/route.ts  # GET 재무제표
│   │       │   └── ai-summary/route.ts  # GET AI 기업요약 (→ Python)
│   │       ├── disclosures/
│   │       │   ├── today/route.ts  # GET 오늘 공시
│   │       │   ├── search/route.ts # GET 공시 검색
│   │       │   ├── company/[corpCode]/route.ts  # GET 기업별 공시
│   │       │   ├── summarized-ids/route.ts  # GET 요약 완료 ID
│   │       │   └── [rceptNo]/ai-summary/route.ts  # POST AI 공시요약 (→ Python)
│   │       ├── news/
│   │       │   ├── route.ts        # GET 뉴스 검색
│   │       │   └── major/route.ts  # GET 주요 뉴스
│   │       ├── stocks/
│   │       │   ├── popular/route.ts  # GET 인기 종목
│   │       │   └── suggest/route.ts  # GET 자동완성
│   │       ├── watchlist/
│   │       │   ├── route.ts        # GET/POST/DELETE 관심종목
│   │       │   └── check/[corpCode]/route.ts  # GET 확인
│   │       ├── user/delete/route.ts  # DELETE 회원탈퇴
│   │       └── cron/cleanup-search-logs/route.ts  # Cron
│   │
│   ├── entities/
│   │   ├── disclosure/             # 공시 (타입, API, 포맷팅, 쿼리훅)
│   │   ├── company/                # 기업 (재무제표, 잠정실적)
│   │   ├── news/                   # 뉴스 (Google RSS)
│   │   ├── user/                   # 사용자 (인증 상태)
│   │   ├── watchlist/              # 관심종목 (CRUD + 옵티미스틱)
│   │   └── glossary/               # 용어사전 (정적 데이터)
│   │
│   ├── features/
│   │   ├── ai-disclosure-summary/  # AI 공시 요약 (버튼, 모달, 결과)
│   │   ├── ai-company-summary/     # AI 기업 요약 (카드)
│   │   ├── auth/                   # 로그인/로그아웃 훅
│   │   ├── search-disclosures/     # 검색 URL 파라미터
│   │   ├── toggle-watchlist/       # 관심종목 토글 버튼
│   │   ├── withdraw-account/       # 회원탈퇴 다이얼로그
│   │   └── glossary-search/        # 용어 검색 필터
│   │
│   ├── widgets/
│   │   ├── company-detail-page/    # 종목 상세 (탭 레이아웃)
│   │   ├── financial-statements/   # 재무제표 (차트 + 테이블)
│   │   ├── today-disclosures/      # 오늘의 공시 (리스트)
│   │   ├── disclosure-list-page/   # 공시 목록 레이아웃
│   │   ├── disclosure-search/      # 종목 검색 (자동완성)
│   │   ├── popular-companies-section/  # 인기 종목
│   │   ├── major-news-section/     # 주요 뉴스
│   │   ├── banner-slider/          # 자동 배너
│   │   ├── service-banner/         # 히어로 배너
│   │   ├── header/                 # 헤더 (PC/모바일)
│   │   ├── footer/                 # 푸터
│   │   ├── bottom-nav/             # 모바일 하단 탭
│   │   ├── auth/                   # 로그인 폼, 유저 메뉴
│   │   ├── interests-page/         # 관심종목 페이지
│   │   ├── mypage/                 # 마이페이지
│   │   ├── glossary-page/          # 용어사전 페이지
│   │   └── legal-page/             # 법률 페이지
│   │
│   ├── shared/
│   │   ├── lib/
│   │   │   ├── prisma/             # Prisma 클라이언트 + 에러 핸들링
│   │   │   ├── supabase/           # Supabase 클라이언트 3종 + 미들웨어
│   │   │   ├── dart/               # DART API 클라이언트
│   │   │   ├── query/              # QueryClient 팩토리
│   │   │   ├── seo/                # JSON-LD 구조화 데이터
│   │   │   ├── error-boundary/     # 에러 바운더리 래퍼
│   │   │   ├── query-keys.ts       # 쿼리 키 팩토리
│   │   │   ├── analytics.ts        # GA4 이벤트
│   │   │   ├── date.ts             # 날짜 유틸리티
│   │   │   ├── get-base-url.ts     # 환경별 URL
│   │   │   └── animations.ts       # Motion variants
│   │   ├── hooks/
│   │   │   └── use-intersection-observer.ts
│   │   └── ui/
│   │       └── back-button/
│   │
│   ├── middleware.ts               # Supabase 세션 + 인증 가드
│   ├── instrumentation.ts         # 서버 계측
│   ├── prisma/                     # DB 스키마 + 시드
│   ├── e2e/                        # Playwright E2E 테스트
│   └── public/                     # 정적 에셋 (폰트, 이미지)
│
├── packages/
│   ├── ui/                         # @gs/ui (23개 컴포넌트)
│   ├── tailwind-config/            # 테마 + 애니메이션
│   ├── typescript-config/          # TS 설정 3종
│   ├── eslint-config/              # ESLint 설정 2종
│   └── prettier-config/            # 코드 포맷 설정
│
├── turbo.json                      # Turborepo 태스크 설정
├── pnpm-workspace.yaml             # 워크스페이스 정의
├── vercel.json                     # Vercel 배포 + Cron 설정
├── commitlint.config.cjs           # 커밋 메시지 린트
└── package.json                    # 루트 스크립트
```

---

## 면접 예상 질문 & 상세 답변

### Q: Tailwind v4에서 "PostCSS로 빌드 파이프라인 단순화"란?

Tailwind v3까지는 설정 파일이 여러 개 필요했습니다:

```
v3: tailwind.config.js + postcss.config.js + globals.css (@tailwind directives)
v4: postcss.config.js + base.css (@import 'tailwindcss' 한 줄)
```

v4에서는 `tailwind.config.js`가 사라지고, CSS 파일 안에서 `@theme`으로 직접 토큰을 정의합니다. PostCSS 플러그인 하나(`@tailwindcss/postcss`)만 등록하면 Tailwind 처리가 끝나므로, **설정 파일이 하나 줄었다**는 의미입니다.

---

### Q: Radix UI와 shadcn/ui의 관계는?

**둘 다 사용합니다.** 정확한 관계:

1. **Radix UI** = npm 패키지로 설치된 headless 컴포넌트 (`@radix-ui/react-dialog` 등)
2. **shadcn/ui** = Radix primitive를 import해서 Tailwind + CVA 스타일을 입힌 래퍼 코드를 **프로젝트에 복사**하는 방식
3. **@gs/ui** = 우리 프로젝트에서 shadcn/ui 방식으로 생성한 컴포넌트 라이브러리 패키지

실제 코드 구조:

```typescript
// packages/ui/src/components/dialog/dialog.tsx
import * as DialogPrimitive from '@radix-ui/react-dialog'  // npm 패키지 (headless)

// Tailwind + CVA로 스타일을 입힌 래퍼 (우리가 소유한 코드)
export function DialogContent({ className, ...props }) {
  return (
    <DialogPrimitive.Content
      className={cn('fixed inset-0 z-50 ...', className)}
      {...props}
    />
  )
}
```

- **Radix UI 자체**: npm 의존성으로 설치 → `import * as DialogPrimitive from '@radix-ui/react-dialog'`
- **shadcn/ui 레이어**: 소스 코드를 프로젝트에 복사 → 래퍼 컴포넌트를 자유롭게 수정 가능
- `@gs/ui`의 Button, Dialog 등은 소스 코드가 프로젝트 안에 있으므로 커스터마이징 자유로움

---

### Q: Chart.js가 명령형이라는 것은 무슨 의미인가?

Chart.js는 **명령형(Imperative) API**로 동작합니다:

```javascript
// Chart.js — 명령형: 직접 인스턴스를 생성하고, 수동으로 업데이트/정리
const chart = new Chart(ctx, {
  type: 'line',
  data: { datasets: [...] },
  options: { ... }
})
chart.update()   // 데이터 변경 시 수동 호출
chart.destroy()  // 정리도 수동
```

```tsx
// Recharts — 선언형: React 컴포넌트로 구성, 데이터 변경 시 자동 리렌더링
<LineChart data={data}>
  <Line dataKey="revenue" />
  <XAxis dataKey="year" />
</LineChart>
```

`react-chartjs-2`라는 React 래퍼가 있지만, 내부적으로 Chart.js의 명령형 API를 감싸는 것이라 React의 선언적 패러다임과 완벽히 맞지 않습니다. Recharts는 처음부터 React 컴포넌트로 설계되어 props 변경 → 자동 리렌더링이 자연스럽습니다.

---

### Q: glossary 페이지의 `force-static`은 없어도 되지 않나?

맞습니다. **`force-static`이 없어도 이 페이지는 자동으로 static으로 빌드됩니다.**

Next.js App Router는 페이지를 자동 분석합니다:

- `fetch()` 호출 없음
- `cookies()` / `headers()` 호출 없음
- 동적 파라미터(`[slug]`) 없음
- → Next.js가 자동으로 **Static Rendering**으로 판단

`force-static`이 실제로 필요한 경우:

- 상위 layout이 dynamic을 강제할 때
- 부모 레이아웃에서 `cookies()`나 `headers()`를 사용하여 페이지도 dynamic이 될 때

이 프로젝트에서는 `layout.tsx`가 `Providers`(QueryClientProvider, ThemeProvider)를 감싸지만, 이것만으로 dynamic이 되지 않습니다. **결론: `force-static`은 명시적 의도 표현(문서화 역할)이며, 기능적으로는 없어도 동일합니다.**

---

### Q: 캐싱과 ISR이 구체적으로 어떻게 동작하나?

이 프로젝트는 4단계 캐싱 레이어를 사용합니다.

#### 1단계: Next.js `fetch` 캐싱 = ISR (서버 사이드)

Next.js App Router에서 `fetch()`를 호출할 때 `revalidate` 옵션을 주면 **ISR(Incremental Static Regeneration)**이 동작합니다:

```typescript
// entities/company/api/company-info/server.ts
const response = await fetch('https://opendart.fss.or.kr/api/company.json?...', {
  next: { revalidate: 604800 }, // 7일 (초 단위)
})
```

동작 원리:

1. **첫 요청**: DART API 호출 → 응답을 Next.js 서버 캐시에 저장
2. **7일 이내 요청**: 캐시된 응답 즉시 반환 (DART API 호출 안 함)
3. **7일 경과 후 요청**: 캐시된 응답을 먼저 반환(**stale-while-revalidate**) → 백그라운드에서 DART API 재호출 → 새 응답으로 캐시 교체
4. **다음 요청부터**: 갱신된 캐시 응답 반환

#### 2단계: API Route에서의 ISR 캐싱

```typescript
// app/api/companies/[corpCode]/ai-summary/route.ts
const response = await fetch(`${AI_SERVER_URL}/api/v1/companies/${corpCode}/summary`, {
  headers: { 'X-API-Key': AI_SERVER_API_KEY },
  next: {
    revalidate: 21600, // 6시간
    tags: ['ai-company-summary', corpCode], // 태그 기반 수동 무효화 가능
  },
})
```

`tags`를 사용하면 나중에 `revalidateTag('ai-company-summary')`로 캐시를 수동 무효화할 수도 있습니다.

#### 3단계: HTTP Cache-Control 헤더 (CDN/브라우저 캐싱)

```typescript
// app/api/stocks/popular/route.ts
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
  },
})
```

- `s-maxage=300`: CDN/프록시에서 5분간 캐시
- `stale-while-revalidate=60`: 만료 후 60초간 오래된 응답 제공하면서 백그라운드 갱신

#### 4단계: TanStack Query 캐싱 (클라이언트 메모리)

```typescript
// entities/company/queries/hooks.ts
export function useCompanyInfo(corpCode: string) {
  return useSuspenseQuery({
    queryKey: queries.company.info(corpCode).queryKey,
    queryFn: () => getCompanyInfo(corpCode),
    staleTime: 24 * 60 * 60 * 1000, // 24시간
  })
}
```

- `staleTime`: 데이터가 "신선"한 기간. 이 기간 내에 같은 쿼리를 다시 호출하면 **네트워크 요청 없이** 캐시 반환
- `gcTime` (기본 5분): 컴포넌트가 언마운트된 후 캐시를 메모리에 유지하는 시간. 이후 가비지 컬렉트

#### 실제 흐름 예시: AI 기업 요약

```
사용자가 삼성전자 상세 페이지 접속

[1] TanStack Query 캐시 확인 (staleTime: 24시간)
    → 히트 → 즉시 렌더링, 끝
    → 미스 ↓

[2] Next.js API Route 호출: GET /api/companies/00126380/ai-summary

[3] Next.js fetch 캐시 확인 (revalidate: 6시간)
    → 히트 → 캐시된 응답 반환 → [1]에 저장, 끝
    → 미스 ↓

[4] Python AI Server 호출: GET /api/v1/companies/00126380/summary

[5] Python TTLCache 확인 (ttl: 6시간, maxsize: 200)
    → 히트 → 캐시된 응답 반환 → [3]에 저장 → [1]에 저장, 끝
    → 미스 ↓

[6] DART API 호출 (기업명 확인) → LLM 호출 (요약 생성)
    → [5]에 저장 → [3]에 저장 → [1]에 저장, 끝
```

결과적으로 LLM은 **6시간에 최대 1번만 호출**됩니다. 동시에 100명이 같은 기업을 보더라도 LLM 호출은 1번입니다.

#### 데이터별 revalidate 값 설정 근거

| 데이터       | revalidate | 이유                                                     |
| ------------ | ---------- | -------------------------------------------------------- |
| 오늘의 공시  | 60초       | 장중 실시간으로 올라옴. 1분이면 적절한 실시간성          |
| 기업 정보    | 7일        | 기업명/대표이사/업종은 거의 변하지 않음                  |
| 재무제표     | 1일        | 분기마다 변경. 하루 한 번 갱신이면 충분                  |
| 뉴스         | 5분        | 계속 바뀌지만 5분 지연은 허용. Google RSS 호출 제한 우려 |
| AI 기업 요약 | 6시간      | LLM 비용 절약. 기업 개요는 잘 변하지 않음                |
| 인기 종목    | 5분        | 24시간 검색 로그 집계 기반. 5분이면 충분                 |

---

### Q: ai-server의 TTLCache를 자세히 설명해주세요

```python
# app/cache/company_cache.py
from cachetools import TTLCache

company_cache: TTLCache = TTLCache(maxsize=200, ttl=21600)
```

#### TTLCache란?

`cachetools` 라이브러리의 **Time-To-Live 캐시**입니다. Python dict처럼 동작하되, 두 가지 제한이 있습니다:

1. **ttl (Time-To-Live)**: 항목이 삽입된 후 `21600초(6시간)` 경과 시 자동 만료/삭제
2. **maxsize**: 캐시에 최대 `200개` 항목만 보관. 초과 시 가장 오래된 항목부터 제거 (LRU 방식)

#### 사용 코드

```python
# 캐시 저장 (dict 스타일 접근)
company_cache[corp_code] = response  # "00126380" → CompanySummaryResponse 객체

# 캐시 조회
cached = company_cache.get(corp_code)  # 히트 → 응답 객체, 미스 → None

# 내부적으로:
# - 접근할 때마다 해당 항목의 TTL 체크 (lazy eviction)
# - 만료된 항목은 접근 시점에 자동 제거됨
```

#### 왜 TTLCache를 선택했는가?

| 대안                    | 장점                                      | 단점                        | 선택하지 않은 이유          |
| ----------------------- | ----------------------------------------- | --------------------------- | --------------------------- |
| **Redis**               | 프로세스 간 공유, 영속성, 분산 환경 지원  | 별도 인프라 필요, 운영 비용 | 현재 단일 프로세스라 과도함 |
| **Python dict**         | 가장 단순                                 | TTL 없음 → 메모리 무한 증가 | 메모리 누수 위험            |
| **functools.lru_cache** | 데코레이터로 간편 적용                    | TTL 없음, 함수 단위만 지원  | 시간 기반 만료 불가         |
| **TTLCache**            | 인메모리, TTL + 크기 제한, 설치만 하면 끝 | 프로세스 재시작 시 초기화   | **채택**                    |

#### maxsize=200의 근거

- 한국 상장기업 약 2,500개
- 실제로 사용자들이 조회하는 기업은 상위 200개 정도에 집중됨
- 200개면 대부분의 조회에서 캐시 히트

#### 한계와 스케일링 계획

- **프로세스 재시작 시 캐시 초기화**: 배포할 때마다 cold start (첫 요청은 LLM 호출)
- **다중 워커에서 캐시 공유 안 됨**: uvicorn worker가 여러 개면 각자 별도 캐시 → 캐시 히트율 저하
- **스케일링 시**: Redis로 교체하면 프로세스 간 공유 + 영속성 + 분산 환경 지원 가능

---

### Q: Dynamic Import는 어떤 Web Vital에 효과적인가?

```typescript
// 일반 import — 모든 탭의 코드가 초기 번들에 포함
import { SummarySection } from './sections/summary-section'
import { FinancialSection } from './sections/financial-section'

// dynamic import — 활성 탭의 코드만 로드
const SummarySection = dynamic(() => import('./sections/summary-section'))
const FinancialSection = dynamic(() => import('./sections/financial-section'))
```

#### 영향받는 Web Vitals

| 지표                                | 효과          | 이유                                                                   |
| ----------------------------------- | ------------- | ---------------------------------------------------------------------- |
| **LCP** (Largest Contentful Paint)  | **개선**      | 초기 JS 번들이 작아져서 메인 콘텐츠가 더 빨리 렌더링됨                 |
| **INP** (Interaction to Next Paint) | **개선**      | 파싱/실행할 JS가 적어서 메인 스레드 블로킹 감소 → 인터랙션 반응 빨라짐 |
| **FCP** (First Contentful Paint)    | **약간 개선** | 초기 번들 크기 감소로 첫 렌더링 시간 단축                              |
| **CLS** (Cumulative Layout Shift)   | **주의 필요** | `loading` fallback이 없으면 컴포넌트 로드 시 레이아웃 시프트 발생 가능 |
| **TTFB** (Time to First Byte)       | **영향 없음** | 서버 응답 시간과 무관 (클라이언트 최적화)                              |

#### 핵심 원리

Dynamic import의 효과는 **초기 번들 크기 감소**에서 옵니다:

```
[일반 import]
초기 번들: 요약 탭 + 재무제표 탭(Recharts 포함) + 공시 탭 + 뉴스 탭
= 큰 JS 파일 → 다운로드/파싱/실행 느림

[dynamic import]
초기 번들: 요약 탭만
재무제표 탭: 사용자가 클릭할 때 별도 chunk로 로드
= 작은 초기 JS → 빠른 LCP, 빠른 INP
```

종목 상세 페이지에서 재무제표 탭(Recharts 차트 라이브러리 포함)이 초기 번들에서 빠지면, 사용자가 "요약" 탭만 볼 때 불필요한 차트 코드를 다운로드/파싱하지 않습니다.

#### CLS 방지를 위한 주의점

```typescript
// CLS 방지: loading fallback으로 동일한 높이의 스켈레톤 제공
const FinancialSection = dynamic(
  () => import('./sections/financial-section'),
  { loading: () => <FinancialSkeleton /> }  // 동일한 높이의 플레이스홀더
)
```

---

### Q: 왜 FSD를 선택했나요?

**문제**: 프로젝트가 커지면 `components/`, `hooks/`, `utils/` 같은 기술 기반 분류는 관련 코드가 여러 폴더에 흩어져서 파일이 어디에 있는지 찾기 어렵습니다.

**FSD 장점**:

- **기능 단위 캡슐화**: `features/toggle-watchlist/`에 API, 훅, UI, 타입이 모두 있음
- **의존성 방향 강제**: 상위 레이어(widgets)가 하위 레이어(entities, shared)만 import → 순환 의존 방지
- **삭제 용이**: 기능 하나를 폴더째 삭제하면 끝
- **팀 작업**: 각자 다른 feature를 독립적으로 개발 가능

---

### Q: 모노레포의 장단점은?

**장점**:

- 공유 코드 재사용 (@gs/ui, @gs/tailwind-config 등 5개 패키지)
- 일관된 린트/포맷/TS 설정
- 원자적 변경: UI 컴포넌트 수정 + 앱 코드 수정을 하나의 PR로

**단점**:

- 빌드 복잡도 증가 (Turborepo로 의존 순서 관리 필요)
- CI 시간 증가 (전체 워크스페이스 설치)
- 패키지 간 버전 관리 필요 (Changesets 사용)

---

### Q: AI 서버를 왜 분리했나요?

1. **LangChain Python 생태계**: LLM 통합 라이브러리가 Python이 압도적으로 풍부
2. **모델 교체 유연성**: `LLM_PROVIDER=gemini` → `openai` → `anthropic` 환경변수만 변경
3. **리소스 격리**: AI 연산이 무거워 Next.js 서버에 영향을 주지 않음
4. **독립 스케일링**: AI 요청이 많을 때 Python 서버만 스케일 아웃 가능

---

### Q: 옵티미스틱 업데이트는 어디서 쓰나요?

관심종목 추가/삭제에서 사용합니다:

```
1. 사용자가 하트 버튼 클릭
2. 서버 응답을 기다리지 않고 즉시 UI 업데이트 (하트 채워짐)
3. 백그라운드에서 서버에 POST/DELETE 요청
4. 성공 → 그대로 유지
5. 실패 → 이전 상태로 롤백 + 에러 토스트
```

하트 버튼은 사용자가 즉각적인 피드백을 기대하는 인터랙션이고, 실패율이 매우 낮아 롤백이 거의 발생하지 않습니다.

---

### Q: 인증 흐름을 설명해주세요

OAuth PKCE(Proof Key for Code Exchange) 플로우:

1. 사용자가 Kakao/Google 로그인 버튼 클릭
2. Supabase가 OAuth PKCE 플로우 시작 → 인증 코드 발급
3. `/auth/callback` Route Handler가 인증 코드 → 세션 교환
4. `syncUser()`로 Prisma DB에 사용자 upsert
5. 쿠키에 세션 저장
6. `middleware.ts`가 모든 요청에서 세션 갱신 (토큰 리프레시)

PKCE가 일반 Authorization Code 플로우보다 안전한 이유: 코드 검증자(verifier)를 사용하여 **인증 코드 가로채기 공격**을 방지합니다.

---

### Q: CSP를 왜 설정했나요?

XSS(Cross-Site Scripting) 공격 방지. 허용되지 않은 외부 스크립트/리소스 로드를 브라우저 레벨에서 차단합니다:

- `default-src 'self'`: 기본적으로 같은 도메인만 허용
- `script-src`: Google Analytics, Vercel, Sentry 스크립트만 허용
- `connect-src`: Supabase, Sentry API만 허용
- `object-src 'none'`: Flash, Java 등 플러그인 완전 차단

---

### Q: Rate Limiting을 왜 구현했나요?

AI 공시 요약 생성에 사용자별 시간당 10회 제한:

- **비용 제어**: LLM API 호출은 토큰 기반 과금 → 무제한 허용 시 비용 폭발
- **남용 방지**: 한 사용자가 모든 공시를 무차별 요약 요청하는 것 방지
- **인메모리 Map 사용**: Redis 없이 간단하게 구현. 단점은 서버 재시작 시 초기화, 다중 인스턴스 미공유

---

### Q: 번들 최적화 방법은?

1. **optimizePackageImports**: `@phosphor-icons/react` (6000+ 아이콘) 배럴 파일에서 사용하는 아이콘만 번들에 포함
2. **dynamic import**: 종목 상세 탭을 지연 로딩 → 초기 번들 크기 감소 → LCP/INP 개선
3. **Suspense streaming**: 각 섹션이 독립적으로 데이터를 로드. 먼저 준비된 섹션부터 표시

---

### Q: 서버 렌더링 전략은?

데이터 특성에 따라 혼합 사용:

- **Dynamic (SSR)**: 홈, 공시 목록, 종목 상세 → 자주 바뀌는 데이터, 항상 최신 필요
- **Static (SSG)**: 용어 사전, 약관 → 정적 콘텐츠, 빌드 타임에 생성
- **CSR**: 관심종목, 마이페이지 → 인증된 사용자의 개인 데이터, 서버에서 프리렌더 불가
- **ISR**: 기업 정보(7일), AI 요약(6시간) → 캐시 + 백그라운드 갱신

---

### Q: 왜 Radix UI + shadcn/ui + Tailwind인가?

- **Headless(Radix)**: 스타일 없이 동작/접근성만 제공 → Tailwind으로 자유롭게 스타일링
- **소스 코드 소유(shadcn)**: npm 패키지가 아닌 복사된 코드 → 제약 없이 커스터마이징
- **RSC 호환(Tailwind)**: CSS-in-JS(Emotion 등)는 런타임 스타일 생성이라 서버 컴포넌트에서 사용 불가. Tailwind은 빌드 타임 CSS 생성
- **번들 크기**: MUI는 Material Design 전체 포함. Radix는 사용하는 컴포넌트만 번들

---

### Q: 디자인 시스템은 어떻게 관리하나요?

- **@gs/ui 패키지**: Radix + Tailwind + CVA 기반 23개 컴포넌트. Vite로 빌드, ESM + CJS 이중 출력
- **CSS 변수 토큰**: `@gs/tailwind-config/base.css`에서 `@theme`으로 색상/radius/shadow 정의
- **CVA variants**: 컴포넌트의 variant/size 조합을 타입 안전하게 관리
- **다크모드**: OKLch 색상 공간 + `next-themes`의 `class` 속성 기반 (SSR 깜빡임 방지)
