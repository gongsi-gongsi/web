import { test, expect } from '@playwright/test'

test('홈페이지가 정상적으로 렌더링된다', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: '공시공시' })).toBeVisible()
  await expect(page.getByText('AI 기반 주식 뉴스 분석 서비스입니다.')).toBeVisible()
})

test('시작하기 버튼이 존재한다', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('button', { name: '시작하기' })).toBeVisible()
})
