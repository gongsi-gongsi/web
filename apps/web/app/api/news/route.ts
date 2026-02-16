import { NextRequest, NextResponse } from 'next/server'

import { getGoogleNews } from '@/entities/news/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = searchParams.get('limit')

    if (!query) {
      return NextResponse.json({ error: 'q parameter is required' }, { status: 400 })
    }

    const data = await getGoogleNews(query, limit ? Number(limit) : 10)

    return NextResponse.json(data)
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
