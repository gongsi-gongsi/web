import { createQueryKeyStore } from '@lukemorales/query-key-factory'
import type {
  Market,
  SearchDisclosuresParams,
  SearchPeriod,
  DisclosureType,
} from '@/entities/disclosure'
import type { FinancialViewMode } from '@/entities/company'

/**
 * TanStack Query의 쿼리 키를 중앙에서 관리하는 스토어입니다
 * @remarks 타입 안전성과 일관성을 보장하며, 쿼리 키 변경 시 한 곳만 수정하면 됩니다
 */
export const queries = createQueryKeyStore({
  disclosures: {
    today: (market: Market) => [market],
    todayInfinite: (market: Market) => [market],
    search: (params: Omit<SearchDisclosuresParams, 'pageNo' | 'pageCount'>) => [params],
    byCorpCode: (
      corpCode: string,
      params: { period: SearchPeriod; type: DisclosureType | 'all' }
    ) => [corpCode, params],
  },
  stocks: {
    suggest: (query: string) => [query],
    popular: (limit: number) => [limit],
  },
  company: {
    info: (corpCode: string) => [corpCode],
  },
  financial: {
    statements: (corpCode: string, mode: FinancialViewMode) => [corpCode, mode],
  },
  news: {
    company: (corpName: string) => [corpName],
    market: null,
  },
  ai: {
    companySummary: (corpCode: string) => [corpCode],
    disclosureSummaryIds: null,
  },
  watchlist: {
    all: null,
    check: (corpCode: string) => [corpCode],
  },
  banners: {
    active: null,
  },
  notices: {
    list: (params: { page?: number; category?: string; limit?: number }) => [params],
    detail: (id: string) => [id],
  },
})
