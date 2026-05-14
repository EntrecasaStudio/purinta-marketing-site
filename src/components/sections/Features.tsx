import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { asset } from '@/lib/utils'

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
  /** Optional per-card overrides for the expanded blob / image anchor
   * positions. Each value REPLACES the default for that property:
   *   - right N : element's right edge is N px inside the card's right
   *   - bottom N: element's bottom edge is N px above the card's bottom
   * Negative values let the element overhang past the card. */
  expandedOverride?: {
    blob?: { right?: number; bottom?: number }
    image?: { right?: number; bottom?: number }
  }
  /** Same shape as `expandedOverride` but applied when the card is in
   * its COLLAPSED state. Use when a card's mascot reads off-center
   * against the narrow pill. */
  collapsedOverride?: {
    blob?: { right?: number; bottom?: number }
    image?: { right?: number; bottom?: number }
  }
}

const CARDS: CardData[] = [
  {
    id: 'borrow',
    title: 'Borrow Against Memes',
    titleCollapsed: 'Borrow\nAgainst Memes',
    body: 'Lock your PEPE, SHIB, or any supported memecoin as collateral and borrow USDC without selling your bags. Your memes stay yours — you just unlock their liquidity.',
    mascot: asset('/assets/figma/features/borrow.png'),
    /* Source PNG is exported @2x — divide by 2 for design size. */
    mascotSize: { w: 127, h: 156 },
    accent: {
      bg: 'var(--color-blush-50)',
      border: 'var(--color-blush-400)',
      blob: 'var(--color-blush-300)',
    },
    blobRotate: { collapsed: -32.4, expanded: 68.88 },
    /* Defaults are blob {right:28,bottom:48} / image {right:-8,bottom:-34}.
     * Borrow's mascot is taller than the others (127×156 vs ~110×140),
     * so the blob needs to sit lower-and-rightward, and the polaroid
     * pulls 16 px leftward to land balanced against the title column. */
    expandedOverride: {
      blob: { right: 16, bottom: 33 },
      image: { right: 8 },
    },
  },
  {
    id: 'apy',
    title: 'Best APY on the Market',
    titleCollapsed: 'Best APY\non the Market',
    body: 'Competitive rates powered by efficient market design. Lenders earn real yield from memecoin borrowers, while borrowers get the best rates available anywhere.',
    mascot: asset('/assets/figma/features/apy.png'),
    mascotSize: { w: 113, h: 103 },
    accent: {
      bg: 'var(--color-success-50)',
      border: 'var(--color-success-400)',
      blob: 'var(--color-success-200)',
    },
    blobRotate: { collapsed: 49.81, expanded: 49.81 },
    /* APY's mascot is the shortest (113×103) so it floats too low and
     * the blob sits too high relative to the polaroid. Pull the image
     * up 30 and left 32 (16 + another 16); drop the blob 16 so they
     * recompose. (The blob stays put — only the mascot shifts further
     * left to balance against the title column.) */
    expandedOverride: {
      blob: { bottom: 32 },
      image: { right: 24, bottom: -4 },
    },
    /* Collapsed: bump the mascot up 32 px from the default (60 → 92)
     * so the shorter 103 px-tall polaroid sits at a similar visual
     * height to the taller mascots on the neighbouring cards. The
     * blob keeps its default 75 px bottom — only the image moves. */
    collapsedOverride: {
      image: { bottom: 92 },
    },
  },
  {
    /* Per Figma node 383:4368: Morpho card uses the Warning palette
     * (orange), not Info — verified against the live design system. */
    id: 'morpho',
    title: 'Built on Morpho',
    titleCollapsed: 'Built on\nMorpho',
    body: "Purinta is built on Morpho's battle-tested lending infrastructure — the same protocol securing billions in DeFi. No shortcuts on security.",
    mascot: asset('/assets/figma/features/morpho.png'),
    mascotSize: { w: 161, h: 140 },
    accent: {
      bg: 'var(--color-warning-50)',
      border: 'var(--color-warning-400)',
      blob: 'var(--color-warning-200)',
    },
    blobRotate: { collapsed: 156.39, expanded: 49.81 },
    /* Lift the polaroid 32 px in expanded (default bottom -34 → -2)
     * so the butterfly composition isn't half-cut by the card edge. */
    expandedOverride: {
      image: { bottom: -2 },
    },
  },
  {
    /* Per Figma node 383:4769: Mainnet card uses the Info palette (blue). */
    id: 'mainnet',
    title: 'Mainnet Native',
    titleCollapsed: 'Mainnet\nNative',
    body: 'Live on Ethereum mainnet from day one. Deep liquidity, real security, no testnet games. Your memes deserve the real thing.',
    mascot: asset('/assets/figma/features/mainnet.png'),
    mascotSize: { w: 126, h: 160 },
    accent: {
      bg: 'var(--color-info-50)',
      border: 'var(--color-info-400)',
      blob: 'var(--color-info-200)',
    },
    blobRotate: { collapsed: 68.38, expanded: 49.81 },
    /* Mainnet expanded: pull the polaroid 32 px LEFT (right -8 → 24)
     * so the crystal/cloud illustration balances against the title
     * column instead of bleeding past the right edge. */
    expandedOverride: {
      image: { right: 24 },
    },
  },
  {
    /* Per Figma node 383:5010: Api3 card uses Green (the brand color),
     * not Mint — matches the protocol identity. */
    id: 'api3',
    title: 'Powered by Api3',
    titleCollapsed: 'Powered\nby Api3',
    body: 'First-party oracle feeds with OEV capture. Accurate pricing for your memecoins, with value flowing back to the protocol.',
    mascot: asset('/assets/figma/features/api3.png'),
    mascotSize: { w: 123, h: 134 },
    accent: {
      bg: 'var(--color-green-50)',
      border: 'var(--color-green-400)',
      blob: 'var(--color-green-100)',
    },
    blobRotate: { collapsed: -9.47, expanded: 49.81 },
    /* Api3 expanded: shift the polaroid 32 px LEFT and 32 px UP from
     * the default expanded anchor so the flexing-arms pose sits
     * centered against the title column, not hugging the corner. */
    expandedOverride: {
      image: { right: 24, bottom: -2 },
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
      /* Negative top margin pulls the entire section UP by 200 px so
       * the title + cards sit higher in the page, overlapping the
       * tail of the hero hill ellipse. The cards (z-40) and title
       * (z-40) paint above the hill (z-30), and the Features bg
       * gradient still fades in transparent → Neutral/50 underneath. */
      className="relative -mt-[200px] w-full pt-[60px] pb-32"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, transparent 0px, var(--color-neutral-50) 240px)',
      }}
      data-node-id="383:4066"
    >
      <div className="relative z-40 mx-auto w-full max-w-[1024px] px-6">
        {/* Section title — Rubik Medium 39px per Figma (UI/2xl-medium).
         * The `reveal reveal-up` classes hook into the global useReveal
         * hook in App.tsx for the original-reference-site entrance
         * (fade in + slight rise on intersection). */}
        <h2 className="reveal reveal-up text-center font-body text-[39px] leading-[1] font-medium tracking-[0.88px] text-[var(--color-neutral-900)]">
          Why Degens Love Purinta
        </h2>
      </div>

      {/* Cards row — pulled OUT of the 1024 safe-area container so it
          can bleed slightly past it when one card is active (active
          384 + 4 collapsed × 198 + gaps ≈ 1208 px). Centered on the
          page instead. z-40 so the cards paint above the hero hill
          ellipse that overflows down into this section. */}
      <div className="relative z-40 mx-auto mt-16 flex w-fit max-w-none justify-center">
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
              index={i}
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
  /** Position of this card in the row (0..4) — drives the entrance
   * stagger so the cards appear one after the other as the user
   * scrolls them into view. */
  index: number
}

