import { Suspense } from 'react'

import { DisclosureSearchPage } from '@/widgets/disclosure-search'

export const dynamic = 'force-dynamic'

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* 모바일 버전 */}
      <div className="pb-4 md:hidden">
        <Suspense>
          <DisclosureSearchPage />
        </Suspense>
      </div>

      {/* PC 버전 */}
      <div className="mx-auto hidden max-w-screen-2xl px-8 py-8 md:block">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">공시 검색</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            회사명 또는 키워드로 공시를 검색할 수 있습니다
          </p>
        </div>
        <Suspense>
          <DisclosureSearchPage />
        </Suspense>
      </div>
    </main>
  )
}
