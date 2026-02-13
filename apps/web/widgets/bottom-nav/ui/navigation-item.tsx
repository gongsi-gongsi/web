'use client'

import { useState } from 'react'

import Link from 'next/link'
import { motion } from 'motion/react'
import type { Icon } from '@phosphor-icons/react'
import { cn } from '@gs/ui'

import { buttonTapAnimation, iconBounceVariants } from '@/shared/lib/animations'

interface NavigationItemProps {
  item: {
    icon: Icon
    label: string
    href: string
  }
  isActive: boolean
}

export function NavigationItem({ item, isActive }: NavigationItemProps) {
  const [iconKey, setIconKey] = useState(0)

  const handleTap = () => {
    setIconKey(prev => prev + 1)
  }

  return (
    <Link href={item.href} className="flex min-w-0 flex-1 flex-col items-center pb-6">
      <motion.div
        className="flex flex-col items-center rounded-2xl px-2 py-1 hover:bg-accent"
        whileTap={buttonTapAnimation.whileTap}
        transition={buttonTapAnimation.transition}
        onTap={handleTap}
      >
        <motion.div
          key={iconKey}
          className="flex size-10 items-center justify-center"
          variants={iconBounceVariants}
          initial="initial"
          animate="bounce"
        >
          <item.icon
            className={cn('size-6', isActive ? 'text-foreground' : 'text-muted-foreground')}
            weight="fill"
          />
        </motion.div>

        <span
          className={cn(
            'text-[11px] font-medium',
            isActive ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {item.label}
        </span>
      </motion.div>
    </Link>
  )
}
