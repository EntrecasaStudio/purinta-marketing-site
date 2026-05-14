import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { Plus } from 'lucide-react'
import Nav from '@/components/Nav'
import { Button } from '@/components/ui/button'
import { asset } from '@/lib/utils'

/* ============================================================
 * Entrance cascade timeline (seconds from mount):
 *
 *   t=0.00 →  BG illustration (scene + mascots + hill ellipse + shadows)
 *             starts fading in over 1.2 s — longer than the other
 *             steps so the artwork has a deliberate, hand-drawn reveal
 *             instead of snapping in.
 *   t=0.50 →  Nav drops in from a few px above
 *   t=0.95 →  Headline rises + fades
 *   t=1.08 →  Subtitle rises + fades
 *   t=1.21 →  Launch App CTA rises + fades
 *
 * Each subsequent element starts mid-way through the previous one so
 * the page reads as a single sweep top-to-bottom, not as 6 disjoint
 * fades. prefers-reduced-motion skips every entrance and snaps the
 * page to its rest state.
 * ============================================================ */
const BG_FADE = { duration: 1.2, ease: 'easeOut' } as const
const NAV_RISE = { duration: 0.55, delay: 0.5, ease: 'easeOut' } as const
const CONTENT_BASE_DELAY = 0.95
const CONTENT_STAGGER = 0.13
const CONTENT_RISE_DURATION = 0.55

