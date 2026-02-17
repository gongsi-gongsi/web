import { downloadDocument, searchProvisionalDisclosures } from '@/shared/lib/dart'

import { parseProvisionalDisclosure } from '../../lib/parse-provisional'
import type { FinancialData, Quarter } from '../../model/types'

/**
 * FinancialData의 채워진 필드 수를 반환합니다
 * @param data - 재무 데이터
 * @returns 유효한(non-null) 재무 필드 수
 */
function countFilledFields(data: FinancialData): number {
  const fields = [
    data.revenue,
    data.operatingProfit,
    data.netIncome,
    data.totalAssets,
    data.totalLiabilities,
    data.totalEquity,
  ]
  return fields.filter(v => v !== null).length
}

/**
 * 특정 기업의 잠정실적을 조회합니다
 * DART list.json에서 잠정실적 공시를 찾고, document.xml로 문서를 다운로드하여 파싱합니다
 * 같은 분기에 여러 공시가 있으면 가장 데이터가 완전한 것을 선택합니다
 * @param corpCode - 기업 고유번호
 * @param year - 사업연도
 * @param targetQuarter - 조회할 분기 (지정 시 해당 분기만 반환)
 * @returns 잠정실적 FinancialData 또는 null
 */
export async function getProvisionalFinancial(
  corpCode: string,
  year: number,
  targetQuarter?: Quarter
): Promise<FinancialData | null> {
  const disclosures = await searchProvisionalDisclosures(corpCode, year)
  if (disclosures.length === 0) return null

  let bestResult: FinancialData | null = null
  let bestFieldCount = 0

  for (const disclosure of disclosures) {
    try {
      const zipBuffer = await downloadDocument(disclosure.rcept_no)
      const result = parseProvisionalDisclosure(zipBuffer)

      if (!result) continue
      if (targetQuarter && result.quarter !== targetQuarter) continue

      const fieldCount = countFilledFields(result)

      if (fieldCount > bestFieldCount) {
        bestResult = result
        bestFieldCount = fieldCount
      }

      // 모든 주요 필드(매출, 영업이익, 순이익)가 있으면 즉시 반환
      if (result.revenue !== null && result.operatingProfit !== null && result.netIncome !== null) {
        return result
      }
    } catch (error) {
      console.error(
        `잠정실적 파싱 실패 (rcept_no: ${disclosure.rcept_no}):`,
        error instanceof Error ? error.message : error
      )
      continue
    }
  }

  return bestResult
}
