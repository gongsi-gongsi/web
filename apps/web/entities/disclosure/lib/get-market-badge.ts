import type { Market } from '../model/types'

interface MarketBadge {
  label: string
  color: string
}

export function getMarketBadge(market: Market): MarketBadge | null {
  switch (market) {
    case 'kospi':
      return {
        label: '유',
        color:
          'bg-background text-blue-700 border border-blue-700 dark:text-blue-400 dark:border-blue-400',
      }
    case 'kosdaq':
      return {
        label: '코',
        color:
          'bg-background text-purple-700 border border-purple-700 dark:text-purple-400 dark:border-purple-400',
      }
    case 'konex':
      return {
        label: '넥',
        color:
          'bg-background text-orange-700 border border-orange-700 dark:text-orange-400 dark:border-orange-400',
      }
    case 'all':
      return null
  }
}
