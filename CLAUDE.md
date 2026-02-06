# 공시공시 (GongsiGongsi) - AI 주식 뉴스 분석 서비스

## 📋 프로젝트 개요

공시공시는 개인 투자자를 위한 AI 기반 주식 뉴스 분석 서비스입니다.

### 주요 기능

- 📰 실시간 주식 뉴스 수집
- 🤖 AI 기반 감성 분석
- 📊 종목 추천 및 인사이트 제공
- 📈 투자 의사결정 지원

### 타겟 사용자

- 개인 투자자
- 주식 투자에 관심 있는 일반 사용자

---

## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 18
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query (React Query)

### Development Tools

- **Package Manager**: pnpm (workspace)
- **Monorepo**: Turbo
- **Testing**: Vitest, Playwright (E2E)
- **Linting**: ESLint, Prettier
- **Version Control**: Git

### Infrastructure

- **Build**: Next.js Build
- **Deployment**: TBD

---

## 📁 프로젝트 구조 (Monorepo)

```
gongsi-gongsi/
├── apps/
│   ├── web/          # 사용자용 웹 애플리케이션
│   └── admin/        # 관리자용 대시보드
├── packages/
│   ├── ui/           # 공통 UI 컴포넌트 라이브러리 (@gs/ui)
│   ├── tailwind-config/  # Tailwind 설정 (@gs/tailwind-config)
│   ├── typescript-config/  # TypeScript 설정 (@gs/typescript-config)
│   ├── eslint-config/      # ESLint 설정 (@gs/eslint-config)
│   └── prettier-config/    # Prettier 설정 (@gs/prettier-config)
└── turbo.json
```

---

## 🏗 아키텍처: FSD (Feature-Sliced Design)

각 앱(`web`, `admin`)은 FSD 아키텍처를 따릅니다.

### FSD 레이어 구조

```
app/
├── app/              # Next.js App Router (라우팅, 레이아웃)
├── widgets/          # 독립적인 UI 블록 (Header, Sidebar, NewsCard 등)
├── features/         # 사용자 기능 (검색, 필터링, 좋아요 등)
├── entities/         # 비즈니스 엔티티 (stock, news, user 등)
└── shared/           # 공유 코드
    ├── api/          # API 클라이언트, fetch 함수
    ├── lib/          # 유틸리티, 헬퍼 함수
    ├── hooks/        # 공통 React Hooks
    ├── config/       # 설정 파일
    └── types/        # 공통 타입 정의
```

### 레이어별 역할

#### 1. `app/` - 애플리케이션 초기화

- Next.js App Router 라우팅
- 전역 레이아웃 및 프로바이더
- 메타데이터 설정

> ⚠️ **중요: `app/` 폴더 안에 `ui/`, `components/` 폴더를 절대 생성하지 마세요!**
>
> - `app/` 레이어는 **라우팅만** 담당합니다
> - 모든 UI 컴포넌트는 `widgets/`, `features/`, `entities/` 레이어에 위치해야 합니다
> - 페이지 컴포넌트(`page.tsx`)는 widgets를 조합만 해야 합니다
>
> ```typescript
> // ❌ 잘못된 예시
> app / disclosures / ui / disclosure - list.tsx // app/ 안에 ui 폴더 금지!
>
> // ✅ 올바른 예시
> widgets / disclosure - list / ui / disclosure - list.tsx // widgets 레이어에 위치
> app / disclosures / page.tsx // widgets만 import해서 사용
> ```

#### 2. `widgets/` - 복합 UI 블록

- 여러 features와 entities를 조합한 독립적 UI
- 예: `NewsCardWidget`, `StockChartWidget`, `HeaderWidget`

#### 3. `features/` - 사용자 기능

- 특정 비즈니스 로직을 수행하는 기능
- 예: `search-stocks/`, `filter-news/`, `like-stock/`

#### 4. `entities/` - 비즈니스 엔티티

- 도메인 모델 및 관련 로직
- 예: `stock/`, `news/`, `user/`

