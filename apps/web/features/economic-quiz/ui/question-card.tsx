'use client'

import { cn } from '@gs/ui'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { motion } from 'motion/react'

import type { QuizQuestion } from '../types'

const CATEGORY_LABELS: Record<string, string> = {
  STOCK: '주식',
  ECONOMY: '거시경제',
  BOND: '채권',
  FUND: '펀드/ETF',
  DERIVATIVE: '파생상품',
}

const CATEGORY_COLORS: Record<string, string> = {
  STOCK:
    'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  ECONOMY:
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  BOND: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800',
  FUND: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  DERIVATIVE:
    'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
}

const OPTION_LABELS = ['①', '②', '③', '④']

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
  return (
    <div className="flex w-full flex-col gap-8">
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className={cn(
          'flex w-fit items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:border-border hover:text-foreground',
          isFirst && 'invisible'
        )}
        aria-label="이전 질문"
      >
        <ArrowLeftIcon className="size-3.5" />
        PREV
      </button>

      {/* 카테고리 + 문제 번호 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
              CATEGORY_COLORS[question.category]
            )}
          >
            {CATEGORY_LABELS[question.category] ?? question.category}
          </span>
          <span className="font-mono text-xs font-bold text-primary">
            Q{String(questionNumber).padStart(2, '0')}
          </span>
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
            <motion.button
              key={index}
              type="button"
              onClick={() => onAnswer(index)}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'group flex w-full items-start gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-150',
                isSelected
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-black transition-colors',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted text-muted-foreground group-hover:border-primary/50 group-hover:text-primary'
                )}
              >
                {OPTION_LABELS[index]}
              </span>
              <span
                className={cn(
                  'text-sm font-medium leading-relaxed transition-colors sm:text-base',
                  isSelected
                    ? 'text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {option}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
