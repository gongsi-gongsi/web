import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma/client'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요' }, { status: 400 })
  }

  // Supabase Auth 로그인 먼저 시도 (유저 열거 방지)
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' }, { status: 401 })
  }

  // 로그인 성공 후 admin_users 테이블에서 관리자 여부 확인
  const adminUser = await prisma.adminUser.findUnique({
    where: { email },
  })

  if (!adminUser) {
    // 관리자가 아니면 즉시 로그아웃 (동일한 에러 메시지로 열거 방지)
    await supabase.auth.signOut()
    return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}
