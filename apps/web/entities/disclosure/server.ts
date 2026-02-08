// 서버 전용 exports
// 이 파일은 서버 컴포넌트와 Route Handler에서만 import해야 합니다

// 서버 전용 API 함수
export {
  getTodayDisclosuresFromDart,
  getTodayDisclosuresFromDartPaginated,
} from './api/today-disclosures/server'
export { searchDisclosuresFromDart } from './api/search-disclosures/server'
export { getPopularCompaniesFromDB } from './api/popular-companies/server'
export { suggestCompaniesFromDart } from './api/suggest-companies/server'

// 서버 컴포넌트용 prefetch 함수
export { prefetchTodayDisclosures, prefetchPopularCompanies } from './queries/prefetch'

// 유틸리티 함수
export { formatDisclosure } from './lib/format-disclosure'

// 타입 정의
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
