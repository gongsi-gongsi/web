import type { TierData, TierType } from '../types'

export const TIERS: TierData[] = [
  {
    type: 'BEGINNER',
    name: '주린이',
    minScore: 0,
    maxScore: 4,
    description:
      '경제 용어가 아직 낯설지만 배우기 시작한 단계입니다. 기초부터 차근차근 공부하면 금방 성장할 수 있어요!',
    emoji: '🌱',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  {
    type: 'AMATEUR',
    name: '개미 투자자',
    minScore: 5,
    maxScore: 8,
    description:
      '기본적인 경제 개념은 알고 있지만 아직 배울 것이 많습니다. 꾸준한 학습으로 실력을 키워보세요!',
    emoji: '🐜',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  {
    type: 'INVESTOR',
    name: '가치 투자자',
    minScore: 9,
    maxScore: 12,
    description:
      '주식·채권·경제의 핵심 개념을 이해하고 있습니다. 꽤 탄탄한 금융 지식을 갖추고 계시네요!',
    emoji: '📊',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  {
    type: 'EXPERT',
    name: '전문 투자자',
    minScore: 13,
    maxScore: 16,
    description:
      '파생상품·펀드까지 폭넓은 금융 지식을 보유하고 있습니다. 투자 시장을 날카롭게 분석하는 실력자!',
    emoji: '🔭',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  },
  {
    type: 'MASTER',
    name: '경제통',
    minScore: 17,
    maxScore: 19,
    description:
      '거시경제부터 파생상품까지 거의 모든 분야를 꿰뚫고 있습니다. 주변에서 경제 조언을 구하는 사람들이 많겠군요!',
    emoji: '🏆',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  },
  {
    type: 'LEGEND',
    name: '월가의 전설',
    minScore: 20,
    maxScore: 20,
    description:
      '20문제 모두 맞혔습니다! 경제·금융에 관한 한 당신은 진정한 전설입니다. 워런 버핏이 반할 수준의 지식!',
    emoji: '👑',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
]

export const TIERS_MAP: Record<TierType, TierData> = Object.fromEntries(
  TIERS.map(t => [t.type, t])
) as Record<TierType, TierData>

export const ALL_TIER_TYPES: TierType[] = TIERS.map(t => t.type)

/**
 * 점수에 따라 티어를 반환합니다.
 * @param score - 맞춘 문제 수 (0~20)
 * @returns 해당 점수의 TierType
 */
export function getTierByScore(score: number): TierType {
  for (const tier of TIERS) {
    if (score >= tier.minScore && score <= tier.maxScore) {
      return tier.type
    }
  }
  return 'BEGINNER'
}

/**
 * TierType 유효성 검사 타입 가드
 * @param value - 검사할 문자열
 */
export function isTierType(value: string): value is TierType {
  return ALL_TIER_TYPES.includes(value as TierType)
}
