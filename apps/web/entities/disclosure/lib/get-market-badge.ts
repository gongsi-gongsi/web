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
        color: 'bg-market-kospi-bg text-market-kospi-text border border-market-kospi-border',
      }
    case 'kosdaq':
      return {
        label: '코',
        color: 'bg-market-kosdaq-bg text-market-kosdaq-text border border-market-kosdaq-border',
      }
    case 'konex':
      return {
        label: '넥',
        color: 'bg-market-konex-bg text-market-konex-text border border-market-konex-border',
      }
    case 'etc':
      return {
        label: '기',
        color: 'bg-market-etc-bg text-market-etc-text border border-market-etc-border',
      }
    case 'all':
      return null
  }
}
