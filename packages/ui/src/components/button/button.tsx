import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive',
        outline:
          'border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-xl px-6 has-[>svg]:px-4',
        xl: 'h-15 rounded-xl px-6 text-base has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
        'icon-bare': 'p-0',
      },
      interactive: {
        true: 'duration-200 ease-out active:scale-[0.98]',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        interactive: true,
        className: 'active:bg-primary/80',
      },
      {
        variant: 'destructive',
        interactive: true,
        className: 'active:bg-destructive/80',
      },
      {
        variant: 'outline',
        interactive: true,
        className: 'active:bg-accent/80',
      },
      {
        variant: 'secondary',
        interactive: true,
        className: 'active:bg-secondary/70',
      },
      {
        variant: 'ghost',
        interactive: true,
        className: 'active:bg-accent/70',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
    },
  }
)

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /** 터치/클릭 시 축소 효과 활성화 */
  interactive?: boolean
  /** 로딩 상태 (disabled + 스피너 표시) */
  loading?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      interactive = false,
      loading = false,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const commonProps = {
      ref,
      'data-slot': 'button' as const,
      'data-variant': variant,
      'data-size': size,
      disabled: disabled || loading,
      'aria-busy': loading || undefined,
      className: cn(buttonVariants({ variant, size, interactive, className })),
      ...props,
    }

    if (asChild) {
      return <Slot {...commonProps}>{children}</Slot>
    }

    const showSpinner = loading

    return (
      <button {...commonProps} className={cn(commonProps.className, showSpinner && 'relative')}>
        {showSpinner && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoaderCircle className="animate-spin" />
          </span>
        )}
        <span className={cn(showSpinner && 'invisible')}>{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
