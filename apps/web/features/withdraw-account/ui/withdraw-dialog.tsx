'use client'

import { useState } from 'react'

import { Button, Checkbox, Label, ResponsiveModal } from '@gs/ui'

import { useWithdrawAccount } from '../model/use-withdraw-account'

interface WithdrawDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WithdrawDialog({ open, onOpenChange }: WithdrawDialogProps) {
  const [confirmed, setConfirmed] = useState(false)
  const { withdraw, isPending, error } = useWithdrawAccount()

  function handleOpenChange(value: boolean) {
    if (!value) {
      setConfirmed(false)
    }
    onOpenChange(value)
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleOpenChange}
      title="회원탈퇴"
      description="정말로 탈퇴하시겠습니까?"
      footer={
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={withdraw}
            disabled={!confirmed || isPending}
          >
            {isPending ? '처리 중...' : '탈퇴하기'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <p className="font-medium">탈퇴 시 다음 데이터가 모두 삭제됩니다:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>계정 정보</li>
            <li>관심 종목 목록</li>
            <li>AI 분석 리포트 및 대화 내역</li>
            <li>알림 기록</li>
          </ul>
          <p className="mt-2 font-medium">삭제된 데이터는 복구할 수 없습니다.</p>
        </div>

        <label htmlFor="withdraw-confirm" className="flex cursor-pointer items-center gap-2">
          <Checkbox
            id="withdraw-confirm"
            checked={confirmed}
            onCheckedChange={checked => setConfirmed(checked === true)}
          />
          <Label htmlFor="withdraw-confirm" className="cursor-pointer text-sm">
            위 내용을 확인했으며, 회원탈퇴에 동의합니다
          </Label>
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </ResponsiveModal>
  )
}
