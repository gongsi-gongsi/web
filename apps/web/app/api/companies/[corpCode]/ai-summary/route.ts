import { NextRequest, NextResponse } from 'next/server'

const AI_SERVER_URL = process.env.AI_SERVER_URL ?? 'http://localhost:8000'
const AI_SERVER_API_KEY = process.env.AI_SERVER_API_KEY ?? ''

interface RouteParams {
  params: Promise<{
    corpCode: string
  }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { corpCode } = await params

  // 유효성 검사 - 8자리 숫자만 허용
  const corpCodeRegex = /^[0-9]{8}$/
  if (!corpCode || !corpCodeRegex.test(corpCode)) {
    return NextResponse.json(
      { error: 'Invalid corp_code. Must be exactly 8 numeric digits.' },
      { status: 400 }
    )
  }

  try {
    // Python AI 서버로 프록시
    const response = await fetch(`${AI_SERVER_URL}/api/v1/companies/${corpCode}/summary`, {
      headers: {
        'X-API-Key': AI_SERVER_API_KEY,
      },
      next: {
        revalidate: 21600, // 6시간 캐시
        tags: ['ai-company-summary', corpCode],
      },
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ detail: 'AI 서버 오류' }))
      return NextResponse.json(
        { error: errorBody.detail ?? 'Failed to generate AI summary' },
        { status: response.status }
      )
    }

    const result = await response.json()

    // Python 서버 snake_case → 프론트엔드 camelCase 변환
    return NextResponse.json({
      summary: result.summary,
      generatedAt: result.generated_at,
    })
  } catch (error) {
    console.error(
      'Failed to generate AI summary for corp:',
      corpCode,
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json({ error: 'Failed to generate AI summary' }, { status: 500 })
  }
}
