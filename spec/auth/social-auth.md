# 소셜 로그인 (카카오, 구글) 명세서

## 📋 기능 개요

Supabase Auth를 활용하여 카카오, 구글 소셜 로그인을 구현합니다.

### 목적

- 별도 회원가입 절차 없이 소셜 계정으로 간편 로그인
- 로그인 사용자 대상 기능 (관심 종목, AI 리포트, 알림 등) 활성화
- Supabase Auth와 기존 Prisma User 모델 연동

### 인증 방식

- **Supabase Auth** (OAuth 2.0 PKCE flow)
- **Provider**: 카카오 (Kakao), 구글 (Google)
- **세션 관리**: Supabase SSR (`@supabase/ssr`) + Cookie 기반
- **토큰 갱신**: Supabase가 자동으로 refresh token 처리

---

## 🎯 요구사항

### 1. 로그인

- **진입점**: 헤더 우측 "로그인" 버튼
- **로그인 페이지**: `/login` 경로에 카카오/구글 로그인 버튼 표시
- **동작**:
  - 소셜 로그인 버튼 클릭 시 해당 OAuth 제공자로 리다이렉트
  - 인증 완료 후 `/auth/callback` 으로 콜백
  - 콜백에서 세션 설정 후 원래 페이지로 리다이렉트
  - 최초 로그인 시 Prisma `User` 레코드 자동 생성 (upsert)

### 2. 로그아웃

- **진입점**: 헤더 우측 사용자 아바타/이름 클릭 → 드롭다운 메뉴 → "로그아웃"
- **동작**:
  - Supabase 세션 제거
  - 쿠키 삭제
  - 홈페이지로 리다이렉트

### 3. 세션 관리

- **미들웨어**: 모든 요청에서 Supabase 세션 검증 및 토큰 갱신
- **보호 경로**: 인증이 필요한 페이지 접근 시 `/login`으로 리다이렉트
- **비보호 경로**: 공시 목록, 검색 등 공개 페이지는 비로그인 상태에서도 접근 가능

### 4. 사용자 정보 동기화

- Supabase Auth의 `user.id`를 Prisma `User.id`로 사용 (UUID 동일)
- 소셜 로그인 시 제공되는 email, name을 Prisma `User`에 upsert
- 프로필 이미지 URL은 Supabase Auth `user_metadata`에서 조회

---

## 🎨 UI/UX 상세

### 헤더 (비로그인 상태)

#### PC 버전

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  공시공시    공시     (기존 메뉴...)                         [로그인]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 모바일 버전

```
┌─────────────────────────────────────────┐
│  공시공시                    [로그인] │
└─────────────────────────────────────────┘
```

### 헤더 (로그인 상태)

#### PC 버전

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  공시공시    공시     (기존 메뉴...)                      [🔔] [👤 이름]  │
└──────────────────────────────────────────────────────────────────────────────┘
                                                                    │
                                                          ┌─────────────────┐
                                                          │  마이페이지      │
                                                          │  관심 종목       │
                                                          │  ─────────────  │
                                                          │  로그아웃        │
                                                          └─────────────────┘
```

### 로그인 페이지 (`/login`)

#### PC 버전

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                    ┌────────────────────────────────────┐                    │
│                    │                                    │                    │
│                    │         공시공시 로그인           │                    │
│                    │                                    │                    │
│                    │  소셜 계정으로 간편하게 시작하세요   │                    │
│                    │                                    │                    │
│                    │  ┌──────────────────────────────┐  │                    │
│                    │  │  🟡  카카오로 시작하기         │  │                    │
│                    │  └──────────────────────────────┘  │                    │
│                    │                                    │                    │
│                    │  ┌──────────────────────────────┐  │                    │
│                    │  │  🔵  구글로 시작하기           │  │                    │
│                    │  └──────────────────────────────┘  │                    │
│                    │                                    │                    │
│                    │  로그인 시 서비스 이용약관 및       │                    │
│                    │  개인정보 처리방침에 동의합니다     │                    │
│                    │                                    │                    │
│                    └────────────────────────────────────┘                    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 모바일 버전

```
┌─────────────────────────────────────────┐
│  ← 뒤로                                │
├─────────────────────────────────────────┤
│                                         │
│         공시공시 로그인                │
│                                         │
│  소셜 계정으로 간편하게 시작하세요       │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🟡  카카오로 시작하기             │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🔵  구글로 시작하기               │  │
│  └───────────────────────────────────┘  │
│                                         │
│  로그인 시 서비스 이용약관 및           │
│  개인정보 처리방침에 동의합니다         │
│                                         │
└─────────────────────────────────────────┘
```

### 로그인 버튼 스타일

- **카카오**: 카카오 공식 가이드라인 준수 (노란색 배경 `#FEE500`, 검정 텍스트)
- **구글**: 구글 브랜딩 가이드라인 준수 (흰색 배경, 테두리, 구글 로고)

