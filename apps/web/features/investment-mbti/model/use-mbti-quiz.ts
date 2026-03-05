'use client'

import { useCallback, useEffect, useReducer } from 'react'

import { QUESTIONS } from '../data/questions'
import { calculateMbtiType } from './calculate-mbti-type'
import type { MbtiResult } from './calculate-mbti-type'

type Step = 'disclaimer' | 'quiz' | 'loading' | 'result'

interface MbtiQuizState {
  step: Step
  currentQuestion: number
  answers: Record<number, 'A' | 'B'>
  result: MbtiResult | null
}

type Action =
  | { type: 'ACCEPT_DISCLAIMER' }
  | { type: 'ANSWER'; questionIndex: number; choice: 'A' | 'B' }
  | { type: 'PREV' }
  | { type: 'SET_LOADING' }
  | { type: 'SET_RESULT'; result: MbtiResult }
  | { type: 'RESET' }

const initialState: MbtiQuizState = {
  step: 'disclaimer',
  currentQuestion: 0,
  answers: {},
  result: null,
}

function reducer(state: MbtiQuizState, action: Action): MbtiQuizState {
  switch (action.type) {
    case 'ACCEPT_DISCLAIMER':
      return { ...state, step: 'quiz' }

    case 'ANSWER': {
      const newAnswers = { ...state.answers, [action.questionIndex]: action.choice }
      const isLast = action.questionIndex === QUESTIONS.length - 1

      if (isLast) {
        return { ...state, answers: newAnswers, step: 'loading' }
      }

      return {
        ...state,
        answers: newAnswers,
        currentQuestion: action.questionIndex + 1,
      }
    }

    case 'PREV':
      if (state.currentQuestion === 0) return state
      return { ...state, currentQuestion: state.currentQuestion - 1 }

    case 'SET_LOADING':
      return { ...state, step: 'loading' }

    case 'SET_RESULT':
      return { ...state, step: 'result', result: action.result }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

/**
 * 투자성향 MBTI 퀴즈의 전체 상태를 관리하는 훅입니다.
 *
 * @returns 퀴즈 상태와 액션 함수들
 *
 * @example
 * const { step, currentQuestion, answers, acceptDisclaimer, answer, prev, reset } = useMbtiQuiz()
 */
export function useMbtiQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // 퀴즈 진행 중 브라우저 새로고침/닫기 경고
  useEffect(() => {
    if (state.step !== 'quiz' || Object.keys(state.answers).length === 0) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [state.step, state.answers])

  // 로딩 단계: 1.5초 후 결과 계산 + sessionStorage 저장
  useEffect(() => {
    if (state.step !== 'loading') return

    const timer = setTimeout(() => {
      const result = calculateMbtiType(state.answers)
      // 결과 페이지에서 정확한 퍼센트 표시를 위해 sessionStorage에 저장
      try {
        sessionStorage.setItem('mbti_result', JSON.stringify(result))
      } catch {
        // sessionStorage 접근 불가 시 무시
      }
      dispatch({ type: 'SET_RESULT', result })
    }, 1500)

    return () => clearTimeout(timer)
  }, [state.step, state.answers])

  const acceptDisclaimer = useCallback(() => {
    dispatch({ type: 'ACCEPT_DISCLAIMER' })
  }, [])

  const answer = useCallback((questionIndex: number, choice: 'A' | 'B') => {
    dispatch({ type: 'ANSWER', questionIndex, choice })
  }, [])

  const prev = useCallback(() => {
    dispatch({ type: 'PREV' })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return {
    step: state.step,
    currentQuestion: state.currentQuestion,
    answers: state.answers,
    result: state.result,
    acceptDisclaimer,
    answer,
    prev,
    reset,
  }
}
