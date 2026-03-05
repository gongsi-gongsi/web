'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import {
  DisclaimerModal,
  ProgressBar,
  QUESTIONS,
  QuestionCard,
  TOTAL_QUESTIONS,
  useMbtiQuiz,
} from '@/features/investment-mbti'

export function InvestmentMbtiQuiz() {
  const router = useRouter()
  const { step, currentQuestion, answers, result, acceptDisclaimer, answer, prev } = useMbtiQuiz()

  // 결과 계산 완료 시 결과 페이지로 이동
  useEffect(() => {
    if (step === 'result' && result) {
      router.replace(`/investment-mbti/result/${result.type}`)
    }
  }, [step, result, router])

  const question = QUESTIONS[currentQuestion]

  // 로딩 화면
  if (step === 'loading') {
    return (
      <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center px-4 pb-24 md:pb-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="animate-float">
            <Image
              src="/images/mbti/GSTR.png"
              alt="분석 중"
              width={160}
              height={160}
              className="object-contain"
            />
          </div>
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

  return (
    <>
      {/* 면책 동의 모달 (step === 'disclaimer' 일 때 자동 표시) */}
      <DisclaimerModal
        open={step === 'disclaimer'}
        onAccept={acceptDisclaimer}
        onClose={() => router.back()}
      />

      <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-start px-4 pb-24 pt-6 md:pb-8">
        <div className="mx-auto w-full max-w-lg">
          {/* 진행 상태 */}
          <ProgressBar current={currentQuestion + 1} total={TOTAL_QUESTIONS} className="mb-8" />

          {/* 질문 카드 */}
          {question && (
            <QuestionCard
              question={question}
              selectedChoice={answers[currentQuestion]}
              onAnswer={choice => answer(currentQuestion, choice)}
              onPrev={prev}
              isFirst={currentQuestion === 0}
            />
          )}
        </div>
      </main>
    </>
  )
}
