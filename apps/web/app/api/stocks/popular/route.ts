export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/shared/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const parsedLimit = parseInt(searchParams.get('limit') || '10', 10)
    const limit = Number.isNaN(parsedLimit) || parsedLimit < 1 ? 10 : Math.min(parsedLimit, 20)

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // 최근 24시간 검색어 집계
    const grouped = await prisma.searchLog.groupBy({
      by: ['query'],
      where: {
        createdAt: { gte: oneDayAgo },
      },
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: limit * 2, // Stock 매칭 안 되는 경우를 대비해 여유분
    })

    if (grouped.length === 0) {
      return NextResponse.json({ companies: [] })
    }

    const queryStrings = grouped.map((g: { query: string }) => g.query)

    // 검색어와 매칭되는 Stock 조회
    const stocks = await prisma.stock.findMany({
      where: {
        corpName: { in: queryStrings },
      },
      select: {
        corpName: true,
        stockCode: true,
      },
    })

    const stockMap = new Map(stocks.map(s => [s.corpName, s.stockCode]))

    // Stock 테이블에 존재하는 회사만 필터링하여 상위 N개
    const companies = grouped
      .filter((g: { query: string }) => stockMap.has(g.query))
      .slice(0, limit)
      .map((g: { query: string; _count: { query: number } }, index: number) => ({
        rank: index + 1,
        corpName: g.query,
        stockCode: stockMap.get(g.query) || '',
        searchCount: g._count.query,
      }))

    return NextResponse.json(
      { companies },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    )
  } catch (error) {
    console.error('Error fetching popular companies:', error)
    return NextResponse.json({ error: 'Failed to fetch popular companies' }, { status: 500 })
  }
}
