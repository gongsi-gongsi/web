import * as React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon } from 'lucide-react';

import { cn } from '../../lib/utils';

const checkboxVariants = cva(
  'group peer relative shrink-0 rounded-full border transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 grid place-content-center',
  {
    variants: {
      size: {
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-6',
      },
      variant: {
        default:
          'border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary',
      },
      interactive: {
        true: 'active:scale-[0.85] cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      interactive: true,
    },
  }
);

const indicatorVariants = cva('text-current', {
  variants: {
    size: {
      sm: '[&_svg]:size-2.5',
      md: '[&_svg]:size-3.5',
      lg: '[&_svg]:size-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface CheckboxProps
  extends
    React.ComponentProps<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  /** 터치/클릭 시 축소 효과 활성화 */
  interactive?: boolean;
}

function Checkbox({
  className,
  size = 'md',
  variant = 'default',
  interactive = true,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        checkboxVariants({ size, variant, interactive }),
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        'shadow-xs',
        className
      )}
      {...props}
    >
      {/* Unchecked 상태 아이콘 - 항상 렌더링 */}
      <span
        className={cn(
          indicatorVariants({ size }),
          'text-muted-foreground/40 transition-opacity duration-200 group-data-[state=checked]:opacity-0'
        )}
      >
        <CheckIcon />
      </span>

      {/* Checked 상태 아이콘 */}
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          indicatorVariants({ size }),
          'animate-in zoom-in-50 absolute inset-0 grid place-content-center duration-200'
        )}
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxVariants };
