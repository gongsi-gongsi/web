import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Providers } from './providers'
import { Header } from '@/widgets/header'
import { BottomNav } from '@/widgets/bottom-nav'
import { Footer } from '@/widgets/footer'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/shared/lib/seo'
import './globals.css'

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gongsi-gongsi.kr'),
  title: {
    default: '공시공시 - AI 기반 기업 공시 분석',
    template: '%s | 공시공시',
  },
  description:
    '개인 투자자를 위한 AI 기반 기업 공시 분석 서비스. 실시간 공시 알림, AI 요약, 재무제표 분석을 한눈에.',
  keywords: ['공시', '주식', 'AI 분석', '기업 공시', '투자', 'DART', '재무제표', '공시공시'],
  authors: [{ name: '공시공시' }],
  creator: '공시공시',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '공시공시',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'f9CQiZOO1Mi5KGL7vHCnYr8QBL1wnpSgtPfYpLLEQ8w',
    other: {
      'naver-site-verification': '692c35e93c57b02e516c97bbfb83f14078b35c85',
    },
  },
}

export const viewport: Viewport = {
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className={pretendard.variable}>
      <body className="bg-background text-foreground antialiased">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <Providers>
          <Header />
          {children}
          <Footer />
          <BottomNav />
        </Providers>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
