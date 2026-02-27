'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Images, Megaphone, Users, SignOut } from '@phosphor-icons/react'

const NAV_ITEMS = [
  { href: '/banners', label: '배너 관리', icon: Images },
  { href: '/notices', label: '공지사항 관리', icon: Megaphone },
  { href: '/users', label: '유저 관리', icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center border-b border-border px-6">
        <Link href="/banners" className="text-lg font-bold text-foreground">
          공시공시 Admin
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(item => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <SignOut size={20} />
          로그아웃
        </button>
      </div>
    </aside>
  )
}
