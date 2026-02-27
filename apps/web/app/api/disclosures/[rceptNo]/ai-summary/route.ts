import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import type { AiDisclosureSummaryRequest } from '@/features/ai-disclosure-summary/model/types'

const RATE_LIMIT_PER_HOUR = 10
const RATE_WINDOW_MS = 60 * 60 * 1000

/** 사용자별 요약 요청 타임스탬프 (인메모리 rate limiter) */
const rateLimitMap = new Map<string, number[]>()

const AI_SERVER_URL = process.env.AI_SERVER_URL ?? 'http://localhost:8000'
const AI_SERVER_API_KEY = process.env.AI_SERVER_API_KEY ?? ''

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
    // Python AI 서버로 프록시
    const response = await fetch(`${AI_SERVER_URL}/api/v1/disclosures/${rceptNo}/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': AI_SERVER_API_KEY,
      },
      body: JSON.stringify({
        corp_code: body.corpCode,
        corp_name: body.corpName,
        stock_code: body.stockCode,
        market: body.market,
        report_name: body.reportName,
        disclosure_type: body.disclosureType,
        received_at: body.receivedAt,
        dart_url: body.dartUrl,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ detail: 'AI 서버 오류' }))
      return NextResponse.json(
        { error: errorBody.detail ?? 'AI 요약 생성에 실패했습니다' },
        { status: response.status }
      )
    }

    const result = await response.json()

    // Python 서버 snake_case → 프론트엔드 camelCase 변환
    return NextResponse.json({
      summary: result.summary,
      sentiment: result.sentiment,
      keyFigures: result.key_figures,
      analysis: result.analysis,
      createdAt: result.created_at,
    })
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
