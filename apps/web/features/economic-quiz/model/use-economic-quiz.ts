'use client'

import { useCallback, useEffect, useReducer } from 'react'

import { selectQuestions, TOTAL_QUIZ_QUESTIONS } from '../data/questions'
import { calculateQuizResult } from './calculate-quiz-result'
import type { QuizQuestion, QuizResult } from '../types'

interface EconomicQuizState {
  step: 'intro' | 'quiz' | 'loading' | 'result'
  selectedQuestions: QuizQuestion[]
  currentIndex: number
  answers: Record<number, number>
  result: QuizResult | null
}

type Action =
  | { type: 'START_QUIZ' }
  | { type: 'ANSWER'; questionIndex: number; optionIndex: number }
  | { type: 'PREV' }
  | { type: 'SET_LOADING' }
  | { type: 'SET_RESULT'; result: QuizResult }
  | { type: 'RESET' }

const initialState: EconomicQuizState = {
  step: 'intro',
  selectedQuestions: [],
  currentIndex: 0,
  answers: {},
  result: null,
}

function reducer(state: EconomicQuizState, action: Action): EconomicQuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        step: 'quiz',
        selectedQuestions: selectQuestions(TOTAL_QUIZ_QUESTIONS),
        currentIndex: 0,
        answers: {},
        result: null,
      }

    case 'ANSWER': {
      const newAnswers = { ...state.answers, [action.questionIndex]: action.optionIndex }
      const isLast = action.questionIndex === state.selectedQuestions.length - 1

      if (isLast) {
        return { ...state, answers: newAnswers, step: 'loading' }
      }

      return {
        ...state,
        answers: newAnswers,
        currentIndex: action.questionIndex + 1,
      }
    }

    case 'PREV':
      if (state.currentIndex === 0) return state
      return { ...state, currentIndex: state.currentIndex - 1 }

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
 * 경제 용어 퀴즈의 전체 상태를 관리하는 훅입니다.
 *
 * @returns 퀴즈 상태와 액션 함수들
 *
 * @example
 * const { step, currentIndex, selectedQuestions, answers, startQuiz, answer, prev, reset } = useEconomicQuiz()
 */
export function useEconomicQuiz() {
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
      const result = calculateQuizResult(state.selectedQuestions, state.answers)
      try {
        sessionStorage.setItem('economic_quiz_result', JSON.stringify(result))
      } catch {
        // sessionStorage 접근 불가 시 무시
      }
      dispatch({ type: 'SET_RESULT', result })
    }, 1500)

    return () => clearTimeout(timer)
  }, [state.step, state.selectedQuestions, state.answers])

  const startQuiz = useCallback(() => {
    dispatch({ type: 'START_QUIZ' })
  }, [])

  const answer = useCallback((questionIndex: number, optionIndex: number) => {
    dispatch({ type: 'ANSWER', questionIndex, optionIndex })
  }, [])

  const prev = useCallback(() => {
    dispatch({ type: 'PREV' })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return {
    step: state.step,
    selectedQuestions: state.selectedQuestions,
    currentIndex: state.currentIndex,
    answers: state.answers,
    result: state.result,
    startQuiz,
    answer,
    prev,
    reset,
  }
}
