# SEO 기획서 - 공시공시

## 1. 현황 분석

| 항목                  | 상태                          |
| --------------------- | ----------------------------- |
| 루트 메타데이터       | title, description만 설정     |
| 페이지별 메타데이터   | 1/6 페이지만 설정 (interests) |
| robots.ts             | 없음                          |
| sitemap.ts            | 없음                          |
| manifest.ts           | 없음                          |
| Open Graph            | 없음                          |
| Twitter Card          | 없음                          |
| JSON-LD 구조화 데이터 | 없음                          |
| Canonical URL         | 없음                          |
| 동적 페이지 SEO       | generateMetadata 미구현       |
| 아이콘                | favicon.ico만 존재            |
| Google Analytics      | 없음                          |

---

## 2. 작업 범위

### 2-1. 기본 인프라

#### metadataBase 설정 (`app/layout.tsx`)

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://gongsi-gongsi.kr'),
  title: {
    default: '공시공시 - AI 기반 기업 공시 분석',
    template: '%s | 공시공시',
  },
  description:
    '개인 투자자를 위한 AI 기반 기업 공시 분석 서비스. 실시간 공시 알림, AI 요약, 재무제표 분석을 한눈에.',
  keywords: ['공시', '주식', 'AI 분석', '기업 공시', '투자', 'DART', '재무제표', '공시공시'],
  authors: [{ name: '공시공시' }],
  creator: '공시공시',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '공시공시',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'f9CQiZOO1Mi5KGL7vHCnYr8QBL1wnpSgtPfYpLLEQ8w',
    naver: '692c35e93c57b02e516c97bbfb83f14078b35c85',
  },
}
```

#### robots.ts (`app/robots.ts`)

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/login'],
      },
    ],
    sitemap: 'https://gongsi-gongsi.kr/sitemap.xml',
  }
}
```

#### sitemap.ts (`app/sitemap.ts`)

- 정적 페이지: `/`, `/disclosures/today`, `/interests`, `/search`
- 동적 페이지: `/companies/[corpCode]` (DB의 Stock 테이블에서 corpCode 목록 조회)
- changeFrequency, priority 설정

#### manifest.ts (`app/manifest.ts`)

```typescript
{
  name: '공시공시',
  short_name: '공시공시',
  description: 'AI 기반 기업 공시 분석 서비스',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#4F6AFF', // primary 색상
  icons: [...]
}
```

### 2-2. 페이지별 메타데이터

| 페이지                  | title                                        | description                                                   |
| ----------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| `/` (홈)                | `공시공시 - AI 기반 기업 공시 분석` (기본값) | 루트 description 사용                                         |
| `/search`               | `기업 검색`                                  | `종목명 또는 종목코드로 기업을 검색하세요`                    |
| `/disclosures/today`    | `오늘의 공시`                                | `오늘 발표된 기업 공시를 실시간으로 확인하세요`               |
| `/interests`            | `관심 종목` (이미 설정)                      | 이미 설정                                                     |
| `/login`                | `로그인`                                     | `공시공시에 로그인하여 맞춤 서비스를 이용하세요`              |
| `/companies/[corpCode]` | `{기업명} - 기업 분석` (동적)                | `{기업명}({종목코드})의 공시, 재무제표, AI 분석을 확인하세요` |

### 2-3. 동적 메타데이터 - 기업 상세 페이지

`app/companies/[corpCode]/page.tsx`에 `generateMetadata` 함수 추가:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { corpCode } = await params
  const companyInfo = await getCompanyInfo(corpCode) // 서버 API 사용

  if (!companyInfo) {
    return { title: '기업 정보 없음' }
  }

  return {
    title: `${companyInfo.corpName} - 기업 분석`,
    description: `${companyInfo.corpName}(${companyInfo.stockCode})의 공시, 재무제표, AI 분석을 확인하세요`,
    openGraph: {
      title: `${companyInfo.corpName} - 공시공시`,
      description: `${companyInfo.corpName} 기업 공시 및 재무 분석`,
    },
  }
}
```

### 2-4. JSON-LD 구조화 데이터

#### 사이트 전역 - Organization (`app/layout.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "공시공시",
  "url": "https://gongsi-gongsi.kr",
  "description": "AI 기반 기업 공시 분석 서비스"
}
```

#### 사이트 전역 - WebSite + SearchAction

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "공시공시",
  "url": "https://gongsi-gongsi.kr",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://gongsi-gongsi.kr/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

#### 기업 상세 - FinancialProduct or Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{기업명}",
  "tickerSymbol": "{종목코드}",
  "description": "{기업 설명}"
}
```

### 2-5. Canonical URL

- metadataBase 설정 시 Next.js가 자동으로 canonical URL 생성
- `alternates.canonical` 명시적으로 설정

### 2-6. Twitter Card

- 루트 layout에 `twitter.card: 'summary_large_image'` 설정
- 각 페이지에서 필요시 title, description override

### 2-7. 아이콘 설정

- `app/apple-icon.png` (180x180) 추가
- `app/icon.png` (다양한 사이즈) 추가
- manifest.ts의 icons 배열에 등록

### 2-8. 보안 헤더 (`next.config.ts`)

```typescript
headers: async () => [
  {
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  },
],
```

### 2-9. Google Analytics (`@next/third-parties`)

Next.js 공식 `@next/third-parties` 패키지를 사용하여 GA4를 통합합니다.

#### 패키지 설치

```bash
pnpm --filter web add @next/third-parties
```

#### 환경변수

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

- `.env.local` 및 Vercel 환경변수에 모두 설정 필요

#### layout.tsx에 GoogleAnalytics 컴포넌트 추가

```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
```

- `NEXT_PUBLIC_GA_ID`가 없으면 GA 스크립트가 삽입되지 않음 (로컬 개발 환경 안전)
- Next.js가 자동으로 `gtag.js` 스크립트를 최적화하여 로드

---

## 3. 파일 변경 목록

### 신규 생성

| 파일                         | 설명                           |
| ---------------------------- | ------------------------------ |
| `app/robots.ts`              | 검색엔진 크롤링 규칙           |
| `app/sitemap.ts`             | 사이트맵 자동 생성             |
| `app/manifest.ts`            | PWA 매니페스트                 |
| `shared/lib/seo/json-ld.tsx` | JSON-LD 구조화 데이터 컴포넌트 |

### 수정

| 파일                                | 설명                                                   |
| ----------------------------------- | ------------------------------------------------------ |
| `app/layout.tsx`                    | metadataBase, 루트 메타데이터 강화, JSON-LD, GA 삽입   |
| `app/page.tsx`                      | 홈 메타데이터 (default 사용으로 변경 불필요할 수 있음) |
| `app/search/page.tsx`               | 검색 페이지 메타데이터 추가                            |
| `app/disclosures/today/page.tsx`    | 오늘의 공시 메타데이터 추가                            |
| `app/login/page.tsx`                | 로그인 페이지 메타데이터 추가                          |
| `app/companies/[corpCode]/page.tsx` | generateMetadata 동적 메타데이터                       |
| `next.config.ts`                    | 보안 헤더 추가                                         |

### 의존성 추가

| 패키지                | 설명                      |
| --------------------- | ------------------------- |
| `@next/third-parties` | Google Analytics GA4 통합 |

---

## 4. 참고사항

- OG 이미지: 이번 작업에서 제외 (추후 별도 작업)
- Google Search Console, Naver Search Advisor 등록은 배포 후 별도 진행
- verification 코드는 등록 완료 후 추가
- `NEXT_PUBLIC_GA_ID` 환경변수: `.env.local` 및 Vercel 환경변수에 설정 필요
