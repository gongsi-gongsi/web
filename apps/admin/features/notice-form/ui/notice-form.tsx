'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Label, Switch } from '@gs/ui'
import {
  useCreateNotice,
  useUpdateNotice,
  NOTICE_CATEGORY_LABELS,
  type Notice,
  type NoticeCategory,
} from '@/entities/notice'
import { RichTextEditor } from './rich-text-editor'

const CATEGORIES = Object.entries(NOTICE_CATEGORY_LABELS) as [NoticeCategory, string][]

interface NoticeFormProps {
  notice?: Notice
}

export function NoticeForm({ notice }: NoticeFormProps) {
  const router = useRouter()
  const createMutation = useCreateNotice()
  const updateMutation = useUpdateNotice()
  const isEdit = !!notice

  const [title, setTitle] = useState(notice?.title ?? '')
  const [category, setCategory] = useState<NoticeCategory>(notice?.category ?? 'NOTICE')
  const [content, setContent] = useState(notice?.content ?? '')
  const [isPublished, setIsPublished] = useState(notice?.isPublished ?? false)
  const [isPinned, setIsPinned] = useState(notice?.isPinned ?? false)

  const isPending = createMutation.isPending || updateMutation.isPending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용은 필수입니다')
      return
    }

    const data = {
      title: title.trim(),
      category,
      content,
      isPublished,
      isPinned,
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: notice.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      router.push('/notices')
    } catch {
      alert('저장에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="공지사항 제목을 입력하세요"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>카테고리 *</Label>
        <div className="flex gap-2">
          {CATEGORIES.map(([value, label]) => (
            <Button
              key={value}
              type="button"
              variant={category === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>내용 *</Label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Switch checked={isPublished} onCheckedChange={setIsPublished} id="isPublished" />
          <Label htmlFor="isPublished">발행</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={isPinned} onCheckedChange={setIsPinned} id="isPinned" />
          <Label htmlFor="isPinned">상단 고정</Label>
        </div>
      </div>

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
