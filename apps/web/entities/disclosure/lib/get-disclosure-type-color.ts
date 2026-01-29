import type { DisclosureType } from '../model/types'

interface DisclosureTypeColor {
  bg: string
  text: string
  label: string
}

export function getDisclosureTypeColor(type: DisclosureType): DisclosureTypeColor {
  switch (type) {
    case 'regular':
      return {
        bg: 'bg-orange-100 dark:bg-orange-950',
        text: 'text-orange-700 dark:text-orange-400',
        label: '정기공시',
      }
    case 'major':
      return {
        bg: 'bg-blue-100 dark:bg-blue-950',
        text: 'text-blue-700 dark:text-blue-400',
        label: '주요사항',
      }
    case 'fair':
      return {
        bg: 'bg-green-100 dark:bg-green-950',
        text: 'text-green-700 dark:text-green-400',
        label: '공정공시',
      }
    case 'other':
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-400',
        label: '기타',
      }
  }
}
