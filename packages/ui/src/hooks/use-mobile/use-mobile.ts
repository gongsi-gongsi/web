'use client'

import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * 모바일 여부를 반환하는 훅
 * @returns 모바일이면 true, 데스크톱이면 false, 초기 로딩 중이면 undefined
 */
export function useIsMobile(): boolean | undefined {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
