'use client'

import { useState } from 'react'

import type { AuthProvider } from '@/entities/user'
import { createClient } from '@/shared/lib/supabase/client'

/**
 * 소셜 로그인을 실행하는 훅
 *
 * OAuth PKCE flow로 동작합니다:
 * 1. signInWithOAuth 호출 → Supabase가 provider(카카오/구글)로 리다이렉트
 * 2. 사용자 인증 완료 → /auth/callback으로 code와 함께 리다이렉트
 * 3. callback Route Handler에서 code → access_token + refresh_token 교환
 *
 * @returns signIn - OAuth 로그인 실행 함수, isLoading - 로그인 진행 중 여부
 */
export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false)

  async function signIn(provider: AuthProvider, redirectTo?: string) {
    setIsLoading(true)

    const supabase = createClient()
    // Supabase → OAuth provider로 리다이렉트 (브라우저가 페이지를 떠남)
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
