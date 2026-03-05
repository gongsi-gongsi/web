import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ALL_MBTI_TYPES, isMbtiType, MBTI_TYPES } from '@/features/investment-mbti'
import { InvestmentMbtiResult } from '@/widgets/investment-mbti-result'

const SITE_URL = 'https://gongsi-gongsi.kr'

interface ResultPageProps {
  params: Promise<{ type: string }>
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { type } = await params

  if (!isMbtiType(type)) {
    return { title: '결과를 찾을 수 없습니다' }
  }

  const typeData = MBTI_TYPES[type]
  const title = `나의 투자성향은 ${type} · ${typeData.name}`
  const description = `${typeData.subtitle} — ${typeData.tagline}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/images/mbti/${type}.png`,
          width: 512,
          height: 512,
          alt: typeData.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export function generateStaticParams() {
  return ALL_MBTI_TYPES.map(type => ({ type }))
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { type } = await params

  // 서버 컴포넌트에서 유효성 검사 — 클라이언트 컴포넌트 렌더링 전에 처리
  if (!isMbtiType(type)) {
    notFound()
  }

  return <InvestmentMbtiResult type={type} />
}
