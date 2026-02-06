import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // Monorepo 패키지 transpile 설정
  // Turbopack은 자동으로 이 패키지들의 변경사항을 감지합니다
  transpilePackages: ['@gs/ui', '@gs/tailwind-config'],

  // 개발 인디케이터 비활성화
  devIndicators: false,
}

export default nextConfig
