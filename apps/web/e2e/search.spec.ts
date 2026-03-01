import { test, expect } from '@playwright/test'

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

test.describe('기업 검색', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/stocks/suggest**', route => {
      route.fulfill({ json: { items: MOCK_SEARCH_RESULTS } })
    })
  })

  test('검색 페이지가 로드된다', async ({ page }) => {
    await page.goto('/search')
    await expect(page.getByPlaceholder(/회사명/)).toBeVisible()
  })

  test('검색어를 입력하면 자동완성 결과가 표시된다', async ({ page }) => {
    await page.goto('/search')

    await page.getByPlaceholder(/회사명/).fill('삼성')

    await expect(page.getByText('삼성전자')).toBeVisible()
  })

  test('검색 결과 클릭 시 기업 상세 페이지로 이동한다', async ({ page }) => {
    await page.goto('/search')

    await page.getByPlaceholder(/회사명/).fill('삼성')
    await page.getByText('삼성전자').first().click()

    await expect(page).toHaveURL(/\/companies\/00126380/)
  })
})
