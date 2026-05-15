import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { asset } from '@/lib/utils'
import { Steps } from './EcosystemArt'

/**
 * Ecosystem ("Built on Giants") — Figma node 495:11656.
 *
 * The decorative layer is laid out inside a fixed 1920×1604 reference
 * frame (the Figma artboard) centered horizontally — same technique as
 * the Hero's 1920 px scene — so every absolute offset below is a 1:1
 * copy of the Figma coordinates. Rotated bills are placed at their
 * UN-rotated top-left (computed so the rotated bounding box matches
 * Figma's inset) and spun with `rotate` about their centre.
 *
 * The bills scroll-parallax: bigger bills drift faster than smaller
 * ones, giving the scattered cash a sense of depth. On viewports
 * narrower than 1920 px the frame crops via `overflow-hidden`; below
 * `md` the decoration is hidden entirely and the copy + cards stack.
 */

type Pillar = {
  title: string
  body: string
  logo: string
  /** Natural display size of the logo art (px). */
  logoSize: { w: number; h: number }
}

const pillars: Pillar[] = [
  {
    title: 'Morpho',
    body: 'Battle-tested lending\ninfrastructure',
    logo: asset('/assets/figma/ecosystem/logo-morpho.svg'),
    logoSize: { w: 60, h: 56 },
  },
  {
    title: 'Api3',
    body: 'First-party oracle feeds with OEV',
    logo: asset('/assets/figma/ecosystem/logo-api3.svg'),
    logoSize: { w: 64, h: 56 },
  },
  {
    title: 'Ethereum',
    body: 'Mainnet native,\ndeep liquidity',
    logo: asset('/assets/figma/ecosystem/logo-eth.svg'),
    logoSize: { w: 44, h: 72 },
  },
  {
    title: 'USDC',
    body: 'Borrow the most trusted stablecoin',
    logo: asset('/assets/figma/ecosystem/logo-usdc.svg'),
    logoSize: { w: 56, h: 56 },
  },
]

/* ---------- Parallax dollar bills ----------
 *  Each bill drifts vertically as the section scrolls through the
 *  viewport. `speed` is the ± drift in px (at section-centred scroll
 *  the bill sits at its rest position) — scaled to the bill's size so
 *  the big bills move fast and the small ones lag behind. */
type BillSpec = {
  src: string
  /** Absolute placement within the 1920×1604 frame (un-rotated box). */
  pos: string
  /** CSS rotation in degrees, applied about the bill's centre. */
  rotate: number
  /** Parallax drift amplitude in px. */
  speed: number
}

