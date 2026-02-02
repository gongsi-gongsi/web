/**
 * Stock 테이블 기반 회사명 검색 유틸리티
 */

import { prisma } from '@/shared/lib/prisma'
import type { CorpCode } from '../types'

/**
 * 회사명으로 상장사를 검색합니다
 * 우선순위: 정확 매칭 → 전방 매칭(startsWith) → 부분 매칭(contains)
 * @param query - 검색할 회사명
 * @param limit - 최대 반환 개수 (기본값: 10)
 * @returns 매칭된 상장사 고유번호 목록
 * @example
 * searchCorpCodes('삼성전자') // [{ corpCode: '00126380', corpName: '삼성전자', ... }]
 * searchCorpCodes('삼성')     // [{ corpName: '삼성전자', ... }, { corpName: '삼성SDI', ... }, ...]
 */
export async function searchCorpCodes(query: string, limit = 10): Promise<CorpCode[]> {
  if (!query.trim()) return []

  // 1. 정확 매칭
  const exactMatches = await prisma.stock.findMany({
    where: { corpName: { equals: query, mode: 'insensitive' } },
    take: limit,
  })

  if (exactMatches.length > 0) {
    return exactMatches.map(toCorpCode)
  }

  // 2. 전방 매칭 (startsWith)
  const startsWithMatches = await prisma.stock.findMany({
    where: { corpName: { startsWith: query, mode: 'insensitive' } },
    orderBy: { corpName: 'asc' },
    take: limit,
  })

  // 3. 부분 매칭 (contains) - 전방 매칭 결과가 부족할 때만
  const remaining = limit - startsWithMatches.length
  let containsMatches: typeof startsWithMatches = []

  if (remaining > 0) {
    const excludeIds = startsWithMatches.map(s => s.id)
    containsMatches = await prisma.stock.findMany({
      where: {
        corpName: { contains: query, mode: 'insensitive' },
        id: { notIn: excludeIds },
        NOT: { corpName: { startsWith: query, mode: 'insensitive' } },
      },
      orderBy: { corpName: 'asc' },
      take: remaining,
    })
  }

  return deduplicateByCorpName([...startsWithMatches, ...containsMatches].map(toCorpCode))
}

/**
 * corpName 기준으로 중복을 제거합니다
 * DART 고유번호 목록에 동일 회사명으로 여러 법인이 등록되어 있을 수 있어 필요합니다
 * @param corps - 검색된 기업 목록
 * @returns 중복이 제거된 기업 목록 (선착순 유지)
 */
function deduplicateByCorpName(corps: CorpCode[]): CorpCode[] {
  const seen = new Set<string>()
  return corps.filter(corp => {
    if (seen.has(corp.corpName)) return false
    seen.add(corp.corpName)
    return true
  })
}

/**
 * Stock 레코드를 CorpCode 타입으로 변환합니다
 * @param stock - Prisma Stock 레코드
 * @returns CorpCode 객체
 */
function toCorpCode(stock: { corpCode: string; corpName: string; stockCode: string }): CorpCode {
  return {
    corpCode: stock.corpCode,
    corpName: stock.corpName,
    stockCode: stock.stockCode || undefined,
    modifyDate: '',
  }
}
