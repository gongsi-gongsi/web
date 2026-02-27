import { QueryClient, isServer } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

/**
 * QueryClient 인스턴스를 반환합니다
 * 서버에서는 매번 새 인스턴스, 브라우저에서는 싱글톤
 * @returns QueryClient 인스턴스
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}
