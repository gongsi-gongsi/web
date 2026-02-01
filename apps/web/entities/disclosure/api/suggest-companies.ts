export interface CompanySuggestion {
  corpCode: string
  corpName: string
  stockCode: string | null
}

interface SuggestCompaniesResponse {
  suggestions: CompanySuggestion[]
}

/**
 * 회사명 자동완성 API를 호출합니다
 * @param query - 검색할 회사명
 * @param limit - 최대 반환 개수 (기본값: 10)
 * @returns 매칭된 회사 목록
 */
export async function suggestCompanies(query: string, limit = 20): Promise<CompanySuggestion[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  const response = await fetch(`/api/stocks/suggest?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch suggestions')
  }

  const data: SuggestCompaniesResponse = await response.json()
  return data.suggestions
}
