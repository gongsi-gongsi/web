'use client'

import Link from 'next/link'
import { Button } from '@ds/ui'

const NAV_ITEMS = [
  { label: '홈', href: '/' },
  { label: '기업정보', href: '/companies' },
  { label: '통계', href: '/statistics' },
] as const

export function Header() {
  return (
    <header className="border-border/40 bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container h-14 flex max-w-screen-2xl items-center px-4 md:px-8">
        {/* 좌측: 로고 */}
        <div className="mr-8 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">DailyStock</span>
          </Link>
        </div>

        {/* 중앙: 메뉴 */}
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground/80 text-foreground/60 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 우측: 로그인 버튼 */}
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">로그인</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
