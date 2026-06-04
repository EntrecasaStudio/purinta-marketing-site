import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import Nav from '@/components/Nav'
import { Button } from '@/components/ui/button'
import { asset } from '@/lib/utils'
import { useParallaxPointer } from '@/hooks/useParallaxPointer'

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

/* ============================================================
 * Layered parallax — the flat scene was split into 5 transparent
 * 1920×1462 layers (same registration as background.webp), which
 * sits behind them as a STATIC base so any edge revealed by a
 * moving layer shows identical pixels (no seams). Each layer
 * shifts by `depth × POINTER_PX` with the cursor and `depth ×
 * SCROLL_PX` with scroll. SCROLL_PX is NEGATIVE so on scroll-down
 * every layer rises, and since the offset scales with depth the
 * foreground (grass + mascots, depth 1) rises faster than the
 * background (sky, depth 0.15) — classic depth parallax. The
 * grass layer carries the three mascots (nested in its group),
 * so the characters stay locked to the floor.
 * ============================================================ */
const POINTER_PX = 28
const SCROLL_PX = -280
/* Mobile uses a much smaller scroll travel: the hero is a fixed 655 px
 * frame, so the desktop -280 px would shoot the foreground up past the
 * CTA and expose the static base behind it (the "doubled" image). */
const MOBILE_SCROLL_PX = -42
const DEPTH = { sky: 0.04, lake: 0.12, tree: 0.55, grass: 1 } as const
const layerSrc = (n: string) => asset(`/assets/figma/hero-layers/${n}.webp`)

/* Every graphic that makes up the hero illustration, across all
 * breakpoints — the flat base, the 5 parallax layers, the three
 * mascots, their shadows and the hill ellipse. The entrance fade is
 * gated on ALL of these being decoded so the scene reveals as one
 * piece (no mascot popping in over a still-loading background). */
const HERO_ASSETS = [
  '/assets/figma/background.webp',
  '/assets/figma/hero-layers/01-sky.webp',
  '/assets/figma/hero-layers/02-lake.webp',
  '/assets/figma/hero-layers/03-tree-L.webp',
  '/assets/figma/hero-layers/03-tree-R.webp',
  '/assets/figma/hero-layers/04-grass.webp',
  '/assets/figma/pepe.svg',
  '/assets/figma/shibu.svg',
  '/assets/figma/hero-mascot.svg',
  '/assets/figma/shadows.svg',
  '/assets/figma/hill-ellipse.svg',
] as const

function useLayerTransform(
  px: MotionValue<number>,
  py: MotionValue<number>,
  scroll: MotionValue<number>,
  depth: number,
  scrollPx: number = SCROLL_PX,
  pointerPx: number = POINTER_PX,
) {
  const x = useTransform(px, (v) => v * depth * pointerPx)
  const y = useTransform(
    [scroll, py] as [MotionValue<number>, MotionValue<number>],
    ([s, p]: number[]) => s * depth * scrollPx + p * depth * pointerPx,
  )
  return { x, y }
}

/** A single transparent scene layer that parallaxes with cursor + scroll. */
function ParallaxLayer({
  px,
  py,
  scroll,
  depth,
  src,
  className,
  scale,
  style,
  scrollPx,
}: {
  px: MotionValue<number>
  py: MotionValue<number>
  scroll: MotionValue<number>
  depth: number
  src: string
  className?: string
  scale?: MotionValue<number>
  style?: React.CSSProperties
  scrollPx?: number
}) {
  const { x, y } = useLayerTransform(px, py, scroll, depth, scrollPx)
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden
      decoding="async"
      style={{ ...style, x, y, scale, willChange: 'transform' }}
      className={className}
    />
  )
}

