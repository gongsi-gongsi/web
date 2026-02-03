import 'server-only'

import type { User as SupabaseUser } from '@supabase/supabase-js'

import { prisma } from '@/shared/lib/prisma'

/**
 * Supabase Auth 사용자 정보를 Prisma User 테이블에 동기화합니다
 * @param supabaseUser - Supabase Auth에서 제공하는 사용자 객체
 * @returns upsert된 Prisma User 레코드
 */
export async function syncUser(supabaseUser: SupabaseUser) {
  const email = supabaseUser.email ?? ''
  const name = supabaseUser.user_metadata?.full_name ?? supabaseUser.user_metadata?.name ?? null

  return prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: {
      email,
      name,
    },
    create: {
      id: supabaseUser.id,
      email,
      name,
    },
  })
}
