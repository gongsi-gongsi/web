# 📋 StockFlow 프로젝트 설정 가이드

> **목표**: Turborepo 기반 모노레포로 주식 뉴스 분석 서비스 구축  
> **예상 시간**: 2-3시간  
> **난이도**: 중급

---

## 🏗️ 프로젝트 구조 개요

```
stock-flow/
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

---

## 🛠️ 기술 스택

| 영역 | 기술 |
|------|------|
| 패키지 매니저 | pnpm |
| 모노레포 | Turborepo |
| 프론트엔드 | Next.js 15 (App Router) |
| 스타일링 | Tailwind CSS v4 (no config file) |
| UI 컴포넌트 | shadcn/ui |
| 데이터베이스 | Supabase (PostgreSQL) |
| 인증 | Supabase Auth |
| 자동화 | n8n (AWS EC2) |
| AI | Gemini API |
| 테스트 | Vitest + Playwright |
| 린팅 | ESLint + Prettier |
| 배포 | Vercel |

---

## 📝 사전 준비

### 필수 설치
```bash
# Node.js 20+ 설치 확인
node -v  # v20.x.x 이상

# pnpm 설치
npm install -g pnpm

# pnpm 버전 확인
pnpm -v  # 8.x.x 이상
```

### 계정 준비
- [ ] GitHub 계정
- [ ] Vercel 계정 (GitHub 연동)
- [ ] Supabase 계정
- [ ] Google Cloud (Gemini API)
- [ ] AWS 계정 (EC2용)

---

# 🚀 단계별 설정 가이드

---

## 1단계: Turborepo 초기 설정

### 1.1 프로젝트 생성

```bash
# Turborepo 생성
npx create-turbo@latest stock-flow

# 선택 옵션:
# - Package manager: pnpm
# - Include example apps and packages: No
```

### 1.2 디렉토리 이동 및 구조 확인

```bash
cd stock-flow
tree -L 2
```

### 1.3 기본 파일 수정

**`package.json`**
```json
{
  "name": "stock-flow",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "test": "turbo test",
    "test:e2e": "turbo test:e2e"
  },
  "devDependencies": {
    "prettier": "^3.2.5",
    "turbo": "^2.0.0"
  },
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=20"
  }
}
```

**`pnpm-workspace.yaml`**
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**`.npmrc`**
```
# pnpm 설정
auto-install-peers=true
shamefully-hoist=true
strict-peer-dependencies=false
```

### 1.4 검증

```bash
pnpm install
pnpm --version
```

---

## 2단계: 공통 설정 패키지

### 2.1 TypeScript 설정 패키지

```bash
mkdir -p packages/typescript-config
cd packages/typescript-config
```

**`packages/typescript-config/package.json`**
```json
{
  "name": "@repo/typescript-config",
  "version": "0.0.0",
  "private": true,
  "files": [
    "base.json",
    "nextjs.json",
    "react-library.json"
  ]
}
```

**`packages/typescript-config/base.json`**
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Default",
  "compilerOptions": {
    "composite": false,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "inlineSources": false,
    "isolatedModules": true,
    "moduleResolution": "Bundler",
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "preserveWatchOutput": true,
    "skipLibCheck": true,
    "strict": true,
    "strictNullChecks": true
  },
  "exclude": [
    "node_modules"
  ]
}
```

**`packages/typescript-config/nextjs.json`**
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Next.js",
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ],
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "incremental": true,
    "module": "esnext",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": [
    "src",
    "next-env.d.ts",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

**`packages/typescript-config/react-library.json`**
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "React Library",
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "noEmit": true
  }
}
```

### 2.2 ESLint 설정 패키지

```bash
cd ../..
mkdir -p packages/eslint-config
cd packages/eslint-config
```

**`packages/eslint-config/package.json`**
```json
{
  "name": "@repo/eslint-config",
  "version": "0.0.0",
  "private": true,
  "files": [
    "next.js",
    "react.js"
  ],
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^7.1.0",
    "@typescript-eslint/parser": "^7.1.0",
    "eslint-config-next": "^15.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.34.0"
  }
}
```

**`packages/eslint-config/next.js`**
```javascript
module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
```

**`packages/eslint-config/react.js`**
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ]
  }
}
```

### 2.3 Prettier 설정 패키지

```bash
cd ../..
mkdir -p packages/prettier-config
cd packages/prettier-config
```

