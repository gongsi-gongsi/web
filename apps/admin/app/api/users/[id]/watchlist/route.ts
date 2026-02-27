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

  const watchlist = await prisma.watchlist.findMany({
    where: { userId: id },
    include: {
      stock: {
        select: {
          id: true,
          stockCode: true,
          corpCode: true,
          corpName: true,
          market: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(watchlist)
}
