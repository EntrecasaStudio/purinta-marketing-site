import { asset } from '@/lib/utils'

/**
 * Ecosystem ("Built on Giants") — Figma node 495:11656.
 *
 * Section structure:
 *   - Soft white → Blush/100 → white vertical gradient bg
 *   - Decorative layer behind: large isometric "squares" pattern (top
 *     and bottom), floating dollar-bill graphics, vertical "PURINTA"
 *     wordmark, central mascot stamp
 *   - Foreground: H2 title + subtitle + 4 "pillar" feature cards in
 *     a flex row, each card with the signature 3-rounded-corner shape
 *     and sticker-style offset drop shadow (Mint/100)
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
    logo: asset('/assets/figma/ecosystem/logo-morpho.png'),
    logoSize: { w: 60, h: 56 },
  },
  {
    title: 'Api3',
    body: 'First-party oracle feeds with OEV',
    logo: asset('/assets/figma/ecosystem/logo-api3.png'),
    logoSize: { w: 64, h: 56 },
  },
  {
    title: 'Ethereum',
    body: 'Mainnet native,\ndeep liquidity',
    logo: asset('/assets/figma/ecosystem/logo-eth.png'),
    logoSize: { w: 44, h: 72 },
  },
  {
    title: 'USDC',
    body: 'Borrow the most trusted stablecoin',
    logo: asset('/assets/figma/ecosystem/logo-usdc.png'),
    logoSize: { w: 56, h: 56 },
  },
]

export default function Ecosystem() {
  return (
    <section
      id="ecosystem"
      className="relative w-full overflow-hidden py-32"
      /* Per Figma: subtle gradient peaks at Blush/100 around 86 % of
       * the section height, fading back to Neutral/50 at top and bottom
       * so the blush tint sits below the cards near the mascot zone. */
      style={{
        background:
          'linear-gradient(to bottom, #FEFEFE 0%, #FFF5F4 86%, #FEFEFE 100%)',
      }}
    >
      {/* ---------- Decorative background layer ----------
       *  All elements `pointer-events-none` and behind the content
       *  (z-0). Positions are absolute pixel offsets calibrated for
       *  the ~1440 px Figma frame; on narrower viewports they crop
       *  naturally via the section's `overflow-hidden`. */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Top isometric squares pattern (rotated 180° per Figma) */}
        <img
          src={asset('/assets/figma/ecosystem/squares-top.png')}
          alt=""
          aria-hidden
          className="absolute -top-10 left-1/2 h-[1085px] w-[1435px] max-w-none -translate-x-1/2 rotate-180"
        />
        {/* Bottom isometric squares pattern */}
        <img
          src={asset('/assets/figma/ecosystem/squares-bottom.png')}
          alt=""
          aria-hidden
          className="absolute -bottom-5 left-1/2 h-[839px] w-[1435px] max-w-none -translate-x-1/2"
        />

        {/* Vertical "PURINTA" wordmark on the left */}
        <img
          src={asset('/assets/figma/ecosystem/purinta-vertical.png')}
          alt=""
          aria-hidden
          className="absolute top-[180px] left-[160px] h-[519px] w-[34px] max-w-none"
        />

        {/* Floating dollar bills — 4 of them at hand-placed angles */}
        <img
          src={asset('/assets/figma/ecosystem/bill-1.png')}
          alt=""
          aria-hidden
          className="absolute top-[60px] right-[80px] w-[220px] max-w-none rotate-[-12deg]"
        />
        <img
          src={asset('/assets/figma/ecosystem/bill-2.png')}
          alt=""
          aria-hidden
          className="absolute top-[680px] left-[420px] w-[200px] max-w-none rotate-[34deg]"
        />
        <img
          src={asset('/assets/figma/ecosystem/bill-3.png')}
          alt=""
          aria-hidden
          className="absolute top-[700px] left-[760px] w-[210px] max-w-none rotate-[34deg]"
        />
        <img
          src={asset('/assets/figma/ecosystem/bill-4.png')}
          alt=""
          aria-hidden
          className="absolute top-[900px] left-[440px] w-[280px] max-w-none rotate-[-6deg]"
        />

        {/* Central tofu mascot — peeking out from the squares bg */}
        <img
          src={asset('/assets/figma/ecosystem/mascot.png')}
          alt=""
          aria-hidden
          className="absolute top-[640px] left-1/2 w-[260px] max-w-none -translate-x-1/2"
        />
      </div>

      {/* ---------- Foreground content ---------- */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1024px] flex-col items-center gap-[72px] px-6">
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

        {/* Pillar cards — 4 in a row, stack on narrow viewports */}
        <div className="flex w-full flex-col gap-6 md:flex-row md:items-stretch">
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
