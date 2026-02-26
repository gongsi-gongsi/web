'use client'

import { usePathname } from 'next/navigation'
import { BookOpenTextIcon, HeartIcon, HouseIcon, UserIcon } from '@phosphor-icons/react'

import { NavigationItem } from './navigation-item'

const NAV_ITEMS = [
  { icon: HouseIcon, label: '홈', href: '/' },
  { icon: HeartIcon, label: '관심', href: '/interests' },
  { icon: BookOpenTextIcon, label: '용어집', href: '/glossary' },
  { icon: UserIcon, label: '프로필', href: '/mypage' },
] as const

/**
 * 모바일 하단 네비게이션 바
 */
export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="주요 메뉴"
    >
      <div className="mx-auto flex items-center justify-around px-2">
        {NAV_ITEMS.map(item => {
          const isActive =
            item.href === '/' ? pathname === item.href : pathname.startsWith(item.href)

          return <NavigationItem key={item.href} item={item} isActive={isActive} />
        })}
      </div>
    </nav>
  )
}