function Card({ card, isActive, onSelect, index }: CardProps) {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    /* Wrapper drives the SCROLL-IN entrance animation (opacity + rise)
     * with a staggered delay per `index`. It's the flex item — the
     * button inside resizes (width animate) within the wrapper, so
     * the entrance and the auto-cycle width transitions don't fight
     * each other (each owns a distinct property + transition). */
    <motion.div
      className="shrink-0"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: 'easeOut',
      }}
    >
      <motion.button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-controls={`feature-panel-${card.id}`}
        id={`feature-tab-${card.id}`}
        onClick={onSelect}
        animate={{
          /* Collapsed cards are 152 px wide (Figma node 454:8821).
           * With 1 expanded (384) + 4 collapsed (152) + 4 gaps (8 each)
           * the row totals exactly 1024 px — fitting the safe content
           * area perfectly without the overflow the 198 variant had. */
          width: isActive ? 384 : 152,
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
        className="relative h-[416px] cursor-pointer rounded-[24px] border border-solid bg-white text-left transition-colors duration-500 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
      {/* Clip-wrapper — masks any content that would otherwise spill
       * past the card's rounded boundary (notably the expanded h3
       * title, which is wider than the collapsed pill and overflows
       * during the width-expand animation). Everything inside is
       * clipped to the rounded card shape; the polaroid IMAGE is
       * rendered OUTSIDE this wrapper so it can still float past the
       * card edge in the active state. */}
      <div className="absolute inset-0 overflow-hidden rounded-[24px]">
        <CollapsedContent isActive={isActive} />
        <ExpandedContent card={card} isActive={isActive} />
        {/* Blob lives BEHIND the text layers — Star + Title + Divider
         * sit on top via z-10. */}
        <MascotBlob card={card} isActive={isActive} />
        <Star card={card} isActive={isActive} />
        <Title card={card} isActive={isActive} />
        <Divider card={card} isActive={isActive} />
      </div>

      {/* Polaroid — outside the clip wrapper so it can float past the
       * card boundary as a sticker in the expanded state. */}
      <MascotImage card={card} isActive={isActive} />
      </motion.button>
    </motion.div>
  )
}

