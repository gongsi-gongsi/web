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

  const banner = await prisma.banner.findUnique({ where: { id } })

  if (!banner) {
    return NextResponse.json({ error: '배너를 찾을 수 없습니다' }, { status: 404 })
  }

  return NextResponse.json(banner)
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const { id } = await params
  const body = await request.json()

  try {
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.imageMobileUrl !== undefined && { imageMobileUrl: body.imageMobileUrl || null }),
        ...(body.linkUrl !== undefined && { linkUrl: body.linkUrl || null }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.startDate !== undefined && {
          startDate: body.startDate ? new Date(body.startDate) : null,
        }),
        ...(body.endDate !== undefined && {
          endDate: body.endDate ? new Date(body.endDate) : null,
        }),
      },
    })

    return NextResponse.json(banner)
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: '배너를 찾을 수 없습니다' }, { status: 404 })
    }
    throw error
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const { id } = await params

  try {
    await prisma.banner.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: '배너를 찾을 수 없습니다' }, { status: 404 })
    }
    throw error
  }
}
