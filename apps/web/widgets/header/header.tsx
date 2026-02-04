'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn, ThemeToggle } from '@ds/ui'

import { AuthButton } from '@/widgets/auth'

const NAV_ITEMS = [
  { label: '홈', href: '/' },
  { label: '기업정보', href: '/companies' },
  { label: '통계', href: '/statistics' },
] as const

export function DesktopHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-background sticky top-0 z-50 hidden w-full backdrop-blur md:block">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center px-4 md:px-8">
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
              className={cn(
                'hover:text-foreground/80 transition-colors',
                pathname === item.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 우측: 테마 전환 + 인증 버튼 */}
        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
