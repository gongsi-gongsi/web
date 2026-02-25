import { Suspense } from 'react'
import type { Metadata } from 'next'

import { CompanySearchPage } from '@/widgets/disclosure-search'

export const metadata: Metadata = {
  title: '기업 검색',
  description: '종목명 또는 종목코드로 기업을 검색하세요',
}

export const dynamic = 'force-dynamic'

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background pb-24 md:pb-0">
      <div className="md:mx-auto md:max-w-[1280px] md:px-4 md:py-8 lg:px-8">
        <div className="mb-8 hidden md:block">
          <h1 className="text-xl font-bold">기업 검색</h1>
          <p className="mt-1 text-sm text-muted-foreground">
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
