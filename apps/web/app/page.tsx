import { Suspense } from 'react'
import { TodayDisclosures } from '@/widgets/today-disclosures'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <TodayDisclosures />
        </Suspense>
      </div>
    </main>
  )
}
