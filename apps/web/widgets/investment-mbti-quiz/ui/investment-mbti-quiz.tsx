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
import { MobileHeader } from '@/widgets/header'

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
      <>
        <MobileHeader />
        <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-6 px-4 pb-24 md:pb-0">
          <div className="flex flex-col items-center gap-5 text-center">
            {/* 마법사형 캐릭터 */}
            <div className="relative">
              <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/20 blur-2xl" />
              <Image
                src="/images/mbti/GSTR.png"
                alt="분석 중"
                width={140}
                height={140}
                className="animate-float object-contain"
              />
            </div>

            <div>
              <p className="text-lg font-black text-foreground">결과 분석 중</p>
              <p className="mt-1 text-sm text-muted-foreground">잠시만 기다려주세요</p>
            </div>

            {/* 로딩 바 */}
            <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
              <div className="h-full animate-[loading_1.5s_ease-in-out_forwards] rounded-full bg-primary" />
            </div>
          </div>
        </main>
      </>
    )
  }

  // 결과 처리 중 (리다이렉트 대기)
  if (step === 'result') {
    return null
  }

  return (
    <>
      {/* 면책 동의 모달 */}
      <DisclaimerModal
        open={step === 'disclaimer'}
        onAccept={acceptDisclaimer}
        onClose={() => router.back()}
      />

      <MobileHeader />

      <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-start px-4 pb-24 pt-6 md:pb-8">
        <div className="mx-auto w-full max-w-lg">
          {/* 진행 상태 */}
          <ProgressBar current={currentQuestion + 1} total={TOTAL_QUESTIONS} className="mb-10" />

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
