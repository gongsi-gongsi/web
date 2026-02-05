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
    <header className="group/header header-animate sticky top-0 z-50 hidden w-full backdrop-blur-xl backdrop-saturate-150 md:block">
      {/* Subtle gradient border bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent" />

      {/* Animated gradient glow on scroll */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-linear-to-r from-primary/0 via-primary/40 to-primary/0 opacity-0 transition-opacity duration-500 group-hover/header:opacity-100" />

      <div className="relative flex h-16 w-full items-center md:px-4 lg:px-8">
        {/* Logo Section - Distinctive branding */}
        <Link
          href="/"
          className="group/logo relative mr-12 flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Geometric icon representing data/AI */}
          <div className="relative h-8 w-8">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-lg border-2 border-foreground/20 transition-all duration-500 group-hover/logo:rotate-90 group-hover/logo:border-primary/60" />
            {/* Inner square */}
            <div className="absolute inset-[6px] rounded-[4px] bg-linear-to-br from-primary/80 to-primary/90 transition-all duration-500 group-hover/logo:rotate-45 group-hover/logo:from-primary/90 group-hover/logo:to-primary" />
            {/* Center dot - AI pulse */}
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg shadow-primary/50 transition-all duration-500 group-hover/logo:h-2 group-hover/logo:w-2 group-hover/logo:shadow-primary/70" />
          </div>

          {/* Brand text */}
          <div className="flex flex-col">
            <span className="bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-xl font-bold leading-tight tracking-tight text-transparent transition-all duration-300 group-hover/logo:from-primary group-hover/logo:to-primary">
              공시공시
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/40 transition-colors duration-300 group-hover/logo:text-primary/60">
              AI Analysis
            </span>
          </div>
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
                  'text-sm font-medium transition-colors duration-200',
                  isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Auth button */}
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
