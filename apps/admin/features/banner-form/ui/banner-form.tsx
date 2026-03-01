'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Label, Switch } from '@gs/ui'
import { useCreateBanner, useUpdateBanner, type Banner } from '@/entities/banner'
import { ImageUpload } from './image-upload'

interface BannerFormProps {
  banner?: Banner
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter()
  const createMutation = useCreateBanner()
  const updateMutation = useUpdateBanner()
  const isEdit = !!banner

  const [title, setTitle] = useState(banner?.title ?? '')
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl ?? '')
  const [imageMobileUrl, setImageMobileUrl] = useState(banner?.imageMobileUrl ?? '')
  const [linkUrl, setLinkUrl] = useState(banner?.linkUrl ?? '')
  const [isActive, setIsActive] = useState(banner?.isActive ?? true)
  const [isAlwaysOn, setIsAlwaysOn] = useState(!banner?.startDate && !banner?.endDate)
  const [startDate, setStartDate] = useState(banner?.startDate ? banner.startDate.slice(0, 16) : '')
  const [endDate, setEndDate] = useState(banner?.endDate ? banner.endDate.slice(0, 16) : '')

  const isPending = createMutation.isPending || updateMutation.isPending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !imageUrl) {
      alert('제목과 이미지는 필수입니다')
      return
    }

    const data = {
      title: title.trim(),
      imageUrl,
      imageMobileUrl: imageMobileUrl || undefined,
      linkUrl: linkUrl || undefined,
      isActive,
      startDate: isAlwaysOn ? undefined : startDate || undefined,
      endDate: isAlwaysOn ? undefined : endDate || undefined,
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: banner.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      router.push('/banners')
    } catch {
      alert('저장에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="배너 제목을 입력하세요"
          required
        />
      </div>

      <ImageUpload value={imageUrl} onChange={setImageUrl} label="데스크톱 이미지 *" />

      <ImageUpload
        value={imageMobileUrl}
        onChange={setImageMobileUrl}
        label="모바일 이미지 (선택)"
      />

      <div className="space-y-2">
        <Label htmlFor="linkUrl">링크 URL</Label>
        <Input
          id="linkUrl"
          value={linkUrl}
          onChange={e => setLinkUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
        <Label htmlFor="isActive">활성화</Label>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={isAlwaysOn} onCheckedChange={setIsAlwaysOn} id="isAlwaysOn" />
        <Label htmlFor="isAlwaysOn">상시 노출</Label>
      </div>

      {!isAlwaysOn && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">시작일</Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">종료일</Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? '저장 중...' : isEdit ? '수정' : '생성'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </form>
  )
}
