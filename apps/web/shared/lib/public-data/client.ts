import type { PublicDataResponse } from './types'

const BASE_URL = 'https://apis.data.go.kr/1160100/service'

function getApiKey(): string {
  const apiKey = process.env.PUBLIC_DATA_API_KEY
  if (!apiKey) {
    throw new Error('PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.')
  }
  return apiKey
}

export async function fetchPublicData<T>(
  endpoint: string,
  params: Record<string, string | number | undefined>
): Promise<PublicDataResponse<T>> {
  const apiKey = getApiKey()

  // serviceKey는 이미 인코딩된 상태로 저장되어 있으므로 직접 사용
  const searchParams = new URLSearchParams({
    resultType: 'json',
  })

  // undefined가 아닌 파라미터만 추가
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value))
    }
  })

  // serviceKey는 인코딩하지 않고 직접 추가 (이미 URL 인코딩된 키 사용)
  const url = `${BASE_URL}${endpoint}?serviceKey=${apiKey}&${searchParams.toString()}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`공공데이터 API 요청 실패: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  // API 에러 응답 처리
  if (data.response?.header?.resultCode !== '00') {
    throw new Error(`공공데이터 API 에러: ${data.response?.header?.resultMsg ?? '알 수 없는 에러'}`)
  }

  return data
}

// 응답에서 아이템 배열 추출 (단일 객체도 배열로 변환)
export function extractItems<T>(response: PublicDataResponse<T>): T[] {
  const items = response.response.body.items?.item
  if (!items) return []
  return Array.isArray(items) ? items : [items]
}

// 페이지네이션 헬퍼 - 전체 데이터 조회
export async function fetchAllPages<T>(
  endpoint: string,
  params: Record<string, string | number | undefined>,
  options?: { maxPages?: number; rowsPerPage?: number }
): Promise<T[]> {
  const { maxPages = 100, rowsPerPage = 1000 } = options ?? {}
  const allItems: T[] = []
  let pageNo = 1
  let hasMore = true

  while (hasMore && pageNo <= maxPages) {
    const response = await fetchPublicData<T>(endpoint, {
      ...params,
      pageNo,
      numOfRows: rowsPerPage,
    })

    const items = extractItems(response)
    allItems.push(...items)

    const { totalCount, numOfRows } = response.response.body
    hasMore = pageNo * numOfRows < totalCount
    pageNo++

    // Rate limiting - 요청 간 딜레이
    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return allItems
}
