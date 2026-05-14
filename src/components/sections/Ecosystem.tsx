import { asset } from '@/lib/utils'

/**
 * Ecosystem ("Built on Giants") — Figma node 495:11656.
 *
 * The decorative layer is laid out inside a fixed 1920×1596 reference
 * frame (the Figma artboard) centered horizontally, so every absolute
 * offset below is a 1:1 copy of the Figma coordinates. On narrow
 * viewports the frame crops via the section's `overflow-hidden`; below
 * `md` the decoration is hidden entirely and only the copy + cards
 * stack.
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

export default function Ecosystem() {
  return (
    <section
      id="ecosystem"
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
       *  A fixed 1920×1596 reference frame, centered horizontally.
       *  Every child uses absolute pixel offsets copied straight from
       *  the Figma artboard. Hidden below `md` to avoid a tall empty
       *  band on mobile. */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 hidden h-[1596px] w-[1920px] -translate-x-1/2 md:block">
        {/* Top isometric squares pattern (rotated 180° per Figma) */}
        <img
          src={asset('/assets/figma/ecosystem/squares-top.svg')}
          alt=""
          aria-hidden
          className="absolute top-[52px] left-[242px] h-[1085px] w-[1436px] max-w-none rotate-180"
        />
        {/* Bottom isometric squares pattern */}
        <img
          src={asset('/assets/figma/ecosystem/squares-bottom.svg')}
          alt=""
          aria-hidden
          className="absolute top-[776px] left-[242px] h-[839px] w-[1436px] max-w-none"
        />

        {/* Decorative katakana "プ" mark, top-left */}
        <img
          src={asset('/assets/figma/ecosystem/katakana.svg')}
          alt=""
          aria-hidden
          className="absolute top-[71px] left-[342px] h-[182px] w-[174px] max-w-none"
        />
        {/* Vertical "PURINTA" wordmark on the left */}
        <img
          src={asset('/assets/figma/ecosystem/purinta-vertical.svg')}
          alt=""
          aria-hidden
          className="absolute top-[274px] left-[361px] h-[519px] w-[34px] max-w-none"
        />

        {/* Floating dollar bill — top right */}
        <img
          src={asset('/assets/figma/ecosystem/bill-1.svg')}
          alt=""
          aria-hidden
          className="absolute top-[370px] left-[1334px] h-[283px] w-[375px] max-w-none rotate-[-11.69deg]"
        />
        {/* Composite bill tucked behind bill-1 */}
        <img
          src={asset('/assets/figma/ecosystem/bill-comp-base.svg')}
          alt=""
          aria-hidden
          className="absolute top-[156px] left-[1191px] h-[140px] w-[244px] max-w-none rotate-[34.06deg]"
        />

        {/* Isometric stepped platform under the mascot — 3 stacked
         * cubes, drawn back-to-front so each lower tier overlaps the
         * one behind it. */}
        <img
          src={asset('/assets/figma/ecosystem/cube-side.svg')}
          alt=""
          aria-hidden
          className="absolute top-[1096px] left-[774px] h-[216px] w-[373px] max-w-none"
        />
        <img
          src={asset('/assets/figma/ecosystem/cube-side.svg')}
          alt=""
          aria-hidden
          className="absolute top-[1158px] left-[774px] h-[216px] w-[373px] max-w-none"
        />
        <img
          src={asset('/assets/figma/ecosystem/cube-side.svg')}
          alt=""
          aria-hidden
          className="absolute top-[1220px] left-[774px] h-[216px] w-[373px] max-w-none"
        />

        {/* Floating dollar bills around the platform */}
        <img
          src={asset('/assets/figma/ecosystem/bill-2.svg')}
          alt=""
          aria-hidden
          className="absolute top-[922px] left-[541px] h-[106px] w-[185px] max-w-none rotate-[34.06deg]"
        />
        <img
          src={asset('/assets/figma/ecosystem/bill-3.svg')}
          alt=""
          aria-hidden
          className="absolute top-[1075px] left-[1009px] h-[574px] w-[588px] max-w-none rotate-[34.06deg]"
        />

        {/* Central tofu mascot — standing on the cube platform */}
        <img
          src={asset('/assets/figma/ecosystem/mascot.svg')}
          alt=""
          aria-hidden
          className="absolute top-[872px] left-[796px] h-[303px] w-[305px] max-w-none"
        />

        {/* Foreground dollar bill — overlaps the mascot's feet */}
        <img
          src={asset('/assets/figma/ecosystem/bill-4.svg')}
          alt=""
          aria-hidden
          className="absolute top-[1190px] left-[523px] h-[150px] w-[262px] max-w-none rotate-[-6.34deg]"
        />
      </div>

      {/* ---------- Foreground content ---------- */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1024px] flex-col items-center gap-[72px] px-6 py-24 md:h-[1596px] md:justify-start md:py-0 md:pt-[207px]">
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
