export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import {
  getDisclosuresByCorpCode,
  type DisclosureType,
  type SearchPeriod,
} from '@/entities/disclosure/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ corpCode: string }> }
) {
  try {
    const { corpCode } = await params

    if (!/^[0-9]{8}$/.test(corpCode)) {
      return NextResponse.json(
        { error: 'Invalid corp_code. Must be exactly 8 numeric digits.' },
        { status: 400 }
      )
    }

    const VALID_PERIODS = new Set(['today', '1w', '3m', 'all', 'custom'])
    const VALID_TYPES = new Set(['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'])

    const searchParams = request.nextUrl.searchParams
    const rawPeriod = searchParams.get('period') || '3m'
    const rawType = searchParams.get('type') || 'all'
    const period: SearchPeriod = VALID_PERIODS.has(rawPeriod) ? (rawPeriod as SearchPeriod) : '3m'
    const type: DisclosureType | 'all' = VALID_TYPES.has(rawType)
      ? (rawType as DisclosureType | 'all')
      : 'all'
    const pageNo = Math.max(1, Math.floor(Number(searchParams.get('page_no') || '1')) || 1)
    const pageCount = Math.min(
      100,
      Math.max(1, Math.floor(Number(searchParams.get('page_count') || '100')) || 100)
    )

    const result = await getDisclosuresByCorpCode({
      corpCode,
      period,
      type,
      pageNo,
      pageCount,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching company disclosures:', error)
    return NextResponse.json({ error: 'Failed to fetch company disclosures' }, { status: 500 })
  }
}