**`packages/prettier-config/package.json`**
```json
{
  "name": "@repo/prettier-config",
  "version": "0.0.0",
  "private": true,
  "main": "index.js",
  "devDependencies": {
    "prettier": "^3.2.5"
  }
}
```

**`packages/prettier-config/index.js`**
```javascript
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  arrowParens: 'avoid',
  endOfLine: 'lf'
}
```

### 2.4 루트에 Prettier 설정 추가

```bash
cd ../..
```

**`.prettierrc.js` (루트)**
```javascript
module.exports = {
  ...require('@repo/prettier-config')
}
```

**`.prettierignore` (루트)**
```
node_modules
.next
.turbo
dist
build
coverage
.vercel
*.min.js
pnpm-lock.yaml
```

### 2.5 검증

```bash
cd ../..
pnpm install
pnpm format
```

---

## 3단계: packages/ui - 공통 UI 컴포넌트

### 3.1 UI 패키지 초기화

```bash
mkdir -p packages/ui/src
cd packages/ui
```

**`packages/ui/package.json`**
```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./button": "./src/button.tsx",
    "./card": "./src/card.tsx",
    "./styles.css": "./src/styles.css"
  },
  "scripts": {
    "lint": "eslint src/",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@storybook/addon-essentials": "^8.0.0",
    "@storybook/addon-interactions": "^8.0.0",
    "@storybook/addon-links": "^8.0.0",
    "@storybook/blocks": "^8.0.0",
    "@storybook/react": "^8.0.0",
    "@storybook/react-vite": "^8.0.0",
    "@storybook/test": "^8.0.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "jsdom": "^24.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "storybook": "^8.0.0",
    "typescript": "^5.3.3",
    "vitest": "^1.3.1"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  }
}
```

### 3.2 Tailwind CSS v4 설정

**`packages/ui/src/styles.css`**
```css
@import "tailwindcss";

/* 커스텀 CSS 변수 */
@theme {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
  
  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, monospace;
}

/* 기본 스타일 */
* {
  @apply border-gray-200;
}

body {
  @apply bg-white text-gray-900 font-sans;
}

h1, h2, h3, h4, h5, h6 {
  @apply font-bold;
}
```

### 3.3 샘플 컴포넌트 생성

**`packages/ui/src/button.tsx`**
```typescript
import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

**`packages/ui/src/card.tsx`**
```typescript
import React from 'react'

export interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  )
}
```

### 3.4 Vitest 설정

**`packages/ui/vitest.config.ts`**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts'
  }
})
```

**`packages/ui/vitest.setup.ts`**
```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
```

**`packages/ui/src/button.test.tsx`**
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByText('Primary')
    expect(button).toHaveClass('bg-primary-600')
  })
})
```

### 3.5 Storybook 설정

**`packages/ui/.storybook/main.ts`**
```typescript
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
}

export default config
```

**`packages/ui/.storybook/preview.ts`**
```typescript
import type { Preview } from '@storybook/react'
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
```

**`packages/ui/src/button.stories.tsx`**
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button'
  }
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button'
  }
}
```

### 3.6 TypeScript 설정

**`packages/ui/tsconfig.json`**
```json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.stories.tsx", "**/*.test.tsx"]
}
```

### 3.7 검증

```bash
cd packages/ui
pnpm install
pnpm test
pnpm storybook
```

---

## 4단계: packages/database - Supabase 통합

### 4.1 Database 패키지 초기화

```bash
cd ../..
mkdir -p packages/database/src
cd packages/database
```

**`packages/database/package.json`**
```json
{
  "name": "@repo/database",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./client": "./src/client.ts",
    "./types": "./src/types.ts"
  },
  "scripts": {
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "eslint": "^8.57.0",
    "typescript": "^5.3.3"
  }
}
```

### 4.2 Supabase 클라이언트

