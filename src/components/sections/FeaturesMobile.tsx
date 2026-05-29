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
  /** Optional vertical nudge (px). Positive = down. Per-card tweak
   * so mascots 2-5 sit slightly lower in their slot than mascot 1,
   * matching the Figma 773:40685 mobile layout. */
  illuOffsetY?: number
  /** Optional horizontal nudge (px). Positive = right (past the
   * card's right edge). Used for mascot 5 (api3) which sits a bit
   * outside the column per Figma. */
  illuOffsetX?: number
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
    star: asset('/assets/figma/features/star-mobile-borrow.svg'),
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
    star: asset('/assets/figma/features/star-mobile-apy.svg'),
    illu: asset('/assets/figma/features/apy.svg'),
    /* natural 153×155 → 0.75× for mobile */
    illuW: 115,
    illuH: 116,
    illuOffsetY: 20,
    blob: 'var(--color-success-200)',
    blobRotate: 49.81,
  },
  {
    key: 'morpho',
    title: 'Built\non Morpho',
    body: "Purinta is built on Morpho's battle-tested lending infrastructure, the same protocol securing billions in DeFi. No shortcuts on security.",
    bg: '#FFF5ED',
    border: '#FFA466',
    star: asset('/assets/figma/features/star-mobile-morpho.svg'),
    illu: asset('/assets/figma/features/morpho.svg'),
    /* natural 131×161 → 0.75× for mobile */
    illuW: 98,
    illuH: 121,
    illuOffsetY: 20,
    blob: 'var(--color-warning-200)',
    blobRotate: 49.81,
  },
  {
    key: 'mainnet',
    title: 'Mainnet Native',
    body: 'Live on Ethereum mainnet from day one. Deep liquidity, real security, great volumes. Your memes deserve the real thing.',
    bg: '#EDF4FF',
    border: '#669FFF',
    star: asset('/assets/figma/features/star-mobile-mainnet.svg'),
    illu: asset('/assets/figma/features/mainnet.svg'),
    /* natural 130×160 → 0.75× for mobile */
    illuW: 98,
    illuH: 120,
    illuOffsetY: 20,
    blob: 'var(--color-info-200)',
    blobRotate: 49.81,
  },
  {
    key: 'api3',
    title: 'Powered\nby Api3',
    body: 'A curator you can trust. An oracle that never misreported. Api3 picks which memecoins make the cut and powers the price feeds, while OEV capture sends value back to the protocol.',
    bg: '#F1F3E7',
    border: '#57A053',
    star: asset('/assets/figma/features/star-mobile-api3.svg'),
    illu: asset('/assets/figma/features/api3.svg'),
    /* natural 172×135 → 0.75× for mobile */
    illuW: 129,
    illuH: 101,
    illuOffsetY: 12,
    illuOffsetX: 16,
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
    <section className="relative z-40 w-full pt-10 pb-4 min-[1154px]:hidden min-[768px]:pt-[24px] min-[768px]:pb-[124px]">
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
              className="reveal reveal-up w-full max-w-[480px] rounded-[24px] border border-solid p-4 pb-6 min-[768px]:max-w-[680px] min-[768px]:px-[16px] min-[768px]:pt-[24px] min-[768px]:pb-[24px]"
              style={{ backgroundColor: c.bg, borderColor: c.border }}
            >
              {/* Title row — star + heading on the left, illustration
               * on the right (the mascot overhangs the card top). */}
              <div className="flex items-start justify-between gap-2 pt-1">
                {/* Title column — collapses to a single line at
                 * viewports wide enough to fit the longest title
                 * ("Best APY on the Market", ~290 px at 20 px bold)
                 * without touching the 120 px mascot column. Below
                 * that threshold the explicit \n breaks in `title`
                 * are honoured via whitespace-pre-line (Borrow /
                 * Against Memes, Built / on Morpho, Powered / by
                 * Api3 — matching Figma 773:40685). At ≥ 500 px
                 * viewport the column adds 24 px extra padding-top
                 * so the now-single-line title's baseline lands at
                 * the same gap to the paragraph below (16 px). */}
                <div className="flex flex-1 flex-col gap-0 pt-1 pl-2 min-[500px]:pt-7">
                  {/* Star — 36×36 SVG with built-in shadow / padding
                   * around the ~16 px glyph. Negative left margin
                   * (-10 px) cancels the SVG's left padding so the
                   * visible glyph aligns with the title's left edge,
                   * and negative bottom margin (-4 px) tightens the
                   * gap between the glyph's bottom and the title to
                   * a clean ~8 px visual. */}
                  <img
                    src={c.star}
                    alt=""
                    aria-hidden
                    className="size-9 -mb-1 -ml-[10px]"
                  />
                  <h3 className="font-display text-[20px] leading-[24px] font-semibold tracking-[0.4px] whitespace-pre-line text-[#333] min-[500px]:whitespace-normal">
                    {c.title}
                  </h3>

                  {/* Body + Learn more — TABLET ONLY. At tablet+
                   * (Figma 1047:144282) the card flattens to a single
                   * row with all text content on the LEFT of the
                   * mascot+blob, so the body + CTA live inside the
                   * title column here. The mobile layout keeps the
                   * full-width body section below the title row
                   * (rendered after this title-col wrapper). */}
                  <div className="hidden min-[768px]:mt-4 min-[768px]:flex min-[768px]:flex-col min-[768px]:gap-2">
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
                </div>
                <div
                  className="relative h-[76px] w-[120px] shrink-0 min-[768px]:h-[200px] min-[768px]:w-[260px]"
                  style={{
                    /* Per-card mascot dims: mobile uses the 0.75×
                     * mobile-design sizes (illuW/H); tablet+ jumps to
                     * the desktop-expanded sizes (natural × 1.5 = 2×
                     * mobile) and pins blob + mascot INSIDE the slot
                     * with no overflow, matching Figma 1047:144282. */
                    ['--m-w' as string]: `${c.illuW}px`,
                    ['--m-h' as string]: `${c.illuH}px`,
                    ['--m-w-t' as string]: `${c.illuW * 2}px`,
                    ['--m-h-t' as string]: `${c.illuH * 2}px`,
                  }}
                >
                  {/* Blob — mobile 76×52 sits low behind the mascot's
                   * body; tablet+ jumps to the desktop-default 170×150
                   * shape and is anchored inside the slot so the whole
                   * mascot+blob group reads as a contained "expanded
                   * state" snapshot to the right of the text. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-[-4px] bottom-[20px] h-[52px] w-[76px] min-[768px]:right-[8px] min-[768px]:bottom-[24px] min-[768px]:h-[150px] min-[768px]:w-[170px]"
                    style={{
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
                    className="absolute max-w-none [width:var(--m-w)] [height:var(--m-h)] min-[768px]:[width:var(--m-w-t)] min-[768px]:[height:var(--m-h-t)] min-[768px]:right-[24px] min-[768px]:bottom-0"
                    style={{
                      /* Mobile anchor — bottom-right of the slot with
                       * per-card offsets (illuOffsetY for cards 2-5,
                       * illuOffsetX for api3) so each character lands
                       * over its blob. Tablet+ overrides via Tailwind
                       * classes to pin the mascot inside the wider
                       * slot. */
                      bottom: `${-(c.illuOffsetY ?? 0)}px`,
                      right: `${-(c.illuOffsetX ?? 0)}px`,
                      transform: 'rotate(8deg)',
                      transformOrigin: 'bottom right',
                    }}
                  />
                </div>
              </div>

              {/* Body + Learn more — MOBILE ONLY. Hidden at tablet+
               * because the body is rendered inside the title column
               * for the side-by-side layout (Figma 1047:144282).
               * `relative` (no z-index) promotes this section to a
               * positioned element so it paints AFTER the header row
               * in DOM order. Without it, the mascot's transform-
               * created stacking context makes the overflowing
               * mascot paint over the paragraph (positioned slot
               * beats static body in CSS paint order). */}
              <div className="relative flex flex-col items-start gap-2 px-2 pt-2 min-[768px]:hidden">
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
