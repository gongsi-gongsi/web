import { useCallback, useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

/**
 * Intersection Observer를 사용하여 요소가 뷰포트에 보이는지 감지합니다
 * @param options - threshold, rootMargin, enabled 옵션
 * @returns ref (callback ref)와 inView 상태
 * @example
 * const { ref, inView } = useIntersectionObserver({ rootMargin: '200px' })
 * return <div ref={ref}>{inView && 'Visible!'}</div>
 */
export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0, rootMargin = '0px', enabled = true } = options
  const [inView, setInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 컴포넌트 언마운트 시 observer 정리
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [])

  const ref = useCallback(
    (node: HTMLElement | null) => {
      // 이전 observer 정리
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      if (!enabled || !node) {
        setInView(false)
        return
      }

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting)
        },
        { threshold, rootMargin }
      )

      observerRef.current.observe(node)
    },
    [threshold, rootMargin, enabled]
  )

  return { ref, inView }
}
