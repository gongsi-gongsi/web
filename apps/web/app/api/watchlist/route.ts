export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma'
import { getCompanyInfo } from '@/entities/company/api/company-info/server'

const CORP_CODE_REGEX = /^[0-9]{8}$/

/**
 * 현재 로그인한 사용자의 관심 종목 목록을 조회합니다
 * @returns 관심 종목 목록 (Stock 정보 포함)
 */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const watchlistItems = await prisma.watchlist.findMany({
      where: { userId: user.id },
      include: {
        stock: {
          select: {
            corpCode: true,
            corpName: true,
            stockCode: true,
            market: true,
            sector: true,
          },
        },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    })

    const items = watchlistItems.map(item => ({
      id: item.id,
      corpCode: item.stock.corpCode,
      corpName: item.stock.corpName,
      stockCode: item.stock.stockCode,
      market: item.stock.market,
      sector: item.stock.sector,
      createdAt: item.createdAt,
    }))

    return NextResponse.json({ items })
  } catch (error) {
    console.error(
      'Failed to fetch watchlist:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 })
  }
}

/**
 * 관심 종목을 추가합니다
 * @param request - Body: { corpCode: string }
 * @returns 생성된 watchlist item
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { corpCode?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { corpCode } = body
  if (!corpCode || !CORP_CODE_REGEX.test(corpCode)) {
    return NextResponse.json(
      { error: 'Invalid corpCode. Must be exactly 8 numeric digits.' },
      { status: 400 }
    )
  }

  try {
    // Stock 테이블에서 corpCode로 조회. 없으면 DART API에서 기업 정보를 가져와 upsert
    let stock = await prisma.stock.findUnique({ where: { corpCode } })

    if (!stock) {
      let companyInfo
      try {
        companyInfo = await getCompanyInfo(corpCode)
      } catch (dartError) {
        console.error(
          'DART API error for corp:',
          corpCode,
          dartError instanceof Error ? dartError.message : 'Unknown error'
        )
        return NextResponse.json(
          { error: 'Failed to fetch company info from DART' },
          { status: 502 }
        )
      }

      if (!companyInfo) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 })
      }

      if (!companyInfo.stockCode) {
        return NextResponse.json(
          { error: 'Company is not listed on the stock market' },
          { status: 422 }
        )
      }

      // upsert으로 race condition 방지
      stock = await prisma.stock.upsert({
        where: { corpCode },
        update: {},
        create: {
          corpCode: companyInfo.corpCode,
          corpName: companyInfo.corpName,
          stockCode: companyInfo.stockCode,
          market: companyInfo.corpCls ?? null,
        },
      })
    }

    // Watchlist에 추가
    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: user.id,
        stockId: stock.id,
      },
      include: {
        stock: {
          select: {
            corpCode: true,
            corpName: true,
            stockCode: true,
            market: true,
            sector: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        id: watchlistItem.id,
        corpCode: watchlistItem.stock.corpCode,
        corpName: watchlistItem.stock.corpName,
        stockCode: watchlistItem.stock.stockCode,
        market: watchlistItem.stock.market,
        sector: watchlistItem.stock.sector,
        createdAt: watchlistItem.createdAt,
      },
      { status: 201 }
    )
  } catch (error) {
    // Unique constraint violation → 이미 관심 종목에 등록됨
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Already in watchlist' }, { status: 409 })
    }

    console.error(
      'Failed to add watchlist:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json({ error: 'Failed to add watchlist' }, { status: 500 })
  }
}

/**
 * 관심 종목을 삭제합니다
 * @param request - Body: { corpCode: string }
 * @returns 성공 여부
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { corpCode?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { corpCode } = body
  if (!corpCode || !CORP_CODE_REGEX.test(corpCode)) {
    return NextResponse.json(
      { error: 'Invalid corpCode. Must be exactly 8 numeric digits.' },
      { status: 400 }
    )
  }

  try {
    const stock = await prisma.stock.findUnique({ where: { corpCode } })

    if (!stock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }

    await prisma.watchlist.delete({
      where: {
        userId_stockId: {
          userId: user.id,
          stockId: stock.id,
        },
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    // Record not found
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Watchlist item not found' }, { status: 404 })
    }

    console.error(
      'Failed to delete watchlist:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json({ error: 'Failed to delete watchlist' }, { status: 500 })
  }
}
