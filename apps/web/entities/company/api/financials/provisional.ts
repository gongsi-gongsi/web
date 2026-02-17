import { downloadDocument, searchProvisionalDisclosures } from '@/shared/lib/dart'

import { parseProvisionalDisclosure } from '../../lib/parse-provisional'
import type { FinancialData, Quarter } from '../../model/types'

/**
 * 특정 기업의 잠정실적을 조회합니다
 * DART list.json에서 잠정실적 공시를 찾고, document.xml로 문서를 다운로드하여 파싱합니다
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

  for (const disclosure of disclosures) {
    try {
      const zipBuffer = await downloadDocument(disclosure.rcept_no)
      const result = parseProvisionalDisclosure(zipBuffer)

      if (!result) continue
      if (targetQuarter && result.quarter !== targetQuarter) continue

      return result
    } catch (error) {
      console.error(
        `잠정실적 파싱 실패 (rcept_no: ${disclosure.rcept_no}):`,
        error instanceof Error ? error.message : error
      )
      continue
    }
  }

  return null
}
