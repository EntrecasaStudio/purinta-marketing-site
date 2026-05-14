import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { asset } from '@/lib/utils'

/**
 * HowItWorks — Figma node 454:7091.
 *
 * Scroll-driven 3-step explainer. The outer <section> is 3.6× the
 * viewport tall; inside it a sticky frame fills the viewport and pins
 * itself to the top while the user scrolls past. Inside the pinned
 * frame a horizontal track of 3 panels slides leftward as the section
 * scrolls (panel 1 → 2 → 3). Once all three panels have advanced past
 * the viewport, the sticky pin releases and normal downward scrolling
 * resumes.
 *
 * Title placement:
 *  The "How It Works" title lives in its OWN fixed-position layer
 *  (above the sticky pin) with opacity driven by the section's
 *  intersection range. That way the title is at the top of the
 *  viewport from the very moment the section starts entering — not
 *  just once the sticky pin engages — and it lingers there for the
 *  full visibility window before fading out as the section exits.
 *
 * Reveal sequencing (per UX spec):
 *  - The giant numeral + mascot live INSIDE the sliding track and so
 *    enter naturally from the right edge as the panel slides in.
 *  - Title + body of each panel are kept invisible until the panel
 *    reaches its design position; then the title pops in with a
 *    jelly/bounce spring and the body fades in just after, while the
 *    pinned background crossfades to the next per-panel color.
 *  - prefers-reduced-motion: panels stacked vertically, no scroll pin.
 */

type Step = {
  num: string
  title: string
  body: string
  /** Per-panel screenshot from Figma (includes any wrapper rotation
   * baked in — no further CSS rotation required). */
  mascot: string
  /** Absolute offsets within the numeral column (px). Width is the
   * screenshot's natural canvas width — the screenshot already
   * captures the rotated frame's bounding box, so just render at this
   * exact pixel size and position. */
  mascotPosition: { top: number; left: number; width: number }
  /** Vertical nudge of the numeral within the column (px). The digit
   * itself is a fixed 256.11 px text-centered box pinned to the
   * column's left edge — in Figma every step's "Front" text node sits
   * at x=0 within the number column (454:7100 / 7181 / 7195) — so only
   * the vertical offset varies per step. */
  numberTop: number
  /** Per-step accent colors from Figma — the giant numeral and the
   * panel title. Each step keys to its own palette family (green /
   * cream / blush). */
  numberColor: string
  titleColor: string
}

const steps: Step[] = [
  {
    num: '1',
    title: 'Deposit\nyour memes',
    body: 'Connect your wallet, pick a market (PEPE, SHIB, etc.), and deposit your memecoins as collateral.',
    /* Figma node 454:7100. The "1" sits at x=0 in the number column;
     * mascot wrapper at ml-0 mt-40.17 with rotation -12.65° (rotation
     * already baked into the PNG export). */
    mascot: asset('/assets/figma/how-it-works/step-1.png'),
    /* Manual nudge: top +80 to drop the mascot into the bottom curve of
     * the "1". `left` tracks the digit — it's shifted the same -45 px
     * the centered "1" moved, so the number + mascot stay a unit. */
    mascotPosition: { top: 120, left: -129, width: 296 },
    numberTop: 0,
    numberColor: '#498746', // Green/500
    titleColor: '#57A053', // Green/400
  },
  {
    num: '2',
    title: 'Borrow USDC',
    body: 'Choose how much USDC to borrow — up to 62.5% of your collateral value with built-in safety buffers.',
    /* Figma node 454:7181. The "2" sits at x=0 in the number column,
     * nudged ~16 px down; mascot wrapper at ml-0 mt-0 with rotation
     * +19.62° (baked into PNG). The screenshot canvas (353×284) is
     * 42 px wider than the Figma wrapper (311×284) because the
     * character's arms overflow LEFT of the wrapper bounds, so we
     * shift left by -42 to keep the wrapper origin aligned with the
     * column origin. */
    mascot: asset('/assets/figma/how-it-works/step-2.png'),
    /* Manual nudge: top +94 to align the mascot with the bottom hump of
     * the "2". `left` tracks the digit — it's shifted the same -87 px
     * the centered "2" moved, so the number + mascot stay a unit. */
    mascotPosition: { top: 94, left: -129, width: 353 },
    numberTop: 16,
    numberColor: '#8B8765', // Cream/900
    titleColor: '#8B8765', // Cream/900
  },
  {
    num: '3',
    title: 'Chill',
    body: 'Use your USDC anywhere. When ready, repay your loan and get your memecoins back. Moon mission intact.',
    /* Figma node 454:7195. The "3" sits at x=0 in the number column;
     * mascot frame at ml-0 mt-34.54 (no outer rotation). */
    mascot: asset('/assets/figma/how-it-works/step-3.png'),
    /* Manual nudge: top +70 to drop the peaceful mascot into the bottom
     * curve of the "3". `left` tracks the digit — it's shifted the same
     * -54 px the centered "3" moved, so the number + mascot stay a
     * unit. */
    mascotPosition: { top: 105, left: -70, width: 256 },
    numberTop: 0,
    numberColor: '#CC5550', // Blush/700
    titleColor: '#CC5550', // Blush/700
  },
]

