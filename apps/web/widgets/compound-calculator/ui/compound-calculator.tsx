'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  CalculatorChart,
  CalculatorForm,
  CalculatorResult,
  calculateCompound,
} from '@/features/compound-calculator'
import type { CompoundInput } from '@/features/compound-calculator'
import { trackCompoundCalculatorUse } from '@/shared/lib/analytics'

const DEFAULT_INPUT: CompoundInput = {
  principal: 10000000,
  monthly: 300000,
  annualRate: 7,
  years: 20,
}

export function CompoundCalculator() {
  const [input, setInput] = useState<CompoundInput>(DEFAULT_INPUT)
  const result = useMemo(() => calculateCompound(input), [input])

  useEffect(() => {
    const timeout = setTimeout(() => {
      trackCompoundCalculatorUse(input.years, input.annualRate)
    }, 500)
    return () => clearTimeout(timeout)
  }, [input.years, input.annualRate])

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
      {/* 좌: 입력 폼 */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h2 className="mb-5 text-base font-bold text-foreground">계산 설정</h2>
        <CalculatorForm value={input} onChange={setInput} />
      </div>

      {/* 우: 결과 + 차트 */}
      <div className="flex flex-col gap-4">
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h2 className="mb-4 text-base font-bold text-foreground">계산 결과</h2>
          <CalculatorResult result={result} />
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <CalculatorChart snapshots={result.yearlySnapshots} />
        </div>
      </div>
    </div>
  )
}