function CollapsedContent({ isActive }: { isActive: boolean }) {
  /* Currently CollapsedContent has no per-state body — all the visible
   * collapsed-state elements (star, title, divider, mascot, blob) are
   * persistent layers at the Card level. This component is kept as a
   * placeholder so the Card structure stays symmetric with
   * ExpandedContent and so we have a hook if we later need any
   * collapsed-only flourish. */
  return (
    <motion.div
      animate={{ opacity: isActive ? 0 : 1 }}
      transition={{ duration: 0.13, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center px-4 pt-[60px] pb-5"
    >
      {/* Star + Title + Divider live at Card level (persistent across
          states). See sibling <Divider /> in Card for the line that
          animates scaleX between states. */}
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
      className="pointer-events-none absolute inset-0 z-10"
    >
      {/* Body + Learn-more cross-fade in this slot. Positioned
       *  absolutely just below the title so the gap is the
       *  Figma-spec 8 px (title.bottom = 64 + 31 = 95, body.top = 103). */}
      <div
        className="pointer-events-auto absolute flex flex-col gap-2"
        style={{ top: 103, left: 32, right: 32 }}
      >
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
/* Per-card stroke colors for the star outline — matches each Figma
 * star-*.svg file's `stroke="..."` hardcoded value. Kept as a const
 * table (instead of on CardData) because the stroke is tied to the
 * SVG shape itself, not the card's broader accent system. */
const STAR_STROKES: Record<string, string> = {
  borrow: '#FEAAA4', // Blush/500
  apy: '#41C8BD', // Success/500
  morpho: '#F98C4B', // Warning/500
  mainnet: '#669FFF', // Info/400
  api3: '#57A053', // Green/400
}

/* Path data for the 25% star — identical across all card-specific
 * star-*.svg files (only the fill / stroke colors differ between
 * them), so we inline the geometry once and let `motion.path`
 * animate the fill between states. */
const STAR_FILL_PATH =
  'M17.3998 8.30777C17.2328 8.31472 17.1007 8.40515 17.0589 8.54428L15.3824 13.6502L15.3338 13.8033L15.1877 13.8659L9.74782 16.1406C9.58782 16.2102 9.53217 16.3354 9.53913 16.4467C9.54608 16.558 9.61565 16.6832 9.7826 16.7388L15.0625 18.4223L15.2085 18.471L15.2711 18.617L17.678 24.0986C17.7406 24.2378 17.8798 24.3143 18.0537 24.3073C18.2206 24.3004 18.3528 24.203 18.3945 24.0639L20.1267 18.2414L20.1823 18.0675L20.3562 18.0118L25.2952 16.4049C25.4691 16.3493 25.5387 16.2171 25.5387 16.0989C25.5387 15.9806 25.4691 15.8554 25.2952 15.7928L20.3771 14.1998L20.231 14.1511L20.1684 14.005L17.7685 8.52341L17.7476 8.46776C17.678 8.35646 17.5528 8.30081 17.3998 8.31472V8.30777Z'
const STAR_STROKE_PATH =
  'M17.3805 7.84683C17.0611 7.86017 16.7281 8.04505 16.6178 8.4103L14.9596 13.4601L9.56994 15.715L9.56408 15.7169C9.22644 15.8637 9.05962 16.17 9.07873 16.4757C9.09695 16.7655 9.28265 17.0589 9.63635 17.1769L9.64221 17.1789L14.8668 18.8439L17.2555 24.2843L17.2574 24.2882C17.4115 24.6302 17.7469 24.7816 18.0719 24.7687H18.0729C18.4085 24.7547 18.7306 24.5494 18.8365 24.1964V24.1955L20.5514 18.4328L25.4362 16.8439C25.7619 16.7395 25.9491 16.4854 25.9908 16.215L26.0006 16.0988L25.9908 15.9787C25.9472 15.7042 25.7544 15.4676 25.4518 15.3585L25.4371 15.3537L20.5738 13.7785L18.194 8.3439L18.1793 8.30581L18.1393 8.2228C17.9847 7.97551 17.7313 7.86176 17.4762 7.85269C17.4448 7.84742 17.4127 7.84548 17.3805 7.84683Z'

function Star({ card, isActive }: { card: CardData; isActive: boolean }) {
  const reduceMotion = useReducedMotion()
  /* No delay — the star repositions IN PARALLEL with the divider's
   * disappearing scaleX (both start at t=0), instead of waiting for
   * the 130 ms pill delay like the mascot does. That keeps the upper
   * card area visually coordinated during state changes. */
  const transition = reduceMotion
    ? { duration: 0 }
    : ({ type: 'spring', stiffness: 180, damping: 24 } as const)
  const fillTransition = reduceMotion
    ? { duration: 0 }
    : ({ duration: 0.45, ease: 'easeOut' } as const)

  /* Star is rendered as an inline `<motion.svg>` so the stroke (a
   * separate colored path) is preserved while the inner fill path can
   * animate its `fill` attribute between states. Per the Figma design:
   *   collapsed → fill = light accent.blob shade + stroke outline
   *   expanded  → fill = white (#FEFEFE) + same stroke outline
   *
   * Anchor box was 16 (collapsed) / 24 (expanded) at the top-left in
   * Figma but the visible star glyph extends past it via negative
   * insets, giving an actual visual size of 35×35 / 52.7×52.7. */
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 35.0772 35.077"
      fill="none"
      preserveAspectRatio="none"
      className="pointer-events-none absolute z-10"
      style={{
        /* Matches the original SVG drop-shadow filter (Cream/500 at
         * 30 % alpha, soft 4.3 px blur, 1.2 px y-offset). */
        filter: 'drop-shadow(0 1.23px 4.31px rgba(214, 210, 178, 0.3))',
      }}
      animate={{
        top: isActive ? 19.5 : 31.7,
        left: isActive ? 17.7 : 6.5,
        width: isActive ? 52.66 : 35.08,
        height: isActive ? 52.66 : 35.08,
      }}
      transition={transition}
    >
      <motion.path
        d={STAR_FILL_PATH}
        initial={false}
        animate={{ fill: isActive ? '#FEFEFE' : card.accent.blob }}
        transition={fillTransition}
      />
      <path
        d={STAR_STROKE_PATH}
        stroke={STAR_STROKES[card.id] ?? card.accent.border}
        strokeWidth="0.923085"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}

/* ============================================================
 * Title — cross-fades between two separate text nodes (NOT a
 * single morphing element). Per the typographic / brand consult,
 * the 2-line collapsed wrap ("Borrow\nAgainst Memes") is a real
 * design decision — verb isolated, object phrase intact — and
 * should not be sacrificed to a scale-morph. The container pill
 * does the continuous work; the two titles fade in / out within
 * the same slot so the eye reads them as one title transforming.
 *
 * Per Figma:
 *   collapsed (198 pill): 25/25 Semibold tracking 0.5, width ~120,
 *                         (left 16, top 80)
 *   expanded  (384 pill): 31/31 Semibold tracking 0.62, width ~316,
 *                         (left 32, top 72)
 *
 * Timing (within the 350 ms pill spring):
 *   out: 0–140 ms, in: 120–280 ms, 20 ms overlap window
 *   ease cubic-bezier(0.32, 0.72, 0, 1) on both opacity and y
 *   3 px y-translate on the incoming element (more reads as a swap)
 *   60 ms delay so the pill leads, the title follows
 * ============================================================ */
const TITLE_EASE = [0.32, 0.72, 0, 1] as const
const TITLE_OUT_DURATION = 0.14
const TITLE_IN_DURATION = 0.16
const TITLE_IN_DELAY = 0.12 + 0.06 // 60 ms after the pill's 130 ms delay = ~190 ms total

function Title({ card, isActive }: { card: CardData; isActive: boolean }) {
  const reduceMotion = useReducedMotion()

  /* Outgoing variant: opacity 1 → 0 immediately on state change.
     Incoming variant: opacity 0 → 1 after a small lag + slight y-rise. */
  const outTransition = reduceMotion
    ? { duration: 0 }
    : { duration: TITLE_OUT_DURATION, ease: TITLE_EASE }
  const inTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: TITLE_IN_DURATION,
        delay: TITLE_IN_DELAY,
        ease: TITLE_EASE,
      }

  return (
    <>
      {/* Collapsed variant — visible when !isActive */}
      <motion.h3
        aria-hidden={isActive}
        className="pointer-events-none absolute z-10 m-0 font-display font-semibold whitespace-pre-line text-[var(--color-neutral-900)]"
        style={{
          /* Smaller (16/16) per the 152 px-wide collapsed card spec
           * but kept at top:80 (same as the original 198 variant) so
           * the cross-fade between the collapsed and expanded title
           * variants stays smooth — pushing top down to 120 made the
           * two variants too far apart in the viewport and the fade
           * read as a visible jump. */
          top: 80,
          left: 16,
          width: 120,
          fontSize: 16,
          lineHeight: '16px',
          letterSpacing: '0.32px',
          willChange: 'opacity, transform',
        }}
        initial={false}
        animate={{
          opacity: isActive ? 0 : 1,
          y: isActive ? -2 : 0,
        }}
        transition={isActive ? outTransition : inTransition}
      >
        {card.titleCollapsed}
      </motion.h3>

      {/* Expanded variant — visible when isActive.
       *   y = star.top (32) + star.size (24) + gap-8 = 64 per Figma */}
      <motion.h3
        aria-hidden={!isActive}
        className="pointer-events-none absolute z-10 m-0 font-display font-semibold text-[var(--color-neutral-900)]"
        style={{
          top: 64,
          left: 32,
          width: 316,
          fontSize: 31,
          lineHeight: '31px',
          letterSpacing: '0.62px',
          willChange: 'opacity, transform',
        }}
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 3,
        }}
        transition={isActive ? inTransition : outTransition}
      >
        {card.title}
      </motion.h3>
    </>
  )
}

/* ============================================================
 * Divider — 1 px accent line under the title. Persistent across
 * states; on activate it collapses from right to left (scaleX
 * 1 → 0 with origin: left), on de-activate it grows back the
 * opposite way (0 → 1, sweeping in from left to right).
 *
 * Position: y = 60 (pt of CollapsedContent) + 110 (spacer) = 170.
 * Width spans the card pill width minus 16 px padding each side.
 * ============================================================ */
function Divider({
  card,
  isActive,
}: {
  card: CardData
  isActive: boolean
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute z-10 origin-left border-b"
      style={{
        top: 170,
        left: 16,
        right: 16,
        borderColor: card.accent.border,
      }}
      animate={{ scaleX: isActive ? 0 : 1 }}
      transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
    />
  )
}

/* ============================================================
 * Mascot pieces — SPLIT INTO TWO COMPONENTS so the Card can render
 * the blob INSIDE a clip-wrapper (clipped to the card's rounded
 * boundary along with the text layers) while keeping the polaroid
 * image OUTSIDE the clip so it can still float past the card edge:
 *
 *   <Card>
 *     <ClipWrapper overflow-hidden rounded>
 *       …text + <MascotBlob />…   ← all clipped to card
 *     </ClipWrapper>
 *     <MascotImage />              ← floats freely past card
 *   </Card>
 *
 * Each card has a unique blob shape (Figma ellipse-107..111) and
 * rotation per state, plus a polaroid mascot at its natural pixel
 * size scaled 1.4× when expanded.
 * ============================================================ */
function useMascotTransition(isActive: boolean) {
  const reduceMotion = useReducedMotion()
  /* Shared spring so the blob + polaroid feel coherent — position,
   * size and rotation all use the same curve in both pieces. */
  return reduceMotion
    ? { duration: 0 }
    : ({
        type: 'spring',
        stiffness: 180,
        damping: 24,
        delay: isActive ? 0.13 : 0,
      } as const)
}

function MascotBlob({
  card,
  isActive,
}: {
  card: CardData
  isActive: boolean
}) {
  const transition = useMascotTransition(isActive)

  /* Anchor insets — per-card overrides applied on top of defaults.
   * Collapsed defaults center the 135 px-wide blob horizontally in
   * the new 152 px card ((152-135)/2 ≈ 9) and lift it up to ~75 px
   * from the bottom so it sits centered-ish under the title rather
   * than tucked into the bottom-right corner. */
  const right = isActive
    ? (card.expandedOverride?.blob?.right ?? 28)
    : (card.collapsedOverride?.blob?.right ?? 9)
  const bottom = isActive
    ? (card.expandedOverride?.blob?.bottom ?? 48)
    : (card.collapsedOverride?.blob?.bottom ?? 75)

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        WebkitMaskImage: `url(${asset(`/assets/figma/features/blob-${card.id}.svg`)})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: `url(${asset(`/assets/figma/features/blob-${card.id}.svg`)})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
      animate={{
        right,
        bottom,
        width: isActive ? 170 : 135,
        height: isActive ? 150 : 120,
        backgroundColor: isActive ? card.accent.blob : card.accent.bg,
        rotate: isActive
          ? card.blobRotate.expanded
          : card.blobRotate.collapsed,
      }}
      transition={transition}
    />
  )
}

