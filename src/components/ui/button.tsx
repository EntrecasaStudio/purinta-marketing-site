import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * Purinta Button — ported from the live dapp source of truth at
 *   /tmp/purinta-app/index.html  (.btn .btn-primary .btn-secondary
 *   .btn-connect .btn-sm .btn-lg .btn-full .btn-icon).
 *
 * The visual rules live in `index.css` under @layer components so
 * the marketing site and the dapp can stay in lock-step by porting
 * any future updates to those rules. This React component just
 * composes the class names declaratively.
 *
 * Variants
 *   primary   — mint gradient (green-200 → green-300), green-700 text,
 *               "stamp" extruded shadow on hover.
 *   secondary — mint-100 surface with a green-300 pill border.
 *   connect   — white pill with a cream-400 border (wallet button).
 *
 * Sizes (height ≈ 44 / 40 / 52)
 *   md (default)
 *   sm
 *   lg
 *
 * Modifiers
 *   fullWidth — stretches to 100% with content centered.
 */
const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      connect: 'btn-connect',
    },
    size: {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    },
    fullWidth: {
      true: 'btn-full',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
})

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? 'primary'}
      data-size={size ?? 'md'}
      className={cn(
        buttonVariants({ variant, size, fullWidth, className }),
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }
