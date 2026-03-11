import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ALL_TIER_TYPES, isTierType, TIERS_MAP } from '@/features/economic-quiz'
import { EconomicQuizResult } from '@/widgets/economic-quiz-result'

const SITE_URL = 'https://gongsi-gongsi.kr'

interface ResultPageProps {
  params: Promise<{ tier: string }>
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { tier } = await params

  if (!isTierType(tier)) {
    return { title: '결과를 찾을 수 없습니다' }
  }

  const tierData = TIERS_MAP[tier]
  const title = `나의 금융 지식 티어: ${tierData.emoji} ${tierData.name}`
  const description = `경제 용어 퀴즈 결과 — ${tierData.description}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/images/quiz-tiers/${tier}.png`,
          width: 512,
          height: 512,
          alt: tierData.name,
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
  return ALL_TIER_TYPES.map(tier => ({ tier }))
}

export default async function EconomicQuizResultPage({ params }: ResultPageProps) {
  const { tier } = await params

  if (!isTierType(tier)) {
    notFound()
  }

  return <EconomicQuizResult tier={tier} />
}
