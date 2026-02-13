import type { Transition, Variants } from 'motion/react'

/**
 * 버튼 탭 애니메이션 — 누르는 동안 전체가 살짝 줄어듦
 */
export const buttonTapAnimation = {
  whileTap: {
    scale: 0.9,
  },
  transition: {
    duration: 0.1,
  } as Transition,
}

/**
 * 아이콘 바운스 애니메이션 — 탭 후 아이콘이 눌렸다 튕기는 효과
 */
export const iconBounceVariants: Variants = {
  initial: {
    scaleY: 1,
    scaleX: 1,
  },
  bounce: {
    scaleY: [1, 0.8, 1.15, 0.95, 1],
    scaleX: [1, 1.15, 0.9, 1.05, 1],
    transition: {
      duration: 0.6,
      times: [0, 0.2, 0.5, 0.75, 1],
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
}
