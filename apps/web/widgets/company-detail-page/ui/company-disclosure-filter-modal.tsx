'use client'

import { useState } from 'react'

import { cn, Button, ResponsiveModal } from '@gs/ui'

import type { DisclosureType } from '@/entities/disclosure'

import { TYPE_OPTIONS } from '@/widgets/disclosure-search/lib/filter-options'

interface CompanyDisclosureFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: DisclosureType | 'all'
  onApply: (type: DisclosureType | 'all') => void
}

export function CompanyDisclosureFilterModal({
  open,
  onOpenChange,
  type,
  onApply,
}: CompanyDisclosureFilterModalProps) {
  const [localType, setLocalType] = useState<DisclosureType | 'all'>(type)

  function handleReset() {
    setLocalType('all')
  }

  function handleApply() {
    onApply(localType)
    onOpenChange(false)
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={open => {
        if (open) {
          setLocalType(type)
        }
        onOpenChange(open)
      }}
      title="공시 필터 설정"
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
      <div className="flex flex-col gap-5 py-2">
        <div>
          <p className="mb-2 text-sm font-medium">공시 유형</p>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLocalType(option.value)}
                aria-pressed={localType === option.value}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm transition-colors',
                  localType === option.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:bg-accent'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}
