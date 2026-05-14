import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'

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
  /** Absolute offsets for the numeral within the column (px) — mirrors
   * the Figma `ml-X mt-Y` values on each step's number node so the
   * digit and the mascot stamp land in their hand-placed positions
   * rather than centered. */
  numberPosition: { top: number; left: number }
}

const steps: Step[] = [
  {
    num: '1',
    title: 'Deposit\nyour memes',
    body: 'Connect your wallet, pick a market (PEPE, SHIB, etc.), and deposit your memecoins as collateral.',
    /* Figma node 454:7100. Number at ml-126 mt-0; mascot wrapper at
     * ml-0 mt-40.17 with rotation -12.65° (rotation already baked into
     * the PNG export). */
    mascot: '/assets/figma/how-it-works/step-1.png',
    /* Manual nudge: -100 left from Figma's 0 to pull the mascot
     * further toward the title column's left edge. */
    mascotPosition: { top: 40, left: -100, width: 296 },
    numberPosition: { top: 0, left: 126 },
  },
  {
    num: '2',
    title: 'Borrow USDC',
    body: 'Choose how much USDC to borrow — up to 62.5% of your collateral value with built-in safety buffers.',
    /* Figma node 454:7181. Number at ml-123.95 mt-15.83; mascot
     * wrapper at ml-0 mt-0 with rotation +19.62° (baked into PNG).
     * The screenshot canvas (353×284) is 42 px wider than the Figma
     * wrapper (311×284) because the character's arms overflow LEFT of
     * the wrapper bounds, so we shift left by -42 to keep the wrapper
     * origin aligned with the column origin. */
    mascot: '/assets/figma/how-it-works/step-2.png',
    /* Manual nudge: +82 top from Figma's 0 to drop the mascot down
     * so it sits aligned with the bottom hump of the "2". */
    mascotPosition: { top: 82, left: -42, width: 353 },
    numberPosition: { top: 16, left: 124 },
  },
  {
    num: '3',
    title: 'Chill',
    body: 'Use your USDC anywhere. When ready, repay your loan and get your memecoins back. Moon mission intact.',
    /* Figma node 454:7195. Number at ml-97.47 mt-0; mascot frame at
     * ml-0 mt-34.54 (no outer rotation). */
    mascot: '/assets/figma/how-it-works/step-3.png',
    /* Manual nudge: +70 top and -16 left from Figma's 35,0 — drops
     * the peaceful mascot lower into the bottom curve of the "3" and
     * shifts it slightly leftward to keep the composition centered. */
    mascotPosition: { top: 105, left: -16, width: 256 },
    numberPosition: { top: 0, left: 97 },
  },
]

/* Per-panel backgrounds from Figma (454:7098 / 7179 / 7193). */
const BG_COLORS = [
  '#FEFEFE', // Neutral/50  — Step 1
  '#E7F4EC', // Mint/100   — Step 2
  '#C8E6D0', // Mint/300   — Step 3
] as const

/* Active-step thresholds. The flip happens slightly BEFORE the panel
 * reaches its exact geometric center so the title pop + bg crossfade
 * land just as the numeral snaps into place (not lagged after). */
const STEP_2_THRESHOLD = 0.46
const STEP_3_THRESHOLD = 0.96

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
   * Sliding by -66.6667% of the 300%-wide track exposes panel 3. */
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.6667%'])

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
          <h2 className="font-body text-[44px] leading-[1] font-medium tracking-[0.88px] text-[var(--color-neutral-900)] md:text-[46px]">
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
      /* 3.6× viewport gives the user a comfortable amount of scroll
       * to move through three panels. The title rides up from below
       * INSIDE the sticky pin, together with step 1's content, exactly
       * like the Figma layout (title is the header of step 1's panel). */
      style={{ height: '360vh' }}
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
         *  Lives INSIDE the sticky pin so it rides up from below together
         *  with step 1's content as the section enters the viewport.
         *  The `reveal reveal-up` classes hook into the global useReveal
         *  hook in App.tsx — same fade+rise entrance pattern as the
         *  original reference site's main titles (see Community.tsx,
         *  Ecosystem.tsx for the existing usage). */}
        <div className="relative z-10 flex shrink-0 items-center justify-center pt-12 pb-6">
          <h2 className="reveal reveal-up font-body text-[44px] leading-[1] font-medium tracking-[0.88px] text-[var(--color-neutral-900)] md:text-[46px]">
            How It Works
          </h2>
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
               * `items-start pt-8` aligns the panel content NEAR the
               * top of the track (just below the title block) instead
               * of vertically centered — keeps the spacing tight per
               * the user spec ("estan muy abajo" with center alignment). */
              className="flex h-full w-1/3 shrink-0 items-start justify-center px-10 pt-8"
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

        {/* ---------- Bottom: docs link (persistent across panels) ---------- */}
        <a
          href="https://docs.purinta.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-body text-[15px] leading-[20px] text-[var(--color-neutral-800)] underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Learn more in the docs →
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
 *  - Numeral column is 400×332. Inside it the number and the mascot
 *    are absolutely positioned at the exact ml/mt offsets from Figma
 *    (numeral pushed right, mascot anchored at the left edge so they
 *    overlap visually with the mascot peeking out beside the digit).
 *  - Then a 40 px gap to the title+body column (1 fr).
 * ============================================================ */
function PanelContent({ step, isActive }: { step: Step; isActive: boolean }) {
  return (
    <div className="flex w-full max-w-[1232px] items-center justify-center gap-[40px] pl-[208px]">
      {/* ---------- Number column (absolute positioning per Figma) ---------- */}
      <div
        className="relative shrink-0"
        style={{ width: 400, height: 332 }}
      >
        <span
          className="absolute font-display"
          style={{
            top: step.numberPosition.top,
            left: step.numberPosition.left,
            fontSize: 437,
            lineHeight: 1,
            fontWeight: 500,
            letterSpacing: '-21.87px',
            color: '#498746',
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
          className="font-display font-bold whitespace-pre-line text-[#57A053]"
          style={{
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
