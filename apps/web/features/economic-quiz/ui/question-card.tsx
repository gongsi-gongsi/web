'use client'

import { cn } from '@gs/ui'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr'

import type { QuizQuestion } from '../types'

const CATEGORY_LABELS: Record<string, string> = {
  STOCK: '주식',
  ECONOMY: '거시경제',
  BOND: '채권',
  FUND: '펀드/ETF',
  DERIVATIVE: '파생상품',
}

interface QuestionCardProps {
  question: QuizQuestion
  questionNumber: number
  selectedOption: number | undefined
  onAnswer: (optionIndex: number) => void
  onPrev: () => void
  isFirst: boolean
}

export function QuestionCard({
  question,
  questionNumber,
  selectedOption,
  onAnswer,
  onPrev,
  isFirst,
}: QuestionCardProps) {
  const OPTION_LABELS = ['①', '②', '③', '④']

  return (
    <div className="flex w-full flex-col gap-8">
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className={cn(
          'flex w-fit items-center gap-1.5 rounded-md p-1 text-sm text-muted-foreground transition-colors hover:text-foreground',
          isFirst && 'invisible'
        )}
        aria-label="이전 질문"
      >
        <ArrowLeftIcon className="size-4" />
        이전
      </button>

      {/* 카테고리 + 문제 번호 */}
      <div className="text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {CATEGORY_LABELS[question.category] ?? question.category}
          </span>
          <span className="text-xs text-muted-foreground/60">Q{questionNumber}</span>
        </div>
        <h2 className="text-xl font-bold leading-snug text-foreground sm:text-2xl">
          {question.question}
        </h2>
      </div>

      {/* 4지선다 선택지 */}
      <div className="flex flex-col gap-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index

          return (
            <button
              key={index}
              type="button"
              onClick={() => onAnswer(index)}
              className={cn(
                'w-full rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-md'
                  : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5'
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'shrink-0 text-base font-bold',
                    isSelected ? 'text-primary-foreground' : 'text-primary'
                  )}
                >
                  {OPTION_LABELS[index]}
                </span>
                <span className="text-sm font-medium leading-relaxed sm:text-base">{option}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
