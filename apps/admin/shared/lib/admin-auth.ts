import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma/client'
import { NextResponse } from 'next/server'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

/**
 * 현재 요청의 관리자 정보를 반환합니다
 *
 * Supabase Auth 세션을 확인한 뒤, admin_users 테이블에서 관리자 여부를 2중 검증합니다.
 *
 * @returns 관리자 정보 또는 null (비인증/비관리자)
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return null

  const adminUser = await prisma.adminUser.findUnique({
    where: { email: user.email },
  })

  if (!adminUser) return null

  return {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
  }
}

/**
 * API route에서 관리자 인증을 검증하고, 실패 시 401 응답을 반환합니다
 * @returns [adminUser, null] 또는 [null, NextResponse]
 */
export async function requireAdmin(): Promise<[AdminUser, null] | [null, NextResponse]> {
  const adminUser = await getAdminUser()
  if (!adminUser) {
    return [null, NextResponse.json({ error: 'Unauthorized' }, { status: 401 })]
  }
  return [adminUser, null]
}
