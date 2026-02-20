const SITE_URL = 'https://gongsi-gongsi.kr'

interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * JSON-LD 구조화 데이터를 script 태그로 삽입하는 컴포넌트
 * @param data - JSON-LD 데이터 객체
 */
function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

/**
 * 사이트 전역 Organization JSON-LD
 */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '공시공시',
        url: SITE_URL,
        description: 'AI 기반 기업 공시 분석 서비스',
      }}
    />
  )
}

/**
 * 사이트 전역 WebSite + SearchAction JSON-LD
 */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: '공시공시',
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  )
}

interface CompanyJsonLdProps {
  corpName: string
  stockCode?: string
  description?: string
}

/**
 * 기업 상세 페이지용 Organization JSON-LD
 * @param corpName - 기업명
 * @param stockCode - 종목코드
 * @param description - 기업 설명
 */
export function CompanyJsonLd({ corpName, stockCode, description }: CompanyJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: corpName,
        ...(stockCode && { tickerSymbol: stockCode }),
        ...(description && { description }),
      }}
    />
  )
}
