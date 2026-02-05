// 클라이언트용 exports (클라이언트 컴포넌트에서 안전하게 import 가능)

// TanStack Query Hooks
export {
  useTodayDisclosures,
  useInfiniteTodayDisclosures,
  useSearchDisclosures,
  usePopularCompanies,
  useSuggestCompanies,
} from './queries/hooks'

// 클라이언트 전용 API 함수
export {
  getTodayDisclosures,
  getTodayDisclosuresPaginated,
  searchDisclosures,
  getPopularCompanies,
  suggestCompanies,
  type CompanySuggestion,
} from './api'

// 유틸리티 함수 (서버/클라이언트 공통)
export { getDisclosureTypeColor } from './lib/get-disclosure-type-color'
export { getDisclosureTypeLabel } from './lib/get-disclosure-type-label'
export { getMarketBadge } from './lib/get-market-badge'
export { deduplicateDisclosures } from './lib/deduplicate-disclosures'

// 타입 정의 (서버/클라이언트 공통)
export type {
  Disclosure,
  Market,
  DisclosureType,
  TodayDisclosuresResponse,
  PaginatedDisclosuresResponse,
  DartApiResponse,
  DartDisclosureItem,
  SearchPeriod,
  SearchDisclosuresParams,
  SearchDisclosuresResponse,
  PopularCompany,
  PopularCompaniesResponse,
} from './model/types'

// 주의: 서버 전용 함수는 '@/entities/disclosure/server'에서 import하세요
// import { getTodayDisclosuresFromDart } from '@/entities/disclosure/server'
