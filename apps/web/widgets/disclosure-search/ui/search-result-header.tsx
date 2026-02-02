interface SearchResultHeaderProps {
  query: string
  totalCount: number
}

export function SearchResultHeader({ query, totalCount }: SearchResultHeaderProps) {
  return (
    <div className="px-4 py-3 md:px-0">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span> 검색 결과
        {totalCount > 0 && <span className="ml-1">({totalCount.toLocaleString()}건)</span>}
      </p>
    </div>
  )
}
