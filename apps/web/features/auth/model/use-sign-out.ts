'use client'

import { useRouter } from 'next/navigation'

import { createClient } from '@/shared/lib/supabase/client'

/**
 * 로그아웃을 실행하는 훅
 *
 * signOut()은 다음을 수행합니다:
 * 1. Supabase 서버에 refresh_token revoke 요청 → 새 access_token 발급 차단
 * 2. 클라이언트 쿠키에서 토큰 삭제 → 브라우저에 인증 정보 제거
 * 3. 홈으로 리다이렉트 + router.refresh()로 서버 컴포넌트 재검증
 *
 * signOut()을 호출하지 않으면 refresh_token이 쿠키에 남아
 * 미들웨어가 자동으로 세션을 갱신하여 로그인 상태가 유지됩니다.
 *
 * @returns signOut - Supabase 세션을 제거하고 홈으로 리다이렉트하는 함수
 */
export function useSignOut() {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    // refresh_token revoke + 쿠키 삭제
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return { signOut }
}
