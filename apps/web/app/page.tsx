import { Suspense } from 'react'
import Link from 'next/link'

import { MagnifyingGlassIcon, ListIcon } from '@phosphor-icons/react/dist/ssr'

import { MobileHeader } from '@/widgets/header'
import { TodayDisclosures } from '@/widgets/today-disclosures'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <MobileHeader
        left={
          <Link href="/" className="flex items-center">
            <span className="text-lg font-bold">공시공시</span>
          </Link>
        }
        right={
          <>
            <Link
              href="/disclosures/search"
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
              aria-label="검색"
            >
              <MagnifyingGlassIcon className="size-5" />
            </Link>
            <button
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
              aria-label="메뉴"
            >
              <ListIcon className="size-5" />
            </button>
          </>
        }
      />
      <div className="mx-auto max-w-screen-2xl py-8 md:px-4 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <TodayDisclosures />
        </Suspense>
      </div>
    </main>
  )
}
