import { unstable_cache } from 'next/cache'
import { getCompanyInfo } from '@/entities/company/api/company-info/server'
import { getQuarterlyFinancials } from '@/entities/company/api/financials/server'
import { getGoogleNews } from '@/entities/news/api/google-news/server'
import { generateContent } from '@/shared/lib/gemini'
import { buildCompanySummaryPrompt } from '../lib/build-prompt'
import type { AiCompanySummary } from '../model/types'

/**
 * [서버 전용] AI 기업 요약을 생성합니다
 * 재무 데이터 + 뉴스 제목을 조합하여 Gemini Flash로 분석합니다
 * unstable_cache로 corpCode별 24시간 서버 캐싱 (모든 사용자 동일 결과)
 * @param corpCode - 기업 고유번호 (8자리)
 * @returns AI 기업 요약
 * @throws {Error} 기업 정보 조회 실패 또는 Gemini 호출 실패 시
 */
async function _generateCompanySummary(corpCode: string): Promise<AiCompanySummary> {
  // 1. 기업 정보 조회 (뉴스 검색에 기업명 필요)
  const companyInfo = await getCompanyInfo(corpCode)
  if (!companyInfo) {
    throw new Error(`기업 정보를 찾을 수 없습니다: ${corpCode}`)
  }

  // 2. 재무 데이터 + 뉴스를 기업명으로 병렬 조회
  const [financials, newsResponse] = await Promise.all([
    getQuarterlyFinancials(corpCode).catch(() => null),
    getGoogleNews(`${companyInfo.corpName} 주식`, 30).catch(() => null),
  ])

  const newsTitles = newsResponse?.items.map(item => item.title) ?? []

  // 3. 프롬프트 빌드
  const financialData = financials?.data ?? []
  const prompt = buildCompanySummaryPrompt(companyInfo.corpName, financialData, newsTitles)

  // 4. Gemini 호출
  const rawResponse = await generateContent(prompt)

  // 5. JSON 파싱 (마크다운 코드블록 또는 순수 JSON 모두 처리)
  const codeBlockMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonStr = codeBlockMatch ? codeBlockMatch[1].trim() : rawResponse.match(/\{[\s\S]*\}/)?.[0]
  if (!jsonStr) {
    throw new Error('Gemini 응답에서 JSON을 추출할 수 없습니다')
  }

  const parsed = JSON.parse(jsonStr) as { summary: string }

  if (!parsed.summary) {
    throw new Error('Gemini 응답에 summary 필드가 누락되었습니다')
  }

  return {
    summary: parsed.summary,
    generatedAt: new Date().toISOString(),
  }
}

export const generateCompanySummary = unstable_cache(
  _generateCompanySummary,
  ['ai-company-summary'],
  { revalidate: 86400 }
)
