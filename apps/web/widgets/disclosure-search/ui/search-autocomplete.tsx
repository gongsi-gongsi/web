'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'

import { cn, Input, Button } from '@gs/ui'

interface SearchAutocompleteProps {
  value: string
  onSearch: (value: string) => void
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
  inputClassName?: string
  variant?: 'compact' | 'banner'
}

export function SearchAutocomplete({
  value,
  onSearch,
  onChange,
  onFocus,
  onBlur,
  placeholder = '회사명 검색',
  autoFocus = false,
  className,
  inputClassName,
  variant = 'compact',
}: SearchAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = inputValue.trim()
      if (trimmed) {
        onSearch(trimmed)
      }
    },
    [inputValue, onSearch]
  )

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
  }

  function handleClear() {
    setInputValue('')
    onChange('')
    inputRef.current?.focus()
  }

  if (variant === 'banner') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit}>
          <div className="relative rounded-2xl border border-border bg-background shadow-sm">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              autoFocus={autoFocus}
              autoComplete="off"
              onFocus={onFocus}
              onBlur={onBlur}
              className="h-14 border-none bg-transparent pl-4 pr-24 text-lg shadow-none outline-none placeholder:text-foreground/40 focus:outline-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {inputValue && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                aria-label="검색어 삭제"
                className="absolute right-14 top-1/2 -translate-y-1/2"
              >
                <XIcon className="size-5" weight="bold" />
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              interactive
              className="absolute right-2 top-1/2 size-11 -translate-y-1/2 shadow-md"
              aria-label="검색"
            >
              <MagnifyingGlassIcon className="size-6" weight="bold" />
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            onFocus={onFocus}
            onBlur={onBlur}
            className={cn('pr-8', inputClassName)}
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="검색어 삭제"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