**`packages/database/src/client.ts`**
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// 서버 사이드용 클라이언트 (Service Role Key)
export function createServerClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
```

### 4.3 타입 정의 (초기 스키마)

**`packages/database/src/types.ts`**
```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // 사용자 관심 종목
      user_stocks: {
        Row: {
          id: string
          user_id: string
          stock_code: string
          stock_name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stock_code: string
          stock_name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stock_code?: string
          stock_name?: string
          created_at?: string
        }
      }
      // 종목 뉴스
      stock_news: {
        Row: {
          id: string
          stock_code: string
          title: string
          content: string
          source: string
          published_at: string
          url: string
          sentiment?: number
          keywords?: string[]
          created_at: string
        }
        Insert: {
          id?: string
          stock_code: string
          title: string
          content: string
          source: string
          published_at: string
          url: string
          sentiment?: number
          keywords?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          stock_code?: string
          title?: string
          content?: string
          source?: string
          published_at?: string
          url?: string
          sentiment?: number
          keywords?: string[]
          created_at?: string
        }
      }
      // 주가 데이터
      stock_prices: {
        Row: {
          id: string
          stock_code: string
          price: number
          change: number
          change_percent: number
          volume: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          stock_code: string
          price: number
          change: number
          change_percent: number
          volume: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          stock_code?: string
          price?: number
          change?: number
          change_percent?: number
          volume?: number
          date?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
```

### 4.4 헬퍼 함수

**`packages/database/src/queries.ts`**
```typescript
import { supabase } from './client'

// 사용자 관심 종목 조회
export async function getUserStocks(userId: string) {
  const { data, error } = await supabase
    .from('user_stocks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 고유 종목 목록 가져오기 (중복 제거)
export async function getUniqueStocks() {
  const { data, error } = await supabase
    .from('user_stocks')
    .select('stock_code, stock_name')
    .order('stock_code')

  if (error) throw error
  
  // 중복 제거
  const unique = Array.from(
    new Map(data.map(item => [item.stock_code, item])).values()
  )
  
  return unique
}

// 종목별 뉴스 조회
export async function getStockNews(stockCode: string, limit = 10) {
  const { data, error } = await supabase
    .from('stock_news')
    .select('*')
    .eq('stock_code', stockCode)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// 종목 주가 조회
export async function getStockPrice(stockCode: string) {
  const { data, error } = await supabase
    .from('stock_prices')
    .select('*')
    .eq('stock_code', stockCode)
    .order('date', { ascending: false })
    .limit(1)
    .single()

  if (error) throw error
  return data
}
```

### 4.5 TypeScript 설정

**`packages/database/tsconfig.json`**
```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### 4.6 검증

```bash
cd packages/database
pnpm install
pnpm type-check
```

---

## 5단계: apps/web - Next.js 메인 애플리케이션

### 5.1 Next.js 앱 생성

```bash
cd ../..
npx create-next-app@latest apps/web

# 선택 옵션:
# - TypeScript: Yes
# - ESLint: Yes
# - Tailwind CSS: Yes (v4 나중에 수동 설정)
# - src/ directory: No
# - App Router: Yes
# - import alias: @/* (기본값)
```

### 5.2 package.json 수정

**`apps/web/package.json`**
```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@repo/database": "workspace:*",
    "@repo/ui": "workspace:*",
    "@supabase/ssr": "^0.1.0",
    "@supabase/supabase-js": "^2.39.0",
    "next": "^15.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.42.0",
    "@repo/eslint-config": "workspace:*",
    "@repo/prettier-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "postcss": "^8",
    "tailwindcss": "^4.0.0",
    "typescript": "^5"
  }
}
```

### 5.3 Tailwind CSS v4 설정

**`apps/web/app/globals.css`**
```css
@import "@repo/ui/styles.css";
@import "tailwindcss";

/* 앱 전용 추가 스타일 */
```

### 5.4 환경 변수 설정

**`apps/web/.env.local.example`**
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

**`.gitignore`에 추가**
```
.env.local
.env*.local
```

### 5.5 Supabase Auth 설정

**`apps/web/lib/supabase/client.ts`**
```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@repo/database/types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`apps/web/lib/supabase/server.ts`**
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@repo/database/types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서는 set 불가능
          }
        },
      },
    }
  )
}
```

**`apps/web/lib/supabase/middleware.ts`**
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  return supabaseResponse
}
```

**`apps/web/middleware.ts`**
```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 5.6 레이아웃 설정

**`apps/web/app/layout.tsx`**
```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StockFlow - AI 주식 뉴스 분석',
  description: 'AI 기반 주식 뉴스 분석 및 감성 분석 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  )
}
```

### 5.7 홈페이지

**`apps/web/app/page.tsx`**
```typescript
import { Button } from '@repo/ui/button'
import { Card } from '@repo/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          StockFlow
        </h1>
        
        <Card title="환영합니다">
          <p className="text-gray-700 mb-4">
            AI 기반 주식 뉴스 분석 서비스입니다.
          </p>
          <Button variant="primary">
            시작하기
          </Button>
        </Card>
      </div>
    </main>
  )
}
```

### 5.8 API Routes 예시

**`apps/web/app/api/stocks/route.ts`**
```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('user_stocks')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ stocks: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

### 5.9 TypeScript 설정

**`apps/web/tsconfig.json`**
```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### 5.10 ESLint 설정

**`apps/web/.eslintrc.js`**
```javascript
module.exports = {
  extends: ['@repo/eslint-config/next']
}
```

### 5.11 검증

```bash
cd apps/web
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속

---

## 6단계: E2E 테스트 (Playwright)

### 6.1 Playwright 설정

```bash
cd apps/web
pnpm dlx playwright install
```

**`apps/web/playwright.config.ts`**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 6.2 샘플 테스트

**`apps/web/e2e/home.spec.ts`**
```typescript
import { test, expect } from '@playwright/test'

test('홈페이지가 정상적으로 렌더링된다', async ({ page }) => {
  await page.goto('/')
  
  await expect(page.getByRole('heading', { name: 'StockFlow' })).toBeVisible()
  await expect(page.getByText('AI 기반 주식 뉴스 분석 서비스입니다.')).toBeVisible()
})

test('시작하기 버튼이 존재한다', async ({ page }) => {
  await page.goto('/')
  
  await expect(page.getByRole('button', { name: '시작하기' })).toBeVisible()
})
```

### 6.3 검증

```bash
pnpm test:e2e
```

---

## 7단계: Turbo 설정

### 7.1 turbo.json 설정

**루트 `turbo.json`**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "dependsOn": ["build"],
      "cache": false
    },
    "storybook": {
      "cache": false,
      "persistent": true
    },
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    }
  }
}
```

### 7.2 전체 프로젝트 빌드 및 테스트

```bash
cd ../..  # 루트로 이동

# 전체 린트
pnpm lint

# 전체 빌드
pnpm build

# 전체 테스트
pnpm test

# 전체 개발 서버 실행
pnpm dev
```

---

## 8단계: apps/admin 초기 설정 (나중에 구현)

```bash
cd apps
mkdir admin
cd admin
```

**`apps/admin/package.json`**
```json
{
  "name": "admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "echo 'Admin app - Coming soon'",
    "build": "echo 'Admin app - Coming soon'",
    "start": "echo 'Admin app - Coming soon'"
  }
}
```

**`apps/admin/README.md`**
```markdown
# StockFlow Admin

관리자 대시보드 - 추후 구현 예정

## 예정 기능
- 사용자 관리
- 종목 관리
- 데이터 모니터링
- 수익 대시보드
```

---

## 9단계: 배포 준비

### 9.1 Vercel 설정

**`vercel.json` (루트)**
```json
{
  "buildCommand": "cd apps/web && pnpm build",
  "devCommand": "cd apps/web && pnpm dev",
  "installCommand": "pnpm install",
  "framework": null,
  "outputDirectory": "apps/web/.next"
}
```

### 9.2 GitHub Actions (CI/CD)

**`.github/workflows/ci.yml`**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Lint
        run: pnpm lint
      
      - name: Test
        run: pnpm test
      
      - name: Build
        run: pnpm build
```

---

## 10단계: Supabase 데이터베이스 스키마 생성

### 10.1 Supabase 대시보드에서 실행

```sql
-- 사용자 관심 종목 테이블
CREATE TABLE user_stocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stock_code VARCHAR(20) NOT NULL,
  stock_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_user_stocks_user_id ON user_stocks(user_id);
CREATE INDEX idx_user_stocks_stock_code ON user_stocks(stock_code);

-- RLS 활성화
ALTER TABLE user_stocks ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Users can view own stocks"
  ON user_stocks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stocks"
  ON user_stocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stocks"
  ON user_stocks FOR DELETE
  USING (auth.uid() = user_id);

-- 종목 뉴스 테이블
CREATE TABLE stock_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_code VARCHAR(20) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(100) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  url TEXT UNIQUE NOT NULL,
  sentiment DECIMAL(3,2),
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_stock_news_stock_code ON stock_news(stock_code);
CREATE INDEX idx_stock_news_published_at ON stock_news(published_at DESC);
CREATE INDEX idx_stock_news_url ON stock_news(url);

-- RLS (모든 사용자 읽기 가능)
ALTER TABLE stock_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news"
  ON stock_news FOR SELECT
  USING (true);

-- 주가 데이터 테이블
CREATE TABLE stock_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_code VARCHAR(20) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  change DECIMAL(15,2) NOT NULL,
  change_percent DECIMAL(5,2) NOT NULL,
  volume BIGINT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(stock_code, date)
);

-- 인덱스
CREATE INDEX idx_stock_prices_stock_code ON stock_prices(stock_code);
CREATE INDEX idx_stock_prices_date ON stock_prices(date DESC);

-- RLS (모든 사용자 읽기 가능)
ALTER TABLE stock_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prices"
  ON stock_prices FOR SELECT
  USING (true);
```

### 10.2 타입 자동 생성

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 타입 생성
supabase gen types typescript --project-id your-project-id > packages/database/src/types.ts
```

---

## 📚 개발 워크플로우

### 일일 개발 루틴

```bash
# 1. 최신 코드 받기
git pull

# 2. 의존성 설치 (새로운 패키지 추가 시)
pnpm install

# 3. 개발 서버 실행
pnpm dev

# 4. 코드 작성 후 린트
pnpm lint

# 5. 테스트 실행
pnpm test

# 6. 커밋 전 포맷팅
pnpm format
```

### 새 컴포넌트 추가 시

```bash
# 1. packages/ui에 컴포넌트 추가
# 2. Storybook 스토리 작성
# 3. Vitest 테스트 작성
# 4. apps/web에서 사용

cd packages/ui
pnpm storybook  # 확인
pnpm test       # 테스트
```

### 배포

```bash
# Vercel (자동 배포)
git push origin main

# 수동 배포
cd apps/web
vercel
```

---

## 🔧 트러블슈팅

### 1. pnpm 설치 오류

```bash
# 캐시 삭제
pnpm store prune

# 재설치
rm -rf node_modules
pnpm install
```

### 2. Turbo 캐시 문제

```bash
# 캐시 삭제
pnpm turbo clean
rm -rf .turbo

# 재빌드
pnpm build
```

### 3. Tailwind v4가 적용 안 됨

```bash
# postcss 설정 확인
# app/globals.css에 @import "tailwindcss" 있는지 확인
```

### 4. Supabase 타입 불일치

```bash
# 타입 재생성
supabase gen types typescript --project-id your-project-id > packages/database/src/types.ts
```

---

## 📋 체크리스트

### 초기 설정
- [ ] Node.js 20+ 설치
- [ ] pnpm 설치
- [ ] GitHub 레포지토리 생성
- [ ] Supabase 프로젝트 생성
- [ ] Vercel 계정 연결

### 프로젝트 생성
- [ ] Turborepo 초기화
- [ ] packages/typescript-config 설정
- [ ] packages/eslint-config 설정
- [ ] packages/prettier-config 설정
- [ ] packages/ui 생성 (Tailwind v4, Vitest, Storybook)
- [ ] packages/database 생성 (Supabase)
- [ ] apps/web 생성 (Next.js)
- [ ] apps/admin 구조 생성

### 테스트
- [ ] Vitest 테스트 통과
- [ ] Playwright E2E 테스트 통과
- [ ] Storybook 정상 실행
- [ ] pnpm dev 정상 실행
- [ ] pnpm build 성공

### 배포
- [ ] 환경 변수 설정
- [ ] Vercel 배포 성공
- [ ] Supabase RLS 설정
- [ ] CI/CD 파이프라인 동작

---

## 🎯 다음 단계

1. **UI 컴포넌트 확장**
   - shadcn/ui 통합
   - 차트 라이브러리 추가
   - 폼 컴포넌트 구현

2. **인증 구현**
   - 로그인/회원가입 페이지
   - 소셜 로그인 (구글, 카카오)
   - 인증 미들웨어

3. **대시보드 구현**
   - 종목 선택 UI
   - 뉴스 목록
   - AI 분석 결과 표시

4. **n8n 워크플로우**
   - 데이터 수집 자동화
   - Gemini API 통합
   - Webhook 설정

5. **수익화**
   - 결제 시스템 (토스페이먼츠)
   - 구독 관리
   - 프리미엄 기능

---

## 📞 도움 받기

- **Turborepo 문서**: https://turbo.build/repo/docs
- **Next.js 문서**: https://nextjs.org/docs
- **Supabase 문서**: https://supabase.com/docs
- **Tailwind CSS v4**: https://tailwindcss.com/blog/tailwindcss-v4-alpha
- **Playwright 문서**: https://playwright.dev/docs/intro

---

**프로젝트 시작을 축하합니다! 🎉**
