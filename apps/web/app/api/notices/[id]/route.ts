import { NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/prisma/client'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const notice = await prisma.notice.findFirst({
    where: { id, isPublished: true },
    select: {
      id: true,
      title: true,
      category: true,
      content: true,
      isPinned: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { name: true } },
    },
  })

  if (!notice) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(notice)
}