function MascotImage({
  card,
  isActive,
}: {
  card: CardData
  isActive: boolean
}) {
  const transition = useMascotTransition(isActive)

  /* Collapsed `right` is computed per-card so the polaroid is
   * horizontally CENTERED in the 152 px card regardless of its
   * natural width: right = (152 - mascot.w) / 2. The wider morpho
   * mascot (161) goes slightly negative — its arms intentionally
   * extend past the card edge per the Figma design.
   * Collapsed `bottom` lifts the polaroid 60 px above the card's
   * bottom so it sits near the lower-middle of the card under the
   * title block, instead of flush with the bottom edge. */
  const right = isActive
    ? (card.expandedOverride?.image?.right ?? -8)
    : (card.collapsedOverride?.image?.right ??
       Math.round((152 - card.mascotSize.w) / 2))
  const bottom = isActive
    ? (card.expandedOverride?.image?.bottom ?? -34)
    : (card.collapsedOverride?.image?.bottom ?? 60)

  return (
    /* Polaroid scales 1.4× when expanded (Figma 454:8816 — polaroid
     * 177×221 vs collapsed 127×156 = 1.39× linear). Origin bottom-right
     * so scale grows up-and-left from a fixed anchor; in expanded the
     * anchor is OUTSIDE the card so the polaroid floats past the
     * boundary, in collapsed it tucks into the bottom-right corner. */
    <motion.img
      src={card.mascot}
      alt=""
      aria-hidden
      width={card.mascotSize.w}
      height={card.mascotSize.h}
      className="pointer-events-none absolute max-w-none drop-shadow-[0_8px_8px_rgba(0,0,0,0.15)]"
      style={{ transformOrigin: 'bottom right' }}
      animate={{
        right,
        bottom,
        width: card.mascotSize.w,
        height: card.mascotSize.h,
        rotate: isActive ? 6 : 0,
        scale: isActive ? 1.4 : 1,
      }}
      transition={transition}
    />
  )
}
