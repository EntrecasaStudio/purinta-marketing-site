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
  /** Mascot SVG — Figma 773:40686 mobile exports (Type=1/2/3.svg),
   * dropped into `/assets/figma/how-it-works/mascot-N.svg`. */
  mascot: string
  /** Rendered size (px), kept SMALL so the mascot reads as the little
   * tofu character it is in Figma — not a big sticker. Each SVG has
   * a different natural aspect so the height varies per pose. */
  mascotW: number
  mascotH: number
  /** Per-step offsets inside the number column. Each Figma mascot
   * pose sits at a slightly different visual spot relative to its
   * digit (top-left of "1", inside the curve of "2", bottom-left of
   * "3"), so each step nudges top/left independently. */
  mascotTop: number
  mascotLeft: number
  /** Per-step rotation (deg). Base Figma rotation is -12.65°; some
   * steps need extra tilt so the mascot reads as leaning ON the digit
   * rather than floating next to it. */
  mascotRotate: number
  bg: string
  /** Numeral colour per Figma (per-step palette). */
  numColor: string
  /** Title colour per Figma. */
  titleColor: string
  /** Horizontal offset (px) the numeral sits inside the inline-grid
   * cell — Figma's `ml-[63px]` for "1" (it's a narrow digit so it
   * shifts right) and `ml-[31px]` for "2" and "3". */
  numLeft: number
  /** Per-step vertical offset (px) for the digit. Defaults to 0;
   * negative pushes the digit up. Used when the mascot sits at the
   * top of the column and the digit needs to lift to clear it. */
  numTop?: number
}

const STEPS: Step[] = [
  {
    num: '1',
    title: 'Deposit\nyour memes',
    body: 'Connect your wallet, pick a market, and deposit your memecoins as collateral.',
    mascot: asset('/assets/figma/how-it-works/mascot-1.svg'),
    /* SVG viewBox expanded to 164 × 132 (15 px padding on each side
     * of the original 134 × 102) so content that used to clip past
     * the viewBox boundaries now fits within. Rendered at 86 × 69
     * keeps the visible character at the same pixel size as the
     * previous 70 × 53 in the 134 × 102 box. */
    mascotW: 86,
    mascotH: 69,
    /* Pose: leaning on the top of the "1". */
    mascotTop: 36,
    mascotLeft: -14,
    /* Reset to 0 then rotate −45° (mascot leans clearly onto the
     * digit's stem from its top). */
    mascotRotate: -45,
    /* Step 1 panel is transparent — the surrounding page bg shows
     * through so the Deposit panel reads as part of the canvas
     * rather than its own coloured band. */
    bg: 'transparent',
    numColor: '#498746', // Green/500
    titleColor: '#57A053', // Green/400
    /* Digit shifted +24 px right (32 − 8) + 32 px up to clear the
     * rotated mascot bbox without moving the mascot itself. */
    numLeft: 34,
    numTop: -32,
  },
  {
    num: '2',
    title: 'Borrow\nUSDC',
    body: 'Choose how much USDC to borrow – up to 62.5% of your collateral value with built-in safety buffers.',
    mascot: asset('/assets/figma/how-it-works/mascot-2.svg'),
    /* viewBox expanded to 146 × 130. Render scaled to keep the
     * visible character at the same pixel size as the previous
     * 64 × 55 in the 116 × 100 box. */
    mascotW: 81,
    mascotH: 72,
    /* Inside the upper-right curl of "2": shifted right + down so the
     * mascot rides the digit's upper hump. */
    mascotTop: 64,
    mascotLeft: 32,
    mascotRotate: 0,
    bg: '#F0EDD4', // Cream/300
    numColor: '#8B8765', // Cream/900
    titleColor: '#8B8765',
    numLeft: -6,
    numTop: -32,
  },
  {
    num: '3',
    title: 'Chill',
    body: 'Use your USDC anywhere. When ready, repay your loan and get your memecoins back. Moon mission intact.',
    mascot: asset('/assets/figma/how-it-works/mascot-3.svg'),
    /* viewBox expanded to 160 × 128. Render scaled to keep the
     * visible character at the same pixel size as the previous
     * 68 × 51 in the 130 × 98 box. */
    mascotW: 84,
    mascotH: 67,
    /* Bottom-LEFT of the "3" — under the lower curve. */
    mascotTop: 78,
    mascotLeft: -10,
    mascotRotate: 0,
    bg: '#C8E6D0', // Mint/300
    numColor: '#498A70', // Mint/700
    titleColor: '#498A70',
    numLeft: 2,
    numTop: -32,
  },
]

export default function HowItWorksMobile() {
  return (
    <section className="w-full pt-[48px] pb-[24px] md:hidden">
      {/* Title — Figma 714:35917: Ohno Softie Bold 25 / 33 */}
      <div className="reveal reveal-up flex w-full items-center justify-center px-6 pb-2">
        <h2 className="text-center font-display text-[25px] leading-[33px] font-bold tracking-[0.5px] text-[#333]">
          How It Works
        </h2>
      </div>

      {/* Three stacked panels — each panel is full-bleed and carries
       * its own background colour. Panels use `overflow-visible` so
       * the rotated mascot bbox can extend slightly past the number
       * column without being clipped. */}
      <div className="flex w-full flex-col" style={{ overflow: 'visible' }}>
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="reveal reveal-up relative w-full px-4 pt-[52px] pb-10"
            style={{ backgroundColor: step.bg, overflow: 'visible' }}
          >
            <div
              className="mx-auto flex w-full max-w-[480px] items-center justify-center gap-2"
              style={{ overflow: 'visible' }}
            >
              {/* Number column — Figma 714:36627/-65/-78 mobile.
               * Match the Figma 98-wide column exactly; the digit +
               * mascot are positioned absolutely with the rotated
               * mascot bbox overflowing symmetrically (negative left)
               * into the panel padding, like the Figma inline-grid
               * cell centered in pr-32. Font is Ohno Softie Medium
               * 218/line-none tracking -10.9 per Figma 714:36629. */}
              <div
                className="relative h-[178px] w-[98px] shrink-0"
                style={{ overflow: 'visible' }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute font-display text-[218px] leading-none font-medium tracking-[-10.9px] select-none"
                  style={{
                    top: step.numTop ?? 0,
                    left: step.numLeft,
                    color: step.numColor,
                  }}
                >
                  {step.num}
                </span>
                {/* Mascot — Figma 714:36630/-68/-81. Each SVG renders
                 * at its OWN natural viewBox size (mascot-1 134×102,
                 * mascot-2 116×100, mascot-3 130×98) so the artwork
                 * isn't stretched or letterboxed. The Figma wrapper
                 * rotation -12.65° is preserved. */}
                <img
                  src={step.mascot}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="pointer-events-none absolute max-w-none"
                  style={{
                    top: step.mascotTop,
                    left: step.mascotLeft,
                    width: step.mascotW,
                    height: step.mascotH,
                    transform: `rotate(${step.mascotRotate}deg)`,
                    transformOrigin: 'center',
                    overflow: 'visible',
                  }}
                />
              </div>

              {/* Text column — title + body. Title font is 31 px on
               * mobile (vs 39 in Figma's 360 frame) so "your memes"
               * stays on one line on a 360 viewport with the wider
               * number column. Height matches the number column so
               * `items-center` doesn't shift one against the other. */}
              <div className="flex h-[178px] min-w-0 flex-1 flex-col items-start justify-center gap-2 pr-2">
                <h3
                  className="w-full font-display text-[31px] leading-[34px] font-semibold tracking-[0.62px] whitespace-pre-line"
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
