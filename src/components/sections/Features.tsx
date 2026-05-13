import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronRight, Sparkle } from 'lucide-react'

/**
 * Features — Figma node 383:4066 ("Why Degens Love Purinta").
 *
 * Auto-cycling tab row of 5 themed cards. One card is expanded at any
 * time (~384px wide), the other four are collapsed (~152px wide).
 * Total row width: 1024px (the safe container of the marketing site).
 *
 * Interaction (per UX spec):
 *  - Auto-advances every 5s through the 5 cards.
 *  - Hover on any card pauses the timer while hovered, resumes on
 *    mouse-leave.
 *  - Click/focus pauses for 10s of inactivity, then resumes.
 *  - prefers-reduced-motion: no cycling, first card expanded by default.
 *  - Subtle progress bar at the bottom of the expanded card shows the
 *    remaining time until the next advance.
 *  - aria-live="polite" announces the active card's title + body when
 *    it changes (auto or user-driven).
 *  - Each card is a <button role="tab"> with aria-selected; keyboard
 *    Tab/Enter/Space activate.
 */

type Accent = {
  /** Background of the expanded card (~50). */
  bg: string
  /** Border color shared between collapsed and expanded. */
  border: string
  /** Soft surface used for the mascot blob behind the illustration. */
  blob: string
}

type CardData = {
  id: string
  title: string
  /** Title rendered when the card is collapsed (2-line, no spaces normally). */
  titleCollapsed: string
  body: string
  mascot: string
  accent: Accent
}

const CARDS: CardData[] = [
  {
    id: 'borrow',
    title: 'Borrow Against Memes',
    titleCollapsed: 'Borrow\nAgainst Memes',
    body: 'Lock your PEPE, SHIB, or any supported memecoin as collateral and borrow USDC without selling your bags. Your memes stay yours — you just unlock their liquidity.',
    mascot: '/assets/figma/features/borrow.webp',
    accent: {
      bg: 'var(--color-blush-50)',
      border: 'var(--color-blush-400)',
      blob: 'var(--color-blush-300)',
    },
  },
  {
    id: 'apy',
    title: 'Best APY on the Market',
    titleCollapsed: 'Best APY\non the Market',
    body: 'Competitive rates powered by efficient market design. Lenders earn real yield from memecoin borrowers, while borrowers get the best rates available anywhere.',
    mascot: '/assets/figma/features/apy.webp',
    accent: {
      bg: 'var(--color-success-50)',
      border: 'var(--color-success-400)',
      blob: 'var(--color-success-200)',
    },
  },
  {
    /* Per Figma node 383:4368: Morpho card uses the Warning palette
     * (orange), not Info — verified against the live design system. */
    id: 'morpho',
    title: 'Built on Morpho',
    titleCollapsed: 'Built on\nMorpho',
    body: "Purinta is built on Morpho's battle-tested lending infrastructure — the same protocol securing billions in DeFi. No shortcuts on security.",
    mascot: '/assets/figma/features/morpho.webp',
    accent: {
      bg: 'var(--color-warning-50)',
      border: 'var(--color-warning-400)',
      blob: 'var(--color-warning-200)',
    },
  },
  {
    /* Per Figma node 383:4769: Mainnet card uses the Info palette (blue). */
    id: 'mainnet',
    title: 'Mainnet Native',
    titleCollapsed: 'Mainnet\nNative',
    body: 'Live on Ethereum mainnet from day one. Deep liquidity, real security, no testnet games. Your memes deserve the real thing.',
    mascot: '/assets/figma/features/mainnet.webp',
    accent: {
      bg: 'var(--color-info-50)',
      border: 'var(--color-info-400)',
      blob: 'var(--color-info-200)',
    },
  },
  {
    /* Per Figma node 383:5010: Api3 card uses Green (the brand color),
     * not Mint — matches the protocol identity. */
    id: 'api3',
    title: 'Powered by Api3',
    titleCollapsed: 'Powered\nby Api3',
    body: 'First-party oracle feeds with OEV capture. Accurate pricing for your memecoins, with value flowing back to the protocol.',
    mascot: '/assets/figma/features/api3.webp',
    accent: {
      bg: 'var(--color-green-50)',
      border: 'var(--color-green-400)',
      blob: 'var(--color-green-100)',
    },
  },
]

