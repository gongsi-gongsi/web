import type { DisclosureType } from '../model/types'
import { getDisclosureTypeLabel } from './get-disclosure-type-label'

interface DisclosureTypeColor {
  bg: string
  text: string
  label: string
}

/**
 * 공시 유형에 따른 색상 테마를 반환합니다 (다크모드 자동 대응)
 * @param type - 공시 유형 코드 (A~J)
 * @returns 배경색, 텍스트색, 라벨이 포함된 객체
 * @example
 * getDisclosureTypeColor('A') // { bg: 'bg-disclosure-type-a-bg', text: 'text-disclosure-type-a-fg', label: '정기공시' }
 */
export function getDisclosureTypeColor(type: DisclosureType): DisclosureTypeColor {
  const label = getDisclosureTypeLabel(type)

  switch (type) {
    case 'A': // 정기공시
      return {
        bg: 'bg-disclosure-type-a-bg',
        text: 'text-disclosure-type-a-fg',
        label,
      }
    case 'B': // 주요사항보고
      return {
        bg: 'bg-disclosure-type-b-bg',
        text: 'text-disclosure-type-b-fg',
        label,
      }
    case 'C': // 발행공시
      return {
        bg: 'bg-disclosure-type-c-bg',
        text: 'text-disclosure-type-c-fg',
        label,
      }
    case 'D': // 지분공시
      return {
        bg: 'bg-disclosure-type-d-bg',
        text: 'text-disclosure-type-d-fg',
        label,
      }
    case 'E': // 기타공시
      return {
        bg: 'bg-disclosure-type-e-bg',
        text: 'text-disclosure-type-e-fg',
        label,
      }
    case 'F': // 외부감사관련
      return {
        bg: 'bg-disclosure-type-f-bg',
        text: 'text-disclosure-type-f-fg',
        label,
      }
    case 'G': // 펀드공시
      return {
        bg: 'bg-disclosure-type-g-bg',
        text: 'text-disclosure-type-g-fg',
        label,
      }
    case 'H': // 자산유동화
      return {
        bg: 'bg-disclosure-type-h-bg',
        text: 'text-disclosure-type-h-fg',
        label,
      }
    case 'I': // 거래소공시
      return {
        bg: 'bg-disclosure-type-i-bg',
        text: 'text-disclosure-type-i-fg',
        label,
      }
    case 'J': // 공정위공시
      return {
        bg: 'bg-disclosure-type-j-bg',
        text: 'text-disclosure-type-j-fg',
        label,
      }
    default:
      return {
        bg: 'bg-disclosure-type-e-bg',
        text: 'text-disclosure-type-e-fg',
        label: '기타',
      }
  }
}
