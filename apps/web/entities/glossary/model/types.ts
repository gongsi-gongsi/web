/** 용어 난이도 */
export type GlossaryDifficulty = 'beginner' | 'intermediate' | 'advanced'

/** 용어 카테고리 */
export type GlossaryCategory =
  | 'financial-statements'
  | 'disclosure'
  | 'investment-indicators'
  | 'trading'
  | 'bonds'

/** 카테고리 라벨 매핑 */
export const GLOSSARY_CATEGORY_LABEL: Record<GlossaryCategory, string> = {
  'financial-statements': '재무제표',
  disclosure: '공시/기업',
  'investment-indicators': '투자지표',
  trading: '거래/시장',
  bonds: '채권/금리',
}

/** 난이도 라벨 매핑 */
export const GLOSSARY_DIFFICULTY_LABEL: Record<GlossaryDifficulty, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}

/** 투자 용어 타입 */
export interface GlossaryTerm {
  /** 고유 식별자 (kebab-case) */
  id: string
  /** 한글 용어명 */
  term: string
  /** 영문 용어명 */
  termEn: string
  /** 간단한 한줄 설명 */
  summary: string
  /** 상세 설명 */
  description: string
  /** 쉬운 예시/비유 */
  example: string
  /** 카테고리 */
  category: GlossaryCategory
  /** 난이도 */
  difficulty: GlossaryDifficulty
  /** 관련 용어 ID 목록 */
  relatedTermIds: string[]
}