### 공통 인터랙션

- **로딩**: 로그인 버튼 클릭 후 OAuth 리다이렉트 전 로딩 스피너 표시
- **에러 처리**:
  - OAuth 인증 실패: `로그인에 실패했습니다. 다시 시도해주세요` 토스트 표시
  - 이미 로그인 상태에서 `/login` 접근: 홈으로 리다이렉트

---

## 🔧 기술 구현 방안

### Supabase Auth 설정

#### 사전 준비 (Supabase Dashboard)

1. **카카오 OAuth 설정**
   - Supabase Dashboard → Authentication → Providers → Kakao 활성화
   - Kakao Developers에서 앱 생성 후 Client ID / Secret 등록
   - Redirect URI: `{SUPABASE_URL}/auth/v1/callback`

2. **구글 OAuth 설정**
   - Supabase Dashboard → Authentication → Providers → Google 활성화
   - Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
   - Redirect URI: `{SUPABASE_URL}/auth/v1/callback`

#### 환경 변수

```bash
# .env.local에 추가
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 아키텍처 (FSD)

```
apps/web/
├── app/
│   ├── login/
│   │   └── page.tsx                           # 로그인 페이지
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts                       # OAuth 콜백 Route Handler
│   └── middleware.ts                           # Supabase 세션 갱신 미들웨어
│
├── widgets/
│   └── auth/
│       ├── index.ts
│       └── ui/
│           ├── login-form.tsx                 # 로그인 폼 (소셜 버튼 목록)
│           ├── user-menu.tsx                  # 로그인 상태 사용자 메뉴 (드롭다운)
│           └── auth-button.tsx                # 헤더용 로그인/사용자 버튼
│
├── features/
│   └── auth/
│       ├── index.ts
│       └── model/
│           ├── use-sign-in.ts                 # 소셜 로그인 실행 훅
│           └── use-sign-out.ts                # 로그아웃 훅
│
├── entities/
│   └── user/
│       ├── index.ts
│       ├── api/
│       │   └── sync-user.ts                   # Supabase → Prisma User 동기화
│       └── model/
│           ├── use-current-user.ts            # 현재 로그인 사용자 조회 훅
│           └── types.ts                       # User 관련 타입
│
└── shared/
    └── lib/
        └── supabase/
            ├── index.ts
            ├── client.ts                      # 브라우저용 Supabase 클라이언트
            ├── server.ts                      # 서버 컴포넌트용 Supabase 클라이언트
            └── middleware.ts                  # 미들웨어용 Supabase 클라이언트
```

### 패키지 설치

```bash
pnpm --filter web add @supabase/supabase-js @supabase/ssr
```

### Supabase 클라이언트 구성

#### 브라우저 클라이언트

```typescript
// shared/lib/supabase/client.ts
'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### 서버 클라이언트

```typescript
// shared/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )
}
```

#### 미들웨어 클라이언트

```typescript
// shared/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 보호 경로: 인증되지 않은 사용자 리다이렉트
  const protectedPaths = ['/mypage', '/watchlist']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // 이미 로그인 상태에서 /login 접근 시 홈으로 리다이렉트
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

### 미들웨어

```typescript
// app/middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/shared/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 정적 파일 및 이미지를 제외한 모든 경로에 적용
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### OAuth 콜백 Route Handler

