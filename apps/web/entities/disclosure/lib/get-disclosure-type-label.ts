import type { DisclosureType } from '../model/types'

/**
 * 공시 유형 코드를 한글 라벨로 변환합니다
 * @param type - 공시 유형 코드 (A~J)
 * @returns 공시 유형 한글 라벨
 * @example
 * getDisclosureTypeLabel('A') // '정기공시'
 * getDisclosureTypeLabel('B') // '주요사항보고'
 */
export function getDisclosureTypeLabel(type: DisclosureType): string {
  switch (type) {
    case 'A':
      return '정기공시'
    case 'B':
      return '주요사항보고'
    case 'C':
      return '발행공시'
    case 'D':
      return '지분공시'
    case 'E':
      return '기타공시'
    case 'F':
      return '외부감사관련'
    case 'G':
      return '펀드공시'
    case 'H':
      return '자산유동화'
    case 'I':
      return '거래소공시'
    case 'J':
      return '공정위공시'
    default:
      return '기타'
  }
}
