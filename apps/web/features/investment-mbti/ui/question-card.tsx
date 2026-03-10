'use client'

import { cn } from '@gs/ui'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { motion } from 'motion/react'

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
          'flex w-fit items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:border-border hover:text-foreground',
          isFirst && 'invisible'
        )}
        aria-label="이전 질문"
      >
        <ArrowLeftIcon className="size-3.5" />
        PREV
      </button>

      {/* 질문 */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          Q{String(question.id).padStart(2, '0')}
        </span>
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
            <motion.button
              key={choice}
              type="button"
              onClick={() => onAnswer(choice)}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'group flex w-full items-start gap-4 rounded-2xl border-2 px-5 py-5 text-left transition-all duration-150',
                isSelected
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5'
              )}
            >
              {/* Choice label */}
              <span
                className={cn(
                  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-black transition-colors',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted text-muted-foreground group-hover:border-primary/50 group-hover:text-primary'
                )}
              >
                {choice}
              </span>

              <span
                className={cn(
                  'text-base font-medium leading-relaxed transition-colors',
                  isSelected
                    ? 'text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {option.text}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
