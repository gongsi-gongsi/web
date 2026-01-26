# DailyStock

AI 기반 주식 뉴스 분석 서비스

## 프로젝트 구조

```
daily-stock/
├── apps/
│   ├── web/                      # 메인 서비스 (Next.js 15 + Tailwind v4)
│   └── admin/                    # 어드민 (나중에 구현)
│
├── packages/
│   ├── ui/                       # 공통 UI + Storybook + Vitest
│   ├── database/                 # Supabase 타입/쿼리
│   ├── eslint-config/            # ESLint 설정
│   ├── prettier-config/          # Prettier 설정
│   └── typescript-config/        # TypeScript 설정
│
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── .npmrc
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| 패키지 매니저 | pnpm |
| 모노레포 | Turborepo |
| 프론트엔드 | Next.js 15 (App Router) |
| 스타일링 | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui |
| 데이터베이스 | Supabase (PostgreSQL) |
| 인증 | Supabase Auth |
| 자동화 | n8n (AWS EC2) |
| AI | Gemini API |
| 테스트 | Vitest + Playwright |
| 린팅 | ESLint + Prettier |
| 배포 | Vercel |

## 시작하기

### 필수 요구사항

- Node.js 20+
- pnpm 8+

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 테스트 실행
pnpm test

# E2E 테스트 실행 (Playwright)
pnpm test:e2e

# 린트
pnpm lint

# 포맷팅
pnpm format
```

### 환경 변수 설정

`apps/web/.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 개발

### Storybook 실행

```bash
cd packages/ui
pnpm storybook
```

### Playwright 브라우저 설치

```bash
cd apps/web
pnpm dlx playwright install
```

## 배포

### Vercel

프로젝트는 Vercel에 자동으로 배포됩니다. `main` 브랜치에 푸시하면 자동으로 배포가 시작됩니다.

## 라이선스

MIT
