import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronRight } from 'lucide-react'

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
  /** Natural pixel size of the mascot artwork — used so the image
   * renders at 100% of its source dimensions (no scaling). */
  mascotSize: { w: number; h: number }
  accent: Accent
  /** Per-card blob rotations from Figma — each card has its own
   * organic ellipse shape oriented differently to feel hand-placed. */
  blobRotate: { collapsed: number; expanded: number }
}

const CARDS: CardData[] = [
  {
    id: 'borrow',
    title: 'Borrow Against Memes',
    titleCollapsed: 'Borrow\nAgainst Memes',
    body: 'Lock your PEPE, SHIB, or any supported memecoin as collateral and borrow USDC without selling your bags. Your memes stay yours — you just unlock their liquidity.',
    mascot: '/assets/figma/features/borrow.png',
    mascotSize: { w: 254, h: 312 },
    accent: {
      bg: 'var(--color-blush-50)',
      border: 'var(--color-blush-400)',
      blob: 'var(--color-blush-300)',
    },
    blobRotate: { collapsed: -32.4, expanded: 68.88 },
  },
  {
    id: 'apy',
    title: 'Best APY on the Market',
    titleCollapsed: 'Best APY\non the Market',
    body: 'Competitive rates powered by efficient market design. Lenders earn real yield from memecoin borrowers, while borrowers get the best rates available anywhere.',
    mascot: '/assets/figma/features/apy.png',
    mascotSize: { w: 225, h: 206 },
    accent: {
      bg: 'var(--color-success-50)',
      border: 'var(--color-success-400)',
      blob: 'var(--color-success-200)',
    },
    blobRotate: { collapsed: 49.81, expanded: 49.81 },
  },
  {
    /* Per Figma node 383:4368: Morpho card uses the Warning palette
     * (orange), not Info — verified against the live design system. */
    id: 'morpho',
    title: 'Built on Morpho',
    titleCollapsed: 'Built on\nMorpho',
    body: "Purinta is built on Morpho's battle-tested lending infrastructure — the same protocol securing billions in DeFi. No shortcuts on security.",
    mascot: '/assets/figma/features/morpho.png',
    mascotSize: { w: 321, h: 280 },
    accent: {
      bg: 'var(--color-warning-50)',
      border: 'var(--color-warning-400)',
      blob: 'var(--color-warning-200)',
    },
    blobRotate: { collapsed: 156.39, expanded: 49.81 },
  },
  {
    /* Per Figma node 383:4769: Mainnet card uses the Info palette (blue). */
    id: 'mainnet',
    title: 'Mainnet Native',
    titleCollapsed: 'Mainnet\nNative',
    body: 'Live on Ethereum mainnet from day one. Deep liquidity, real security, no testnet games. Your memes deserve the real thing.',
    mascot: '/assets/figma/features/mainnet.png',
    mascotSize: { w: 252, h: 319 },
    accent: {
      bg: 'var(--color-info-50)',
      border: 'var(--color-info-400)',
      blob: 'var(--color-info-200)',
    },
    blobRotate: { collapsed: 68.38, expanded: 49.81 },
  },
  {
    /* Per Figma node 383:5010: Api3 card uses Green (the brand color),
     * not Mint — matches the protocol identity. */
    id: 'api3',
    title: 'Powered by Api3',
    titleCollapsed: 'Powered\nby Api3',
    body: 'First-party oracle feeds with OEV capture. Accurate pricing for your memecoins, with value flowing back to the protocol.',
    mascot: '/assets/figma/features/api3.png',
    mascotSize: { w: 246, h: 268 },
    accent: {
      bg: 'var(--color-green-50)',
      border: 'var(--color-green-400)',
      blob: 'var(--color-green-100)',
    },
    blobRotate: { collapsed: -9.47, expanded: 49.81 },
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
    const t = setTimeout(() => {
      setActiveIdx((i) => (i + 1) % CARDS.length)
    }, CYCLE_MS)
    return () => clearTimeout(t)
  }, [activeIdx, paused])

  const handleSelect = (idx: number) => {
    if (idx !== activeIdx) {
      setActiveIdx(idx)
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
      </div>

      {/* Cards row — pulled OUT of the 1024 safe-area container so it
          can bleed slightly past it when one card is active (active
          384 + 4 collapsed × 198 + gaps ≈ 1208 px). Centered on the
          page instead. */}
      <div className="mx-auto mt-16 flex w-fit max-w-none justify-center">
        <div
          role="tablist"
          aria-label="Purinta features"
          className="flex gap-[8px]"
          onMouseEnter={() => setHoverPause(true)}
          onMouseLeave={() => setHoverPause(false)}
        >
          {CARDS.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              isActive={i === activeIdx}
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
  onSelect: () => void
}

function Card({ card, isActive, onSelect }: CardProps) {
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
        /* Collapsed cards stay at the Figma 198 px width even when a
         * sibling is active — even though the row total then exceeds
         * the 1024 px safe content area by ~180 px, the user signed
         * off on letting it overflow. */
        width: isActive ? 384 : 198,
      }}
      /* Spring tuned to the original snappy feel (~350 ms). Both
       * directions share the same 130 ms delay so the opening and the
       * closing cards start widening / shrinking at the EXACT same
       * moment — that way the row stays exactly 1024 px wide throughout
       * the transition instead of momentarily collapsing under that. */
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 24,
        delay: 0.13,
      }}
      className="relative h-[416px] shrink-0 cursor-pointer overflow-hidden rounded-[24px] border border-solid bg-white text-left transition-colors duration-500 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        backgroundColor: isActive ? card.accent.bg : '#FEFEFE',
        borderColor: card.accent.border,
      }}
    >
      {/* Both content layers stay MOUNTED at all times — the body /
          Learn-more / divider just cross-fade via opacity when isActive
          changes, instead of unmounting and remounting. That way nothing
          "leaves and re-enters" between auto-cycle ticks; only what is
          truly different (body text per card) fades in place. */}
      <CollapsedContent card={card} isActive={isActive} />
      <ExpandedContent card={card} isActive={isActive} />

      {/* Mascot lives BEHIND the text so the polaroid + blob never
          cover the body / Learn more / title. Star + Title + content
          layers sit on top via z-10. */}
      <Mascot card={card} isActive={isActive} />
      <Star card={card} isActive={isActive} />
      <Title card={card} isActive={isActive} />
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
  /* Stays mounted always — only the divider line cross-fades via the
   * inline transition below. Star, title and mascot are persistent
   * siblings in the Card. */
  return (
    <motion.div
      animate={{ opacity: isActive ? 0 : 1 }}
      transition={{ duration: 0.13, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center px-4 pt-[60px] pb-5"
    >
      {/* Star + Title live at Card level (persistent across states).
          Spacer below reserves the visual room for them so the divider
          lands at the right vertical position. */}
      <div className="w-full" style={{ minHeight: 110 }} aria-hidden />

      {/* Divider — only rendered while the card is collapsed (NOT in
          the expanded state, per the Figma design). */}
      {!isActive && (
        <div
          className="w-full border-b"
          style={{ borderColor: card.accent.border }}
        />
      )}
      {/* Mascot lives outside this component in Card → see <Mascot /> */}
    </motion.div>
  )
}

function ExpandedContent({
  card,
  isActive,
}: {
  card: CardData
  isActive: boolean
}) {
  /* Stays mounted always — only the body / Learn-more / progress
   * cross-fade via opacity. Title is persistent at Card level (it
   * morphs styles rather than fading), so it does NOT live here. */
  return (
    <motion.div
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{
        duration: isActive ? 0.22 : 0.13,
        delay: isActive ? 0.45 : 0,
        ease: 'easeOut',
      }}
      id={`feature-panel-${card.id}`}
      className="pointer-events-none absolute inset-0 z-10 flex flex-col pt-6 pr-4 pb-0 pl-4"
    >
      {/* Star + Title live at Card level (persistent across states).
          This block holds only the body + Learn-more link — those are
          the parts that cross-fade. pt-[120px] reserves space for the
          star (32–56) + title (~64–120). */}
      <div className="pointer-events-auto flex flex-col gap-2 px-4 pt-[120px] pb-2">
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
      </div>

      {/* Mascot lives outside this component in Card → see <Mascot /> */}

      {/* No progress bar — read as a divider line at the bottom of
          the expanded card. The auto-cycle is still announced via the
          aria-live region; the visual indicator is dropped. */}
    </motion.div>
  )
}

