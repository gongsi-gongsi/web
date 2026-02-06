'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn, ThemeToggle } from '@gs/ui'

import { AuthButton } from '@/widgets/auth'
import './desktop-header.css'

const NAV_ITEMS = [
  { label: '홈', href: '/' },
  { label: '기업정보', href: '/companies' },
  { label: '통계', href: '/statistics' },
] as const

export function DesktopHeader() {
  const pathname = usePathname()

  return (
    <header className="group/header header-animate sticky top-0 z-50 hidden w-full bg-background/80 backdrop-blur-xl backdrop-saturate-150 md:block">
      {/* Subtle gradient border bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent" />

      {/* Animated gradient glow on scroll */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-linear-to-r from-primary/0 via-primary/40 to-primary/0 opacity-0 transition-opacity duration-500 group-hover/header:opacity-100" />

      <div className="relative flex h-16 w-full items-center px-4 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1280px] items-center">
          {/* Logo */}
          <Link href="/" className="mr-12 flex items-center">
            <span className="text-xl font-bold">공시공시</span>
          </Link>

          {/* Navigation - Clean and refined */}
          <nav className="flex flex-1 items-center gap-6">
            {NAV_ITEMS.map(item => {
              const isActive =
                item.href === '/' ? pathname === item.href : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-base font-medium transition-colors duration-200',
                    isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Auth button */}
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  )
}
