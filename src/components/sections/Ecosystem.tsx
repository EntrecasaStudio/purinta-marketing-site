import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { asset } from '@/lib/utils'
import { Steps } from './EcosystemArt'

/**
 * Ecosystem ("Built on Giants") — Figma node 551:41112.
 *
 * Decorative layer is laid out inside a fixed 1920×1604 reference frame
 * (centered horizontally) so every absolute offset below is a 1:1 copy
 * of the Figma artboard. Rotated bills are placed at their UN-rotated
 * top-left and spun about their center.
 *
 * Bills scroll-parallax (larger bills drift further than smaller ones).
 * The mascot, steps platform and decorative wordmarks are static — no
 * vertical movement, position is fixed to Figma. Below `md` the
 * decoration is hidden entirely and the copy + cards stack.
 *
 * The mascot is the Figma vector export at `ecosystem-v2/mascot.svg`
 * (Figma node 551:41112;567:37160). The SVG ships an internal SMIL
 * animation that cycles the slot bill in and out of the mouth slot.
 */

const v2 = (f: string) => asset(`/assets/figma/ecosystem-v2/${f}`)

type Pillar = {
  title: string
  body: string
  logo: string
  logoSize: { w: number; h: number }
}

const pillars: Pillar[] = [
  {
    title: 'Morpho',
    /* Single-line on mobile; the desktop card wraps it naturally to
     * two lines (the text is too wide for the 230 px desktop card
     * column), matching Figma 551:41112. */
    body: 'Battle-tested lending infrastructure',
    logo: v2('logo-morpho.svg'),
    logoSize: { w: 60, h: 56 },
  },
  {
    title: 'Api3',
    body: 'OEV oracle feeds and market curator',
    logo: v2('logo-api3.svg'),
    logoSize: { w: 64, h: 56 },
  },
  {
    title: 'Ethereum',
    body: 'Mainnet native, deep liquidity',
    logo: v2('logo-eth.svg'),
    logoSize: { w: 44, h: 72 },
  },
  {
    title: 'USDC',
    body: 'The most trusted stablecoin',
    logo: v2('logo-usdc.svg'),
    logoSize: { w: 56, h: 56 },
  },
]

/* ---------- Parallax dollar bills ----------
 *  Each bill drifts vertically as the section scrolls through the
 *  viewport. `speed` is the ± drift in px — scaled to the bill's size
 *  so big bills move fast and small ones lag behind. Coordinates are
 *  taken straight from Figma (node 551:41112). */
type BillSpec = {
  src: string
  /** Absolute placement within the 1920×1604 frame (un-rotated box). */
  pos: string
  /** CSS rotation in degrees, applied about the bill's centre. */
  rotate: number
  /** Parallax drift amplitude in px. */
  speed: number
}

/* For each bill: the position offsets put the un-rotated 374x283 (or
 * smaller) artwork at its top-left so that when CSS `rotate()` spins
 * it around its centre, the resulting rotated bounding box matches the
 * Figma outer wrapper. */
const bills: Record<string, BillSpec> = {
  // top-right loose bill — large
  bill1: {
    src: v2('bill-1.svg'),
    pos: 'top-[298px] left-[1335px] h-[283px] w-[375px]',
    rotate: -11.69,
    speed: 145,
  },
  // mid-left small bill
  bill2: {
    src: v2('bill-2.svg'),
    pos: 'top-[849px] left-[543px] h-[104px] w-[183px]',
    rotate: 34.06,
    speed: 60,
  },
  // mid-right small bill
  bill3: {
    src: v2('bill-3.svg'),
    pos: 'top-[860px] left-[1688px] h-[104px] w-[183px]',
    rotate: 34.06,
    speed: 60,
  },
  // far-left small bill
  bill4: {
    src: v2('bill-4.svg'),
    pos: 'top-[870px] left-[57px] h-[104px] w-[183px]',
    rotate: -28.23,
    speed: 60,
  },
  // big foreground bill — fastest
  bill5: {
    src: v2('bill-5.svg'),
    pos: 'top-[1023px] left-[1049px] h-[574px] w-[588px]',
    rotate: 34.06,
    speed: 220,
  },
  // bill overlapping the mascot's feet — medium
  bill6: {
    src: v2('bill-6.svg'),
    pos: 'top-[1115px] left-[500px] h-[148px] w-[260px]',
    rotate: -6.34,
    speed: 100,
  },
}

