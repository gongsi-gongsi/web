'use client'

import { getBaseUrl } from '@/shared/lib/get-base-url'
import type { WatchlistItem, WatchlistResponse, WatchlistCheckResponse } from '../model'

/**
 * [클라이언트 전용] 관심 종목 목록을 조회합니다
 * @returns 관심 종목 목록
 * @throws {Error} API 호출 실패 시
 */
export async function getWatchlist(): Promise<WatchlistResponse> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/watchlist`)

  if (!response.ok) {
    throw new Error('Failed to fetch watchlist')
  }

  return response.json()
}

/**
 * [클라이언트 전용] 관심 종목에 기업을 추가합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @returns 생성된 WatchlistItem
 * @throws {Error} API 호출 실패 시
 */
export async function addToWatchlist(corpCode: string): Promise<WatchlistItem> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ corpCode }),
  })

  if (!response.ok) {
    throw new Error('Failed to add to watchlist')
  }

  return response.json()
}

/**
 * [클라이언트 전용] 관심 종목에서 기업을 삭제합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @returns void
 * @throws {Error} API 호출 실패 시
 */
export async function removeFromWatchlist(corpCode: string): Promise<void> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/watchlist`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ corpCode }),
  })

  if (!response.ok) {
    throw new Error('Failed to remove from watchlist')
  }
}

/**
 * [클라이언트 전용] 특정 기업의 관심 종목 등록 여부를 확인합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @returns 관심 종목 등록 여부
 * @throws {Error} API 호출 실패 시
 */
export async function checkWatchlist(corpCode: string): Promise<WatchlistCheckResponse> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/watchlist/check/${corpCode}`)

  if (!response.ok) {
    throw new Error('Failed to check watchlist')
  }

  return response.json()
}
