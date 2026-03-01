'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@gs/ui'
import { useActiveBanners } from '@/entities/banner'

const AUTO_PLAY_INTERVAL = 7000

function isSafeUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

export function BannerSlider() {
  const { data: banners } = useActiveBanners()
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent(prev => (banners.length > 0 ? (prev + 1) % banners.length : 0))
  }, [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(next, AUTO_PLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [next, banners.length])

  if (!banners.length) return null

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {banners.map((banner, index) => {
        const images = (
          <>
            {/* PC - 1280:250 비율 유지 */}
            <div className="relative hidden aspect-[1280/250] w-full md:block">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover"
                quality={90}
                priority={index === 0}
              />
            </div>
            {/* 모바일 - 고정 높이 */}
            <Image
              src={banner.imageMobileUrl ?? banner.imageUrl}
              alt={banner.title}
              width={350}
              height={200}
              className="h-[200px] w-full object-cover md:hidden"
              quality={90}
              priority={index === 0}
            />
          </>
        )

        return (
          <div
            key={banner.id}
            className={cn(
              'transition-opacity duration-700 ease-in-out',
              current === index ? 'relative opacity-100' : 'absolute inset-0 opacity-0'
            )}
          >
            {banner.linkUrl && isSafeUrl(banner.linkUrl) ? (
              <Link href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
                {images}
              </Link>
            ) : (
              images
            )}
          </div>
        )
      })}
    </div>
  )
}
