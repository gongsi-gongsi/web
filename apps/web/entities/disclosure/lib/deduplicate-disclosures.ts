import type { Disclosure } from '../model/types'

/**
 * id 기준으로 중복 공시를 제거합니다
 * DART API가 페이지 간 중복 항목을 반환할 수 있어 필요합니다
 * @param disclosures - 공시 목록
 * @returns 중복이 제거된 공시 목록 (선착순 유지)
 */
export function deduplicateDisclosures(disclosures: Disclosure[]): Disclosure[] {
  const seen = new Set<string>()
  return disclosures.filter(d => {
    if (seen.has(d.id)) return false
    seen.add(d.id)
    return true
  })
}