function Bill({
  spec,
  progress,
}: {
  spec: BillSpec
  progress: MotionValue<number>
}) {
  const y = useTransform(progress, [0, 1], [spec.speed, -spec.speed])
  return (
    <motion.img
      src={spec.src}
      alt=""
      aria-hidden
      className={`absolute max-w-none ${spec.pos}`}
      style={{ rotate: spec.rotate, y }}
    />
  )
}

/* The composite bill is three layers (back bill + multiply shadow +
 * front bill) that read as one object, so they parallax together as a
 * single small/slow unit. */
function CompositeBill({ progress }: { progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], [50, -50])
  return (
    <motion.div className="absolute inset-0" style={{ y }}>
      <img
        src={v2('bill-comp-base.svg')}
        alt=""
        aria-hidden
        className="absolute top-[42px] left-[1174px] h-[102px] w-[179px] max-w-none rotate-[4.07deg]"
      />
      <img
        src={v2('bill-comp-shadow.svg')}
        alt=""
        aria-hidden
        className="absolute top-[85px] left-[1250px] h-[83px] w-[124px] max-w-none mix-blend-multiply"
      />
      <img
        src={v2('bill-comp-top.svg')}
        alt=""
        aria-hidden
        className="absolute top-[125px] left-[1265px] h-[102px] w-[179px] max-w-none rotate-[34.06deg]"
      />
    </motion.div>
  )
}

/* ============================================================
 *  MOBILE bills — Figma 773:40687, positioned in the 960-wide
 *  Bg-Illustration scene. Same SVG assets as desktop; coords come
 *  from get_design_context (`ml-X mt-Y` translated to absolute top/left).
 *  Items outside the 360-viewport are clipped by the section's
 *  overflow-hidden — Figma intentionally lets several bills crop.
 * ============================================================ */
const billsMobile: Record<string, BillSpec> = {
  // top-right loose bill — Figma "Bill" outer 212×180 rot -11.92,
  // inner 187.541×144.432
  bill1: {
    src: v2('bill-1.svg'),
    pos: 'top-[173px] left-[667px] h-[144px] w-[188px]',
    rotate: -11.92,
    speed: 70,
  },
  // mid bills (3 small) — outer 104×96 rot 34.61 / -28.72, inner 91×52
  bill2: {
    src: v2('bill-2.svg'),
    pos: 'top-[437px] left-[271px] h-[52px] w-[92px]',
    rotate: 34.61,
    speed: 30,
  },
  bill3: {
    src: v2('bill-3.svg'),
    pos: 'top-[442px] left-[844px] h-[52px] w-[92px]',
    rotate: 34.61,
    speed: 30,
  },
  bill4: {
    src: v2('bill-4.svg'),
    pos: 'top-[447px] left-[27px] h-[52px] w-[91px]',
    rotate: -28.72,
    speed: 30,
  },
  // big foreground bill — inner 296×291 rot 34.61
  bill5: {
    src: v2('bill-5.svg'),
    pos: 'top-[534px] left-[492px] h-[291px] w-[296px]',
    rotate: 34.61,
    speed: 100,
  },
  // foreground bill at mascot feet — inner 130×75 rot -6.47
  bill6: {
    src: v2('bill-6.svg'),
    pos: 'top-[645px] left-[259px] h-[75px] w-[130px]',
    rotate: -6.47,
    speed: 50,
  },
}

/* Mobile composite bill — same three-layer construction as desktop,
 * scaled to mobile coordinates (Figma 714:36083, ml-546.73 mt-0). */
function CompositeBillMobile({ progress }: { progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], [25, -25])
  return (
    <motion.div className="absolute inset-0" style={{ y }}>
      <img
        src={v2('bill-comp-base.svg')}
        alt=""
        aria-hidden
        className="absolute top-[24px] left-[588px] h-[52px] w-[90px] max-w-none rotate-[4.16deg]"
      />
      <img
        src={v2('bill-comp-shadow.svg')}
        alt=""
        aria-hidden
        className="absolute top-[42px] left-[622px] h-[42px] w-[62px] max-w-none mix-blend-multiply"
      />
      <img
        src={v2('bill-comp-top.svg')}
        alt=""
        aria-hidden
        className="absolute top-[59px] left-[622px] h-[52px] w-[90px] max-w-none rotate-[34.61deg]"
      />
    </motion.div>
  )
}

