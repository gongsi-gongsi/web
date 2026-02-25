import type { GlossaryCategory, GlossaryTerm } from '../model/types'

/**
 * 용어 목록을 검색어와 카테고리로 필터링합니다
 * @param terms - 전체 용어 목록
 * @param query - 검색어 (한글/영문 모두 검색)
 * @param category - 카테고리 필터 (null이면 전체)
 * @returns 필터링된 용어 목록
 * @example
 * filterGlossaryTerms(terms, 'PER', null) // PER이 포함된 모든 용어
 * filterGlossaryTerms(terms, '', 'trading') // 거래/시장 카테고리 전체
 */
export function filterGlossaryTerms(
  terms: GlossaryTerm[],
  query: string,
  category: GlossaryCategory | null
): GlossaryTerm[] {
  const normalizedQuery = query.trim().toLowerCase()

  return terms.filter(term => {
    const matchesCategory = category === null || term.category === category

    if (!normalizedQuery) return matchesCategory

    const matchesQuery =
      term.term.toLowerCase().includes(normalizedQuery) ||
      term.termEn.toLowerCase().includes(normalizedQuery) ||
      term.summary.includes(normalizedQuery)

    return matchesCategory && matchesQuery
  })
}

/**
 * ID로 용어를 찾습니다
 * @param terms - 전체 용어 목록
 * @param id - 용어 ID
 * @returns 찾은 용어 또는 undefined
 */
export function findGlossaryTermById(terms: GlossaryTerm[], id: string): GlossaryTerm | undefined {
  return terms.find(term => term.id === id)
}

/**
 * 관련 용어 목록을 반환합니다
 * @param terms - 전체 용어 목록
 * @param relatedIds - 관련 용어 ID 배열
 * @returns 관련 용어 객체 배열
 */
export function getRelatedTerms(terms: GlossaryTerm[], relatedIds: string[]): GlossaryTerm[] {
  return relatedIds
    .map(id => terms.find(term => term.id === id))
    .filter((term): term is GlossaryTerm => term !== undefined)
}
