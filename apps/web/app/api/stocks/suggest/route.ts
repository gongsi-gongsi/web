import { NextRequest, NextResponse } from 'next/server'

import { searchCorpCodes } from '@/shared/lib/dart/apis/search-stocks'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || ''
    const limit = Math.min(Number(searchParams.get('limit') || '50'), 50)

    if (!q.trim()) {
      return NextResponse.json({ suggestions: [] })
    }

    const matches = await searchCorpCodes(q.trim(), limit)

    const suggestions = matches.map(corp => ({
      corpCode: corp.corpCode,
      corpName: corp.corpName,
      stockCode: corp.stockCode || null,
    }))

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error suggesting stocks:', error)
    return NextResponse.json({ error: 'Failed to suggest stocks' }, { status: 500 })
  }
}
