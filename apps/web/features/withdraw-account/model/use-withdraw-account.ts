'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { createClient } from '@/shared/lib/supabase/client'

/**
 * 회원탈퇴를 실행하는 훅
 *
 * DELETE /api/user/delete 호출 후 로그아웃 및 홈 리다이렉트를 수행합니다.
 *
 * @returns withdraw - 탈퇴 실행 함수, isPending - 요청 중 여부, error - 에러 메시지
 */
export function useWithdrawAccount() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function withdraw() {
    setIsPending(true)
    setError(null)

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? '회원탈퇴에 실패했습니다')
      }

      // 로그아웃 처리
      const supabase = createClient()
      await supabase.auth.signOut()

      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원탈퇴에 실패했습니다')
    } finally {
      setIsPending(false)
    }
  }

  return { withdraw, isPending, error }
}