const CYCLE_MS = 5000
const RESUME_AFTER_INPUT_MS = 10_000

export default function Features() {
  const reduceMotion = useReducedMotion()
  const [activeIdx, setActiveIdx] = useState(0)
  const [hoverPause, setHoverPause] = useState(false)
  /** Counter incremented on every deliberate user interaction.
   * Pairs with an effect that auto-resumes the cycle after
   * RESUME_AFTER_INPUT_MS of no further input. */
  const [inputPauseTick, setInputPauseTick] = useState(0)
  const [inputPaused, setInputPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const paused = reduceMotion || hoverPause || inputPaused

  /** Resume auto-cycle 10s after the last user input. */
  useEffect(() => {
    if (inputPauseTick === 0) return
    setInputPaused(true)
    const t = setTimeout(() => setInputPaused(false), RESUME_AFTER_INPUT_MS)
    return () => clearTimeout(t)
  }, [inputPauseTick])

  /** Cycle timer driven by a single RAF loop. Resets whenever
   * `activeIdx` or `paused` change so the progress bar restarts on
   * advance and on pause/resume. */
  useEffect(() => {
    if (paused) {
      // Keep current progress visible while paused (do not reset).
      return
    }
    let raf = 0
    let advanced = false
    const start = performance.now()
    const tick = (t: number) => {
      if (advanced) return
      const elapsed = t - start
      setProgress(Math.min(1, elapsed / CYCLE_MS))
      if (elapsed >= CYCLE_MS) {
        advanced = true // guard against double-advance under StrictMode
        setActiveIdx((i) => (i + 1) % CARDS.length)
        setProgress(0)
      } else {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      advanced = true
      cancelAnimationFrame(raf)
    }
  }, [activeIdx, paused])

  const handleSelect = (idx: number) => {
    if (idx !== activeIdx) {
      setActiveIdx(idx)
      setProgress(0)
    }
    setInputPauseTick((n) => n + 1)
  }

  const active = CARDS[activeIdx]

  return (
    <section
      id="features"
      className="relative w-full bg-white py-32"
      data-node-id="383:4066"
    >
      <div className="mx-auto w-full max-w-[1024px] px-6">
        {/* Section title — 100% line-height per Figma */}
        <h2 className="text-center font-display text-[44px] leading-[1] font-bold tracking-[0.88px] text-[var(--color-neutral-900)] md:text-[46px]">
          Why Degens Love Purinta
        </h2>

        {/* Cards row — auto-cycling carousel */}
        <div
          role="tablist"
          aria-label="Purinta features"
          className="mt-16 flex gap-[8px]"
          onMouseEnter={() => setHoverPause(true)}
          onMouseLeave={() => setHoverPause(false)}
        >
          {CARDS.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              isActive={i === activeIdx}
              progress={i === activeIdx ? progress : 0}
              onSelect={() => handleSelect(i)}
            />
          ))}
        </div>

        {/* Polite live region — announces only when active card changes */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {active.title}. {active.body}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
 * Card — collapsed (152×416) / expanded (384×416). The width
 * interpolates with a spring so the row reflows nicely when the
 * active card changes.
 * ============================================================ */

type CardProps = {
  card: CardData
  isActive: boolean
  progress: number
  onSelect: () => void
}

function Card({ card, isActive, progress, onSelect }: CardProps) {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <motion.button
      ref={ref}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`feature-panel-${card.id}`}
      id={`feature-tab-${card.id}`}
      onClick={onSelect}
      animate={{
        width: isActive ? 384 : 152,
      }}
      /* Spring tuned to the original "snappy" feel (settles in ~350 ms).
       * Content swap is delayed separately so the text still arrives
       * after the pill is mostly open. */
      transition={{ type: 'spring', stiffness: 180, damping: 24 }}
      className="relative h-[416px] shrink-0 cursor-pointer overflow-hidden rounded-[24px] border border-solid bg-white text-left transition-colors duration-500 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        backgroundColor: isActive ? card.accent.bg : '#FEFEFE',
        borderColor: card.accent.border,
      }}
    >
      {isActive ? (
        <ExpandedContent card={card} progress={progress} />
      ) : (
        <CollapsedContent card={card} isActive={isActive} />
      )}
    </motion.button>
  )
}