#### 5. `shared/` - 공유 코드

- 재사용 가능한 유틸리티 및 설정
- **주의**: UI 컴포넌트는 `@repo/ui` 패키지 사용

---

## 📐 코딩 규칙

### 파일 및 폴더 네이밍

```typescript
// ✅ 올바른 예시
components / stock - card / index.ts
stock - card.tsx
stock - card.test.tsx
stock - card.stories.tsx

// ❌ 잘못된 예시
components / StockCard / StockCard.tsx // PascalCase 사용 금지
```

#### 규칙

- **파일명, 폴더명**: `kebab-case` 사용
- **컴포넌트명**: `PascalCase` (코드 내부)
- **변수, 함수명**: `camelCase`
- **상수**: `UPPER_SNAKE_CASE`
- **타입, 인터페이스**: `PascalCase`

### Export 규칙

모든 모듈은 **반드시 `index.ts`를 통해 export**합니다.

```typescript
// ✅ features/search-stocks/index.ts
export { SearchStocks } from './ui/search-stocks'
export { useSearchStocks } from './model/use-search-stocks'
export type { SearchStocksProps } from './types'

// ✅ 사용하는 곳
import { SearchStocks, useSearchStocks } from '@/features/search-stocks'
```

### Import 순서

ESLint의 `import/order` 설정을 따릅니다:

```typescript
// 1. React 및 Next.js
import { useState } from 'react'
import Link from 'next/link'

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'

// 3. @gs/* 패키지
import { Button, Card } from '@gs/ui'

// 4. 내부 절대경로 (@/)
import { SearchStocks } from '@/features/search-stocks'
import { Stock } from '@/entities/stock'

// 5. 상대경로
import { formatDate } from '../lib/utils'
import type { NewsItem } from './types'
```

### 컴포넌트 작성 규칙

```typescript
// ✅ 올바른 예시
interface StockCardProps {
  stockId: string
  title: string
  price: number
  onChange?: (value: number) => void
}

export function StockCard({ stockId, title, price, onChange }: StockCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card>
      {/* ... */}
    </Card>
  )
}
```

#### 규칙

- **함수형 컴포넌트만 사용** (클래스 컴포넌트 금지)
- **Props는 `interface`로 정의** (type 대신)
- **화살표 함수 대신 `function` 키워드 사용** (컴포넌트)
- **Early return 패턴 활용**

### TypeScript 규칙

```typescript
// ✅ 올바른 예시
interface User {
  id: string
  name: string
  email?: string // optional은 ? 사용
}

function getUser(id: string): Promise<User> {
  // 명시적 타입 정의
}

// ❌ 잘못된 예시
const getUser = (id: any) => {
  // any 사용 금지 (warn)
  // ...
}
```

#### 규칙

- `any` 사용 시 ESLint warning
- 사용하지 않는 변수는 `_` prefix (`_unusedVar`)
- 타입 추론 가능한 경우 타입 생략 가능
- API 응답 등 외부 데이터는 반드시 타입 정의

### 함수 주석 규칙

라이브러리 함수(유틸리티, 헬퍼 함수 등)는 **JSDoc 스타일 주석**을 반드시 작성합니다.

```typescript
// ✅ 올바른 예시 - entities/*/lib, shared/lib 등

/**
 * 공시 유형 코드를 한글 라벨로 변환합니다
 * @param type - 공시 유형 코드 (A~J)
 * @returns 공시 유형 한글 라벨
 * @example
 * getDisclosureTypeLabel('A') // '정기공시'
 * getDisclosureTypeLabel('B') // '주요사항보고'
 */
export function getDisclosureTypeLabel(type: DisclosureType): string {
  // ...
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅합니다
 * @param date - 포맷팅할 날짜 객체
 * @param separator - 구분자 (기본값: '-')
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(date: Date, separator = '-'): string {
  // ...
}
```

#### 규칙

