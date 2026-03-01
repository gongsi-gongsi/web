import { test, expect } from '@playwright/test'

// 용어집은 정적 데이터 기반이라 API 모킹 없이 테스트 가능합니다

test.describe('용어집 - 공통', () => {
  test('페이지가 로드되고 용어 목록이 표시된다', async ({ page }) => {
    await page.goto('/glossary')

    await expect(page.getByRole('heading', { name: '투자 용어집' })).toBeVisible()
    // 정적 데이터이므로 용어가 즉시 렌더링됨
    await expect(page.getByText('PER')).toBeVisible()
  })

  test('검색으로 용어를 필터링할 수 있다', async ({ page }) => {
    await page.goto('/glossary')

    await page.getByPlaceholder(/용어를 검색하세요/).fill('PER')

    // PER은 표시되고 관련 없는 용어는 숨겨짐
    await expect(page.getByText('검색 결과')).toBeVisible()
  })

  test('카테고리 필터가 동작한다', async ({ page }) => {
    await page.goto('/glossary')

    await page.getByRole('button', { name: '재무제표' }).click()

    await expect(page.getByText('검색 결과')).toBeVisible()
  })

  test('검색어 초기화(X) 버튼이 동작한다', async ({ page }) => {
    await page.goto('/glossary')

    const searchInput = page.getByPlaceholder(/용어를 검색하세요/)
    await searchInput.fill('PER')
    await expect(page.getByText('검색 결과')).toBeVisible()

    // X 버튼 클릭
    await page
      .getByRole('button')
      .filter({ has: page.locator('svg') })
      .last()
      .click()

    await expect(searchInput).toHaveValue('')
    await expect(page.getByText(/총.*개의 용어/)).toBeVisible()
  })
})

test.describe('용어집 - 데스크톱', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('용어 클릭 시 우측 패널에 상세 내용이 표시된다', async ({ page }) => {
    await page.goto('/glossary')

    // 사이드바에서 PBR 클릭
    await page.getByRole('button', { name: /PBR/ }).first().click()

    // 우측 패널에 상세 내용 표시
    await expect(page.getByText('Price Book-value Ratio')).toBeVisible()
    await expect(page.getByText('설명')).toBeVisible()
    await expect(page.getByText('쉬운 예시')).toBeVisible()
  })

  test('관련 용어 배지 클릭 시 해당 용어로 이동한다', async ({ page }) => {
    await page.goto('/glossary')

    // PER 클릭
    await page.getByRole('button', { name: /^PER$/ }).first().click()
    await expect(page.getByText('Price Earnings Ratio')).toBeVisible()

    // 관련 용어 PBR 클릭
    await page.getByText('관련 용어').waitFor()
    const relatedPBR = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'PBR' }).first()
    await relatedPBR.click()

    await expect(page.getByText('Price Book-value Ratio')).toBeVisible()
  })
})

test.describe('용어집 - 모바일', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('용어 클릭 시 바텀 시트가 열린다', async ({ page }) => {
    await page.goto('/glossary')

    // 모바일 목록에서 첫 번째 용어 클릭
    await page.getByRole('button', { name: /PER/ }).first().click()

    // 바텀 시트 열림 확인
    await expect(page.getByText('Price Earnings Ratio')).toBeVisible()
    await expect(page.getByText('설명')).toBeVisible()
  })

  test('바텀 시트 X 버튼으로 닫을 수 있다', async ({ page }) => {
    await page.goto('/glossary')

    await page.getByRole('button', { name: /PER/ }).first().click()
    await expect(page.getByText('Price Earnings Ratio')).toBeVisible()

    // Sheet 내부 X 버튼 클릭 (sr-only "Close")
    await page.getByRole('button', { name: 'Close' }).click()

    await expect(page.getByText('Price Earnings Ratio')).not.toBeVisible()
  })

  test('바텀 시트 바깥 영역 클릭 시 닫힌다', async ({ page }) => {
    await page.goto('/glossary')

    await page.getByRole('button', { name: /PER/ }).first().click()
    await expect(page.getByText('Price Earnings Ratio')).toBeVisible()

    // 오버레이(시트 바깥) 클릭 - 화면 상단 영역
    await page.mouse.click(195, 100)

    await expect(page.getByText('Price Earnings Ratio')).not.toBeVisible()
  })

  test('Escape 키로 바텀 시트를 닫을 수 있다', async ({ page }) => {
    await page.goto('/glossary')

    await page.getByRole('button', { name: /PER/ }).first().click()
    await expect(page.getByText('Price Earnings Ratio')).toBeVisible()

    await page.keyboard.press('Escape')

    await expect(page.getByText('Price Earnings Ratio')).not.toBeVisible()
  })
})
