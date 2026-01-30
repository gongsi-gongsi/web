import { MobileHeader } from './ui/mobile-header'
import { DisclosureList } from './ui/disclosure-list'

/**
 * 오늘 날짜를 한국어 형식으로 포맷합니다
 * @returns "2026년 01월 30일" 형식의 문자열
 */
function formatTodayKorean(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}년 ${month}월 ${day}일`
}

export function DisclosureListPage() {
  const todayLabel = formatTodayKorean()

  return (
    <>
      {/* 모바일 헤더 */}
      <MobileHeader />

      {/* 모바일 버전 */}
      <div className="bg-card md:hidden">
        <div className="px-4 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">오늘의 공시</h1>
            <span className="text-xs text-muted-foreground">{todayLabel} 기준</span>
          </div>
          <p className="mt-1 text-sm text-primary">오늘 올라온 공시 목록입니다</p>
        </div>

        <DisclosureList />
      </div>

      {/* PC 버전 */}
      <div className="mx-auto hidden max-w-screen-2xl px-8 py-8 md:block">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold md:text-3xl">오늘의 공시</h1>
            <span className="text-sm text-muted-foreground">{todayLabel} 기준</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">오늘 등록된 모든 공시를 확인하세요</p>
        </div>

        <DisclosureList />
      </div>
    </>
  )
}
