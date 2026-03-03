import { test, expect, type Page } from '@playwright/test'

// 종목 검색 API 모킹
const MOCK_SEARCH_RESULTS = [
  {
    corpCode: '00126380',
    corpName: '삼성전자',
    stockCode: '005930',
    market: 'Y',
  },
  {
    corpCode: '00164779',
    corpName: '삼성전자우',
    stockCode: '005935',
    market: 'Y',
  },
]

// 뷰포트에 따라 보이는 검색 input이 다름:
// - 모바일 (MobileHeader, md:hidden): placeholder='회사명 검색'
// - 데스크톱 (hidden md:block): placeholder='기업명으로 검색해보세요'
// 두 경우 모두 placeholder에 '검색'을 포함하므로 :visible 셀렉터로 통일
const searchInput = (page: Page) => page.locator('input:visible[placeholder*="검색"]')

test.describe('기업 검색', () => {
  test.beforeEach(async ({ page }) => {
    // suggestCompanies()는 { suggestions: [...] } 형식을 기대함 (items 아님)
    await page.route('**/api/stocks/suggest**', route => {
      route.fulfill({ json: { suggestions: MOCK_SEARCH_RESULTS } })
    })
  })

  test('검색 페이지가 로드된다', async ({ page }) => {
    await page.goto('/search')
    await expect(searchInput(page)).toBeVisible()
  })

  test('검색어를 입력하면 자동완성 결과가 표시된다', async ({ page }) => {
    await page.goto('/search')

    await searchInput(page).fill('삼성')

    // '삼성전자우'도 '삼성전자'를 포함하므로 exact: true로 정확히 매칭
    await expect(page.getByRole('link', { name: '삼성전자', exact: true })).toBeVisible()
  })

  test('검색 결과에 기업 상세 페이지 링크가 표시된다', async ({ page }) => {
    await page.goto('/search')

    await searchInput(page).fill('삼성')

    // href 속성으로 링크 목적지를 확인 (Next.js App Router SSR 타이밍에 무관)
    const companyLink = page.getByRole('link', { name: '삼성전자', exact: true })
    await expect(companyLink).toBeVisible()
    await expect(companyLink).toHaveAttribute('href', '/companies/00126380')
  })
})
