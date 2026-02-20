import { NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/prisma'

/**
 * AI 요약이 완료된 공시의 rceptNo 목록을 반환합니다
 * 공시 목록에서 "AI 요약 완료" 뱃지 표시에 사용됩니다
 */
export async function GET() {
  try {
    const disclosures = await prisma.disclosure.findMany({
      where: { aiAnalyzedAt: { not: null } },
      select: { rceptNo: true },
    })

    const rceptNos = disclosures.map(d => d.rceptNo)
    return NextResponse.json({ rceptNos })
  } catch (error) {
    console.error('Failed to fetch summarized disclosure IDs:', error)
    return NextResponse.json({ rceptNos: [] })
  }
}
