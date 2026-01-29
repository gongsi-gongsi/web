import type { DisclosureType } from '../model/types'
import { getDisclosureTypeLabel } from './get-disclosure-type-label'

interface DisclosureTypeColor {
  bg: string
  text: string
  label: string
}

/**
 * 공시 유형에 따른 색상 테마를 반환합니다 (다크모드 대응)
 * @param type - 공시 유형 코드 (A~J)
 * @returns 배경색, 텍스트색, 라벨이 포함된 객체
 * @example
 * getDisclosureTypeColor('A') // { bg: 'bg-blue-500 dark:bg-blue-700', text: 'text-white', label: '정기공시' }
 */
export function getDisclosureTypeColor(type: DisclosureType): DisclosureTypeColor {
  const label = getDisclosureTypeLabel(type)

  switch (type) {
    case 'A': // 정기공시
      return {
        bg: 'bg-blue-500 dark:bg-blue-700',
        text: 'text-white',
        label,
      }
    case 'B': // 주요사항보고
      return {
        bg: 'bg-red-500 dark:bg-red-700',
        text: 'text-white',
        label,
      }
    case 'C': // 발행공시
      return {
        bg: 'bg-purple-500 dark:bg-purple-700',
        text: 'text-white',
        label,
      }
    case 'D': // 지분공시
      return {
        bg: 'bg-orange-500 dark:bg-orange-700',
        text: 'text-white',
        label,
      }
    case 'E': // 기타공시
      return {
        bg: 'bg-gray-500 dark:bg-gray-700',
        text: 'text-white',
        label,
      }
    case 'F': // 외부감사관련
      return {
        bg: 'bg-green-500 dark:bg-green-700',
        text: 'text-white',
        label,
      }
    case 'G': // 펀드공시
      return {
        bg: 'bg-indigo-500 dark:bg-indigo-700',
        text: 'text-white',
        label,
      }
    case 'H': // 자산유동화
      return {
        bg: 'bg-teal-500 dark:bg-teal-700',
        text: 'text-white',
        label,
      }
    case 'I': // 거래소공시
      return {
        bg: 'bg-cyan-500 dark:bg-cyan-700',
        text: 'text-white',
        label,
      }
    case 'J': // 공정위공시
      return {
        bg: 'bg-pink-500 dark:bg-pink-700',
        text: 'text-white',
        label,
      }
    default:
      return {
        bg: 'bg-gray-500 dark:bg-gray-700',
        text: 'text-white',
        label: '기타',
      }
  }
}
