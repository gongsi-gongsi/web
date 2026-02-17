/**
 * DART API 계정과목명을 앱 내부 키로 매핑합니다
 * @remarks 기업마다 계정과목명이 다를 수 있어 여러 변형을 지원합니다
 */

export type AccountKey =
  | 'revenue'
  | 'operatingProfit'
  | 'netIncome'
  | 'totalAssets'
  | 'totalLiabilities'
  | 'totalEquity'

export const ACCOUNT_MAPPING: Record<AccountKey, string[]> = {
  revenue: ['매출액', '영업수익', '수익(매출액)', '매출', '이자수익', '보험수익'],
  operatingProfit: ['영업이익', '영업이익(손실)'],
  netIncome: ['당기순이익', '연결당기순이익', '당기순이익(손실)', '분기순이익', '반기순이익'],
  totalAssets: ['자산총계'],
  totalLiabilities: ['부채총계'],
  totalEquity: ['자본총계', '자본총계(지배)', '지배기업 소유주지분'],
}

/**
 * 계정과목명으로 AccountKey를 찾습니다
 * @param accountName - DART API에서 받은 계정과목명
 * @returns 매핑된 AccountKey 또는 null
 */
export function findAccountKey(accountName: string): AccountKey | null {
  for (const [key, names] of Object.entries(ACCOUNT_MAPPING)) {
    if (names.includes(accountName)) {
      return key as AccountKey
    }
  }
  return null
}

/**
 * AccountKey의 한글 라벨을 반환합니다
 * @param key - AccountKey
 * @returns 한글 라벨
 */
export function getAccountLabel(key: AccountKey): string {
  const labels: Record<AccountKey, string> = {
    revenue: '매출액',
    operatingProfit: '영업이익',
    netIncome: '당기순이익',
    totalAssets: '자산총계',
    totalLiabilities: '부채총계',
    totalEquity: '자본총계',
  }
  return labels[key]
}
