import { Suspense } from 'react'

import { CompanySearchPage } from '@/widgets/disclosure-search'

export const dynamic = 'force-dynamic'

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* 모바일 버전 */}
      <div className="pb-4 md:hidden">
        <Suspense>
          <CompanySearchPage />
        </Suspense>
      </div>

      {/* PC 버전 */}
      <div className="mx-auto hidden max-w-screen-2xl px-8 py-8 md:block">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">기업 검색</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            회사명으로 검색하여 기업 정보와 공시를 확인할 수 있습니다
          </p>
        </div>
        <Suspense>
          <CompanySearchPage />
        </Suspense>
      </div>
    </main>
  )
}
