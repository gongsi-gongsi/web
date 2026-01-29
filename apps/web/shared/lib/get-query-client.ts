import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

/**
 * 서버 컴포넌트에서 사용할 QueryClient 싱글톤을 생성합니다
 * @returns 요청 스코프 내에서 캐싱된 QueryClient 인스턴스
 * @remarks React cache API를 사용하여 요청당 하나의 인스턴스만 생성하여 메모리 누수를 방지합니다
 */
export const getQueryClient = cache(() => new QueryClient())
