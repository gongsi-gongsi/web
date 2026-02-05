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
        color: 'bg-background text-market-kospi-text border border-market-kospi-border',
      }
    case 'kosdaq':
      return {
        label: '코',
        color: 'bg-background text-market-kosdaq-text border border-market-kosdaq-border',
      }
    case 'konex':
      return {
        label: '넥',
        color: 'bg-background text-market-konex-text border border-market-konex-border',
      }
    case 'etc':
      return {
        label: '기',
        color: 'bg-background text-market-etc-text border border-market-etc-border',
      }
    case 'all':
      return null
  }
}
