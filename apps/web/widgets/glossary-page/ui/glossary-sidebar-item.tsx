import { cn } from '@gs/ui'

import { GLOSSARY_DIFFICULTY_LABEL, type GlossaryTerm } from '@/entities/glossary'

interface GlossarySidebarItemProps {
  term: GlossaryTerm
  isSelected: boolean
  onSelect: (term: GlossaryTerm) => void
}

const DIFFICULTY_DOT: Record<GlossaryTerm['difficulty'], string> = {
  beginner: 'bg-emerald-500',
  intermediate: 'bg-blue-500',
  advanced: 'bg-orange-500',
}

export function GlossarySidebarItem({ term, isSelected, onSelect }: GlossarySidebarItemProps) {
  return (
    <button
      onClick={() => onSelect(term)}
      className={cn(
        'w-full text-left px-3 py-2.5 rounded-md transition-colors',
        isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-foreground'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm truncate">{term.term}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <div
            className={cn('h-1.5 w-1.5 rounded-full', DIFFICULTY_DOT[term.difficulty])}
            title={GLOSSARY_DIFFICULTY_LABEL[term.difficulty]}
          />
        </div>
      </div>
      <p className="text-muted-foreground text-xs mt-0.5 truncate">{term.termEn}</p>
    </button>
  )
}