const bills: Record<string, BillSpec> = {
  // top-right loose bill — large
  bill1: {
    src: asset('/assets/figma/ecosystem/bill-1.svg'),
    pos: 'top-[373px] left-[1334px] h-[283px] w-[375px]',
    rotate: -11.69,
    speed: 145,
  },
  // mid-left small bill
  bill2: {
    src: asset('/assets/figma/ecosystem/bill-2.svg'),
    pos: 'top-[927px] left-[541px] h-[106px] w-[185px]',
    rotate: 34.06,
    speed: 60,
  },
  // mid-right small bill
  bill3: {
    src: asset('/assets/figma/ecosystem/bill-3.svg'),
    pos: 'top-[939px] left-[1686px] h-[106px] w-[185px]',
    rotate: 34.06,
    speed: 60,
  },
  // far-left small bill
  bill4: {
    src: asset('/assets/figma/ecosystem/bill-4.svg'),
    pos: 'top-[949px] left-[55px] h-[106px] w-[185px]',
    rotate: -28.23,
    speed: 60,
  },
  // big foreground bill — fastest
  bill5: {
    src: asset('/assets/figma/ecosystem/bill-5.svg'),
    pos: 'top-[1082px] left-[1009px] h-[574px] w-[588px]',
    rotate: 34.06,
    speed: 220,
  },
  // bill overlapping the mascot's feet — medium
  bill6: {
    src: asset('/assets/figma/ecosystem/bill-6.svg'),
    pos: 'top-[1196px] left-[523px] h-[150px] w-[262px]',
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
        src={asset('/assets/figma/ecosystem/bill-comp-base.svg')}
        alt=""
        aria-hidden
        className="absolute top-[119px] left-[1175px] h-[104px] w-[181px] max-w-none rotate-[4.07deg]"
      />
      <img
        src={asset('/assets/figma/ecosystem/bill-comp-shadow.svg')}
        alt=""
        aria-hidden
        className="absolute top-[157px] left-[1249px] h-[83px] w-[124px] max-w-none mix-blend-multiply"
      />
      <img
        src={asset('/assets/figma/ecosystem/bill-comp-top.svg')}
        alt=""
        aria-hidden
        className="absolute top-[196px] left-[1261px] h-[104px] w-[181px] max-w-none rotate-[34.06deg]"
      />
    </motion.div>
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
       * the section height, fading back to Neutral/50 at top and bottom
       * so the blush tint sits below the cards near the mascot zone. */
      style={{
        background:
          'linear-gradient(to bottom, #FEFEFE 0%, #FFF5F4 86%, #FEFEFE 100%)',
      }}
    >
      {/* ---------- Decorative background layer ----------
       *  A fixed 1920×1604 reference frame, centered horizontally.
       *  Every child uses absolute pixel offsets copied straight from
       *  the Figma artboard. Hidden below `md` to avoid a tall empty
       *  band on mobile. */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 hidden h-[1604px] w-[1920px] -translate-x-1/2 md:block">
        {/* Top isometric squares pattern (rotated 180° per Figma) */}
        <img
          src={asset('/assets/figma/ecosystem/squares-top.svg')}
          alt=""
          aria-hidden
          className="absolute top-[85px] left-[-1px] h-[989px] w-[1920px] max-w-none rotate-180"
        />
        {/* Bottom isometric squares pattern */}
        <img
          src={asset('/assets/figma/ecosystem/squares-bottom.svg')}
          alt=""
          aria-hidden
          className="absolute top-[569px] left-[-1px] h-[940px] w-[1920px] max-w-none"
        />

        {/* Floating dollar bill — top right */}
        <Bill spec={bills.bill1} progress={scrollYProgress} />

        {/* Isometric stepped platform under the mascot */}
        <Steps />

        {/* Floating dollar bills scattered around the platform */}
        <Bill spec={bills.bill2} progress={scrollYProgress} />
        <Bill spec={bills.bill3} progress={scrollYProgress} />
        <Bill spec={bills.bill4} progress={scrollYProgress} />
        {/* Big foreground bill — crops off the bottom of the frame */}
        <Bill spec={bills.bill5} progress={scrollYProgress} />

        {/* Composite bill (top right) — back bill, multiply shadow,
         * front bill, layered per Figma node 495:11726. */}
        <CompositeBill progress={scrollYProgress} />

        {/* Central tofu mascot — standing on the cube platform, with a
         * soft contact-shadow ellipse beneath it. Flattened raster
         * export from Figma (node 532:15932). */}
        <img
          src={asset('/assets/figma/ecosystem/mascot-shadow.svg')}
          alt=""
          aria-hidden
          className="absolute top-[1104px] left-[884px] h-[56px] w-[186px] max-w-none"
        />
        <img
          src={asset('/assets/figma/ecosystem/mascot.png')}
          alt=""
          aria-hidden
          className="absolute top-[818px] left-[773px] h-[395px] w-[363px] max-w-none"
        />

        {/* Foreground dollar bill — overlaps the mascot's feet */}
        <Bill spec={bills.bill6} progress={scrollYProgress} />

        {/* Decorative katakana "プ" mark, top-left */}
        <img
          src={asset('/assets/figma/ecosystem/katakana.svg')}
          alt=""
          aria-hidden
          className="absolute top-[71px] left-[342px] h-[183px] w-[174px] max-w-none"
        />
        {/* Vertical "PURINTA" wordmark on the left */}
        <img
          src={asset('/assets/figma/ecosystem/purinta-vertical.svg')}
          alt=""
          aria-hidden
          className="absolute top-[274px] left-[361px] h-[519px] w-[34px] max-w-none"
        />
      </div>

      {/* ---------- Foreground content ---------- */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1024px] flex-col items-center gap-[72px] px-6 py-24 md:h-[1604px] md:justify-start md:py-0 md:pt-[207px]">
        {/* Copy block — title + subtitle */}
        <div className="flex w-full flex-col items-center gap-4">
          <h2 className="reveal reveal-up text-center font-display text-[68px] leading-[68px] font-bold tracking-[0.76px] text-[#185229] md:text-[76px] md:leading-[76px]">
            Built on Giants
          </h2>
          <p className="reveal reveal-up text-center font-body text-[20px] leading-[32px] tracking-[0.25px] text-[#4C4C4C] md:text-[25px] md:leading-[38px]">
            Purinta combines the best DeFi primitives into one
            <br />
            seamless memecoin lending experience.
            <br />
            No shortcuts, no compromises.
          </p>
        </div>

        {/* Pillar cards — 4 in a row, stack on narrow viewports.
         * `md:-mx-6 md:w-[calc(100%+3rem)]` cancels the foreground's
         * `px-6` mobile gutter on desktop so the row spans the full
         * 1024 px Figma width — without it the cards are 12 px narrower
         * each and "Battle-tested lending" wraps to a 2nd line. */}
        <div className="flex w-full flex-col gap-6 md:-mx-6 md:w-[calc(100%+3rem)] md:flex-row md:items-stretch">
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
                 * #E7F4EC — no blur, just a flat color block. */
                className="flex h-full flex-col gap-8 rounded-tr-[48px] rounded-br-[48px] rounded-bl-[48px] bg-[#FEFEFE] px-8 py-10"
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
      </div>
    </section>
  )
}
