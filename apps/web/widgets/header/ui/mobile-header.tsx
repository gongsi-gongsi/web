'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface MobileHeaderProps {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
}

function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/images/logo-light.svg"
        alt="공시공시"
        width={80}
        height={24}
        className="h-6 w-auto dark:hidden"
        priority
      />
      <Image
        src="/images/logo-dark.svg"
        alt="공시공시"
        width={80}
        height={24}
        className="hidden h-6 w-auto dark:block"
        priority
      />
    </Link>
  )
}

export function MobileHeader({ left, center, right }: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-50 md:hidden">
      <header className="bg-card flex h-14 items-center gap-2 px-4 backdrop-blur">
        {/* 좌측 */}
        <div className="flex shrink-0 items-center">{left ?? <Logo />}</div>

        {/* 중앙 */}
        {center && <div className="flex min-w-0 flex-1 items-center">{center}</div>}

        {/* 우측 */}
        {!center && <div className="flex min-w-0 flex-1" />}
        <div className="flex shrink-0 items-center gap-1">{right}</div>
      </header>
    </div>
  )
}
