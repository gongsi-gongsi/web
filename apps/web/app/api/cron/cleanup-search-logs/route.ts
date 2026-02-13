import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/prisma'

/**
 * 7일 이상 된 검색 로그를 삭제하는 Cron Job
 * Vercel Cron에 의해 매일 자정(UTC)에 실행됩니다
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    console.error('[Cron] CRON_SECRET is not configured')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const result = await prisma.searchLog.deleteMany({
      where: {
        createdAt: { lt: sevenDaysAgo },
      },
    })

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    })
  } catch (error) {
    console.error('[Cron] Failed to cleanup search logs:', error)
    return NextResponse.json({ error: 'Failed to cleanup' }, { status: 500 })
  }
}
