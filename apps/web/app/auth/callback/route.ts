import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'

import { syncUser } from '@/entities/user'
import { createClient } from '@/shared/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') || '/'

  if (code) {
    const supabase = await createClient()
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

      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
