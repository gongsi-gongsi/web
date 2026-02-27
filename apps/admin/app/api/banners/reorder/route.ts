import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/shared/lib/prisma/client'
import { requireAdmin } from '@/shared/lib/admin-auth'

export async function PATCH(request: NextRequest) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const { orderedIds } = (await request.json()) as { orderedIds: string[] }

  if (
    !Array.isArray(orderedIds) ||
    orderedIds.length === 0 ||
    !orderedIds.every(id => typeof id === 'string' && id.length > 0)
  ) {
    return NextResponse.json({ error: 'orderedIds는 문자열 배열이어야 합니다' }, { status: 400 })
  }

  // 트랜잭션으로 일괄 순서 업데이트
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.banner.update({
        where: { id },
        data: { order: index },
      })
    )
  )

  return NextResponse.json({ success: true })
}
