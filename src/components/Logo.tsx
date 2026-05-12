type LogoProps = {
  className?: string
  /** Show the wordmark alongside the symbol */
  withWordmark?: boolean
}

/**
 * Purinta logo (symbol + optional wordmark).
 * Matches Figma node I384:2295;10:1658 — 168.475 × 40 with wordmark, or 35.33 × 40 symbol only.
 */
export default function Logo({ className, withWordmark = true }: LogoProps) {
  if (!withWordmark) {
    return (
      <img
        src="/assets/figma/logo-symbol.svg"
        alt="Purinta"
        width={35.33}
        height={40}
        className={className}
      />
    )
  }
  return (
    <div
      className={
        className ?? 'relative h-[40px] w-[168.475px] shrink-0'
      }
      aria-label="Purinta"
    >
      <img
        src="/assets/figma/logo-symbol.svg"
        alt=""
        className="absolute top-0 left-0 h-[40px] w-[35.33px]"
      />
      <img
        src="/assets/figma/wordmark.svg"
        alt="Purinta"
        className="absolute top-[8.814px] left-[43.47px] h-[24.746px] w-[124.915px]"
      />
    </div>
  )
}
