import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/shared/lib/prisma/client'
import { requireAdmin } from '@/shared/lib/admin-auth'
import { createAdminClient } from '@/shared/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { watchlist: true, aiReports: true, notifications: true } },
    },
  })

  if (!user) {
    return NextResponse.json({ error: '유저를 찾을 수 없습니다' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const { id } = await params
  const body = await request.json()

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.notificationEmail !== undefined && { notificationEmail: body.notificationEmail }),
        ...(body.notificationTelegram !== undefined && {
          notificationTelegram: body.notificationTelegram,
        }),
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: '유저를 찾을 수 없습니다' }, { status: 404 })
    }
    throw error
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const { id } = await params

  // DB 먼저 삭제 (제약조건 실패 가능성이 더 높으므로)
  try {
    await prisma.user.delete({ where: { id } })
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: '유저를 찾을 수 없습니다' }, { status: 404 })
    }
    return NextResponse.json({ error: 'DB 유저 삭제 실패' }, { status: 500 })
  }

  // Supabase Auth 삭제 (best effort - 실패해도 DB는 이미 정리됨)
  try {
    const supabase = createAdminClient()
    await supabase.auth.admin.deleteUser(id)
  } catch (error) {
    console.error(`Supabase Auth 유저 삭제 실패 (ID: ${id}):`, error)
  }

  return NextResponse.json({ success: true })
}
