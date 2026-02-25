import { Badge } from '@gs/ui'

import {
  GLOSSARY_CATEGORY_LABEL,
  GLOSSARY_DIFFICULTY_LABEL,
  GLOSSARY_TERMS,
  getRelatedTerms,
  type GlossaryTerm,
} from '@/entities/glossary'

const DIFFICULTY_COLOR: Record<GlossaryTerm['difficulty'], string> = {
  beginner: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  intermediate: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  advanced: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
}

interface GlossaryDetailPanelProps {
  term: GlossaryTerm
  onSelectRelated: (term: GlossaryTerm) => void
}

export function GlossaryDetailPanel({ term, onSelectRelated }: GlossaryDetailPanelProps) {
  const relatedTerms = getRelatedTerms(GLOSSARY_TERMS, term.relatedTermIds)

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-bold">{term.term}</h2>
          <span className="text-muted-foreground text-sm">{term.termEn}</span>
        </div>
        <div className="flex gap-2 mt-3">
          <Badge variant="outline">{GLOSSARY_CATEGORY_LABEL[term.category]}</Badge>
          <Badge className={DIFFICULTY_COLOR[term.difficulty]}>
            {GLOSSARY_DIFFICULTY_LABEL[term.difficulty]}
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
          설명
        </h3>
        <p className="text-base leading-relaxed">{term.description}</p>
      </div>

      <div className="bg-muted/50 rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-2">쉬운 예시</h3>
        <p className="text-base leading-relaxed text-muted-foreground">{term.example}</p>
      </div>

      {relatedTerms.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            관련 용어
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedTerms.map(related => (
              <button
                key={related.id}
                onClick={() => onSelectRelated(related)}
                className="bg-card hover:bg-accent border-border inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors"
              >
                <span className="font-medium">{related.term}</span>
                <span className="text-muted-foreground text-xs">{related.termEn}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
