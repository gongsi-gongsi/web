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
      <div className="mx-auto hidden max-w-[1280px] py-10 md:block md:px-4 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                오늘의 공시
              </h1>
              <span className="flex items-center gap-1.5 rounded-full bg-success-weak px-2.5 py-1 text-xs font-medium text-success-weak-foreground">
                <span className="inline-block size-1.5 animate-pulse rounded-full bg-success" />
                실시간
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {todayLabel} 기준 · 1분마다 자동 갱신
            </p>
          </div>
        </div>

        <DisclosureList />
      </div>
    </>
  )
}
