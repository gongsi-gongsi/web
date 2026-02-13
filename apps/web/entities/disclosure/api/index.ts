// 클라이언트 전용 API (클라이언트 컴포넌트에서 안전하게 import 가능)
export { getTodayDisclosures, getTodayDisclosuresPaginated } from './today-disclosures/client'
export { searchDisclosures, getDisclosuresByCorpCodeClient } from './search-disclosures/client'
export { suggestCompanies, type CompanySuggestion } from './suggest-companies/client'
export { getPopularCompanies } from './popular-companies/client'

// 주의: 서버 전용 API는 직접 import하지 말고, '@/entities/disclosure/server'를 사용하세요