function CollapsedContent({
  card,
  isActive,
}: {
  card: CardData
  isActive: boolean
}) {
  return (
    <motion.div
      key={`${card.id}-collapsed`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      /* Exit immediately so we don't see the small layout fighting
       * with the widening pill. */
      transition={{ duration: 0.18 }}
      className="flex h-full flex-col items-center px-4 py-5"
    >
      {/* Star icon */}
      <div className="self-start py-5">
        <Sparkle
          className="size-4"
          strokeWidth={1.5}
          style={{ color: card.accent.border }}
        />
      </div>

      {/* Title — 100% line-height per Figma (matches font-size) */}
      <p
        className="w-full font-display text-[16px] leading-[16px] font-medium tracking-[0.48px] whitespace-pre-line text-[var(--color-neutral-900)]"
        style={{ paddingBottom: 20 }}
      >
        {card.titleCollapsed}
      </p>

      {/* Divider — fades to 0 as soon as the card opens, even before
          this component unmounts on the next render. */}
      <div
        className="w-full border-b transition-opacity duration-150"
        style={{
          borderColor: card.accent.border,
          opacity: isActive ? 0 : 1,
        }}
      />

      {/* Mascot blob */}
      <div className="relative mt-auto flex h-[150px] w-[150px] items-center justify-center">
        <div
          className="absolute h-[120px] w-[135px] rotate-[49deg] rounded-[50%]"
          style={{ background: card.accent.blob, opacity: 0.6 }}
        />
        <img
          src={card.mascot}
          alt=""
          className="relative h-[103px] w-[103px] object-contain"
          loading="lazy"
        />
      </div>
    </motion.div>
  )
}

function ExpandedContent({
  card,
  progress,
}: {
  card: CardData
  progress: number
}) {
  /* Stagger the inner content behind the width morph: title + body
   * + CTA fade in once the pill is mostly settled (~280 ms in). The
   * mascot lags slightly more so the eye lands on the text first. */
  return (
    <motion.div
      key={`${card.id}-expanded`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: 0.28 }}
      id={`feature-panel-${card.id}`}
      className="relative flex h-full flex-col pt-6 pr-4 pb-0 pl-4"
    >
      {/* Star + Title + Body */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: 0.3, ease: 'easeOut' }}
        className="flex flex-col gap-2 px-4 py-2"
      >
        <Sparkle
          className="size-6"
          strokeWidth={1.5}
          style={{ color: card.accent.border }}
        />
        <h3 className="font-display text-[31px] leading-[31px] font-semibold tracking-[0.62px] text-[var(--color-neutral-900)]">
          {card.title}
        </h3>
        <p className="font-body text-[16px] leading-[26px] tracking-[0.16px] text-[var(--color-neutral-600)]">
          {card.body}
        </p>
        <a
          href="#"
          className="mt-2 inline-flex items-center gap-1.5 font-body text-[15px] leading-[20px] text-[var(--color-green-500)] transition-opacity hover:opacity-80"
        >
          Learn more
          <ChevronRight className="size-4" strokeWidth={2} />
        </a>
      </motion.div>

      {/* Mascot in lower-right, rotated 6deg (polaroid feel) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 6 }}
        transition={{ duration: 0.3, delay: 0.35, ease: 'easeOut' }}
        className="pointer-events-none absolute right-2 bottom-0 flex h-[180px] w-[180px] items-center justify-center"
      >
        <div
          className="absolute h-[150px] w-[170px] rotate-[68deg] rounded-[50%]"
          style={{ background: card.accent.blob, opacity: 0.7 }}
        />
        <img
          src={card.mascot}
          alt=""
          className="relative h-[160px] w-[160px] object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.15)]"
          loading="lazy"
        />
      </motion.div>

      {/* Progress bar */}
      <div
        className="absolute right-4 bottom-3 left-4 h-[2px] overflow-hidden rounded-full opacity-30"
        aria-hidden
        style={{ backgroundColor: card.accent.border, opacity: 0.15 }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-100"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: card.accent.border,
            opacity: 0.6,
          }}
        />
      </div>
    </motion.div>
  )
}
