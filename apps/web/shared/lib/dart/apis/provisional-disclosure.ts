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
 * 연결재무제표 기준 공시만 필터링하며, 기재정정이 있으면 원본 대신 정정본을 반환합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @param year - 조회할 사업연도
 * @returns 잠정실적 공시 목록 (최신순, 분기별 최신 1건)
 */
export async function searchProvisionalDisclosures(
  corpCode: string,
  year: number
): Promise<DartDisclosureItem[]> {
  const response = await fetchJson<DartListResponse>('list.json', {
    corp_code: corpCode,
    bgn_de: `${year}0101`,
    end_de: `${year + 1}0401`,
    pblntf_ty: 'I', // 거래소공시 (잠정실적은 공정공시로 분류)
    page_count: '100',
    sort: 'date',
    sort_mth: 'desc',
  })

  if (response.status !== '000' || !response.list) {
    return []
  }

  // 연결재무제표 기준 잠정실적만 필터링 (자회사 공시 제외)
  const provisional = response.list.filter(
    item =>
      item.report_nm.includes('잠정') &&
      item.report_nm.includes('연결재무제표') &&
      !item.report_nm.includes('자회사')
  )

  // 같은 날짜에 기재정정과 원본이 있으면 기재정정을 우선
  const seen = new Set<string>()
  return provisional.filter(item => {
    const dateKey = item.rcept_dt
    if (seen.has(dateKey)) return false
    seen.add(dateKey)
    return true
  })
}
