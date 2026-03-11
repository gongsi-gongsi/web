import type { CompoundResult } from '../model/calculate-compound'

interface CalculatorResultProps {
  result: CompoundResult
}

function formatKoreanAmount(amount: number): string {
  if (amount >= 100000000) {
    const eok = amount / 100000000
    return `${eok.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}억원`
  }
  if (amount >= 10000) {
    const man = amount / 10000
    return `${man.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원`
  }
  return `${amount.toLocaleString('ko-KR')}원`
}

export function CalculatorResult({ result }: CalculatorResultProps) {
  const { finalAmount, totalPrincipal, totalInterest, returnRate } = result

  return (
    <div className="flex flex-col gap-3">
      {/* 최종금액 highlight */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.08))',
          border: '1px solid rgba(245,158,11,0.25)',
        }}
      >
        <p className="text-xs text-foreground/70">최종 금액</p>
        <p className="mt-1 text-3xl font-black text-foreground">
          {formatKoreanAmount(finalAmount)}
        </p>
        <p className="mt-0.5 text-xs text-foreground/60">{finalAmount.toLocaleString('ko-KR')}원</p>
      </div>

      {/* 나머지 통계 */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="총 납입금" value={formatKoreanAmount(totalPrincipal)} />
        <StatCard label="총 이자" value={formatKoreanAmount(totalInterest)} />
        <StatCard label="수익률" value={`+${returnRate.toFixed(1)}%`} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <p className="text-[10px] text-foreground/70">{label}</p>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  )
}
