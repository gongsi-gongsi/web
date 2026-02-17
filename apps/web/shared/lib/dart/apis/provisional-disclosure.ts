import { fetchJson } from '../client'
import type { DartDisclosureItem } from '@/entities/disclosure/model/types'

interface DartListResponse {
  status: string
  message: string
  total_count: number
  list?: DartDisclosureItem[]
}

/**
 * DART API에서 기업의 잠정실적 공시를 검색합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @param year - 조회할 사업연도
 * @returns 잠정실적 공시 목록 (최신순)
 */
export async function searchProvisionalDisclosures(
  corpCode: string,
  year: number
): Promise<DartDisclosureItem[]> {
  const response = await fetchJson<DartListResponse>('list.json', {
    corp_code: corpCode,
    bgn_de: `${year}0101`,
    end_de: `${year + 1}0401`,
    page_count: '100',
    sort: 'date',
    sort_mth: 'desc',
  })

  if (response.status !== '000' || !response.list) {
    return []
  }

  return response.list.filter(item => item.report_nm.includes('잠정'))
}
