import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/shared/lib/prisma/client'
import { NoticeCategory } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 20)))
  const categoryParam = searchParams.get('category')
  const validCategories = Object.values(NoticeCategory)
  const category =
    categoryParam && validCategories.includes(categoryParam as NoticeCategory)
      ? (categoryParam as NoticeCategory)
      : undefined

  const where = {
    isPublished: true,
    ...(category ? { category } : {}),
  }

  const [data, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        category: true,
        isPinned: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.notice.count({ where }),
  ])

  return NextResponse.json({
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}
