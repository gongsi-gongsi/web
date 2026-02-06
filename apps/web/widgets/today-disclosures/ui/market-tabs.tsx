'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@gs/ui'
import type { Market } from '@/entities/disclosure'

interface MarketTabsProps {
  selectedMarket: Market
  onMarketChange: (market: Market) => void
}

const MARKETS: { value: Market; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'kospi', label: '유가증권' },
  { value: 'kosdaq', label: '코스닥' },
  { value: 'konex', label: '코넥스' },
  { value: 'etc', label: '기타' },
]

export function MarketTabs({ selectedMarket, onMarketChange }: MarketTabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const updateIndicator = () => {
      const activeTab = tabRefs.current[selectedMarket]
      // offsetWidth > 0 체크로 실제로 보이는 탭만 업데이트 (CSS hidden 상태 무시)
      if (activeTab && activeTab.offsetWidth > 0) {
        setIndicatorStyle({
          left: activeTab.offsetLeft,
          width: activeTab.offsetWidth,
        })
      }
    }

    // 초기 indicator 위치 설정
    updateIndicator()

    // viewport 변경 시 indicator 위치 재계산 (모바일 ↔ PC 전환 대응)
    window.addEventListener('resize', updateIndicator)

    return () => {
      window.removeEventListener('resize', updateIndicator)
    }
  }, [selectedMarket])

  return (
    <div className="relative flex gap-6 overflow-x-auto border-b border-border pl-4 md:pl-0">
      {MARKETS.map(market => (
        <button
          key={market.value}
          ref={el => {
            tabRefs.current[market.value] = el
          }}
          onClick={() => onMarketChange(market.value)}
          className={cn(
            'shrink-0 cursor-pointer pb-3 text-md font-medium transition-colors',
            selectedMarket === market.value
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {market.label}
        </button>
      ))}
      {/* 애니메이션 언더라인 */}
      <span
        className="absolute bottom-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
    </div>
  )
}