/** A parallax group (grass + shadows + mascots) that moves as one unit. */
function ParallaxGroup({
  px,
  py,
  scroll,
  depth,
  className,
  style,
  children,
  scrollPx,
}: {
  px: MotionValue<number>
  py: MotionValue<number>
  scroll: MotionValue<number>
  depth: number
  className?: string
  style?: React.CSSProperties
  children: ReactNode
  scrollPx?: number
}) {
  const { x, y } = useLayerTransform(px, py, scroll, depth, scrollPx)
  return (
    <motion.div
      style={{ x, y, willChange: 'transform', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

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
  /* Gate the entrance fade on EVERY hero graphic (base + parallax
   * layers + mascots + shadows + hill) being decoded, so the whole
   * illustration — backgrounds and characters — fades in together as
   * one piece instead of the light SVG mascots popping in ahead of
   * the heavy webp layers. We preload them off-DOM; the browser dedupes
   * these against the elements React renders (and the <link rel=
   * "preload"> in index.html), so it's just a readiness probe, not an
   * extra download. A 3 s safety timer guarantees the scene never
   * stays hidden if a request stalls. */
  const [sceneReady, setSceneReady] = useState(false)
  useEffect(() => {
    let cancelled = false
    let remaining = HERO_ASSETS.length
    const settle = () => {
      remaining -= 1
      if (remaining <= 0 && !cancelled) setSceneReady(true)
    }
    const imgs = HERO_ASSETS.map((path) => {
      const img = new Image()
      let counted = false
      const once = () => {
        if (counted) return
        counted = true
        settle()
      }
      img.onload = once
      img.onerror = once
      img.src = asset(path)
      // Cache hits may already be complete before handlers attach.
      if (img.complete) once()
      return img
    })
    const fallback = window.setTimeout(() => {
      if (!cancelled) setSceneReady(true)
    }, 3000)
    return () => {
      cancelled = true
      window.clearTimeout(fallback)
      imgs.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
    }
  }, [])
  const { px, py } = useParallaxPointer()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Scroll-driven parallax (mascot parallax removed — would break their
  // percent-based positioning by creating a new containing block).
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.22])
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
      className="relative flex w-full flex-col items-center min-[768px]:min-h-[962px] min-[1154px]:min-h-[1300px]"
      data-node-id="384:2207"
    >
      {/* Hill ellipse — DESKTOP. Pulled out of the bg container so the
          section can have overflow-visible. Positioned absolutely
          with z-30 so it paints OVER Features' bg plane (z-auto).
          The Features title / cards have z-40+ so they stay above
          the hill. */}
      <motion.img
        src={asset('/assets/figma/hill-ellipse.svg')}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-30 hidden h-[1312.311px] w-[2485.428px] max-w-none -translate-x-1/2 min-[1154px]:block"
        style={{ top: 839.17 }}
        initial={bgInitial}
        animate={{ opacity: sceneReady || reduceMotion ? 1 : 0 }}
        transition={bgTransition}
        data-node-id="384:2217"
      />
      {/* Hill ellipse — TABLET (Figma 1006:113054). Same SVG as
          desktop, scaled to the smaller 2112×1115 footprint and
          anchored at top:713 relative to the section so the lower
          curve bleeds into the Why Purinta section below, providing
          the visual hand-off between hero meadow and the cards
          canvas without a hard horizontal cut. */}
      <motion.img
        src={asset('/assets/figma/hill-ellipse.svg')}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-30 hidden h-[1115.464px] w-[2112.614px] max-w-none -translate-x-1/2 min-[768px]:block min-[1154px]:hidden"
        style={{ top: 713.29 }}
        initial={bgInitial}
        animate={{ opacity: sceneReady || reduceMotion ? 1 : 0 }}
        transition={bgTransition}
      />
      {/* ---------- BG layer (1920×1462, overflow-clip) ----------
          Container matches the image's exact natural size so the
          scene renders at its true proportion (no object-cover crop,
          no stretching). Section overflow-hidden + section min-h
          decide how much of the scene is visible at each viewport. */}
      <motion.div
        style={{ y: sceneY }}
        initial={bgInitial}
        animate={{ opacity: sceneReady || reduceMotion ? 1 : 0 }}
        transition={bgTransition}
        className="pointer-events-none absolute top-0 left-1/2 z-[1] hidden -translate-x-1/2 min-[1154px]:block"
      >
        <div className="relative h-[1462px] w-[1920px] overflow-hidden">
          {/* STATIC base — the original flat scene. Sits behind every
              parallax layer so any edge revealed by a moving layer
              shows identical pixels (no seams / holes). Keeps the
              priority hints; the entrance fade is gated on the shared
              `sceneReady` preload (all layers + mascots), not this one
              image. Does NOT parallax (depth 0). */}
          <motion.img
            src={asset('/assets/figma/background.webp')}
            alt=""
            width={1920}
            height={1462}
            fetchPriority="high"
            decoding="async"
            loading="eager"
            style={{ scale: sceneScale }}
            className="absolute top-[-220px] left-0 block h-auto w-[1920px] max-w-none"
            data-node-id="430:4341"
          />

          {/* Depth layers (back → front). Same registration / sizing as
              the base so they overlay 1:1; each scales with scroll like
              the base and shifts by its own depth on cursor + scroll. */}
          {(['01-sky:sky', '02-lake:lake', '03-tree-L:tree', '03-tree-R:tree'] as const).map(
            (entry) => {
              const [file, key] = entry.split(':') as [string, keyof typeof DEPTH]
              return (
                <ParallaxLayer
                  key={file}
                  px={px}
                  py={py}
                  scroll={scrollYProgress}
                  depth={DEPTH[key]}
                  scale={sceneScale}
                  src={layerSrc(file)}
                  className="absolute top-[-220px] left-0 block h-auto w-[1920px] max-w-none"
                />
              )
            },
          )}

          {/* GRASS GROUP — grass + shadows + the three mascots move as
              ONE unit so the characters stay locked to the floor. The
              wrapper is `inset-0` (full BG-container size) so the
              hero-mascot's percent insets still resolve unchanged. */}
          <ParallaxGroup
            px={px}
            py={py}
            scroll={scrollYProgress}
            depth={DEPTH.grass}
            className="absolute inset-0"
          >
            {/* Grass plate — scales with scroll like the other scene
                layers (mascots below intentionally do NOT scale). */}
            <motion.img
              src={layerSrc('04-grass')}
              alt=""
              aria-hidden
              decoding="async"
              style={{ scale: sceneScale }}
              className="absolute top-[-220px] left-0 block h-auto w-[1920px] max-w-none"
            />

            {/* Drop shadows under mascots */}
            <img
              src={asset('/assets/figma/shadows.svg')}
              alt=""
              className="absolute top-[784px] left-[600.63px] h-[74.208px] w-[747.384px] mix-blend-multiply"
              data-node-id="384:2213"
            />

            {/* Frog (Pepe) */}
            <img
              src={asset('/assets/figma/pepe.svg')}
              alt="Pepe the frog"
              className="absolute h-[231.81px] w-[175.07px] max-w-none"
              style={{ top: '601.91px', left: '592.83px' }}
              data-node-id="384:2222"
            />

            {/* Dog (Shibu) */}
            <img
              src={asset('/assets/figma/shibu.svg')}
              alt="Shiba the dog"
              className="absolute h-[269.75px] w-[205.77px] max-w-none"
              style={{ top: '585.16px', left: '1130.44px' }}
              data-node-id="384:2220"
            />

            {/* Tofu / Hero mascot — percent insets resolve against the
                inset-0 wrapper (same size as the BG container). */}
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
          </ParallaxGroup>
        </div>
      </motion.div>

      {/* ---------- Top spacer (Bg flex item, 48px) ---------- */}
      <div className="hidden h-[48px] w-full min-[1154px]:block" />

      {/* ---------- Nav ---------- */}
      <motion.div
        className="relative z-50 hidden w-full px-4 md:block min-[768px]:pt-6 min-[1154px]:pt-0"
        initial={navInitial}
        animate={{ opacity: 1, y: 0 }}
        transition={navTransition}
      >
        <Nav />
      </motion.div>

      {/* ---------- Mobile Hero — uses the DESKTOP scene background
       * (`background.webp`, 1920×1462) cropped to the mobile
       * portrait frame (360×655 aspect, ~0.55) via object-fit:cover.
       * The desktop bg has no mascots / no hill / no shadows — just
       * the clean lake-mountain-pagoda scene — so the SVG mascot
       * overlays are the only mascot rendering and there's no
       * raster halo around them in Safari/Retina. */}
      {/* Mobile hero — section has a FIXED 655 px height (matching
       * the Figma 360×655 mobile frame). The bg fills the section
       * via object-cover so it extends horizontally as the viewport
       * widens; the mascot crew + content live inside a 360-wide
       * inner container centred on the section, so they stay
       * pinned to their original Figma pixel positions while the
       * viewport grows around them (instead of scaling up with
       * aspect-ratio). */}
      <div
        className="relative w-full overflow-hidden md:hidden"
        style={{ height: 655 }}
      >
        {/* Bg scene — Figma 665:56488 sizes the 1920×1462 webp at a
         * fixed 908 px width (116.44% of the 780-wide design frame),
         * centred on the 360 section and top-aligned, so the bottom
         * ~36 px clip into the section. Fixed width (not object-cover)
         * keeps the scene at the Figma scale and locks it to the
         * 360-wide mascot overlay at any mobile viewport.
         *
         * Doubles as the STATIC seam-filler base behind the parallax
         * layers (depth 0 — never moves). */}
        {/* Scene is masked to fade to transparent toward its bottom so
         * the crew sits on the grass but the lower edge dissolves into
         * the CONTINUOUS page gradient (--gradient-bg) instead of into
         * a solid band. The page gradient is near-horizontal (106.89°,
         * blush-50 left → mint-50 right) so it has no vertical seam —
         * letting it show through removes the hard cut entirely. */}
        {/* All mobile graphics (base + layers + hill + mascots) fade in
         * together via the shared scene-ready gate. inset-0 keeps the
         * 655 px frame size + offset so every absolute child resolves
         * unchanged. The content overlay stays OUTSIDE this wrapper. */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={bgInitial}
          animate={{ opacity: sceneReady || reduceMotion ? 1 : 0 }}
          transition={bgTransition}
        >
        <img
          src={asset('/assets/figma/background.webp')}
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          className="absolute top-0 left-1/2 max-w-none -translate-x-1/2"
          style={{
            width: 908,
            WebkitMaskImage:
              'linear-gradient(to bottom, black 66%, transparent 92%)',
            maskImage:
              'linear-gradient(to bottom, black 66%, transparent 92%)',
          }}
        />

        {/* Depth layers (back → front) — same 908 px width + bottom mask
         * as the base so they overlay it 1:1. Touch has no fine pointer
         * → these parallax with scroll only. */}
        {(['01-sky:sky', '02-lake:lake', '03-tree-L:tree', '03-tree-R:tree', '04-grass:grass'] as const).map(
          (entry) => {
            const [file, key] = entry.split(':') as [string, keyof typeof DEPTH]
            return (
              <ParallaxLayer
                key={file}
                px={px}
                py={py}
                scroll={scrollYProgress}
                depth={DEPTH[key]}
                scrollPx={MOBILE_SCROLL_PX}
                src={layerSrc(file)}
                className="absolute top-0 left-1/2 max-w-none -translate-x-1/2"
                style={{
                  width: 908,
                  WebkitMaskImage:
                    'linear-gradient(to bottom, black 66%, transparent 92%)',
                  maskImage:
                    'linear-gradient(to bottom, black 66%, transparent 92%)',
                }}
              />
            )
          },
        )}

        {/* Soft transition — Figma 665:56494 (Ellipse 1052): a 50px
         * blurred white→pale-lime ellipse rising from the bottom of
         * the scene. It sits ABOVE the scene but BELOW the mascots so
         * the crew stays crisp. Masked to fade out before the 655 px
         * section edge so its semi-opaque tail isn't hard-clipped into
         * a faint line by the section's overflow-hidden. */}
        <img
          src={asset('/assets/figma/hill-ellipse.svg')}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-1/2 max-w-none -translate-x-1/2"
          style={{
            top: 475.71,
            width: 1113.265,
            height: 587.806,
            WebkitMaskImage:
              'linear-gradient(to bottom, black 22%, transparent 31%)',
            maskImage:
              'linear-gradient(to bottom, black 22%, transparent 31%)',
          }}
        />

        {/* Mascot crew — centred on the 360-wide inner (static), with an
         * inner ParallaxGroup at the grass depth so the characters ride
         * the floor on scroll. Painted above the soft transition so the
         * crew stays crisp. */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
          style={{ width: 360, height: 655 }}
        >
          <ParallaxGroup
            px={px}
            py={py}
            scroll={scrollYProgress}
            depth={DEPTH.grass}
            scrollPx={MOBILE_SCROLL_PX}
            className="absolute inset-0"
          >
            <img
              src={asset('/assets/figma/pepe.svg')}
              alt=""
              aria-hidden
              className="absolute max-w-none"
              style={{ left: 15.2, top: 403.2, width: 78 }}
            />
            <img
              src={asset('/assets/figma/hero-mascot.svg')}
              alt=""
              aria-hidden
              className="absolute max-w-none"
              style={{ left: 107, top: 376, width: 148 }}
            />
            <img
              src={asset('/assets/figma/shibu.svg')}
              alt=""
              aria-hidden
              className="absolute max-w-none"
              style={{ left: 261.4, top: 392.4, width: 91.5 }}
            />
          </ParallaxGroup>
        </div>
        </motion.div>

        {/* Content overlay — title + paragraph + CTA pinned at a
         * fixed top (140 px = 24 px nav offset + 52 px nav height +
         * 64 px Figma spec) so the headline stays at the same
         * vertical position regardless of viewport width. */}
        <div className="absolute inset-x-0 top-[140px]">
          <div className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-4 px-6">
            <div className="flex flex-col items-center gap-2">
              <h1
                className="text-center font-display text-[39px] leading-[43px] font-bold tracking-[0.78px] text-[#333]"
                style={{ textShadow: '0.5px 0.5px 2px rgba(254,254,254,0.52)' }}
              >
                Deposit Memes,
                <br />
                Print USDC.
              </h1>
              <p className="max-w-[320px] text-center font-body text-[13px] leading-[21px] font-medium tracking-[0.26px] text-[#333]">
                The first lending protocol for memecoin believers. Lock
                your bags, borrow USDC, and keep the upside.
              </p>
            </div>
            {/* Mobile CTA — Figma matches the Community mobile button:
             * 44 px tall, 16 px Medium text (same as <Button size="md">). */}
            <Button variant="primary" size="md" className="h-[44px]" asChild>
              <a
                href="https://app.purinta.xyz"
                style={{ border: '1px solid #78ba68', padding: '0 25px' }}
              >
                Launch App
              </a>
            </Button>
          </div>
        </div>

      </div>

      {/* ============================================================
       *  TABLET Hero (768 ≤ vw < 1154) — Figma 1047:144278.
       *
       *  Same `background.webp` + Pepe / Tofu / Shibu SVGs as the
       *  desktop scene, but sized down for the 1320-wide bg
       *  container the tablet design uses (vs desktop's 1920). The
       *  768 content column stays centred at any viewport in this
       *  range; the bg container is 1320 wide, so on viewports
       *  narrower than that the sides clip into the section's
       *  overflow-hidden, matching the "content fixed, image
       *  continuing" pattern used on desktop.
       * ============================================================ */}
      <div
        className="absolute inset-x-0 top-0 z-[1] hidden w-full overflow-hidden min-[768px]:block min-[1154px]:hidden"
        style={{ height: 962 }}
      >
        {/* Bg container — 1320 × 1054 centered at top, overflow-clip
         * (so the bg image's negative offsets don't bleed past it).
         * Fades in as one piece with the same scene-ready gate as the
         * desktop layer so backgrounds + mascots enter together. */}
        <motion.div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 overflow-hidden"
          style={{ width: 1320, height: 1054 }}
          initial={bgInitial}
          animate={{ opacity: sceneReady || reduceMotion ? 1 : 0 }}
          transition={bgTransition}
        >
          {/* STATIC base — flat scene, same 123.67% × 117.9% nest as
           * before. Sits behind the parallax layers as a seam filler. */}
          <img
            src={asset('/assets/figma/background.webp')}
            alt=""
            aria-hidden
            fetchPriority="high"
            decoding="async"
            className="absolute block max-w-none"
            style={{
              width: '123.67%',
              height: '117.9%',
              left: '-11.84%',
              top: '-17.86%',
            }}
          />

          {/* Depth layers (back → front), same nest as the base. */}
          {(['01-sky:sky', '02-lake:lake', '03-tree-L:tree', '03-tree-R:tree'] as const).map(
            (entry) => {
              const [file, key] = entry.split(':') as [string, keyof typeof DEPTH]
              return (
                <ParallaxLayer
                  key={file}
                  px={px}
                  py={py}
                  scroll={scrollYProgress}
                  depth={DEPTH[key]}
                  src={layerSrc(file)}
                  className="absolute block max-w-none"
                  style={{
                    width: '123.67%',
                    height: '117.9%',
                    left: '-11.84%',
                    top: '-17.86%',
                  }}
                />
              )
            },
          )}

          {/* GRASS GROUP — grass + shadows + mascots move locked together.
           * Wrapper is inset-0 of the 1320×1054 container so the mascots'
           * `calc(50% ± px)` offsets resolve unchanged. */}
          <ParallaxGroup
            px={px}
            py={py}
            scroll={scrollYProgress}
            depth={DEPTH.grass}
            className="absolute inset-0"
          >
            <img
              src={layerSrc('04-grass')}
              alt=""
              aria-hidden
              decoding="async"
              className="absolute block max-w-none"
              style={{
                width: '123.67%',
                height: '117.9%',
                left: '-11.84%',
                top: '-17.86%',
              }}
            />

            {/* Drop shadows under mascots — Figma 1006:113050. */}
            <img
              src={asset('/assets/figma/shadows.svg')}
              alt=""
              aria-hidden
              className="absolute block max-w-none mix-blend-multiply"
              style={{
                width: 635.276,
                height: 63.076,
                left: 'calc(50% + 12.17px)',
                top: 666.4,
                transform: 'translateX(-50%)',
              }}
            />

            {/* Pepe (frog) */}
            <img
              src={asset('/assets/figma/pepe.svg')}
              alt="Pepe the frog"
              className="absolute block max-w-none"
              style={{
                width: 148.75,
                height: 198.95,
                left: 'calc(50% - 238.62px)',
                top: 515,
                transform: 'translateX(-50%)',
              }}
            />

            {/* Tofu / Purinta-chan */}
            <img
              src={asset('/assets/figma/hero-mascot.svg')}
              alt="Purinta mascot"
              className="absolute block max-w-none"
              style={{
                width: 281.35,
                height: 245.4,
                left: 'calc(50% + 1.68px)',
                top: 464,
                transform: 'translateX(-50%)',
              }}
            />

            {/* Shibu (dog) */}
            <img
              src={asset('/assets/figma/shibu.svg')}
              alt="Shiba the dog"
              className="absolute block max-w-none"
              style={{
                width: 174.25,
                height: 230.96,
                left: 'calc(50% + 241.13px)',
                top: 494,
                transform: 'translateX(-50%)',
              }}
            />
          </ParallaxGroup>
        </motion.div>

        {/* Content overlay — title + paragraph + CTA, 600 px column
         * centred in the 768 frame. Figma 1006:113058 sets the
         * content vertical anchor with pt:170 / pb:524 — that puts
         * the title baseline ~170 px below the section top, well
         * above the mascots that sit further down in the bg. */}
        <div className="relative z-10 mx-auto flex w-full max-w-[768px] flex-col items-center gap-4 pt-[170px]">
          <div className="flex w-[600px] max-w-full flex-col items-center gap-[10px]">
            <h1
              className="w-full text-center font-display text-[61px] leading-[61px] font-bold tracking-[1.22px] text-[#333]"
              style={{ textShadow: '2px 2px 8px rgba(254,254,254,0.52)' }}
            >
              Deposit Memes,
              <br />
              Print USDC.
            </h1>
            <p className="w-full px-10 text-center font-body text-[16px] leading-[26px] font-medium tracking-[0.16px] text-[#333]">
              The first lending protocol for memecoin believers.
              <br />
              Lock your bags, borrow USDC, and keep the upside.
            </p>
          </div>
          <Button variant="primary" size="md" asChild>
            <a href="https://app.purinta.xyz">Launch App</a>
          </Button>
        </div>

        {/* Gradient fade — long, very gentle dissolve of the scene
         * into the PAGE background (blush-50 → mint-50 diagonal
         * --gradient-bg). Painted in transparent → mint-50 so the
         * bottom edge matches the page gradient at the section
         * boundary instead of ramping to opaque white, which used to
         * create a faint color band against the Why Purinta canvas
         * below. The mascot crew at y≈770 already lives in the more
         * opaque area; the dissolve happens BEHIND them. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[340px]"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(242,247,244,0.12) 35%, rgba(242,247,244,0.45) 65%, rgba(242,247,244,0.78) 85%, var(--color-mint-50) 100%)',
          }}
        />
      </div>

      {/* ---------- Hero content (1280 × 668, pt-58 pb-148) ---------- */}
      <div className="relative z-10 hidden w-full flex-col items-center min-[1154px]:flex">
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
                Print USDC.
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