/* Mascot — animated embed from `public/mascot-animated.html`. Same
 * illustration as `ecosystem-v2/mascot.svg` (Figma node 551:41112;
 * 567:37160), but with JS-driven breath / blink / sway / hand motion
 * baked in by the embed script. The iframe is isolated so the embed's
 * defs + animation script can't collide with the host page. Size +
 * offset match the static placement (363×395 at top 748 / left 774).
 * Static slot, no vertical parallax. */
function Mascot() {
  return (
    <iframe
      src={asset('/mascot-animated.html')}
      title=""
      aria-hidden
      tabIndex={-1}
      scrolling="no"
      className="absolute top-[748px] left-[774px] h-[395px] w-[363px] max-w-none border-0 bg-transparent pointer-events-none"
    />
  )
}

export default function Ecosystem() {
  const ref = useRef<HTMLElement>(null)
  /* One scroll reading drives every bill's parallax drift. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return (
    <section
      id="ecosystem"
      ref={ref}
      className="relative w-full overflow-hidden"
      /* Per Figma: subtle gradient peaks at Blush/100 around 86 % of
       * the section height, fading back toward Neutral/50 above and
       * to fully transparent at the bottom. Letting the bottom go
       * transparent removes the seam against Community below — that
       * section is also transparent over the page-level diagonal
       * gradient, so when Ecosystem fades out the two sections share
       * the exact same boundary color at every x. */
      style={{
        background:
          'linear-gradient(to bottom, #FEFEFE 0%, #FFF5F4 86%, rgba(254,254,254,0) 100%)',
      }}
    >
      {/* ---------- Decorative background layer ----------
       *  Fixed 1920×1604 reference frame, centered horizontally. Every
       *  child uses absolute pixel offsets copied straight from the
       *  Figma artboard. Hidden below `md`. */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 hidden h-[1604px] w-[1920px] -translate-x-1/2 min-[1154px]:block">
        {/* Top isometric squares pattern (rotated 180° per Figma) */}
        <img
          src={v2('squares-top.svg')}
          alt=""
          aria-hidden
          className="absolute top-0 left-0 h-[989px] w-[1920px] max-w-none rotate-180"
        />
        {/* Bottom isometric squares pattern */}
        <img
          src={v2('squares-bottom.svg')}
          alt=""
          aria-hidden
          className="absolute top-[483px] left-0 h-[940px] w-[1920px] max-w-none"
        />

        {/* Decorative katakana "プ" mark, top-left */}
        <img
          src={v2('katakana.svg')}
          alt=""
          aria-hidden
          className="absolute top-0 left-[343px] h-[182px] w-[174px] max-w-none"
        />
        {/* Vertical "PURINTA" wordmark on the left */}
        <img
          src={v2('purinta-vertical.svg')}
          alt=""
          aria-hidden
          className="absolute top-[204px] left-[361px] h-[519px] w-[34px] max-w-none"
        />

        {/* Floating dollar bill — top right */}
        <Bill spec={bills.bill1} progress={scrollYProgress} />

        {/* Composite bill (top right) — back bill, multiply shadow,
         * front bill, layered per Figma node 551:41112;567:37104. */}
        <CompositeBill progress={scrollYProgress} />

        {/* Isometric stepped platform under the mascot */}
        <Steps />

        {/* Floating dollar bills scattered around the platform */}
        <Bill spec={bills.bill2} progress={scrollYProgress} />
        <Bill spec={bills.bill3} progress={scrollYProgress} />
        <Bill spec={bills.bill4} progress={scrollYProgress} />
        {/* Big foreground bill — crops off the bottom of the frame */}
        <Bill spec={bills.bill5} progress={scrollYProgress} />

        {/* Mascot ground-contact shadow */}
        <img
          src={v2('mascot-shadow.svg')}
          alt=""
          aria-hidden
          className="absolute top-[1041px] left-[891px] h-[42px] w-[172px] max-w-none"
        />
        {/* Central mascot — animated basic-money emote, static
         * position (no parallax). */}
        <Mascot />

        {/* Foreground dollar bill — overlaps the mascot's feet */}
        <Bill spec={bills.bill6} progress={scrollYProgress} />
      </div>

      {/* ---------- Mobile decorative layer ----------
       *  Figma 773:40687 03_Bg-Illustration. A 960-wide reference scene
       *  centered in the 360 viewport (same pattern as the footer's
       *  mobile scene); items outside the viewport are clipped by the
       *  section's overflow-hidden. */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 z-0 h-[1300px] w-[960px] -translate-x-1/2 min-[1154px]:hidden"
      >
        {/* Top isometric squares pattern (rotated 180° per Figma) */}
        <img
          src={v2('squares-top.svg')}
          alt=""
          aria-hidden
          className="absolute top-[3px] left-0 h-[504px] w-[960px] max-w-none rotate-180"
        />
        {/* Bottom isometric squares pattern */}
        <img
          src={v2('squares-bottom.svg')}
          alt=""
          aria-hidden
          className="absolute top-[493px] left-0 h-[480px] w-[960px] max-w-none"
        />

        {/* Parallax bills — same SVGs as desktop, positioned to the
         * mobile Figma scene. Several land outside the 360-viewport on
         * purpose and crop into the section bg. */}
        <Bill spec={billsMobile.bill1} progress={scrollYProgress} />
        <CompositeBillMobile progress={scrollYProgress} />
        <Bill spec={billsMobile.bill2} progress={scrollYProgress} />
        <Bill spec={billsMobile.bill3} progress={scrollYProgress} />
        <Bill spec={billsMobile.bill4} progress={scrollYProgress} />
        <Bill spec={billsMobile.bill5} progress={scrollYProgress} />
        <Bill spec={billsMobile.bill6} progress={scrollYProgress} />
      </div>

      {/* Mobile/tablet bottom blush — the section background fades to
       * transparent over its last ~14 % (revealing the page's cool
       * diagonal gradient behind the grid graphic). Community below is
       * solid Blush-white (#FFF5F4), so paint the bottom band blush too
       * and the Stack→Community boundary reads as one warm surface.
       * Sits above the z-0 grid layer but below the z-10 content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[220px] min-[1154px]:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,245,244,0) 0%, #FFF5F4 100%)',
        }}
      />

      {/* ---------- Foreground content ---------- */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1024px] flex-col items-center gap-6 px-6 py-16 min-[1154px]:h-[1604px] min-[1154px]:justify-start min-[1154px]:gap-[72px] min-[1154px]:py-0 min-[1154px]:pt-[136px]">
        {/* Copy block — title + subtitle. Mobile sizing (Figma
         * 773:40687): h2 31/37 Bold, p 13/21 Regular. Desktop keeps
         * the original 76/76 + 25/38. */}
        <div className="mx-auto flex w-full max-w-[320px] flex-col items-center gap-2 min-[768px]:max-w-none min-[1154px]:gap-4">
          <h2 className="reveal reveal-up text-center font-display text-[31px] leading-[37px] font-bold tracking-[0.62px] text-[#185229] min-[1154px]:text-[76px] min-[1154px]:leading-[76px] min-[1154px]:tracking-[0.76px]">
            The Stack
          </h2>
          <p className="reveal reveal-up text-center font-body text-[13px] leading-[21px] tracking-[0.26px] text-[#333] min-[1154px]:text-[25px] min-[1154px]:leading-[38px] min-[1154px]:tracking-[0.25px] min-[1154px]:text-[#4C4C4C]">
            <span className="min-[1154px]:hidden">
              Purinta combines the best DeFi primitives into one
              seamless memecoin lending experience.
              <br />
              No shortcuts, no compromises.
            </span>
            <span className="hidden min-[1154px]:inline">
              Purinta combines the best DeFi primitives into one
              <br />
              seamless memecoin lending experience.
              <br />
              No shortcuts, no compromises.
            </span>
          </p>
        </div>

        {/* Pillar cards — desktop: 4 across, big vertical cards.
         * `min-[1154px]:-mx-6 min-[1154px]:w-[calc(100%+3rem)]` cancels the foreground's
         * `px-6` mobile gutter on desktop so the row spans the full
         * 1024 px Figma width — without it the cards are 12 px
         * narrower each and "Battle-tested lending" wraps to a 2nd
         * line. Hidden on mobile (the mobile layout below renders
         * a more compact horizontal-card variant). */}
        <div className="hidden min-[1154px]:-mx-6 min-[1154px]:flex min-[1154px]:w-[calc(100%+3rem)] min-[1154px]:flex-row min-[1154px]:items-stretch min-[1154px]:gap-6">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="reveal reveal-up flex-1"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                /* Signature shape: rounded on 3 corners (bottom-left,
                 * bottom-right, top-right) with a sharp top-left.
                 * Sticker drop shadow offset by (4, 4) in Mint/100
                 * #E7F4EC — no blur, just a flat colour block. */
                className="flex h-full flex-col gap-8 rounded-tr-[32px] rounded-br-[32px] rounded-bl-[32px] bg-[#FEFEFE] px-8 py-10"
                style={{
                  filter: 'drop-shadow(4px 4px 0 #E7F4EC)',
                }}
              >
                <div className="flex size-20 items-center justify-center">
                  <img
                    src={p.logo}
                    alt=""
                    aria-hidden
                    style={{ width: p.logoSize.w, height: p.logoSize.h }}
                    className="max-w-none object-contain"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-body text-[31px] leading-[45px] font-medium text-[#185229]">
                    {p.title}
                  </h3>
                  <p className="font-body text-[16px] leading-[26px] tracking-[0.16px] whitespace-pre-line text-[#333]">
                    {p.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile pillar cards — compact horizontal layout per Figma
         * 773:40687: 312 px wide, 60 px logo square on the left,
         * 16/26 Medium title + 10/16 Regular body on the right,
         * sticker drop shadow 2px / 2px in Mint/100 (#E7F4EC). The
         * stack uses gap-4 (16 px) — visually tighter than the
         * desktop card row and matches the compact stack seen in the
         * Figma mobile screenshot. */}
        <div className="flex w-full max-w-[360px] flex-col gap-4 min-[1154px]:hidden">
          {pillars.map((p) => (
            <div
              key={p.title}
              /* Same signature shape as desktop: sharp top-left, 8 px
               * radius on the other three corners. Lighter 2/2 sticker
               * shadow vs desktop's 4/4 to keep the mobile card feeling
               * lighter. */
              className="reveal reveal-up flex w-full items-center gap-2 rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px] bg-[#FEFEFE] px-6 py-4"
              style={{
                filter: 'drop-shadow(2px 2px 0 #E7F4EC)',
              }}
            >
              <div className="flex size-[60px] shrink-0 items-center justify-center">
                <img
                  src={p.logo}
                  alt=""
                  aria-hidden
                  /* Mobile logos render ~25% smaller than desktop so
                   * they fit the 60 px square cleanly. */
                  style={{
                    width: p.logoSize.w * 0.75,
                    height: p.logoSize.h * 0.75,
                  }}
                  className="max-w-none object-contain"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="font-body text-[16px] leading-[26px] font-medium tracking-[0.16px] text-[#185229]">
                  {p.title}
                </h3>
                {/* `whitespace-pre-line` kept so the same body strings
                 * can still drop a line-break in a future iteration;
                 * with no \n in the data they read as a single line
                 * (per Figma 773:40687). */}
                <p className="font-body text-[10px] leading-[16px] tracking-[0.3px] whitespace-pre-line text-[#333]">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mascot on the isometric steps — Figma 714:36137 (mascot
         * 181×201) + 714:36018 (steps). Steps tucked UP under the
         * mascot so the character's feet rest on the top step (~50%
         * of mascot height overlap, matching the desktop scene
         * composition where the steps span the mascot's bottom half). */}
        <div className="flex w-full justify-center -mt-2 min-[1154px]:hidden min-[1154px]:mt-0">
          <div className="relative h-[295px] w-[260px]">
            {/* Steps SVG — Figma 714:36018, three isometric tiers
             * exported as one combined image. Same asset as desktop
             * (~388×389), scaled to half for mobile (194×195). */}
            <img
              src={v2('steps.svg')}
              alt=""
              aria-hidden
              className="pointer-events-none absolute top-[100px] left-1/2 h-[195px] w-[194px] max-w-none -translate-x-1/2"
            />
            {/* Animated mascot — same embed as desktop, character's
             * feet at iframe-y ≈ 180 land on the top step (y = 100). */}
            <iframe
              src={asset('/mascot-animated.html')}
              title=""
              aria-hidden
              tabIndex={-1}
              scrolling="no"
              className="pointer-events-none absolute top-0 left-1/2 z-10 h-[200px] w-[183px] max-w-none -translate-x-1/2 border-0 bg-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
