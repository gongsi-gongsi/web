import { createQueryKeyStore } from '@lukemorales/query-key-factory'
import type { Market } from '@/entities/disclosure'

/**
 * TanStack Query의 쿼리 키를 중앙에서 관리하는 스토어입니다
 * @remarks 타입 안전성과 일관성을 보장하며, 쿼리 키 변경 시 한 곳만 수정하면 됩니다
 */
export const queries = createQueryKeyStore({
  disclosures: {
    today: (market: Market) => [market],
  },
})
