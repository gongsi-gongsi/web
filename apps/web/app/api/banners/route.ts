import { NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/prisma/client'

export async function GET() {
  const now = new Date()

  const banners = await prisma.banner.findMany({
    where: {
      isActive: true,
      OR: [{ startDate: null }, { startDate: { lte: now } }],
      AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
    },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      imageMobileUrl: true,
      linkUrl: true,
      order: true,
    },
  })

  return NextResponse.json(banners)
}
