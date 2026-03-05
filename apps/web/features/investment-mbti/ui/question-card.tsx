'use client'

import { cn } from '@gs/ui'
import { ArrowLeftIcon } from '@phosphor-icons/react'

import type { Question } from '../data/questions'

interface QuestionCardProps {
  question: Question
  selectedChoice: 'A' | 'B' | undefined
  onAnswer: (choice: 'A' | 'B') => void
  onPrev: () => void
  isFirst: boolean
}

export function QuestionCard({
  question,
  selectedChoice,
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
          'flex w-fit items-center gap-1.5 rounded-md p-1 text-sm text-muted-foreground transition-colors hover:text-foreground',
          isFirst && 'invisible'
        )}
        aria-label="이전 질문"
      >
        <ArrowLeftIcon className="size-4" />
        이전
      </button>

      {/* 질문 */}
      <div className="text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          Q{question.id}
        </p>
        <h2 className="text-xl font-bold leading-snug text-foreground sm:text-2xl">
          {question.text}
        </h2>
      </div>

      {/* 선택지 */}
      <div className="flex flex-col gap-3">
        {(['A', 'B'] as const).map(choice => {
          const option = question.options[choice]
          const isSelected = selectedChoice === choice

          return (
            <button
              key={choice}
              type="button"
              onClick={() => onAnswer(choice)}
              className={cn(
                'w-full rounded-2xl border-2 px-6 py-5 text-center transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-md'
                  : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5'
              )}
            >
              <span className="block text-base font-medium leading-relaxed sm:text-lg">
                {option.text}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