```typescript
// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') || '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Supabase Auth → Prisma User 동기화
      await syncUser(data.user)

      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // 인증 실패 시 로그인 페이지로 리다이렉트 (에러 파라미터 포함)
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
```

### 사용자 동기화 (Supabase Auth → Prisma)

```typescript
// entities/user/api/sync-user.ts
import 'server-only'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { prisma } from '@/shared/lib/prisma'

/**
 * Supabase Auth 사용자 정보를 Prisma User 테이블에 동기화합니다
 * @param supabaseUser - Supabase Auth에서 제공하는 사용자 객체
 * @returns upsert된 Prisma User 레코드
 */
export async function syncUser(supabaseUser: SupabaseUser) {
  const email = supabaseUser.email ?? ''
  const name = supabaseUser.user_metadata?.full_name ?? supabaseUser.user_metadata?.name ?? null

  return prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: {
      email,
      name,
    },
    create: {
      id: supabaseUser.id,
      email,
      name,
    },
  })
}
```

> **주의**: Prisma `User.id`의 `@default(uuid())`를 유지하되, Supabase Auth의 UUID를 직접 지정하여 생성합니다. 이를 위해 Supabase Auth 사용자 생성 시점과 Prisma upsert 시점에 동일한 UUID를 사용합니다.

### 소셜 로그인 훅

```typescript
// features/auth/model/use-sign-in.ts
'use client'

import { useState } from 'react'
import { createClient } from '@/shared/lib/supabase/client'

type Provider = 'kakao' | 'google'

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false)

  async function signIn(provider: Provider, redirectTo?: string) {
    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
        }`,
      },
    })

    if (error) {
      setIsLoading(false)
      throw error
    }
  }

  return { signIn, isLoading }
}
```

### 로그아웃 훅

```typescript
// features/auth/model/use-sign-out.ts
'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/client'

export function useSignOut() {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return { signOut }
}
```

### 현재 사용자 조회 훅

```typescript
// entities/user/model/use-current-user.ts
'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/shared/lib/supabase/client'

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, isLoading }
}
```

### 타입 정의

```typescript
// entities/user/model/types.ts

export type AuthProvider = 'kakao' | 'google'

export interface CurrentUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  provider: AuthProvider
}
```

### 보호 경로 목록

현재 시점에서 인증이 필요한 경로:

| 경로                  | 설명       | 인증 필요                        |
| --------------------- | ---------- | -------------------------------- |
| `/`                   | 홈         | ❌                               |
| `/disclosures`        | 공시 목록  | ❌                               |
| `/disclosures/search` | 공시 검색  | ❌                               |
| `/login`              | 로그인     | ❌ (로그인 시 홈으로 리다이렉트) |
| `/mypage`             | 마이페이지 | ✅                               |
| `/watchlist`          | 관심 종목  | ✅                               |

> 보호 경로는 향후 기능 추가에 따라 확장합니다.

---

## 🚀 구현 단계

### Phase 1: Supabase 클라이언트 및 미들웨어

1. **패키지 설치**
   - `@supabase/supabase-js`, `@supabase/ssr` 설치

2. **환경 변수 설정**
   - `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가
   - `.env.example` 업데이트

3. **Supabase 클라이언트 구성**
   - `shared/lib/supabase/client.ts` (브라우저)
   - `shared/lib/supabase/server.ts` (서버 컴포넌트)
   - `shared/lib/supabase/middleware.ts` (미들웨어)
   - `shared/lib/supabase/index.ts` (export)

4. **미들웨어 작성**
   - `app/middleware.ts` 생성
   - 세션 갱신 및 보호 경로 리다이렉트 처리

### Phase 2: OAuth 콜백 및 사용자 동기화

1. **OAuth 콜백 Route Handler**
   - `app/auth/callback/route.ts` 생성
   - code → session 교환 처리

2. **사용자 동기화**
   - `entities/user/api/sync-user.ts` 생성
   - Supabase Auth 사용자 → Prisma User upsert
   - `entities/user/model/types.ts` 타입 정의
   - `entities/user/index.ts` export 설정

