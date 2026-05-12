import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * Purinta Button — mirrors the variants/sizes from the purinta-app
 * Design System (purinta-ui-system.jsx). Springy hover translate
 * + shadow upgrade on hover; rounded-full pill; Ohno Softie face
 * for marketing variants, Rubik for app-style variants.
 *
 * Variants from purinta-app:
 *   primary   — dark green gradient (green-500 → green-600), white text
 *   secondary — white bg, green-700 text, green-200 border
 *   cute      — blush gradient (blush-300 → blush-400), white text
 *   ghost     — green-50 bg, green-700 text
 *   dark      — green-400 → green-500 gradient, dark text
 *
 * Sizes:
 *   sm — 13 / 8 16
 *   md — 14 / 12 24 (default)
 *   lg — 16 / 14 32
 */
const buttonVariants = cva(
  [
    'group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap',
    'rounded-full font-body font-medium tracking-[0.2px]',
    'transition-all duration-[250ms]',
    'ease-[cubic-bezier(0.34,1.56,0.64,1)]',
    'select-none outline-none',
    'hover:-translate-y-0.5',
    'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(' '),
  {
    variants: {
      variant: {
        /* purinta-app variants ─────────────────────────────────────
         * Background gradients & box-shadows are applied via inline
         * styles in <Button> (Tailwind arbitrary values choke on the
         * multi-stop shadow syntax). Variant classes here own text,
         * border, layout. */
        primary: 'text-white border-none [--btn-shadow:0_4px_12px_rgba(57,118,61,0.18)] hover:[--btn-shadow:0_8px_24px_rgba(57,118,61,0.24)]',
        secondary:
          'bg-white text-[var(--color-green-700)] border-2 border-[var(--color-green-200)] [--btn-shadow:0_1px_3px_rgba(57,118,61,0.08)] hover:[--btn-shadow:0_8px_24px_rgba(57,118,61,0.16)]',
        cute: 'text-white border-none [--btn-shadow:0_4px_16px_rgba(254,170,164,0.25)] hover:[--btn-shadow:0_8px_24px_rgba(254,170,164,0.32)]',
        ghost:
          'bg-[var(--color-green-50)] text-[var(--color-green-700)] border-none [--btn-shadow:none] hover:[--btn-shadow:0_4px_12px_rgba(57,118,61,0.10)]',
        dark: 'text-[var(--color-green-700)] font-semibold border-none [--btn-shadow:0_4px_12px_rgba(57,118,61,0.18)] hover:[--btn-shadow:0_8px_24px_rgba(57,118,61,0.24)]',

        /* shadcn defaults kept for compatibility ─────────────────── */
        default:
          'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20',
        link: 'text-primary underline-offset-4 hover:underline shadow-none hover:translate-y-0',
      },
      size: {
        sm: 'h-9 px-4 text-[13px]',
        md: 'h-11 px-6 text-[14px]',
        lg: 'h-12 px-8 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

/** Per-variant background gradient (applied via inline `style` because
 * Tailwind arbitrary values can't reliably express multi-stop gradients
 * with CSS variables inside). Variants that don't have one rely on the
 * `bg-*` class in their variant string. */
const variantGradient: Record<string, string | undefined> = {
  primary:
    'linear-gradient(135deg, var(--color-green-500), var(--color-green-600))',
  cute: 'linear-gradient(135deg, var(--color-blush-300), var(--color-blush-400))',
  dark: 'linear-gradient(135deg, var(--color-green-400), var(--color-green-500))',
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  style,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'
  const gradient = variant ? variantGradient[variant] : variantGradient.primary

  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? 'primary'}
      data-size={size ?? 'md'}
      className={cn(buttonVariants({ variant, size, className }))}
      style={{
        boxShadow: 'var(--btn-shadow)',
        ...(gradient ? { backgroundImage: gradient } : {}),
        ...style,
      }}
      {...props}
    />
  )
}

export { Button, buttonVariants }
