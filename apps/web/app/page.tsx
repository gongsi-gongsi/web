import { Suspense } from 'react'
import Link from 'next/link'
import { MobileHeader } from '@/widgets/header'
import { TodayDisclosures } from '@/widgets/today-disclosures'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <MobileHeader
        left={
          <Link href="/" className="flex items-center">
            <span className="text-lg font-bold">DailyStock</span>
          </Link>
        }
      />
      <div className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <TodayDisclosures />
        </Suspense>
      </div>
    </main>
  )
}
