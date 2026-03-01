import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/mypage', '/watchlist']

/**
 * Supabase 세션을 갱신하고 보호 경로에 대한 접근을 제어합니다
 *
 * Supabase Auth는 JWT 기반 인증을 사용합니다:
 * - access_token(JWT, 1시간 만료) + refresh_token(무기한)을 쿠키에 저장
 * - 매 요청마다 getUser()를 호출하여 access_token 만료 시 refresh_token으로 자동 갱신
 * - 갱신된 토큰은 setAll 콜백을 통해 응답 쿠키에 다시 설정됨
 *
 * @param request - Next.js 미들웨어 요청 객체
 * @returns 세션이 갱신된 응답 또는 리다이렉트 응답
 */
export async function updateSession(request: NextRequest) {
  // Supabase env vars가 없으면 (예: CI 테스트 환경) 인증 없이 통과
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        // access_token 갱신 시 Supabase가 호출하여 새 토큰을 쿠키에 반영
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

  // access_token을 검증하고, 만료 시 refresh_token으로 자동 갱신
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 보호 경로: 인증되지 않은 사용자 리다이렉트
  const isProtectedPath = PROTECTED_PATHS.some(path => request.nextUrl.pathname.startsWith(path))

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
