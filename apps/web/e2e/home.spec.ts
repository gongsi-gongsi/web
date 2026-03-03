import { test, expect } from '@playwright/test'

test.describe('홈페이지', () => {
  test('페이지 타이틀이 올바르다', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/공시공시/)
  })

  test('검색 페이지로 이동할 수 있다', async ({ page }) => {
    await page.goto('/')
    await page.goto('/search')
    await expect(page).toHaveURL('/search')
    // 뷰포트에 따라 다른 placeholder가 보임 (모바일: '회사명 검색', 데스크톱: '기업명으로 검색해보세요')
    await expect(page.locator('input:visible[placeholder*="검색"]')).toBeVisible()
  })

  test('공시 페이지로 이동할 수 있다', async ({ page }) => {
    await page.goto('/disclosures/today')
    await expect(page).toHaveURL('/disclosures/today')
  })

  test('용어집 페이지로 이동할 수 있다', async ({ page }) => {
    await page.goto('/glossary')
    await expect(page.getByRole('heading', { name: '투자 용어집' })).toBeVisible()
  })
})
