'use client'

import { useState } from 'react'

import { Button, ResponsiveModal } from '@gs/ui'

import type { SearchPeriod, Market, DisclosureType } from '@/entities/disclosure'

import { SearchFilterContent } from './search-filter-content'

interface FilterParams {
  period: SearchPeriod
  market: Market
  type: DisclosureType | 'all'
}

interface SearchFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  params: FilterParams
  onApply: (params: FilterParams) => void
}

const DEFAULT_FILTER: FilterParams = {
  period: '1w',
  market: 'all',
  type: 'all',
}

export function SearchFilterModal({ open, onOpenChange, params, onApply }: SearchFilterModalProps) {
  const [localParams, setLocalParams] = useState<FilterParams>(params)

  function handleReset() {
    setLocalParams(DEFAULT_FILTER)
  }

  function handleApply() {
    onApply(localParams)
    onOpenChange(false)
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={open => {
        if (open) {
          setLocalParams(params)
        }
        onOpenChange(open)
      }}
      title="검색 필터 설정"
      footer={
        <div className="flex w-full gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            초기화
          </Button>
          <Button onClick={handleApply} className="flex-1">
            적용하기
          </Button>
        </div>
      }
    >
      <SearchFilterContent params={localParams} onChange={setLocalParams} />
    </ResponsiveModal>
  )
}