- **필수 항목**: 함수 설명, `@param`, `@returns`
- **선택 항목**: `@example`, `@throws`, `@deprecated`
- **함수 설명**: 함수가 무엇을 하는지 명확하게 작성
- **@param**: 각 매개변수의 의미와 타입 설명
- **@returns**: 반환값의 의미 설명
- **@example**: 복잡한 함수는 사용 예시 추가

#### 주석이 필요한 경우

- ✅ `shared/lib`, `entities/*/lib` 등의 유틸리티 함수
- ✅ 재사용 가능한 헬퍼 함수
- ✅ 복잡한 비즈니스 로직 함수
- ✅ 공개 API (export되는 함수)
- ✅ 커스텀 훅 (`use-*.ts`) - 용도, 반환값 설명 필수

#### 주석이 선택적인 경우

- 컴포넌트 내부의 간단한 핸들러 함수
- 일회성 로직
- 함수명만으로 충분히 이해 가능한 경우

---

## 🎨 UI 컴포넌트 관리

### @gs/ui 패키지 사용

공통 UI 컴포넌트는 **@gs/ui 패키지에서만** 관리합니다.

```typescript
// ✅ 올바른 사용
import { Button, Card, Input } from '@gs/ui'

// ❌ shared/ui는 사용하지 않음
// import { Button } from '@/shared/ui/button'  // 금지
```

### 컴포넌트 분류

