import * as Sentry from '@sentry/nextjs'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

import { syncUser } from '@/entities/user'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') || '/'

  if (code) {
    // NextResponse.redirect()를 먼저 생성한 뒤 쿠키를 response에 직접 설정합니다.
    // cookies()에서 set()으로 설정한 쿠키는 NextResponse.redirect() 응답에 포함되지 않으므로,
    // Supabase 클라이언트가 response.cookies에 직접 쓰도록 인라인으로 생성합니다.
    const response = NextResponse.redirect(`${origin}${redirectTo}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      try {
        await syncUser(data.user)
      } catch (syncError) {
        console.error('[Auth Callback] User sync failed:', syncError)
        Sentry.captureException(syncError, {
          extra: { userId: data.user.id, email: data.user.email },
        })
      }

      return response
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