/* Per-panel backgrounds from Figma (495:11062 / 11099 / 11113). */
const BG_COLORS = [
  '#FEFEFE', // Neutral/50  — Step 1
  '#F0EDD4', // Cream/300   — Step 2
  '#FEC4C0', // Blush/400   — Step 3
] as const

/* Active-step thresholds. The flip happens slightly BEFORE each panel
 * finishes landing so the title pop + bg crossfade land just as the
 * numeral snaps into place (not lagged after). Both sit below their
 * panel's dwell-end fraction (0.5 / 1.0) so `activeStep` holds steady
 * through the entire dwell. */
const STEP_2_THRESHOLD = 0.42
const STEP_3_THRESHOLD = 0.92

/* Flow-width of each panel's number column. The number + mascot are
 * absolutely positioned inside it, so this value only controls where
 * the sibling text column starts. It's tuned so the text column's
 * left edge lands on the same x as the centered "How It Works" title
 * — and the title is rendered through the SAME grid (number-column
 * spacer + gap) so the two stay aligned at any viewport width. */
const NUMBER_COL_FLOW_WIDTH = 221

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  /* Single scroll reading drives the track translation + step flips
   * (0→1 while the sticky pin is engaged). The title lives INSIDE the
   * sticky pin so it rides up from the bottom of the viewport
   * together with step 1's content as the section enters, then pins
   * to the top of the viewport once the sticky engages — exactly the
   * behavior the user signed off on. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  /* Horizontal slide: 3 panels stacked horizontally in a flex track.
   * Sliding by -66.6667% of the 300%-wide track exposes panel 3.
   *
   * The mapping is stepped, not linear, so panels 2 and 3 DWELL — they
   * hold stationary for a stretch of continued scroll once they land,
   * giving the user time to read. The section's 292vh scroll range
   * (see the section height note) breaks down as:
   *   130vh  slide  panel 1 → 2
   *    16vh  DWELL  panel 2 held   (~145–175 px on desktop)
   *   130vh  slide  panel 2 → 3
   *    16vh  DWELL  panel 3 held
   * The plateau keyframes (repeated output values) are the holds:
   *   0.4452 = 130/292, 0.5 = 146/292, 0.9452 = 276/292. */
  const x = useTransform(
    scrollYProgress,
    [0, 0.4452, 0.5, 0.9452, 1],
    ['0%', '-33.3333%', '-33.3333%', '-66.6667%', '-66.6667%'],
  )

  /* Active step (1/2/3) — discrete flips, NOT a smooth interpolation,
   * because the title + bg are supposed to "land" with a snap rather
   * than slowly crossfade across the whole scroll. */
  const [activeStep, setActiveStep] = useState(1)
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const step =
      latest < STEP_2_THRESHOLD ? 1 : latest < STEP_3_THRESHOLD ? 2 : 3
    setActiveStep((prev) => (prev === step ? prev : step))
  })

  /* `revealed` flips to true the first time the section intersects the
   * viewport. We gate panel 1's bounce-in on it because panel 1's
   * `isActive` is true from the moment React mounts — without the
   * gate, motion would run the spring animation BEFORE the user
   * scrolls down to the section, and by the time they arrived the
   * bounce would already be done. Panels 2 & 3 are still triggered
   * by their activeStep flips since `revealed` is already true by
   * the time those scroll thresholds get crossed. */
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const target = ref.current
    if (!target) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  /* Reduced-motion fallback — render the 3 panels stacked vertically
   * with their flat Figma backgrounds, no scroll pin, no slide. */
  if (reduceMotion) {
    return (
      <section id="how-it-works" className="relative w-full">
        <div className="py-12 text-center">
          <h2 className="font-body text-[39px] leading-[1] font-medium tracking-[0.88px] text-[var(--color-neutral-900)]">
            How It Works
          </h2>
        </div>
        {steps.map((step, i) => (
          <div
            key={step.num}
            className="flex w-full justify-center px-10 py-16"
            style={{ backgroundColor: BG_COLORS[i] }}
          >
            <PanelContent step={step} isActive />
          </div>
        ))}
      </section>
    )
  }

  return (
    <section
      id="how-it-works"
      ref={ref}
      /* z-40 lifts the whole section above the Hero's hill ellipse
       * (z-30) which extends ~300 px PAST Features' bottom into the
       * top of HowItWorks. Without this, the ellipse would render on
       * top of the title + first panel during the entry phase. */
      className="relative z-40 w-full"
      /* 3.92× viewport. The sticky pin eats 100vh, leaving a 292vh
       * scroll range: 130vh + 130vh to slide between the three panels,
       * plus two 16vh DWELL stretches where panels 2 and 3 hold
       * stationary so the user can read (see the `x` transform note).
       * The title rides up from below INSIDE the sticky pin, together
       * with step 1's content, like the Figma layout. */
      style={{ height: '392vh' }}
    >
      <motion.div
        className="sticky top-0 flex h-screen w-full flex-col overflow-hidden"
        /* initial={false} skips the mount-time bg animation so the pin
         * renders at step 1's color from the first frame (without it
         * the bg-color animate would run "default → step 1" on mount,
         * reading like an unintentional fade-in). */
        initial={false}
        animate={{ backgroundColor: BG_COLORS[activeStep - 1] }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* ---------- Top: "How It Works" title ----------
         *  A flex child at the top of the sticky pin; the docs-link row
         *  is a matching flex child at the bottom. The track sits
         *  `flex-1` between them, so the panel content centers in the
         *  exact gap between the title and the docs CTA — not against
         *  the full viewport.
         *  The `reveal reveal-up` classes hook into the global useReveal
         *  hook in App.tsx — same fade+rise entrance pattern as the
         *  original reference site's main titles (see Community.tsx,
         *  Ecosystem.tsx for the existing usage). */}
        <div className="relative z-10 flex shrink-0 justify-center pt-12">
          {/* Title rides the same grid as the panels — a number-column
           * spacer + 40 px gap — so its left edge lands exactly on the
           * panels' title/body text column. */}
          <div className="flex w-full max-w-[1232px] items-center gap-[40px] pl-[208px]">
            <div
              aria-hidden
              className="shrink-0"
              style={{ width: NUMBER_COL_FLOW_WIDTH }}
            />
            <h2 className="reveal reveal-up font-body text-[39px] leading-[1] font-medium tracking-[0.88px] text-[var(--color-neutral-900)]">
              How It Works
            </h2>
          </div>
        </div>

        {/* ---------- Horizontal track ---------- */}
        <motion.div
          className="flex flex-1 will-change-transform"
          style={{ x, width: '300%' }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              /* Each panel is 1/3 of the 300% track = 100vw effective.
               * The track is `flex-1` between the title row and the
               * docs-link row, so `items-center` centers the content in
               * the exact gap between them. `py-8` is symmetric (no
               * vertical bias) — it only acts as a min gap on very short
               * viewports, it doesn't shift the resting position. */
              className="flex h-full w-1/3 shrink-0 items-center justify-center px-10 py-8"
            >
              {/* Whole-panel fade gated on `revealed` — this covers
               * the giant numeral (which has no isActive animation of
               * its own) so panel 1's number fades in alongside the
               * title/body/mascot when the section first enters the
               * viewport. Panels 2 & 3 also fade in at the same moment
               * but they're off-screen at the time, so the fade isn't
               * visible until they slide into view. */}
              <motion.div
                className="flex w-full justify-center"
                initial={false}
                animate={{ opacity: revealed ? 1 : 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <PanelContent
                  step={step}
                  /* Combined active state: gated on `revealed` so panel 1
                   * (whose activeStep === 1 from mount) only triggers its
                   * bounce-in animation AFTER the section enters the
                   * viewport, not on initial mount when it's still
                   * off-screen. */
                  isActive={activeStep === i + 1 && revealed}
                />
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* ---------- Bottom: docs link (persistent across panels) ----------
         *  A flex child (not absolute) so it bookends the track — the
         *  panel content centers in the gap between this row and the
         *  title row above. Styled per Figma (node 495:11195): Rubik
         *  Medium 15/20, Green/600, no underline, chevron-right icon,
         *  sitting 40 px off the viewport bottom. */}
        <a
          href="https://docs.purinta.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="z-10 mb-10 flex shrink-0 items-center gap-[2px] self-center font-body text-[15px] leading-[20px] font-medium text-[var(--color-green-600)] transition-opacity hover:opacity-70"
        >
          Learn more in the docs
          <ChevronRight className="size-5" strokeWidth={2.5} />
        </a>
      </motion.div>
    </section>
  )
}