- **@gs/ui**: 범용 컴포넌트 (Button, Input, Card, Dialog 등)
- **widgets/**: 도메인 특화 복합 컴포넌트
- **features/**: 기능별 컴포넌트

---

## 🌐 API 통신

### TanStack Query 사용

서버 상태 관리는 **TanStack Query (React Query)**를 사용합니다.

```typescript
// entities/stock/api/get-stock.ts
export async function getStock(stockId: string) {
  const response = await fetch(`/api/stocks/${stockId}`)
  if (!response.ok) throw new Error('Failed to fetch stock')
  return response.json()
}

// entities/stock/model/use-stock.ts
import { useQuery } from '@tanstack/react-query'
import { getStock } from '../api/get-stock'

export function useStock(stockId: string) {
  return useQuery({
    queryKey: ['stock', stockId],
    queryFn: () => getStock(stockId),
  })
}

// 사용하는 곳
import { useStock } from '@/entities/stock'

function StockDetail({ stockId }: { stockId: string }) {
  const { data, isLoading, error } = useStock(stockId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{data.name}</div>
}
```

---

## 🔧 개발 환경

### 명령어

```bash
# 개발 서버 실행 (ui 자동 빌드 + watch 모드)
pnpm dev

# ui 패키지만 watch 모드로 실행
pnpm dev:ui

# 앱만 실행
pnpm dev:apps

# 특정 앱만 실행
pnpm --filter web dev
pnpm --filter admin dev

# 빌드
pnpm build

# 테스트
pnpm test

# E2E 테스트
pnpm test:e2e

# 린트
pnpm lint

# 포맷
pnpm format
```

### 의존성 추가

```bash
# web 앱에 라이브러리 추가
pnpm --filter web add <package-name>

# ui 패키지에 라이브러리 추가
pnpm --filter @gs/ui add <package-name>

# 모든 workspace에 dev 의존성 추가
pnpm add -Dw <package-name>
```

---

## 🌿 Git 브랜치 전략

### 브랜치 구조

```
main       (프로덕션)
  └─ develop (개발)
       ├─ feature/xxx
       ├─ fix/xxx
       └─ refactor/xxx
```

### ⚠️ 중요: 머지 규칙

**모든 PR은 반드시 `develop` 브랜치를 base로 생성하고 머지합니다.**

- ✅ 올바른 예시: `feature/xxx` → `develop`
- ❌ 잘못된 예시: `feature/xxx` → `main`

### 브랜치 네이밍

```bash
# 기능 개발
feature/search-stocks
feature/news-sentiment-analysis

# 버그 수정
fix/stock-price-display
fix/api-timeout

# 리팩토링
refactor/api-layer
refactor/shared-hooks
```

### 워크플로우

1. `develop` 브랜치에서 작업 브랜치 생성
2. 작업 완료 후 `develop`으로 PR 생성
3. 리뷰 및 테스트 통과 후 `develop`에 merge
4. 배포 시 `develop` → `main` merge

---

## 📝 커밋 메시지 규칙

### Conventional Commits

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.
`commitlint`와 `husky`가 설정되어 있어 커밋 시 자동 검증됩니다.

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Type 종류

| Type       | 설명                          |
| ---------- | ----------------------------- |
| `feat`     | 새로운 기능 추가              |
| `fix`      | 버그 수정                     |
| `docs`     | 문서 변경                     |
| `style`    | 코드 포맷팅 (기능 변경 없음)  |
| `refactor` | 코드 리팩토링                 |
| `perf`     | 성능 개선                     |
| `test`     | 테스트 추가/수정              |
| `build`    | 빌드 시스템, 외부 의존성 변경 |
| `ci`       | CI 설정 변경                  |
| `chore`    | 기타 변경사항                 |
| `revert`   | 이전 커밋 되돌리기            |

### 예시

```bash
# 기능 추가
feat(stock): 주식 검색 기능 추가

# 버그 수정
fix(api): 주식 가격 조회 시 null 에러 수정

# 리팩토링
refactor(ui): Button 컴포넌트 forwardRef 적용

# 스코프 없이
docs: README 업데이트
```

### 규칙

- subject는 **소문자**로 시작
- subject 끝에 **마침표(.) 금지**
- subject 최대 **72자**
- body 한 줄 최대 **100자**

---

## 📦 버전 관리 (Changesets)

### 변경사항 추가

PR에 포함된 변경사항이 버전 업데이트가 필요한 경우:

```bash
pnpm changeset
```

1. 변경된 패키지 선택
2. 버전 범프 타입 선택 (patch/minor/major)
3. 변경 내용 설명 작성

### 버전 범프 기준

| Type    | 언제 사용               |
| ------- | ----------------------- |
| `patch` | 버그 수정, 내부 변경    |
| `minor` | 새로운 기능 (하위 호환) |
| `major` | Breaking Changes        |

---

## ⚠️ 주의사항

### 금지 사항

- ❌ `any` 타입 남발 (경고 발생)
- ❌ PascalCase 파일명
- ❌ shared/ui 폴더 생성
- ❌ **app/ 폴더 안에 ui/, components/ 폴더 생성** (FSD 위반!)
- ❌ index.ts 없이 직접 import
- ❌ 클래스 컴포넌트 사용
- ❌ pages 레이어 생성 (Next.js app 디렉토리 사용)

### 권장 사항

- ✅ 기능 단위로 모듈화
- ✅ 타입 안정성 우선
- ✅ 컴포넌트는 작고 단순하게
- ✅ 비즈니스 로직과 UI 분리
- ✅ TanStack Query로 서버 상태 관리
- ✅ FSD 레이어 규칙 준수

---

## 🤖 AI 개발 도우미 사용 시

이 문서는 Claude 등 AI 개발 도우미가 프로젝트를 이해하고 규칙을 준수하도록 돕습니다.

### 커밋 규칙

**⚠️ 중요: 자동 커밋 금지**

- AI는 작업 완료 후 **자동으로 커밋하지 않습니다**
- 사용자가 명시적으로 "커밋해", "커밋해줘" 등으로 요청할 때만 커밋을 수행합니다
- 작업 완료 시 변경사항을 요약하고, 사용자의 커밋 지시를 기다립니다

### 작업 요청 예시

AI에게 작업 요청 시:

- "FSD 아키텍처를 따라서..."
- "kebab-case로 파일명 작성..."
- "index.ts로 export 해줘..."
- "@gs/ui 컴포넌트 사용해서..."

---

**마지막 업데이트**: 2026-02-06