/**
 * Hero — Figma node 384:2207 ("Purinta - Desktop 1440px").
 *
 * Structure (matches Figma):
 *  - Outer section: bg gradient (Blush/50 → Mint/50, 106.89°)
 *  - Bg layer: 1920×1461 overflow-clip with scene + shadows + ellipse + mascots
 *  - 48px top spacer (Bg flex item) → Nav (1280×84) → Hero content (1280×668)
 *  - Hero content: pt-[58] pb-[148], centered text + Launch App CTA
 *
 * Above 1920px viewport, margins grow; below ~1280 the layout starts to scale down.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Scroll-driven parallax (mascot parallax removed — would break their
  // percent-based positioning by creating a new containing block).
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  /* When the user prefers reduced motion, skip all entrance fades —
   * `initial={false}` jumps each element straight to its rest state. */
  const bgInitial = reduceMotion ? false : { opacity: 0 }
  const navInitial = reduceMotion ? false : { opacity: 0, y: -8 }
  const contentInitial = reduceMotion ? false : { opacity: 0, y: 16 }
  const bgTransition = reduceMotion ? { duration: 0 } : BG_FADE
  const navTransition = reduceMotion ? { duration: 0 } : NAV_RISE
  const contentTransition = (index: number) =>
    reduceMotion
      ? { duration: 0 }
      : ({
          duration: CONTENT_RISE_DURATION,
          delay: CONTENT_BASE_DELAY + index * CONTENT_STAGGER,
          ease: 'easeOut',
        } as const)

  return (
    <section
      ref={ref}
      className="relative flex min-h-[1300px] w-full flex-col items-center"
      data-node-id="384:2207"
    >
      {/* Hill ellipse — pulled out of the bg container so the section
          can have overflow-visible. Positioned absolutely with z-30 so
          it paints OVER Features' bg plane (z-auto). The Features
          title / cards have z-40+ so they stay above the hill. */}
      <motion.img
        src={asset('/assets/figma/hill-ellipse.svg')}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-30 h-[1312.311px] w-[2485.428px] max-w-none -translate-x-1/2"
        style={{ top: 839.17 }}
        initial={bgInitial}
        animate={{ opacity: 1 }}
        transition={bgTransition}
        data-node-id="384:2217"
      />
      {/* ---------- BG layer (1920×1462, overflow-clip) ----------
          Container matches the image's exact natural size so the
          scene renders at its true proportion (no object-cover crop,
          no stretching). Section overflow-hidden + section min-h
          decide how much of the scene is visible at each viewport. */}
      <motion.div
        style={{ y: sceneY }}
        initial={bgInitial}
        animate={{ opacity: 1 }}
        transition={bgTransition}
        className="pointer-events-none absolute top-0 left-1/2 z-[1] -translate-x-1/2"
      >
        <div className="relative h-[1462px] w-[1920px] overflow-hidden">
          {/* Scene — Figma node 430:4341 ("Purinta Hero back - 20260512").
              Natural 1920×1462. Width pinned at the natural size, height
              auto, so aspect is preserved without any object-fit crop.
              Vertical offset -80px so the sky band sits tighter at the
              top while the mascots / hill / shadows stay anchored at
              their original positions. */}
          <motion.img
            src={asset('/assets/figma/background.webp')}
            alt=""
            width={1920}
            height={1462}
            style={{ scale: sceneScale }}
            className="absolute top-[-220px] left-0 block h-auto w-[1920px] max-w-none"
            data-node-id="430:4341"
          />

          {/* Hill ellipse is now hoisted OUT of the bg container so
              it can overflow into Features — see <img> at section
              root above. */}

          {/* Drop shadows under mascots */}
          <img
            src={asset('/assets/figma/shadows.svg')}
            alt=""
            className="absolute top-[784px] left-[600.63px] h-[74.208px] w-[747.384px] mix-blend-multiply"
            data-node-id="384:2213"
          />

          {/* Mascots — direct children of the BG container so their
              percent insets resolve correctly (no `transform` parent). */}

          {/* Frog (clipped from mascots-sprite) */}
          <div
            className="absolute top-[112.83px] left-[567.32px] h-[790px] w-[216.297px] overflow-hidden"
            data-node-id="384:2222"
          >
            <img
              src={asset('/assets/figma/mascots-sprite.png')}
              alt="Pepe the frog"
              className="absolute top-0 left-[-127.71%] h-full w-[645.9%] max-w-none"
            />
          </div>

          {/* Dog (clipped from mascots-sprite) */}
          <div
            className="absolute top-[115.83px] left-[1124.96px] h-[790px] w-[272.9px] overflow-hidden"
            data-node-id="384:2220"
          >
            <img
              src={asset('/assets/figma/mascots-sprite.png')}
              alt="Shiba the dog"
              className="absolute top-0 left-[-326.81%] h-full w-[511.93%] max-w-none"
            />
          </div>

          {/* Tofu / Hero mascot — single flattened SVG export from Figma.
              Bounding box mirrors the original Figma frame inset:
              top 37.29% / right 41.17% / bottom 42.94% / left 41.58%
              of the 1920×1461 BG container. */}
          <div
            className="absolute"
            style={{
              top: '37.29%',
              left: '41.58%',
              right: '41.17%',
              bottom: '42.94%',
            }}
            data-node-id="384:2224"
          >
            <img
              src={asset('/assets/figma/hero-mascot.svg')}
              alt="Purinta mascot"
              className="block h-full w-full"
            />
          </div>
        </div>
      </motion.div>

      {/* ---------- Top spacer (Bg flex item, 48px) ---------- */}
      <div className="h-[48px] w-full" />

      {/* ---------- Nav ---------- */}
      <motion.div
        className="relative z-50 w-full px-4"
        initial={navInitial}
        animate={{ opacity: 1, y: 0 }}
        transition={navTransition}
      >
        <Nav />
      </motion.div>

      {/* ---------- Hero content (1280 × 668, pt-58 pb-148) ---------- */}
      <div className="relative z-10 flex w-full flex-col items-center">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="flex h-[668px] w-full max-w-[1280px] flex-col items-start px-6 pt-[58px] pb-[148px]"
        >
          <div className="flex w-full flex-col items-center gap-[16px]">
            <div className="flex flex-col items-center gap-[10px]">
              {/* Headline — first cascade step */}
              <motion.h1
                className="text-center font-display text-[76px] leading-[76px] font-bold tracking-[0.76px] text-[#333]"
                style={{
                  textShadow: '2px 2px 8px rgba(254, 254, 254, 0.52)',
                  width: '731.684px',
                  maxWidth: '100%',
                }}
                initial={contentInitial}
                animate={{ opacity: 1, y: 0 }}
                transition={contentTransition(0)}
                data-node-id="384:2313"
              >
                Deposit Memes,
                <br />
                <span className="text-[var(--color-green-500)]">Print</span>{' '}
                USDC.
              </motion.h1>

              {/* Sub — second cascade step */}
              <motion.p
                className="text-center font-body text-[20px] leading-[32px] font-medium tracking-[0.2px] text-[var(--color-neutral-900)]"
                initial={contentInitial}
                animate={{ opacity: 1, y: 0 }}
                transition={contentTransition(1)}
                data-node-id="384:2315"
              >
                The first lending protocol for memecoin degens —
                <br />
                lock your bags, borrow USDC, keep the upside.
              </motion.p>
            </div>

            {/* CTA — third cascade step. Wrap the shared Button in a
             * motion.div so we don't have to thread motion props into
             * the design-system component itself. */}
            <motion.div
              initial={contentInitial}
              animate={{ opacity: 1, y: 0 }}
              transition={contentTransition(2)}
            >
              <Button variant="primary" size="lg" asChild>
                <a href="https://app.purinta.xyz" data-node-id="384:2316">
                  <Plus className="btn-icon" strokeWidth={2.5} />
                  Launch App
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom transition is handled by the Figma hill ellipse SVG
          inside the bg container (node 384:2217) — a blurred organic
          ellipse with a #FEFEFE → #F1FCCB (pale lime) linear gradient
          and a 50 px Gaussian blur. No additional CSS fade on top so
          the green tones come through. */}
    </section>
  )
}

