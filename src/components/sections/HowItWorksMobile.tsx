import { ChevronRight } from 'lucide-react'
import { asset } from '@/lib/utils'

/**
 * HowItWorks — mobile layout, Figma node 773:40686 ("02_How It Works",
 * 360 wide). Three stacked full-bleed panels with their own bg colour;
 * each panel pairs a giant numeral + mascot column with a title +
 * body column to its right. The Chill panel (step 3) also carries
 * the "Learn more in the docs" CTA.
 *
 * No scroll-pin / sliding track — that's the desktop experience only.
 * Hidden at md+; the desktop component handles md+ separately.
 */

type Step = {
  num: '1' | '2' | '3'
  title: string
  body: string
  /** Mascot PNG — same files the desktop panels use, since the
   * mascots are already rotated in the export. */
  mascot: string
  bg: string
  /** Numeral colour per Figma (per-step palette). */
  numColor: string
  /** Title colour per Figma. */
  titleColor: string
  /** Horizontal offset (px) the numeral sits inside its column.
   * Per-digit so the visual weight balances against the mascot
   * underneath. */
  numLeft: number
  /** Width of the mascot PNG at the mobile scale. */
  mascotWidth: number
  /** Per-step nudges (px) for the mascot within the numeral column. */
  mascotTop: number
  mascotLeft: number
}

const STEPS: Step[] = [
  {
    num: '1',
    title: 'Deposit\nyour memes',
    body: 'Connect your wallet, pick a market, and deposit your memecoins as collateral.',
    mascot: asset('/assets/figma/how-it-works/step-1.png'),
    bg: '#FCFBF5', // Cream/50
    numColor: '#498746', // Green/500
    titleColor: '#57A053', // Green/400
    /* "1" is a narrow digit so it sits well inside the 124-wide column
     * even at 168 px font — slight rightward offset so the mascot can
     * tuck under the bottom curve of the digit. */
    numLeft: 28,
    mascotWidth: 100,
    mascotTop: 50,
    mascotLeft: -4,
  },
  {
    num: '2',
    title: 'Borrow\nUSDC',
    body: 'Borrow as much USDC as you need. The lower you borrow, the more cushion when prices swing.',
    mascot: asset('/assets/figma/how-it-works/step-2.png'),
    bg: '#F0EDD4', // Cream/300
    numColor: '#8B8765', // Cream/900
    titleColor: '#8B8765',
    numLeft: 4,
    mascotWidth: 108,
    mascotTop: 54,
    mascotLeft: 4,
  },
  {
    num: '3',
    title: 'Chill',
    body: 'Use your USDC anywhere. When ready, repay your loan and get your memecoins back. Moon mission intact.',
    mascot: asset('/assets/figma/how-it-works/step-3.png'),
    bg: '#C8E6D0', // Mint/300
    numColor: '#498A70', // Mint/700
    titleColor: '#498A70',
    numLeft: 4,
    mascotWidth: 92,
    mascotTop: 58,
    mascotLeft: 18,
  },
]

export default function HowItWorksMobile() {
  return (
    <section className="w-full md:hidden">
      {/* Title — Figma 714:35917: Ohno Softie Bold 25 / 33 */}
      <div className="reveal reveal-up flex w-full items-center justify-center px-6 py-2 pt-5">
        <h2 className="text-center font-display text-[25px] leading-[33px] font-bold tracking-[0.5px] text-[#333]">
          How It Works
        </h2>
      </div>

      {/* Three stacked panels — each panel is full-bleed and carries
       * its own background colour. The number column is fixed at 98
       * px wide; the text column flexes to fill the rest. */}
      <div className="flex w-full flex-col">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="reveal reveal-up relative w-full px-4 pt-[52px] pb-10"
            style={{ backgroundColor: step.bg }}
          >
            <div className="mx-auto flex w-full max-w-[480px] items-center justify-center gap-3">
              {/* Number column (124 wide). The digit is positioned
               * absolutely so the mascot can sit OVER the bottom curve
               * of the digit — same composition as desktop, scaled
               * down to a 168 px font that fits within the column
               * without bleeding into the text. */}
              <div className="relative h-[178px] w-[124px] shrink-0">
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-0 font-display text-[168px] leading-none font-medium tracking-[-8.4px] select-none"
                  style={{ left: step.numLeft, color: step.numColor }}
                >
                  {step.num}
                </div>
                <img
                  src={step.mascot}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="pointer-events-none absolute max-w-none"
                  style={{
                    width: step.mascotWidth,
                    top: step.mascotTop,
                    left: step.mascotLeft,
                  }}
                />
              </div>

              {/* Text column — title + body. Title font is 31 px on
               * mobile (vs 39 in Figma's 360 frame) so "your memes"
               * stays on one line on a 360 viewport with the wider
               * number column. */}
              <div className="flex h-[178px] min-w-0 flex-1 flex-col items-start justify-center gap-2 pr-2">
                <h3
                  className="w-full font-display text-[31px] leading-[34px] font-bold tracking-[0.62px] whitespace-pre-line"
                  style={{ color: step.titleColor }}
                >
                  {step.title}
                </h3>
                <p className="w-full font-body text-[13px] leading-[21px] font-normal tracking-[0.26px] text-[#4C4C4C]">
                  {step.body}
                </p>
              </div>
            </div>

            {/* Docs link — Figma renders this once on the Chill panel,
             * centered under the content row (node 714:36689). */}
            {i === STEPS.length - 1 && (
              <div className="mt-2 flex w-full items-center justify-center">
                <a
                  href="https://docs.purinta.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 font-body text-[13px] leading-[21px] font-medium tracking-[0.26px] text-[#39763D] transition-opacity hover:opacity-70"
                >
                  Learn more in the docs
                  <ChevronRight className="size-4" strokeWidth={2} />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
