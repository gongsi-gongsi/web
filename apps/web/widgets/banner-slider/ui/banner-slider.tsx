'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@gs/ui'

interface BannerSlide {
  pc: string
  mobile: string
  alt: string
}

const SLIDES: BannerSlide[] = [
  {
    pc: '/images/main-banner-1-pc.png',
    mobile: '/images/main-banner-1-mobile.png',
    alt: '메인 배너 1',
  },
  {
    pc: '/images/main-banner-2-pc.png',
    mobile: '/images/main-banner-2-mobile.png',
    alt: '메인 배너 2',
  },
]

const AUTO_PLAY_INTERVAL = 7000

export function BannerSlider() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % SLIDES.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, AUTO_PLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.pc}
          className={cn(
            'transition-opacity duration-700 ease-in-out',
            current === index ? 'relative opacity-100' : 'absolute inset-0 opacity-0'
          )}
        >
          {/* PC */}
          <Image
            src={slide.pc}
            alt={slide.alt}
            width={1280}
            height={250}
            className="hidden h-[250px] w-full object-cover md:block"
            quality={90}
            priority
          />
          {/* 모바일 */}
          <Image
            src={slide.mobile}
            alt={slide.alt}
            width={350}
            height={200}
            className="h-[200px] w-full object-cover md:hidden"
            quality={90}
            priority
          />
        </div>
      ))}
    </div>
  )
}
