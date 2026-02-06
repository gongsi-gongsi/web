import Image from 'next/image'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr'

import { Input } from '@gs/ui'

export function ServiceBanner() {
  return (
    <section className="relative h-[250px] w-full overflow-hidden bg-linear-to-r from-primary/2 to-primary/60 dark:from-primary/2 dark:to-primary/20 px-4 md:h-[500px] lg:px-8">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between">
        <div className="max-w-2xl">
          {/* 작은 텍스트 */}
          <p className="mb-2 text-sm font-medium text-muted-foreground md:text-base">
            주식 투자자를 위한 기업 분석과 레포트 제공
          </p>

          {/* 메인 텍스트 */}
          <div className="text-2xl font-bold leading-tight text-foreground md:mb-10 md:text-4xl lg:text-5xl">
            읽기 어려운 공시,
            <br />
            <span className="text-primary">AI 애널리스트</span>가 요약해드려요
          </div>

          {/* 검색바 - md 이상에서만 표시 */}
          <div className="relative hidden max-w-xl md:block">
            <div className="relative rounded-2xl border border-white/20 bg-background shadow-xl dark:border-white/10">
              <Input
                type="text"
                placeholder="기업명 또는 종목 코드를 검색해보세요"
                className="h-12 border-none bg-transparent pl-4 pr-14 text-base shadow-none outline-none placeholder:text-foreground/40 focus:outline-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 md:h-14 md:pr-16 md:text-lg"
              />
              <button
                className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-lg active:scale-95 md:right-2 md:size-11"
                aria-label="검색"
              >
                <MagnifyingGlassIcon className="size-5 md:size-6" weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* 배너 이미지 - md 이상에서만 표시 */}
        <div className="hidden md:block">
          <div className="animate-float">
            <Image
              src="/images/banner.png"
              alt="AI 애널리스트"
              width={500}
              height={500}
              className="h-auto w-[350px] lg:w-[500px]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