### Phase 3: 로그인/로그아웃 기능

1. **인증 기능 훅**
   - `features/auth/model/use-sign-in.ts` (소셜 로그인)
   - `features/auth/model/use-sign-out.ts` (로그아웃)
   - `features/auth/index.ts` export 설정

2. **현재 사용자 조회 훅**
   - `entities/user/model/use-current-user.ts` 생성

### Phase 4: 로그인 UI

1. **로그인 페이지**
   - `app/login/page.tsx` 생성
   - `widgets/auth/ui/login-form.tsx` (카카오/구글 버튼)

2. **헤더 인증 UI**
   - `widgets/auth/ui/auth-button.tsx` (비로그인: 로그인 버튼 / 로그인: 사용자 아바타)
   - `widgets/auth/ui/user-menu.tsx` (드롭다운 메뉴)
   - 기존 헤더 위젯에 `AuthButton` 통합

### Phase 5: Supabase Dashboard 설정

1. **카카오 OAuth Provider 설정**
   - Kakao Developers 앱 생성 및 설정
   - Supabase Dashboard에 Client ID / Secret 등록

2. **구글 OAuth Provider 설정**
   - Google Cloud Console OAuth 클라이언트 생성
   - Supabase Dashboard에 Client ID / Secret 등록

---

## ✅ 구현 현황

### 미완료 작업

#### Phase 1: Supabase 클라이언트 및 미들웨어

- [ ] `@supabase/supabase-js`, `@supabase/ssr` 패키지 설치
- [ ] `.env.local`에 Supabase 환경 변수 추가
- [ ] `.env.example` 업데이트
- [ ] `shared/lib/supabase/client.ts` (브라우저 클라이언트)
- [ ] `shared/lib/supabase/server.ts` (서버 클라이언트)
- [ ] `shared/lib/supabase/middleware.ts` (미들웨어 클라이언트)
- [ ] `shared/lib/supabase/index.ts` (export)
- [ ] `app/middleware.ts` (세션 갱신 + 보호 경로)

#### Phase 2: OAuth 콜백 및 사용자 동기화

- [ ] `app/auth/callback/route.ts` (OAuth 콜백)
- [ ] `entities/user/api/sync-user.ts` (Supabase → Prisma 동기화)
- [ ] `entities/user/model/types.ts` (타입 정의)
- [ ] `entities/user/index.ts` (export)

#### Phase 3: 로그인/로그아웃 기능

- [ ] `features/auth/model/use-sign-in.ts`
- [ ] `features/auth/model/use-sign-out.ts`
- [ ] `features/auth/index.ts`
- [ ] `entities/user/model/use-current-user.ts`

#### Phase 4: 로그인 UI

- [ ] `app/login/page.tsx` (로그인 페이지)
- [ ] `widgets/auth/ui/login-form.tsx` (로그인 폼)
- [ ] `widgets/auth/ui/auth-button.tsx` (헤더 인증 버튼)
- [ ] `widgets/auth/ui/user-menu.tsx` (사용자 드롭다운 메뉴)
- [ ] `widgets/auth/index.ts` (export)
- [ ] 기존 헤더 위젯에 AuthButton 통합

#### Phase 5: Supabase Dashboard 설정

- [ ] Kakao Developers 앱 생성 및 OAuth 설정
- [ ] Google Cloud Console OAuth 클라이언트 생성
- [ ] Supabase Dashboard에 카카오 Provider 등록
- [ ] Supabase Dashboard에 구글 Provider 등록

---

## 📝 참고 자료

- [Supabase Auth - Next.js SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase Auth - Login with Kakao](https://supabase.com/docs/guides/auth/social-login/auth-kakao)
- [Supabase Auth - Login with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [@supabase/ssr npm](https://www.npmjs.com/package/@supabase/ssr)
- [Kakao Developers - OAuth 설정 가이드](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite)
- [Google Cloud - OAuth 2.0 설정](https://developers.google.com/identity/protocols/oauth2)
