import { asset } from '@/lib/utils'

/**
 * Features — mobile layout, Figma node 693:34365 ("01_Why Degens Love
 * Purinta", 360 wide). Unlike the desktop auto-cycling card row, the
 * mobile design is five static stacked cards, each fully expanded.
 *
 * Card illustrations reuse the desktop mascot PNGs at their natural
 * Figma 1x size (same files used by the desktop card row, transparent
 * background). Everything else — colours, copy, the star bullet, the
 * "Learn more" link — is live markup.
 *
 * Responsive: the section background is full-bleed; only the cards
 * are capped at 480 px wide (centred, margins grow past that).
 * Hidden at md+.
 */

type Card = {
  key: string
  title: string
  body: string
  bg: string
  border: string
  star: string
  illu: string
  /** Rendered size of the mascot in the mobile card. Scaled down
   * from the natural Figma 1x sizes (which range 113-161 px wide,
   * 103-160 px tall) so the mascot fits inside the 120×76 slot
   * with only a slight overhang above. Height is held near 90 px
   * across all cards for visual consistency; width follows the
   * mascot's natural aspect ratio. */
  illuW: number
  illuH: number
}

const cards: Card[] = [
  {
    key: 'borrow',
    title: 'Borrow Against Memes',
    body: 'Lock any of the supported memecoins as collateral and borrow USDC without selling. Your memes stay yours. You just unlock their liquidity.',
    bg: '#FFFAFA',
    border: '#FEC4C0',
    star: asset('/assets/figma/features/star-borrow.svg'),
    illu: asset('/assets/figma/features/borrow.png'),
    /* natural 127×156 → scaled to fit ~90 px tall */
    illuW: 73,
    illuH: 90,
  },
  {
    key: 'apy',
    title: 'Best APY on the Market',
    body: 'Competitive rates powered by efficient market design. Lenders earn real yield from memecoin borrowers, while borrowers get the best rates available anywhere.',
    bg: '#F2F8F7',
    border: '#6ECFC6',
    star: asset('/assets/figma/features/star-apy.svg'),
    illu: asset('/assets/figma/features/apy.png'),
    /* natural 113×103 → scaled to fit ~90 px tall */
    illuW: 99,
    illuH: 90,
  },
  {
    key: 'morpho',
    title: 'Built on Morpho',
    body: "Purinta is built on Morpho's battle-tested lending infrastructure, the same protocol securing billions in DeFi. No shortcuts on security.",
    bg: '#FFF5ED',
    border: '#FFA466',
    star: asset('/assets/figma/features/star-morpho.svg'),
    illu: asset('/assets/figma/features/morpho.png'),
    /* natural 161×140 → scaled to fit ~90 px tall */
    illuW: 103,
    illuH: 90,
  },
  {
    key: 'mainnet',
    title: 'Mainnet Native',
    body: 'Live on Ethereum mainnet from day one. Deep liquidity, real security, great volumes. Your memes deserve the real thing.',
    bg: '#EDF4FF',
    border: '#669FFF',
    star: asset('/assets/figma/features/star-mainnet.svg'),
    illu: asset('/assets/figma/features/mainnet.png'),
    /* natural 126×160 → scaled to fit ~90 px tall */
    illuW: 71,
    illuH: 90,
  },
  {
    key: 'api3',
    title: 'Powered by Api3',
    body: 'A curator you can trust. An oracle that never misreported. Api3 picks which memecoins make the cut and powers the price feeds, while OEV capture sends value back to the protocol.',
    bg: '#F1F3E7',
    border: '#57A053',
    star: asset('/assets/figma/features/star-api3.svg'),
    illu: asset('/assets/figma/features/api3.png'),
    /* natural 123×134 → scaled to fit ~90 px tall */
    illuW: 83,
    illuH: 90,
  },
]

function Caret() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M6 3.5 10.5 8 6 12.5"
        stroke="#39763D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function FeaturesMobile() {
  return (
    <section className="relative w-full pt-10 pb-4 md:hidden">
      <div className="flex w-full flex-col items-center gap-8">
        {/* Title — Figma 665:61546: Rubik Medium 25 / 38 */}
        <h2 className="reveal reveal-up px-[5px] text-center font-display text-[25px] leading-[38px] font-semibold tracking-[0.25px] text-[#333]">
          Why Purinta?
        </h2>

        {/* Cards — stacked, gap-24, 24 px gutters. Each card is capped
         * at 480 px wide; the section background stays full-bleed. */}
        <div className="flex w-full flex-col items-center gap-6 px-6 pb-6">
          {cards.map((c) => (
            <article
              key={c.key}
              className="reveal reveal-up w-full max-w-[480px] rounded-[24px] border border-solid p-4"
              style={{ backgroundColor: c.bg, borderColor: c.border }}
            >
              {/* Title row — star + heading on the left, illustration
               * on the right (the mascot overhangs the card top). */}
              <div className="flex items-start justify-between gap-2 pt-1">
                <div className="flex flex-col gap-2 pt-1 pl-2">
                  <img
                    src={c.star}
                    alt=""
                    aria-hidden
                    className="size-4"
                  />
                  <h3 className="w-[132px] font-display text-[20px] leading-[24px] font-bold tracking-[0.4px] text-[#333]">
                    {c.title}
                  </h3>
                </div>
                <div className="relative h-[76px] w-[120px] shrink-0">
                  <img
                    src={c.illu}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                    width={c.illuW}
                    height={c.illuH}
                    className="absolute right-0 bottom-0 max-w-none"
                    style={{ width: `${c.illuW}px`, height: `${c.illuH}px` }}
                  />
                </div>
              </div>

              {/* Body + Learn more */}
              <div className="flex flex-col items-start gap-2 px-2 pt-2">
                <p className="font-body text-[13px] leading-[21px] font-normal tracking-[0.26px] text-[#808080]">
                  {c.body}
                </p>
                <a
                  href="https://docs.purinta.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 font-body text-[13px] leading-[21px] font-medium tracking-[0.26px] text-[#39763D] transition-opacity hover:opacity-70"
                >
                  Learn more
                  <Caret />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
