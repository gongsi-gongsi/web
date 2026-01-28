/**
 * DART Open API 클라이언트
 * @see https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS001&apiId=2019018
 */

const DART_API_BASE_URL = 'https://opendart.fss.or.kr/api'

/**
 * DART API 요청 헬퍼
 */
async function dartFetch(endpoint: string, params: Record<string, string> = {}) {
  const apiKey = process.env.DART_API_KEY

  if (!apiKey) {
    throw new Error('DART_API_KEY가 설정되지 않았습니다.')
  }

  const url = new URL(`${DART_API_BASE_URL}/${endpoint}`)
  url.searchParams.append('crtfc_key', apiKey)

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  const response = await fetch(url.toString(), {
    headers: {
      Accept: '*/*',
    },
  })

  if (!response.ok) {
    throw new Error(`DART API 요청 실패: ${response.status} ${response.statusText}`)
  }

  return response
}

/**
 * ZIP 파일을 Buffer로 다운로드
 */
export async function downloadZipFile(endpoint: string): Promise<Buffer> {
  const response = await dartFetch(endpoint)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * JSON 응답 가져오기
 */
export async function fetchJson<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const response = await dartFetch(endpoint, params)
  return response.json()
}
