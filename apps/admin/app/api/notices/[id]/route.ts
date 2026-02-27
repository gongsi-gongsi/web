import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/shared/lib/prisma/client'
import { requireAdmin } from '@/shared/lib/admin-auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const { id } = await params

  const notice = await prisma.notice.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  })

  if (!notice) {
    return NextResponse.json({ error: '공지사항을 찾을 수 없습니다' }, { status: 404 })
  }

  return NextResponse.json(notice)
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const { id } = await params
  const body = await request.json()

  try {
    const notice = await prisma.notice.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        ...(body.isPinned !== undefined && { isPinned: body.isPinned }),
      },
      include: { author: { select: { name: true } } },
    })

    return NextResponse.json(notice)
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: '공지사항을 찾을 수 없습니다' }, { status: 404 })
    }
    throw error
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const { id } = await params

  try {
    await prisma.notice.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: '공지사항을 찾을 수 없습니다' }, { status: 404 })
    }
    throw error
  }
}