/* ============================================================
 * Panel content (giant number + mascot + title + body).
 *
 * The numeral + mascot are ALWAYS visible (they slide in with the
 * track). The title + body are kept hidden until `isActive` flips to
 * true (when the panel reaches its design position); then the title
 * pops with a jelly spring and the body fades in slightly after.
 *
 * Layout per Figma:
 *  - Numeral column: NUMBER_COL_FLOW_WIDTH × 332. The digit is a fixed
 *    256.11 px text-centered box at the column's left edge (Figma
 *    pins the "Front" text node at x=0 in every step); the mascot is
 *    absolutely positioned over it at its own ml/mt offsets. The
 *    column's flow width is decoupled from both — tuned purely for
 *    where the sibling text column starts.
 *  - Then a 40 px gap to the title+body column (1 fr).
 * ============================================================ */
function PanelContent({ step, isActive }: { step: Step; isActive: boolean }) {
  return (
    <div className="flex w-full max-w-[1232px] items-center justify-center gap-[40px] pl-[208px]">
      {/* ---------- Number column (absolute positioning per Figma) ----------
       *  Shifted up 70 px so the number + mascot sit higher than the
       *  text column, matching the Figma composition. The translate is
       *  visual-only — it doesn't affect the column's flow width (which
       *  still drives where the text column starts). */}
      <div
        className="relative shrink-0 -translate-y-[70px]"
        style={{ width: NUMBER_COL_FLOW_WIDTH, height: 332 }}
      >
        {/* The digit is a fixed 256.11 px text-centered box pinned to
         * the column's left edge — exactly the Figma "Front" text node,
         * which sits at x=0 within the number column in every step. */}
        <span
          className="absolute font-display text-center"
          style={{
            top: step.numberTop,
            left: 0,
            width: 256.11,
            fontSize: 437,
            lineHeight: 1,
            fontWeight: 500,
            letterSpacing: '-21.87px',
            color: step.numberColor,
          }}
        >
          {step.num}
        </span>
        {/* Mascot — jelly bounce in together with the title when the
         * panel becomes active. Until then it's hidden (scale 0.5,
         * opacity 0), so only the giant numeral slides in with the
         * panel from the right; the mascot character pops in only
         * once the panel lands at its design position. */}
        <motion.img
          src={step.mascot}
          alt=""
          aria-hidden
          /* No CSS rotation: the screenshot already captures the
           * frame's rotated bounding box, so just place it at the
           * Figma `ml`/`mt` of the mascot wrapper. */
          className="pointer-events-none absolute max-w-none"
          style={{
            top: step.mascotPosition.top,
            left: step.mascotPosition.left,
            width: step.mascotPosition.width,
            /* Bounce from the center-bottom so it reads like the
             * mascot is "landing" into its spot, not zooming out
             * from a corner. */
            transformOrigin: 'center bottom',
          }}
          initial={false}
          animate={{
            scale: isActive ? 1 : 0.5,
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 24,
          }}
          transition={
            isActive
              ? {
                  type: 'spring',
                  stiffness: 360,
                  damping: 12,
                  mass: 0.7,
                }
              : { duration: 0.18, ease: 'easeOut' }
          }
        />
      </div>

      {/* ---------- Title + body (revealed when panel lands) ---------- */}
      <div className="flex flex-1 flex-col gap-6">
        {/* Title — jelly bounce on activation. Origin bottom-left so
         * the bounce reads as the title "popping up" from the baseline
         * rather than scaling from its own center. */}
        <motion.h3
          className="font-display font-bold whitespace-pre-line"
          style={{
            color: step.titleColor,
            fontSize: 95,
            lineHeight: '95px',
            letterSpacing: '0.95px',
            transformOrigin: 'left bottom',
          }}
          initial={false}
          animate={{
            scale: isActive ? 1 : 0.6,
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 24,
          }}
          transition={
            isActive
              ? {
                  type: 'spring',
                  stiffness: 360,
                  damping: 12,
                  mass: 0.7,
                }
              : { duration: 0.18, ease: 'easeOut' }
          }
        >
          {step.title}
        </motion.h3>

        {/* Body — simple fade + rise, slightly delayed so it lands
         * right after the title finishes its first wobble. */}
        <motion.p
          className="font-body text-[#4C4C4C]"
          style={{
            fontSize: 25,
            lineHeight: '38px',
            letterSpacing: '0.25px',
            maxWidth: 465,
          }}
          initial={false}
          animate={{
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 12,
          }}
          transition={
            isActive
              ? { duration: 0.45, delay: 0.22, ease: 'easeOut' }
              : { duration: 0.18, ease: 'easeOut' }
          }
        >
          {step.body}
        </motion.p>
      </div>
    </div>
  )
}
