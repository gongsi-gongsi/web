'use client'

import type { ReactNode } from 'react'

interface MobileHeaderProps {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
}

export function MobileHeader({ left, center, right }: MobileHeaderProps) {
  return (
    <header className="bg-card sticky top-0 z-50 flex h-14 items-center px-4 backdrop-blur md:hidden">
      {/* 좌측 */}
      <div className="flex min-w-0 flex-1 items-center">{left}</div>

      {/* 중앙 */}
      {center && <div className="flex items-center justify-center">{center}</div>}

      {/* 우측 */}
      <div className="flex flex-1 items-center justify-end gap-1">{right}</div>
    </header>
  )
}
