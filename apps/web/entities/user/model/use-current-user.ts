'use client'

import { useEffect, useState } from 'react'

import type { User } from '@supabase/supabase-js'

import { createClient } from '@/shared/lib/supabase/client'

/**
 * 현재 로그인한 사용자를 조회하고 인증 상태 변경을 구독하는 훅
 *
 * onAuthStateChange는 구독 즉시 INITIAL_SESSION 이벤트를 동기적으로 발생시키므로,
 * getUser()와 병행 사용 시 발생하는 경쟁 조건(race condition) 없이
 * 초기 사용자 상태를 안정적으로 결정합니다.
 * 이후 로그인/로그아웃/토큰 갱신 및 탭 간 동기화도 처리합니다.
 *
 * @returns user - Supabase User 객체 (비로그인 시 null), isLoading - 초기 조회 중 여부
 */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // INITIAL_SESSION 이벤트가 구독 즉시 발생하므로 isLoading을 안전하게 false로 설정할 수 있습니다.
    // getUser()를 별도로 호출하면 null 반환 시점에 isLoading=false가 먼저 되어
    // onAuthStateChange의 실제 사용자 설정 전에 로그인 버튼이 잠깐 보이는 문제가 생깁니다.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, isLoading }
}
