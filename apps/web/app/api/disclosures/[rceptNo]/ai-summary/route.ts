import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { generateDisclosureSummary } from '@/features/ai-disclosure-summary/api/generate-summary'
import type { AiDisclosureSummaryRequest } from '@/features/ai-disclosure-summary/model/types'

const RATE_LIMIT_PER_HOUR = 10
const RATE_WINDOW_MS = 60 * 60 * 1000

/** 사용자별 요약 요청 타임스탬프 (인메모리 rate limiter) */
const rateLimitMap = new Map<string, number[]>()

interface RouteParams {
  params: Promise<{
    rceptNo: string
  }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { rceptNo } = await params

  // 접수번호 유효성 검사 (14자리 숫자)
  if (!rceptNo || !/^\d{14}$/.test(rceptNo)) {
    return NextResponse.json({ error: '유효하지 않은 접수번호입니다' }, { status: 400 })
  }

  // 인증 확인
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
  }

  // 요청 body 파싱
  let body: AiDisclosureSummaryRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 })
  }

  if (!body.corpCode || !body.corpName || !body.stockCode || !body.reportName || !body.receivedAt) {
    return NextResponse.json({ error: '필수 필드가 누락되었습니다' }, { status: 400 })
  }

  // 사용자별 시간당 요약 생성 횟수 제한
  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: '시간당 요약 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429 }
    )
  }

  try {
    const result = await generateDisclosureSummary(rceptNo, body)
    return NextResponse.json(result)
  } catch (error) {
    console.error(
      'Failed to generate disclosure summary:',
      rceptNo,
      error instanceof Error ? error.message : 'Unknown error'
    )

    const message = error instanceof Error ? error.message : 'AI 요약 생성에 실패했습니다'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * 사용자별 rate limit을 확인하고 통과 시 타임스탬프를 기록합니다
 */
function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(userId) ?? []
  const recent = timestamps.filter(t => now - t < RATE_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_PER_HOUR) {
    rateLimitMap.set(userId, recent)
    return false
  }

  recent.push(now)
  rateLimitMap.set(userId, recent)
  return true
}
