export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { suggestCompaniesFromDart } from '@/entities/disclosure/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || ''
    const limit = Math.min(Number(searchParams.get('limit') || '50'), 50)

    // 서버 전용 API 함수 사용
    const suggestions = await suggestCompaniesFromDart(q, limit)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error suggesting stocks:', error)
    return NextResponse.json({ error: 'Failed to suggest stocks' }, { status: 500 })
  }
}
