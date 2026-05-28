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
  /** Background blob behind the mascot — matches the desktop
   * expanded-state blob (shape via mask SVG, fill via accent color).
   * Sized 0.75× of the desktop expanded blob (170×150 → 128×113)
   * and tilted per `blobRotate` so the organic ellipse feels
   * hand-placed under each character. */
  blob: string
  blobRotate: number
}

const cards: Card[] = [
  {
    key: 'borrow',
    title: 'Borrow\nAgainst Memes',
    body: 'Lock any of the supported memecoins as collateral and borrow USDC without selling. Your memes stay yours. You just unlock their liquidity.',
    bg: '#FFFAFA',
    border: '#FEC4C0',
    star: asset('/assets/figma/features/star-borrow.svg'),
    illu: asset('/assets/figma/features/borrow.svg'),
    /* natural 130×110 → 0.75× for mobile */
    illuW: 98,
    illuH: 83,
    blob: 'var(--color-blush-300)',
    blobRotate: 68.88,
  },
  {
    key: 'apy',
    title: 'Best APY on the Market',
    body: 'Competitive rates powered by efficient market design. Lenders earn real yield from memecoin borrowers, while borrowers get the best rates available anywhere.',
    bg: '#F2F8F7',
    border: '#6ECFC6',
    star: asset('/assets/figma/features/star-apy.svg'),
    illu: asset('/assets/figma/features/apy.svg'),
    /* natural 153×155 → 0.75× for mobile */
    illuW: 115,
    illuH: 116,
    blob: 'var(--color-success-200)',
    blobRotate: 49.81,
  },
  {
    key: 'morpho',
    title: 'Built\non Morpho',
    body: "Purinta is built on Morpho's battle-tested lending infrastructure, the same protocol securing billions in DeFi. No shortcuts on security.",
    bg: '#FFF5ED',
    border: '#FFA466',
    star: asset('/assets/figma/features/star-morpho.svg'),
    illu: asset('/assets/figma/features/morpho.svg'),
    /* natural 131×161 → 0.75× for mobile */
    illuW: 98,
    illuH: 121,
    blob: 'var(--color-warning-200)',
    blobRotate: 49.81,
  },
  {
    key: 'mainnet',
    title: 'Mainnet Native',
    body: 'Live on Ethereum mainnet from day one. Deep liquidity, real security, great volumes. Your memes deserve the real thing.',
    bg: '#EDF4FF',
    border: '#669FFF',
    star: asset('/assets/figma/features/star-mainnet.svg'),
    illu: asset('/assets/figma/features/mainnet.svg'),
    /* natural 130×160 → 0.75× for mobile */
    illuW: 98,
    illuH: 120,
    blob: 'var(--color-info-200)',
    blobRotate: 49.81,
  },
  {
    key: 'api3',
    title: 'Powered\nby Api3',
    body: 'A curator you can trust. An oracle that never misreported. Api3 picks which memecoins make the cut and powers the price feeds, while OEV capture sends value back to the protocol.',
    bg: '#F1F3E7',
    border: '#57A053',
    star: asset('/assets/figma/features/star-api3.svg'),
    illu: asset('/assets/figma/features/api3.svg'),
    /* natural 172×135 → 0.75× for mobile */
    illuW: 129,
    illuH: 101,
    blob: 'var(--color-green-100)',
    blobRotate: 49.81,
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
                  <h3 className="w-[160px] font-display text-[20px] leading-[24px] font-bold tracking-[0.4px] whitespace-pre-line text-[#333]">
                    {c.title}
                  </h3>
                </div>
                <div className="relative h-[76px] w-[120px] shrink-0">
                  {/* Blob behind the mascot — same per-card mask SVG
                   * + accent fill as the desktop expanded state.
                   * Per Figma 773:40685 the mobile blob is much
                   * smaller than desktop's (170×150 → 76×52), and
                   * sits low-and-right behind the mascot's body so
                   * the character reads against the cream card with
                   * a tinted shape under its lower half rather than
                   * a full halo. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute"
                    style={{
                      right: '-4px',
                      bottom: '-4px',
                      width: '76px',
                      height: '52px',
                      backgroundColor: c.blob,
                      transform: `rotate(${c.blobRotate}deg)`,
                      transformOrigin: 'center',
                      WebkitMaskImage: `url(${asset(`/assets/figma/features/blob-${c.key}.svg`)})`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskImage: `url(${asset(`/assets/figma/features/blob-${c.key}.svg`)})`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                    }}
                  />
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
