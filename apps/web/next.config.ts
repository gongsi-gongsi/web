import { withSentryConfig } from '@sentry/nextjs'
import bundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // Monorepo 패키지 transpile 설정
  // Turbopack은 자동으로 이 패키지들의 변경사항을 감지합니다
  transpilePackages: ['@gs/ui', '@gs/tailwind-config'],

  // 개발 인디케이터 비활성화
  devIndicators: false,

  // 외부 이미지 도메인 허용
  images: {
    qualities: [90],
    remotePatterns: [
      { protocol: 'https', hostname: 'cmljmwditkdcykopkfxj.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { hostname: '*.kakaocdn.net' },
    ],
  },

  // 패키지 barrel import 최적화 (tree-shaking 강화)
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },

  // 보안 헤더
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com https://*.sentry.io",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com http://*.kakaocdn.net https://*.kakaocdn.net",
            "font-src 'self'",
            "connect-src 'self' https://*.supabase.co https://*.sentry.io https://www.google-analytics.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
            "frame-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
        },
      ],
    },
  ],
}

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
})
