import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 어드민 Supabase 세션을 갱신하고 인증 가드를 적용합니다
 *
 * - 로그인 페이지를 제외한 모든 경로에 Supabase 세션 필요
 * - 세션이 없으면 /login으로 리다이렉트
 * - admin 여부 검증은 대시보드 레이아웃에서 수행 (Prisma 접근 필요)
 *
 * @param request - Next.js 미들웨어 요청 객체
 * @returns 세션이 갱신된 응답 또는 리다이렉트 응답
 */
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

  const { pathname } = request.nextUrl
  const isPublicPath = pathname === '/login' || pathname.startsWith('/api/auth/')

  // 로그인 페이지 및 인증 API 제외 모든 경로에 세션 필요
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
