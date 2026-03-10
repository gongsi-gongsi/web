export interface CompoundInput {
  principal: number
  monthly: number
  annualRate: number
  years: number
}

export interface YearlySnapshot {
  year: number
  principal: number
  interest: number
  total: number
}

export interface CompoundResult {
  finalAmount: number
  totalPrincipal: number
  totalInterest: number
  returnRate: number
  yearlySnapshots: YearlySnapshot[]
}

/**
 * 복리 계산을 수행합니다
 * @param input - 계산 입력값 (원금, 월적립금, 연이율, 기간)
 * @returns 최종금액, 총납입금, 총이자, 수익률, 연도별 스냅샷
 */
export function calculateCompound(input: CompoundInput): CompoundResult {
  const { principal, monthly, annualRate, years } = input
  const monthlyRate = annualRate / 12 / 100
  const yearlySnapshots: YearlySnapshot[] = []

  let balance = principal
  let totalDeposited = principal

  for (let month = 1; month <= years * 12; month++) {
    if (monthlyRate > 0) {
      balance = balance * (1 + monthlyRate) + monthly
    } else {
      balance = balance + monthly
    }
    totalDeposited += monthly

    if (month % 12 === 0) {
      const year = month / 12
      yearlySnapshots.push({
        year,
        principal: totalDeposited,
        interest: balance - totalDeposited,
        total: balance,
      })
    }
  }

  const finalAmount = balance
  const totalPrincipal = totalDeposited
  const totalInterest = finalAmount - totalPrincipal
  const returnRate = totalPrincipal > 0 ? (totalInterest / totalPrincipal) * 100 : 0

  return {
    finalAmount,
    totalPrincipal,
    totalInterest,
    returnRate,
    yearlySnapshots,
  }
}
