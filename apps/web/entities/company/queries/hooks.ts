'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { queries } from '@/shared/lib/query-keys'
import { getFinancials } from '../api/financials/client'
import { getCompanyInfo } from '../api/company-info/client'
import type { FinancialViewMode } from '../model/types'

/**
 * [클라이언트 전용] 재무제표를 조회합니다
 * 서버에서 prefetch된 데이터가 있으면 즉시 반환되고, 없으면 클라이언트에서 fetch합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @param mode - 조회 모드 (yearly | quarterly)
 * @returns Suspense 기반 쿼리 결과
 * @example
 * ```tsx
 * function FinancialTable({ corpCode }: { corpCode: string }) {
 *   const { data } = useFinancials(corpCode, 'yearly')
 *   return <div>{data.data.map(...)}</div>
 * }
 * ```
 */
export function useFinancials(corpCode: string, mode: FinancialViewMode = 'yearly') {
  return useSuspenseQuery({
    queryKey: queries.financial.statements(corpCode, mode).queryKey,
    queryFn: () => getFinancials(corpCode, mode),
    staleTime: 24 * 60 * 60 * 1000, // 1일 (재무데이터는 자주 변경되지 않음)
  })
}

/**
 * [클라이언트 전용] 기업 정보를 조회합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @returns Suspense 기반 쿼리 결과
 * @example
 * ```tsx
 * function CompanyHeader({ corpCode }: { corpCode: string }) {
 *   const { data } = useCompanyInfo(corpCode)
 *   return <h1>{data?.corpName}</h1>
 * }
 * ```
 */
export function useCompanyInfo(corpCode: string) {
  return useSuspenseQuery({
    queryKey: queries.company.info(corpCode).queryKey,
    queryFn: () => getCompanyInfo(corpCode),
    staleTime: 24 * 60 * 60 * 1000, // 1일 (서버에서 7일 캐시하므로 클라이언트는 짧게)
  })
}
