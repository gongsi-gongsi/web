'use server'

import {
  prisma,
  getPrismaErrorMessage,
  isPrismaError,
  PRISMA_ERROR_CODES,
} from '@/shared/lib/prisma'
import type { CreateStockInput, Stock } from '../types'

type ActionResult<T> = { success: true; data: T } | { success: false; error: string; code?: string }

export async function createStock(input: CreateStockInput): Promise<ActionResult<Stock>> {
  try {
    const stock = await prisma.stock.create({
      data: input,
    })

    return { success: true, data: stock }
  } catch (error) {
    if (isPrismaError(error) && error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT) {
      return {
        success: false,
        error: '이미 등록된 종목 코드입니다.',
        code: 'DUPLICATE_SYMBOL',
      }
    }
    return {
      success: false,
      error: getPrismaErrorMessage(error),
    }
  }
}

export async function createStocksBatch(
  inputs: CreateStockInput[]
): Promise<ActionResult<{ count: number }>> {
  try {
    const result = await prisma.$transaction(async tx => {
      let count = 0

      for (const input of inputs) {
        await tx.stock.upsert({
          where: { symbol: input.symbol },
          update: {
            name: input.name,
            market: input.market,
            sector: input.sector,
          },
          create: input,
        })
        count++
      }

      return { count }
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('[createStocksBatch] Error:', error)
    return {
      success: false,
      error: getPrismaErrorMessage(error),
    }
  }
}

export async function deleteStock(symbol: string): Promise<ActionResult<void>> {
  try {
    await prisma.stock.update({
      where: { symbol },
      data: { isActive: false },
    })

    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: getPrismaErrorMessage(error),
    }
  }
}
