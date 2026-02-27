/**
 * 어드민 TanStack Query의 쿼리 키를 중앙에서 관리합니다
 */
export const adminQueryKeys = {
  banners: {
    all: ['banners'] as const,
    detail: (id: string) => ['banners', id] as const,
  },
  notices: {
    all: ['notices'] as const,
    list: (params: object) => ['notices', 'list', params] as const,
    detail: (id: string) => ['notices', id] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params: object) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', id] as const,
    watchlist: (id: string) => ['users', id, 'watchlist'] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
}
