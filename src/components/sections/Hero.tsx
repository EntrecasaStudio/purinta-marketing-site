import { useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
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
  /* Gate the entrance fade on the bg image's load event so the small
   * SVG mascots can't render alone while the heavy 1920×1462 webp is
   * still downloading. The <link rel="preload"> in index.html starts
   * the fetch before React mounts, and `fetchpriority="high"` makes
   * the browser prioritise it — for a returning visitor the cache
   * hit fires onLoad almost immediately. */
  const [bgLoaded, setBgLoaded] = useState(false)
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
        animate={{ opacity: bgLoaded || reduceMotion ? 1 : 0 }}
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
        animate={{ opacity: bgLoaded || reduceMotion ? 1 : 0 }}
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
        animate={{ opacity: bgLoaded || reduceMotion ? 1 : 0 }}
        transition={bgTransition}
        className="pointer-events-none absolute top-0 left-1/2 z-[1] hidden -translate-x-1/2 min-[1154px]:block"
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
            /* fetchpriority + decoding hints so the bg lands in
             * memory before the entrance fade starts and the mascot
             * doesn't render alone during the initial paint. The
             * <link rel="preload"> in index.html schedules the
             * download; these attrs make sure the browser actually
             * decodes the bytes ASAP. */
            fetchPriority="high"
            decoding="async"
            loading="eager"
            onLoad={() => setBgLoaded(true)}
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
              percent insets resolve correctly (no `transform` parent).

              Pepe / Shibu are standalone SVG vector exports. Their box
              matches the visible footprint of the previous sprite-clipped
              mascots exactly: same bottom-centre anchor + height, width
              derived from each SVG's own aspect ratio so the vector is
              never distorted. */}

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
         * 360-wide mascot overlay at any mobile viewport. */}
        {/* Scene is masked to fade to transparent toward its bottom so
         * the crew sits on the grass but the lower edge dissolves into
         * the CONTINUOUS page gradient (--gradient-bg) instead of into
         * a solid band. The page gradient is near-horizontal (106.89°,
         * blush-50 left → mint-50 right) so it has no vertical seam —
         * letting it show through removes the hard cut entirely. */}
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

        {/* Vector mascot overlays — same SVG files as desktop, sized
         * 1:1 with the Figma mobile design (752:52201-203) inside the
         * 360-wide inner. Centred on the section so the mascots stay
         * anchored to the bg scene's visual centre at any viewport
         * width ≤ 768. */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
          style={{ width: 360, height: 655 }}
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
        </div>

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
         * (so the bg image's negative offsets don't bleed past it). */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 overflow-hidden"
          style={{ width: 1320, height: 1054 }}
        >
          {/* Scene image — Figma 1006:113049 nests the bg at
           * 123.67% × 117.9% sized with negative left / top so the
           * mountain sits left-of-centre, lake fills the middle and
           * the pagoda is just inside the right edge. Same source
           * webp as desktop. */}
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

          {/* Pepe (frog) — md size 148.75 × 198.95, Figma offset
           * left=(50%-238.62px), top=515 (centre-anchored). */}
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

          {/* Tofu / Purinta-chan — md size 281.35 × 245.4, Figma
           * offset left=(50%+1.68px), top=464. */}
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

          {/* Shibu (dog) — md size 174.25 × 230.96, Figma offset
           * left=(50%+241.13px), top=494. */}
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
        </div>

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

