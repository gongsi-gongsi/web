'use client'

import { useEffect, useState } from 'react'
import { cn } from '@gs/ui'

interface SummaryProgressProps {
  isLoading: boolean
}

const STEPS = [
  { label: '공시 원문 다운로드 중...', duration: 3000 },
  { label: '문서 분석 중...', duration: 2000 },
  { label: 'AI 요약 생성 중...', duration: 10000 },
]

export function SummaryProgress({ isLoading }: SummaryProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    setCurrentStep(0)

    const timer1 = setTimeout(() => setCurrentStep(1), STEPS[0].duration)
    const timer2 = setTimeout(() => setCurrentStep(2), STEPS[0].duration + STEPS[1].duration)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [isLoading])

  if (!isLoading) return null

  const progress = Math.min(((currentStep + 1) / STEPS.length) * 100, 95)

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex flex-col gap-3">
        {STEPS.map((step, index) => (
          <div key={step.label} className="flex items-center gap-3">
            <div
              className={cn(
                'flex size-6 items-center justify-center rounded-full text-xs font-medium',
                index < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index === currentStep
                    ? 'bg-primary/20 text-primary animate-pulse'
                    : 'bg-muted text-muted-foreground'
              )}
            >
              {index < currentStep ? <CheckIcon /> : index + 1}
            </div>
            <span
              className={cn(
                'text-sm',
                index === currentStep ? 'font-medium text-foreground' : 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full max-w-xs">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 6L5 8.5L9.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
