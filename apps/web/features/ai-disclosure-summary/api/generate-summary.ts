import { Prisma } from '@prisma/client'
import { prisma } from '@/shared/lib/prisma'
import { downloadDocument } from '@/shared/lib/dart'
import { generateContent } from '@/shared/lib/gemini'
import { extractDocumentText } from '../lib/extract-document-text'
import { buildDisclosureSummaryPrompt } from '../lib/build-prompt'
import type {
  AiDisclosureSummaryRequest,
  AiDisclosureSummaryResponse,
  GeminiSummaryResult,
  KeyFigure,
} from '../model/types'

/**
 * AI 공시 요약을 생성하거나, 이미 존재하면 기존 요약을 반환합니다
 * 요약은 공시(Disclosure) 단위로 공통 관리됩니다
 * @param rceptNo - 접수번호
 * @param body - 공시 메타데이터 (Stock/Disclosure upsert에 사용)
 * @returns AI 공시 요약 응답
 */
export async function generateDisclosureSummary(
  rceptNo: string,
  body: AiDisclosureSummaryRequest
): Promise<AiDisclosureSummaryResponse> {
  // 1. 기존 요약 존재 확인
  const existing = await findExistingSummary(rceptNo)
  if (existing) return existing

  // 2. Stock + Disclosure upsert
  const disclosureId = await upsertStockAndDisclosure(rceptNo, body)

  // 3. DART ZIP 다운로드 + 텍스트 추출
  const zipBuffer = await downloadDocument(rceptNo)
  const documentText = extractDocumentText(zipBuffer)

  // 4. Gemini 프롬프트 빌드 + 호출
  const prompt = buildDisclosureSummaryPrompt(
    body.corpName,
    body.reportName,
    body.disclosureType,
    documentText
  )
  const rawResponse = await generateContent(prompt)

  // 5. JSON 파싱
  const parsed = parseGeminiResponse(rawResponse)

  // 6. Disclosure AI 필드 업데이트
  try {
    const updated = await prisma.disclosure.update({
      where: { id: disclosureId },
      data: {
        aiSummary: parsed.summary,
        aiSentiment: parsed.sentiment,
        aiKeyFigures: parsed.keyFigures as unknown as Prisma.InputJsonValue,
        aiAnalyzedAt: new Date(),
      },
    })

    return {
      summary: updated.aiSummary!,
      sentiment: updated.aiSentiment as AiDisclosureSummaryResponse['sentiment'],
      keyFigures: parsed.keyFigures,
      analysis: updated.aiAnalysis,
      createdAt: updated.aiAnalyzedAt!.toISOString(),
    }
  } catch (error) {
    // race condition: 다른 요청이 먼저 업데이트한 경우
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      const fallback = await findExistingSummary(rceptNo)
      if (fallback) return fallback
    }
    throw error
  }
}

/**
 * 기존 공시 요약을 조회합니다
 */
async function findExistingSummary(rceptNo: string): Promise<AiDisclosureSummaryResponse | null> {
  const disclosure = await prisma.disclosure.findUnique({
    where: { rceptNo },
    select: {
      aiSummary: true,
      aiSentiment: true,
      aiKeyFigures: true,
      aiAnalysis: true,
      aiAnalyzedAt: true,
    },
  })

  if (!disclosure?.aiAnalyzedAt || !disclosure.aiSummary) return null

  return {
    summary: disclosure.aiSummary,
    sentiment: (disclosure.aiSentiment as AiDisclosureSummaryResponse['sentiment']) ?? 'neutral',
    keyFigures: validateKeyFigures(disclosure.aiKeyFigures),
    analysis: disclosure.aiAnalysis,
    createdAt: disclosure.aiAnalyzedAt.toISOString(),
  }
}

/**
 * Stock과 Disclosure를 upsert하고 disclosureId를 반환합니다
 */
async function upsertStockAndDisclosure(
  rceptNo: string,
  body: AiDisclosureSummaryRequest
): Promise<string> {
  // 날짜 유효성 검사
  const rceptDt = new Date(body.receivedAt)
  if (isNaN(rceptDt.getTime())) {
    throw new Error('유효하지 않은 날짜 형식입니다')
  }

  const stock = await prisma.stock.upsert({
    where: { corpCode: body.corpCode },
    create: {
      stockCode: body.stockCode,
      corpCode: body.corpCode,
      corpName: body.corpName,
      market: body.market,
    },
    update: {},
  })

  const disclosure = await prisma.disclosure.upsert({
    where: { rceptNo },
    create: {
      stockId: stock.id,
      rceptNo,
      reportNm: body.reportName,
      dcmType: body.disclosureType,
      rceptDt,
      dartUrl: body.dartUrl,
    },
    update: {},
  })

  return disclosure.id
}

/**
 * Gemini 응답에서 JSON을 파싱합니다
 * @param rawResponse - Gemini API 원시 응답
 * @returns 파싱된 요약 결과
 * @throws {Error} JSON 파싱 실패 시
 */
function parseGeminiResponse(rawResponse: string): GeminiSummaryResult {
  // 마크다운 코드블록 또는 순수 JSON 모두 처리
  const codeBlockMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonStr = codeBlockMatch ? codeBlockMatch[1].trim() : rawResponse.match(/\{[\s\S]*\}/)?.[0]

  if (!jsonStr) {
    throw new Error('Gemini 응답에서 JSON을 추출할 수 없습니다')
  }

  const parsed = JSON.parse(jsonStr) as GeminiSummaryResult

  if (!parsed.summary || !parsed.sentiment) {
    throw new Error('Gemini 응답에 필수 필드가 누락되었습니다')
  }

  // sentiment 값 검증
  const validSentiments = ['positive', 'negative', 'neutral']
  if (!validSentiments.includes(parsed.sentiment)) {
    parsed.sentiment = 'neutral'
  }

  return {
    summary: parsed.summary,
    sentiment: parsed.sentiment,
    sentimentReason: parsed.sentimentReason || '',
    keyFigures: validateKeyFigures(parsed.keyFigures),
  }
}

/**
 * keyFigures 배열을 검증합니다
 * @param raw - 검증할 데이터
 * @returns 유효한 KeyFigure 배열 (최대 5개)
 */
function validateKeyFigures(raw: unknown): KeyFigure[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (item): item is KeyFigure =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as KeyFigure).label === 'string' &&
        typeof (item as KeyFigure).value === 'string'
    )
    .slice(0, 5)
}
