'use client'

import { useEffect, useState } from 'react'

import type { User } from '@supabase/supabase-js'

import { createClient } from '@/shared/lib/supabase/client'

/**
 * 현재 로그인한 사용자를 조회하고 인증 상태 변경을 구독하는 훅
 *
 * 마운트 시 getUser()로 쿠키의 access_token을 검증하여 사용자를 조회하고,
 * onAuthStateChange로 로그인/로그아웃/토큰 갱신 이벤트를 구독하여
 * 탭 간 동기화 및 실시간 상태 반영을 처리합니다.
 *
 * @returns user - Supabase User 객체 (비로그인 시 null), isLoading - 초기 조회 중 여부
 */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // 쿠키의 access_token으로 현재 사용자 조회
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
    })

    // 로그인/로그아웃/토큰 갱신 이벤트 구독 (탭 간 동기화 포함)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, isLoading }
}
