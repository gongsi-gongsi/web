'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  TextB,
  TextItalic,
  TextStrikethrough,
  ListBullets,
  ListNumbers,
  Quotes,
  Link as LinkIcon,
  Image as ImageIcon,
  TextHOne,
  TextHTwo,
  TextHThree,
  ArrowUUpLeft,
  ArrowUUpRight,
  CodeBlock,
} from '@phosphor-icons/react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer nofollow' },
        validate: href => /^https?:\/\//.test(href),
      }),
      ImageExtension,
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  function addLink() {
    const url = window.prompt('URL을 입력하세요 (https://)')
    if (url && /^https?:\/\//.test(url)) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    } else if (url) {
      alert('http:// 또는 https://로 시작하는 URL만 입력 가능합니다')
    }
  }

  function addImage() {
    const url = window.prompt('이미지 URL을 입력하세요 (https://)')
    if (url && /^https?:\/\//.test(url)) {
      editor?.chain().focus().setImage({ src: url }).run()
    } else if (url) {
      alert('http:// 또는 https://로 시작하는 URL만 입력 가능합니다')
    }
  }

  return (
    <div className="rounded-lg border border-border">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          icon={<TextHOne size={18} />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          icon={<TextHTwo size={18} />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          icon={<TextHThree size={18} />}
        />
        <div className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={<TextB size={18} />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={<TextItalic size={18} />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon={<TextStrikethrough size={18} />}
        />
        <div className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={<ListBullets size={18} />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={<ListNumbers size={18} />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon={<Quotes size={18} />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          icon={<CodeBlock size={18} />}
        />
        <div className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton
          onClick={addLink}
          active={editor.isActive('link')}
          icon={<LinkIcon size={18} />}
        />
        <ToolbarButton onClick={addImage} active={false} icon={<ImageIcon size={18} />} />
        <div className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          icon={<ArrowUUpLeft size={18} />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          icon={<ArrowUUpRight size={18} />}
        />
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 focus-within:outline-none [&_.tiptap]:min-h-[200px] [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  )
}

function ToolbarButton({
  onClick,
  active,
  icon,
}: {
  onClick: () => void
  active: boolean
  icon: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded p-1.5 transition-colors ${
        active
          ? 'bg-accent text-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      }`}
    >
      {icon}
    </button>
  )
}
