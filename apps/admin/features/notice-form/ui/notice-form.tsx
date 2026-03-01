'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import DOMPurify from 'isomorphic-dompurify'
import { Button, Input, Label, Switch } from '@gs/ui'
import {
  useCreateNotice,
  useUpdateNotice,
  NOTICE_CATEGORY_LABELS,
  type Notice,
  type NoticeCategory,
} from '@/entities/notice'
import { RichTextEditor, type RichTextEditorRef } from './rich-text-editor'
import { CATEGORY_TEMPLATES } from '../lib'

const CATEGORIES = Object.entries(NOTICE_CATEGORY_LABELS) as [NoticeCategory, string][]

function isContentEmpty(html: string) {
  return !html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

interface NoticeFormProps {
  notice?: Notice
}

export function NoticeForm({ notice }: NoticeFormProps) {
  const router = useRouter()
  const createMutation = useCreateNotice()
  const updateMutation = useUpdateNotice()
  const isEdit = !!notice

  const editorRef = useRef<RichTextEditorRef>(null)
  const [isPreview, setIsPreview] = useState(false)

  const [title, setTitle] = useState(notice?.title ?? '')
  const [category, setCategory] = useState<NoticeCategory>(notice?.category ?? 'SERVICE')
  const [content, setContent] = useState(
    notice?.content ?? CATEGORY_TEMPLATES['SERVICE']
  )
  const [isPublished, setIsPublished] = useState(notice?.isPublished ?? false)
  const [isPinned, setIsPinned] = useState(notice?.isPinned ?? false)

  const isPending = createMutation.isPending || updateMutation.isPending

  function handleCategoryChange(newCategory: NoticeCategory) {
    if (!isEdit && !isContentEmpty(content)) {
      const confirmed = window.confirm(
        '카테고리를 변경하면 작성 중인 내용이 템플릿으로 교체됩니다. 계속하시겠습니까?'
      )
      if (!confirmed) return
    }
    setCategory(newCategory)
    if (!isEdit) {
      editorRef.current?.setContent(CATEGORY_TEMPLATES[newCategory])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || isContentEmpty(content)) {
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
              onClick={() => handleCategoryChange(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>내용 *</Label>
          <div className="flex gap-1 rounded-md border border-border p-0.5">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={`rounded px-3 py-1 text-xs transition-colors ${
                !isPreview
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              편집
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={`rounded px-3 py-1 text-xs transition-colors ${
                isPreview
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              미리보기
            </button>
          </div>
        </div>

        <div className={isPreview ? 'hidden' : undefined}>
          <RichTextEditor ref={editorRef} value={content} onChange={setContent} />
        </div>

        {isPreview && (
          <div className="min-h-[240px] rounded-lg border border-border p-4">
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
          </div>
        )}
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
