import { prisma } from '@/shared/lib/prisma'
import type { PopularCompany } from '../../model/types'

/**
 * [서버 전용] 최근 24시간 검색 로그를 기반으로 인기 검색 회사 목록을 조회합니다
 * @param limit - 최대 반환 개수 (기본값: 10)
 * @returns 인기 검색 회사 목록
 */
export async function getPopularCompaniesFromDB(limit = 10): Promise<PopularCompany[]> {
  const validLimit = Number.isNaN(limit) || limit < 1 ? 10 : Math.min(limit, 20)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  // 최근 24시간 검색어 집계
  const grouped = await prisma.searchLog.groupBy({
    by: ['query'],
    where: {
      createdAt: { gte: oneDayAgo },
    },
    _count: { query: true },
    orderBy: { _count: { query: 'desc' } },
    take: validLimit * 2, // Stock 매칭 안 되는 경우를 대비해 여유분
  })

  if (grouped.length === 0) {
    return []
  }

  const queryStrings = grouped.map((g: { query: string }) => g.query)

  // 검색어와 매칭되는 Stock 조회
  const stocks = await prisma.stock.findMany({
    where: {
      corpName: { in: queryStrings },
    },
    select: {
      corpCode: true,
      corpName: true,
      stockCode: true,
    },
  })

  const stockMap = new Map(
    stocks.map(s => [s.corpName, { corpCode: s.corpCode, stockCode: s.stockCode }])
  )

  // Stock 테이블에 존재하고 corpCode가 있는 회사만 필터링하여 상위 N개
  const companies = grouped
    .map((g: { query: string; _count: { query: number } }) => ({
      group: g,
      stock: stockMap.get(g.query),
    }))
    .filter(item => item.stock?.corpCode)
    .slice(0, validLimit)
    .map((item, index) => ({
      rank: index + 1,
      corpCode: item.stock!.corpCode,
      corpName: item.group.query,
      stockCode: item.stock?.stockCode || '',
      searchCount: item.group._count.query,
    }))

  return companies
}
