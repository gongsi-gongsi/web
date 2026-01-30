'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export function MobileHeader() {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-card px-4 will-change-transform md:hidden">
      <button
        onClick={() => router.back()}
        className="-ml-3 flex size-11 items-center justify-center rounded-lg hover:bg-accent"
        aria-label="뒤로가기"
      >
        <ChevronLeft className="size-6" />
      </button>
    </header>
  )
}