/* ============================================================
 * Star — accent sparkle icon at the top-left of every card.
 * Uses the actual Figma SVG so each card has its own fill tint
 * (borrow=Blush/300, apy=Success/200, morpho=Warning/200,
 * mainnet=Info/200, api3=Green/100). Persistent across states —
 * animates only position and size.
 *
 * Per Figma the star sits inside a small anchor box (16 collapsed
 * / 24 expanded) but the actual visible glyph extends beyond the
 * anchor via `inset: -51.92% -59.61% -67.31% -59.62%` — that gives
 * a visual size of ~35×35 (collapsed) / ~52×52 (expanded), with
 * the SVG's viewBox 35.0772 × 35.077.
 * ============================================================ */
function Star({ card, isActive }: { card: CardData; isActive: boolean }) {
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion
    ? { duration: 0 }
    : ({
        type: 'spring',
        stiffness: 180,
        damping: 24,
        delay: isActive ? 0.13 : 0,
      } as const)

  /* Anchor box per Figma was 16 (collapsed) / 24 (expanded) at the
   * top-left, but the visible star glyph extends past it via negative
   * insets, giving an actual visual size of 35×35 / 52.7×52.7. We
   * just position the rendered <img> directly at those coordinates
   * (anchor_left + inset_left, anchor_top + inset_top) and let the
   * SVG render at its full visual size. */
  return (
    <motion.img
      src={`/assets/figma/features/star-${card.id}.svg`}
      alt=""
      aria-hidden
      className="pointer-events-none absolute z-10 block max-w-none"
      animate={{
        top: isActive ? 19.5 : 31.7,
        left: isActive ? 17.7 : 6.5,
        width: isActive ? 52.66 : 35.08,
        height: isActive ? 52.66 : 35.08,
      }}
      transition={transition}
    />
  )
}

