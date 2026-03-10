'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { QuestionCard, TOTAL_QUIZ_QUESTIONS, useEconomicQuiz } from '@/features/economic-quiz'
import { ProgressBar } from '@/features/investment-mbti'
import { MobileHeader } from '@/widgets/header'

export function EconomicQuizQuiz() {
  const router = useRouter()
  const { step, selectedQuestions, currentIndex, answers, result, startQuiz, answer, prev } =
    useEconomicQuiz()

  useEffect(() => {
    startQuiz()
  }, [startQuiz])

  useEffect(() => {
    if (step === 'result' && result) {
      router.replace(`/economic-quiz/result/${result.tier}`)
    }
  }, [step, result, router])

  const currentQuestion = selectedQuestions[currentIndex]

  // 로딩 화면
  if (step === 'loading') {
    return (
      <>
        <MobileHeader />
        <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-6 px-4 pb-24 md:pb-0">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="relative">
              <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/20 blur-2xl" />
              <span className="block animate-bounce text-8xl">📊</span>
            </div>
            <div>
              <p className="text-lg font-black text-foreground">결과 분석 중</p>
              <p className="mt-1 text-sm text-muted-foreground">잠시만 기다려주세요</p>
            </div>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
              <div className="h-full animate-[loading_1.5s_ease-in-out_forwards] rounded-full bg-primary" />
            </div>
          </div>
        </main>
      </>
    )
  }

  if (step === 'result') return null

  if (!currentQuestion) return null

  return (
    <>
      <MobileHeader />
      <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-start px-4 pb-24 pt-6 md:pb-8">
        <div className="mx-auto w-full max-w-lg">
          <ProgressBar current={currentIndex + 1} total={TOTAL_QUIZ_QUESTIONS} className="mb-10" />
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            selectedOption={answers[currentIndex]}
            onAnswer={optionIndex => answer(currentIndex, optionIndex)}
            onPrev={prev}
            isFirst={currentIndex === 0}
          />
        </div>
      </main>
    </>
  )
}
