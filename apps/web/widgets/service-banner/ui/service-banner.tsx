import Image from 'next/image'

import { BannerSearch } from './banner-search'

export function ServiceBanner() {
  return (
    <section className="relative z-10 h-[250px] w-full bg-linear-to-r from-primary/2 to-primary/60 dark:from-primary/2 dark:to-primary/20 px-4 md:h-[400px] lg:px-8">
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
          <div className="hidden md:block">
            <BannerSearch />
          </div>
        </div>

        {/* 배너 이미지 - md 이상에서만 표시 */}
        <div className="hidden overflow-hidden md:block">
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
