import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Admin 클라이언트를 생성합니다 (서버 전용)
 *
 * service_role 키를 사용하여 RLS를 우회하는 관리자 권한 클라이언트입니다.
 * Auth 사용자 관리 등 관리자 작업에 사용합니다.
 *
 * @throws 환경변수가 설정되지 않은 경우
 * @returns Supabase Admin 클라이언트
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