/* ============================================================
 * Title — persistent card title. Same text node in both states,
 * just morphs font-size / weight / letter-spacing / width / position.
 * Because the width animates, the text reflows naturally between
 * the multi-line collapsed form and the wider expanded form without
 * needing a content swap.
 *
 * Per Figma node 454:6635 (all-collapsed) and 383:4216 (expanded):
 *   collapsed (152 pill): 25/25 Bold tracking 0.5, width ~120, top 80
 *   expanded  (384 pill): 31/31 Semibold tracking 0.62, width ~316, top 72
 * ============================================================ */
function Title({ card, isActive }: { card: CardData; isActive: boolean }) {
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion
    ? { duration: 0 }
    : ({
        type: 'spring',
        stiffness: 180,
        damping: 24,
        delay: 0.13,
      } as const)

  return (
    <motion.h3
      className="pointer-events-none absolute m-0 font-display text-[var(--color-neutral-900)]"
      animate={{
        top: isActive ? 72 : 80,
        left: isActive ? 32 : 16,
        width: isActive ? 316 : 120,
        fontSize: isActive ? 31 : 25,
        lineHeight: isActive ? '31px' : '25px',
        fontWeight: 600,
        letterSpacing: isActive ? '0.62px' : '0.5px',
      }}
      transition={transition}
    >
      {card.title}
    </motion.h3>
  )
}

/* ============================================================
 * Mascot — Figma blob SVG behind the polaroid-style illustration.
 * Lives at the Card level (outside the AnimatePresence text swap)
 * so it stays mounted across collapsed ↔ expanded transitions and
 * just animates position / size / rotation.
 *
 * The Card pill itself has overflow-hidden so the mascot can sit
 * flush with the bottom edge.
 * ============================================================ */
function Mascot({
  card,
  isActive,
}: {
  card: CardData
  isActive: boolean
}) {
  const reduceMotion = useReducedMotion()

  /* Single spring keeps the mascot + blob + polaroid feel coherent —
   * position, size and rotation all share the same transition curve. */
  const transition = reduceMotion
    ? { duration: 0 }
    : ({
        type: 'spring',
        stiffness: 180,
        damping: 24,
        delay: isActive ? 0.13 : 0,
      } as const)

  return (
    <motion.div
      className="pointer-events-none absolute bottom-0 flex items-center justify-center"
      animate={{
        right: isActive ? 12 : 1,
        width: isActive ? 180 : 150,
        height: isActive ? 180 : 150,
      }}
      transition={transition}
    >
      {/* Background blob — each card uses its OWN unique organic
       * ellipse shape (Figma assets ellipse-107..111). The shape comes
       * via mask-image so we can animate background-color between the
       * collapsed (bg-50, lighter) and the expanded (blob, darker)
       * shades, matching the Figma behavior. Rotation also animates
       * per-card to match the hand-placed feel of the design. */}
      <motion.div
        aria-hidden
        className="absolute"
        style={{
          WebkitMaskImage: `url(/assets/figma/features/blob-${card.id}.svg)`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url(/assets/figma/features/blob-${card.id}.svg)`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
        animate={{
          backgroundColor: isActive ? card.accent.blob : card.accent.bg,
          rotate: isActive
            ? card.blobRotate.expanded
            : card.blobRotate.collapsed,
          width: isActive ? 170 : 135,
          height: isActive ? 150 : 120,
        }}
        transition={transition}
      />

      {/* Polaroid mascot illustration — rendered at its NATURAL pixel
       * dimensions in both states (per-card mascotSize from CardData),
       * so the artwork prints at 100% of its source size. The card
       * pill has overflow-hidden, so the bits that exceed the 198 px
       * collapsed width are clipped gracefully. */}
      <motion.img
        src={card.mascot}
        alt=""
        width={card.mascotSize.w}
        height={card.mascotSize.h}
        className="relative max-w-none flex-none drop-shadow-[0_8px_8px_rgba(0,0,0,0.15)]"
        animate={{
          width: card.mascotSize.w,
          height: card.mascotSize.h,
          rotate: isActive ? 6 : 0,
        }}
        transition={transition}
      />
    </motion.div>
  )
}
