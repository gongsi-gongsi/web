/**
 * 숫자를 억 단위로 포맷팅합니다
 * @param value - 금액 (원 단위)
 * @returns 포맷팅된 문자열 (억 단위) 또는 '-'
 * @example
 * formatToEok(258935022000000) // '2,589,350'
 * formatToEok(null) // '-'
 */
export function formatToEok(value: number | null): string {
  if (value === null) return '-'

  const eok = Math.round(value / 100000000)
  return eok.toLocaleString('ko-KR')
}

/**
 * 비율을 퍼센트 문자열로 포맷팅합니다
 * @param value - 비율 값 (0.1 = 10%)
 * @returns 포맷팅된 문자열 (소수점 2자리) 또는 '-'
 * @example
 * formatPercent(0.1523) // '15.23'
 * formatPercent(null) // '-'
 */
export function formatPercent(value: number | null): string {
  if (value === null || isNaN(value) || !isFinite(value)) return '-'
  return value.toFixed(2)
}

/**
 * ROE (자기자본이익률)를 계산합니다
 * @param netIncome - 당기순이익
 * @param totalEquity - 자본총계
 * @returns ROE (%) 또는 null
 */
export function calculateROE(netIncome: number | null, totalEquity: number | null): number | null {
  if (netIncome === null || totalEquity === null || totalEquity === 0) {
    return null
  }
  return (netIncome / totalEquity) * 100
}

/**
 * ROA (총자산이익률)를 계산합니다
 * @param netIncome - 당기순이익
 * @param totalAssets - 자산총계
 * @returns ROA (%) 또는 null
 */
export function calculateROA(netIncome: number | null, totalAssets: number | null): number | null {
  if (netIncome === null || totalAssets === null || totalAssets === 0) {
    return null
  }
  return (netIncome / totalAssets) * 100
}

/**
 * 영업이익률을 계산합니다
 * @param operatingProfit - 영업이익
 * @param revenue - 매출액
 * @returns 영업이익률 (%) 또는 null
 */
export function calculateOperatingMargin(
  operatingProfit: number | null,
  revenue: number | null
): number | null {
  if (operatingProfit === null || revenue === null || revenue === 0) {
    return null
  }
  return (operatingProfit / revenue) * 100
}

/**
 * 순이익률을 계산합니다
 * @param netIncome - 당기순이익
 * @param revenue - 매출액
 * @returns 순이익률 (%) 또는 null
 */
export function calculateNetMargin(
  netIncome: number | null,
  revenue: number | null
): number | null {
  if (netIncome === null || revenue === null || revenue === 0) {
    return null
  }
  return (netIncome / revenue) * 100
}

/**
 * 부채비율을 계산합니다
 * @param totalLiabilities - 부채총계
 * @param totalEquity - 자본총계
 * @returns 부채비율 (%) 또는 null
 */
export function calculateDebtRatio(
  totalLiabilities: number | null,
  totalEquity: number | null
): number | null {
  if (totalLiabilities === null || totalEquity === null || totalEquity === 0) {
    return null
  }
  return (totalLiabilities / totalEquity) * 100
}

/**
 * 숫자를 조 단위로 포맷팅합니다 (소수점 1자리)
 * @param value - 금액 (원 단위)
 * @returns 포맷팅된 문자열 (조 단위) 또는 '-'
 * @example
 * formatToJo(258935022000000) // '258.9조'
 * formatToJo(null) // '-'
 */
export function formatToJo(value: number | null): string {
  if (value === null) return '-'

  const jo = value / 1000000000000
  if (Math.abs(jo) >= 1) {
    return `${jo.toFixed(1)}조`
  }

  // 1조 미만은 억 단위로 표시
  const eok = value / 100000000
  return `${Math.round(eok).toLocaleString('ko-KR')}억`
}

/**
 * 값의 변화율 스타일 클래스를 반환합니다
 * @param current - 현재 값
 * @param previous - 이전 값
 * @returns 텍스트 색상 클래스
 */
export function getChangeColorClass(current: number | null, previous: number | null): string {
  if (current === null || previous === null) return ''
  if (current > previous) return 'text-red-500'
  if (current < previous) return 'text-blue-500'
  return ''
}
