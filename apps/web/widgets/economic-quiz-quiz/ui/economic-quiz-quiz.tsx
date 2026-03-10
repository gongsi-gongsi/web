'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { QuestionCard, TOTAL_QUIZ_QUESTIONS, useEconomicQuiz } from '@/features/economic-quiz'
import { ProgressBar } from '@/features/investment-mbti'

export function EconomicQuizQuiz() {
  const router = useRouter()
  const { step, selectedQuestions, currentIndex, answers, result, startQuiz, answer, prev } =
    useEconomicQuiz()

  // 페이지 마운트 시 퀴즈 시작
  useEffect(() => {
    startQuiz()
  }, [startQuiz])

  // 결과 계산 완료 시 결과 페이지로 이동
  useEffect(() => {
    if (step === 'result' && result) {
      router.replace(`/economic-quiz/result/${result.tier}`)
    }
  }, [step, result, router])

  const currentQuestion = selectedQuestions[currentIndex]

  // 로딩 화면
  if (step === 'loading') {
    return (
      <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center px-4 pb-24 md:pb-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="motion-safe:animate-float text-8xl">📊</div>
          <p className="text-lg font-bold text-foreground">결과를 분석하고 있어요...</p>
          <p className="text-sm text-muted-foreground">잠시만 기다려주세요</p>
          <div className="mt-2 flex gap-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="block size-2 animate-pulse rounded-full bg-primary"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </main>
    )
  }

  // 결과 처리 중 (리다이렉트 대기)
  if (step === 'result') {
    return null
  }

  // 문제 로딩 전 (intro 상태 또는 문제 미선정)
  if (!currentQuestion) {
    return null
  }

  return (
    <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-start px-4 pb-24 pt-6 md:pb-8">
      <div className="mx-auto w-full max-w-lg">
        {/* 진행 상태 */}
        <ProgressBar current={currentIndex + 1} total={TOTAL_QUIZ_QUESTIONS} className="mb-8" />

        {/* 질문 카드 */}
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
  )
}
