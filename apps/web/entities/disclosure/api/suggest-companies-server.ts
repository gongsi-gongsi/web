import { searchCorpCodes } from '@/shared/lib/dart/apis/search-stocks'
import type { CompanySuggestion } from './suggest-companies'

/**
 * [서버 전용] DART API를 통해 회사명 자동완성을 조회합니다
 * @param query - 검색할 회사명
 * @param limit - 최대 반환 개수 (기본값: 50)
 * @returns 매칭된 회사 목록
 */
export async function suggestCompaniesFromDart(
  query: string,
  limit = 50
): Promise<CompanySuggestion[]> {
  if (!query.trim()) {
    return []
  }

  const validLimit = Math.min(limit, 50)
  const matches = await searchCorpCodes(query.trim(), validLimit)

  const suggestions = matches.map(corp => ({
    corpCode: corp.corpCode,
    corpName: corp.corpName,
    stockCode: corp.stockCode || null,
  }))

  return suggestions
}
