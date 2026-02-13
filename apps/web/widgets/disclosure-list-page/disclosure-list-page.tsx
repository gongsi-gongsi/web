import { BackButton } from '@/shared/ui/back-button'
import { getTodayKorean } from '@/shared/lib/date'
import { MobileHeader } from '@/widgets/header'
import { DisclosureList } from './ui/disclosure-list'

export function DisclosureListPage() {
  const todayLabel = getTodayKorean()

  return (
    <>
      {/* 모바일 헤더: 뒤로가기 */}
      <MobileHeader left={<BackButton />} />

      {/* 모바일 버전 */}
      <div className="bg-card pb-24 md:hidden">
        <div className="px-4 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">오늘의 공시</h1>
            <span className="text-xs text-muted-foreground">{todayLabel} 기준</span>
          </div>
          <p className="mt-1 text-sm text-primary">공시 목록은 1분마다 갱신됩니다</p>
        </div>

        <DisclosureList />
      </div>

      {/* PC 버전 */}
      <div className="mx-auto hidden max-w-screen-2xl py-8 md:block md:px-4 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold md:text-3xl">오늘의 공시</h1>
            <span className="text-sm text-muted-foreground">{todayLabel} 기준</span>
          </div>
          <p className="mt-2 text-sm text-primary">오늘 등록된 모든 공시를 확인하세요</p>
        </div>

        <DisclosureList />
      </div>
    </>
  )
}
