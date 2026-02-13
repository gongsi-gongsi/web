import { prisma } from '@/shared/lib/prisma'
import type { PopularCompany } from '../../model/types'

/**
 * [서버 전용] 최근 24시간 검색 로그를 기반으로 인기 검색 회사 목록을 조회합니다
 * corpCode로 그룹핑하여 Stock 테이블과 직접 조인합니다
 * @param limit - 최대 반환 개수 (기본값: 10)
 * @returns 인기 검색 회사 목록
 */
export async function getPopularCompaniesFromDB(limit = 10): Promise<PopularCompany[]> {
  const validLimit = Number.isNaN(limit) || limit < 1 ? 10 : Math.min(limit, 20)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  // 최근 24시간 검색 로그를 corpCode로 집계 (corpCode가 null인 레코드는 제외)
  const grouped = await prisma.searchLog.groupBy({
    by: ['corpCode'],
    where: {
      createdAt: { gte: oneDayAgo },
      corpCode: { not: null },
    },
    _count: { corpCode: true },
    orderBy: { _count: { corpCode: 'desc' } },
    take: validLimit,
  })

  if (grouped.length === 0) {
    return []
  }

  const corpCodes = grouped.map(g => g.corpCode!)

  // corpCode로 Stock 테이블 직접 조회
  const stocks = await prisma.stock.findMany({
    where: { corpCode: { in: corpCodes } },
    select: {
      corpCode: true,
      corpName: true,
      stockCode: true,
    },
  })

  const stockMap = new Map(stocks.map(s => [s.corpCode, s]))

  return grouped
    .map(g => {
      const stock = stockMap.get(g.corpCode!)
      if (!stock) return null
      return {
        corpCode: stock.corpCode,
        corpName: stock.corpName,
        stockCode: stock.stockCode,
        searchCount: g._count.corpCode,
      }
    })
    .filter((item): item is Omit<PopularCompany, 'rank'> => item !== null)
    .map((item, index) => ({ ...item, rank: index + 1 }))
}
