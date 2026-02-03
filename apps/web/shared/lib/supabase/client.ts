'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * 브라우저 환경용 Supabase 클라이언트를 생성합니다
 * @returns Supabase 브라우저 클라이언트
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
