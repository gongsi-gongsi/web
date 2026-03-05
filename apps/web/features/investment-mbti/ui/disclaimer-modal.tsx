'use client'

import { useEffect, useState } from 'react'

import { Button, Checkbox, Dialog, DialogContent, DialogHeader, DialogTitle } from '@gs/ui'

interface DisclaimerModalProps {
  open: boolean
  onAccept: () => void
  onClose: () => void
}

export function DisclaimerModal({ open, onAccept, onClose }: DisclaimerModalProps) {
  const [agreed, setAgreed] = useState(false)

  // 모달을 다시 열 때마다 체크박스 초기화 (재동의 보장)
  useEffect(() => {
    if (open) setAgreed(false)
  }, [open])

  function handleAccept() {
    if (!agreed) return
    onAccept()
  }

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border/40 p-6 pb-4">
          <div className="mb-1 text-2xl">⚠️</div>
          <DialogTitle className="text-lg font-bold">이용 전 반드시 읽어주세요</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 text-sm text-muted-foreground">
          <p className="mb-4 leading-relaxed">
            본 투자성향 진단은 단순 참고용 콘텐츠로, 자본시장과 금융투자업에 관한 법률에 따른
            투자자문업 또는 투자일임업에 해당하지 않습니다.
          </p>

          <ul className="space-y-2.5">
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-muted-foreground">•</span>
              <span>
                본 결과는 특정 금융투자상품의 매매를 권유하거나 투자 조언을 제공하는 것이 아닙니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-muted-foreground">•</span>
              <span>모든 투자 결정은 투자자 본인의 판단과 책임 하에 이루어져야 합니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-muted-foreground">•</span>
              <span>
                공시공시는 본 콘텐츠 이용으로 인한 투자 손실에 대해 어떠한 책임도 지지 않습니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-muted-foreground">•</span>
              <span>투자에는 원금 손실의 위험이 있습니다.</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-border/40 px-6 py-4">
          <label className="mb-4 flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={agreed}
              onCheckedChange={checked => setAgreed(checked === true)}
              id="disclaimer-agree"
            />
            <span className="text-sm font-medium leading-none">위 내용을 이해하고 동의합니다.</span>
          </label>

          <Button className="w-full" disabled={!agreed} onClick={handleAccept}>
            진단 시작하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
