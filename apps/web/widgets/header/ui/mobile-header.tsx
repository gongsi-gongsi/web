'use client'

import type { ReactNode } from 'react'
import './mobile-header.css'

interface MobileHeaderProps {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
}

export function MobileHeader({ left, center, right }: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-50 md:hidden">
      <header className="header-animate bg-card flex h-14 items-center gap-2 px-4 backdrop-blur">
        {/* 좌측 */}
        <div className="flex shrink-0 items-center">{left}</div>

        {/* 중앙 */}
        {center && <div className="flex min-w-0 flex-1 items-center">{center}</div>}

        {/* 우측 */}
        {!center && <div className="flex min-w-0 flex-1" />}
        <div className="flex shrink-0 items-center gap-1">{right}</div>
      </header>
    </div>
  )
}
