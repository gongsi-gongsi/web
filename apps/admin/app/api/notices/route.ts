import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/shared/lib/prisma/client'
import { requireAdmin } from '@/shared/lib/admin-auth'

export async function GET(request: NextRequest) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20))
  const category = searchParams.get('category')

  const where = {
    ...(category && { category: category as 'SERVICE' | 'EVENT' | 'MAINTENANCE' }),
  }

  const [notices, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notice.count({ where }),
  ])

  return NextResponse.json({
    data: notices,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function POST(request: NextRequest) {
  const [adminUser, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const body = await request.json()

  const notice = await prisma.notice.create({
    data: {
      title: body.title,
      category: body.category,
      content: body.content,
      authorId: adminUser.id,
      isPublished: body.isPublished ?? false,
      isPinned: body.isPinned ?? false,
    },
    include: { author: { select: { name: true } } },
  })

  return NextResponse.json(notice, { status: 201 })
}
