import { MobileHeader } from './ui/mobile-header'
import { DisclosureList } from './ui/disclosure-list'

export function DisclosureListPage() {
  return (
    <>
      {/* 모바일 헤더 */}
      <MobileHeader />

      {/* 모바일 버전 */}
      <div className="bg-card md:hidden">
        <div className="px-4 pb-4 pt-6">
          <h1 className="text-lg font-bold">오늘의 공시</h1>
          <p className="mt-1 text-sm text-primary">오늘 올라온 공시 목록입니다</p>
        </div>

        <DisclosureList />
      </div>

      {/* PC 버전 */}
      <div className="mx-auto hidden max-w-screen-2xl px-8 py-8 md:block">
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl">공시 목록</h1>
          <p className="mt-2 text-sm text-muted-foreground">오늘 등록된 모든 공시를 확인하세요</p>
        </div>

        <DisclosureList />
      </div>
    </>
  )
}
