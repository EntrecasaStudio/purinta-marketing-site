import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { ChevronRight } from 'lucide-react'
import HowItWorksMobile from '@/components/sections/HowItWorksMobile'

/* SVGs split out of Figma Type=N, Size=lg combined exports (one path
 * = digit, the rest = mascot). Imported as raw strings (?raw) so we
 * can inline them via dangerouslySetInnerHTML and render true inline
 * <svg> markup — <img src=*.svg> rasterises at the intrinsic size
 * first and then CSS transforms scale the bitmap, which pixelates in
 * Safari/Retina at any non-1× scale. */
import step1NumberSvg from '@/assets/figma/how-it-works/step-1-number.svg?raw'
import step1MascotSvg from '@/assets/figma/how-it-works/step-1-mascot.svg?raw'
import step2NumberSvg from '@/assets/figma/how-it-works/step-2-number.svg?raw'
import step2MascotSvg from '@/assets/figma/how-it-works/step-2-mascot.svg?raw'
import step3NumberSvg from '@/assets/figma/how-it-works/step-3-number.svg?raw'
import step3MascotSvg from '@/assets/figma/how-it-works/step-3-mascot.svg?raw'

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
  /** Inline SVG markup (?raw) split out of the Figma Type=N, Size=lg
   * combined export: digit and mascot share the SAME 256×~334
   * viewBox, so stacked at (0,0) of the number column the mascot
   * lands at its Figma-designed position relative to the digit. */
  numberSvg: string
  mascotSvg: string
  /** Per-step accent colors from Figma — the panel title. */
  titleColor: string
}

const steps: Step[] = [
  {
    num: '1',
    title: 'Deposit\nyour memes',
    body: 'Connect your wallet, pick a market (PEPE, SHIB, etc.), and deposit your memecoins as collateral.',
    numberSvg: step1NumberSvg,
    mascotSvg: step1MascotSvg,
    titleColor: '#57A053', // Green/400
  },
  {
    num: '2',
    title: 'Borrow USDC',
    body: 'Choose how much USDC to borrow — up to 62.5% of your collateral value with built-in safety buffers.',
    numberSvg: step2NumberSvg,
    mascotSvg: step2MascotSvg,
    titleColor: '#8B8765', // Cream/900
  },
  {
    num: '3',
    title: 'Chill',
    body: 'Use your USDC anywhere. When ready, repay your loan and get your memecoins back. Moon mission intact.',
    numberSvg: step3NumberSvg,
    mascotSvg: step3MascotSvg,
    titleColor: '#498A70', // Mint/700
  },
]

/* Per-panel backgrounds from Figma (495:11062 / 11099 / 11113). */
const BG_COLORS = [
  '#FEFEFE', // Neutral/50  — Step 1
  '#F0EDD4', // Cream/300   — Step 2
  '#C8E6D0', // Mint/300    — Step 3
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

/** Default export renders the desktop scroll-pinned panels (≥ md) and
 * the mobile stacked layout (< md) — each is gated by Tailwind
 * breakpoints. The `id="how-it-works"` anchor sits on the wrapper
 * (instead of the inner sections) so there's only one in the DOM
 * for the Nav scroll target. */
export default function HowItWorks() {
  return (
    <div id="how-it-works">
      <HowItWorksDesktop />
      <HowItWorksMobile />
    </div>
  )
}

function HowItWorksDesktop() {
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
      <section className="relative hidden w-full min-[1152px]:block">
        <div className="py-12 text-center">
          <h2 className="font-display text-[39px] leading-[1] font-semibold tracking-[0.88px] text-[var(--color-neutral-900)]">
            How It Works?
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
      ref={ref}
      /* z-40 lifts the whole section above the Hero's hill ellipse
       * (z-30) which extends ~300 px PAST Features' bottom into the
       * top of HowItWorks. Without this, the ellipse would render on
       * top of the title + first panel during the entry phase. */
      className="relative z-40 hidden w-full min-[1152px]:block"
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
            <h2 className="reveal reveal-up font-display text-[39px] leading-[1] font-semibold tracking-[0.88px] text-[var(--color-neutral-900)]">
              How It Works?
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
       *  Sits at the flex row's vertical center (items-center on the
       *  parent) so the digit + mascot align with the title baseline
       *  on its right — the earlier -translate-y-[70px] lifted it
       *  above the text and read as misaligned with the new vector
       *  digit + mascot SVG that's shorter than the original 437 px
       *  text numeral. */}
      <div
        className="relative shrink-0"
        style={{ width: NUMBER_COL_FLOW_WIDTH, height: 332 }}
      >
        {/* Number — INLINE <svg> (via dangerouslySetInnerHTML) so
         * the digit stays true vector through every CSS transform.
         * Same 256-wide viewBox as the mascot, pinned to the
         * column's left edge. No per-active animation — only the
         * panel fade. The inner [&>svg]:size-full variant forces
         * the raw <svg> to fill the wrapper at 256×~334. */}
        <div
          aria-hidden
          className="absolute top-0 left-0 [&>svg]:size-full"
          style={{ width: 256, height: 332 }}
          dangerouslySetInnerHTML={{ __html: step.numberSvg }}
        />
        {/* Mascot — INLINE <svg>, same viewBox as the number so
         * positioning at (0,0) lands the character at its Figma-
         * designed spot relative to the digit. Wrapper sized to the
         * EXPANDED footprint and animation scales between 0.5 and 1
         * — always a downscale of the layout-sized SVG, which stays
         * crisp in Safari/Retina (unlike <img src=*.svg> which
         * rasterises the bitmap before transforms). */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 [&>svg]:size-full"
          style={{
            width: 256,
            height: 332,
            transformOrigin: 'center bottom',
            willChange: 'transform',
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
          dangerouslySetInnerHTML={{ __html: step.mascotSvg }}
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
