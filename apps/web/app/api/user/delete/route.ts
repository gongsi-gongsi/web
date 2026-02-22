export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { Prisma } from '@prisma/client'

import { createClient } from '@/shared/lib/supabase/server'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { prisma } from '@/shared/lib/prisma'

/**
 * 회원탈퇴 API
 * 1. Supabase Auth로 현재 사용자 확인
 * 2. Supabase Admin API로 Auth 사용자 삭제 (실패 시 DB 데이터 보존)
 * 3. Prisma로 DB 데이터 삭제 (cascade로 관련 데이터 자동 삭제)
 */
export async function DELETE() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Auth 사용자 먼저 삭제 — 실패 시 DB 데이터는 온전히 보존됨
    const supabaseAdmin = createAdminClient()
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (authError) {
      console.error('Failed to delete auth user:', authError.message)
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }

    // 2. DB User 삭제 (cascade로 Watchlist, AiReport, AiConversation, Notification 자동 삭제)
    try {
      await prisma.user.delete({
        where: { id: user.id },
      })
    } catch (dbError) {
      // User 레코드가 이미 없는 경우 — 정상 처리로 간주
      if (dbError instanceof Prisma.PrismaClientKnownRequestError && dbError.code === 'P2025') {
        console.warn('DB user record not found, may have been previously deleted:', user.id)
      } else {
        throw dbError
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(
      'Failed to delete user:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
