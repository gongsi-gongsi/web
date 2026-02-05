'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

import { XIcon } from '@phosphor-icons/react'

import { Input } from '@gs/ui'

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
            className={`pr-8 ${inputClassName || ''}`}
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="검색어 삭제"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
