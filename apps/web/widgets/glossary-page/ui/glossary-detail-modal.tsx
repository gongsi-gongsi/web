import { Badge, ResponsiveModal } from '@gs/ui'

import {
  GLOSSARY_CATEGORY_LABEL,
  GLOSSARY_DIFFICULTY_LABEL,
  GLOSSARY_TERMS,
  getRelatedTerms,
  type GlossaryTerm,
} from '@/entities/glossary'

interface GlossaryDetailModalProps {
  term: GlossaryTerm | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectRelated: (term: GlossaryTerm) => void
}

export function GlossaryDetailModal({
  term,
  open,
  onOpenChange,
  onSelectRelated,
}: GlossaryDetailModalProps) {
  if (!term) return null

  const relatedTerms = getRelatedTerms(GLOSSARY_TERMS, term.relatedTermIds)

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={term.term}
      description={term.termEn}
    >
      <div className="space-y-5 px-1 py-2">
        <div className="flex gap-2">
          <Badge variant="outline">{GLOSSARY_CATEGORY_LABEL[term.category]}</Badge>
          <Badge variant="secondary">{GLOSSARY_DIFFICULTY_LABEL[term.difficulty]}</Badge>
        </div>

        <div>
          <h4 className="mb-1.5 text-sm font-semibold">설명</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">{term.description}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="mb-1.5 text-sm font-semibold">쉬운 예시</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">{term.example}</p>
        </div>

        {relatedTerms.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">관련 용어</h4>
            <div className="flex flex-wrap gap-2">
              {relatedTerms.map(related => (
                <Badge
                  key={related.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => {
                    onSelectRelated(related)
                  }}
                >
                  {related.term}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </ResponsiveModal>
  )
}
