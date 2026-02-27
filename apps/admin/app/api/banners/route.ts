import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/shared/lib/prisma/client'
import { requireAdmin } from '@/shared/lib/admin-auth'

export async function GET() {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const banners = await prisma.banner.findMany({
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(banners)
}

export async function POST(request: NextRequest) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const body = await request.json()

  // 새 배너의 order를 마지막으로 설정
  const maxOrder = await prisma.banner.aggregate({ _max: { order: true } })
  const nextOrder = (maxOrder._max.order ?? -1) + 1

  const banner = await prisma.banner.create({
    data: {
      title: body.title,
      imageUrl: body.imageUrl,
      imageMobileUrl: body.imageMobileUrl || null,
      linkUrl: body.linkUrl || null,
      order: nextOrder,
      isActive: body.isActive ?? true,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  })

  return NextResponse.json(banner, { status: 201 })
}
