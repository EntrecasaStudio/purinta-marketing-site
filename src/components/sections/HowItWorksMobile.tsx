import { ChevronRight } from 'lucide-react'
import { asset } from '@/lib/utils'

/* Combined number + mascot SVGs (Figma Type=N, Size=lg exports).
 * Inlined via ?raw + dangerouslySetInnerHTML so the artwork stays
 * vector through every CSS transform — <img src=*.svg> rasterises
 * at the intrinsic size first, which pixelates in Safari/Retina
 * when the column scales the SVG via width/height. */
import step1Svg from '@/assets/figma/how-it-works/step-1.svg?raw'
import step2Svg from '@/assets/figma/how-it-works/step-2.svg?raw'
import step3Svg from '@/assets/figma/how-it-works/step-3.svg?raw'

const STEP_SVG: Record<string, string> = {
  '1': step1Svg,
  '2': step2Svg,
  '3': step3Svg,
}

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
  /** Per-step adjustments to the combined-SVG (digit + mascot)
   * placement inside the 98-wide number column. The digit's
   * horizontal position varies per character ("1" sits at the
   * SVG's right, "2" / "3" sit more centred), so each step gets
   * its own left/width tweak so the digit's visual centre lands
   * at the column centre. */
  svgLeft: number
  svgTop: number
  svgWidth: number
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
    /* Combined-SVG placement — "1" digit sits at x=175 of the 256
     * viewBox (narrow numeral pulled right), so anchor the SVG
     * LEFT-shifted (-34) to land the stem near the column centre. */
    svgLeft: -34,
    svgTop: -8,
    svgWidth: 140,
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
    /* Combined-SVG placement — "2" digit centred around x=190 of
     * the 256 viewBox; SVG anchored further LEFT to bring the
     * digit centre to the column centre. */
    svgLeft: -38,
    svgTop: -8,
    svgWidth: 140,
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
    /* Combined-SVG placement — "3" digit centred around x=185 of
     * the 256 viewBox; same left-shift as "2" so the column
     * centre line stays aligned across all three steps. */
    svgLeft: -38,
    svgTop: -8,
    svgWidth: 140,
  },
]

export default function HowItWorksMobile() {
  return (
    <section className="w-full pt-[48px] pb-0 min-[768px]:pb-[24px] min-[1152px]:hidden">
      {/* Title — mobile (714:35917): 25/33 semibold. Tablet
       *  (1006:114833): 31/37 tracking 0.62 (weight kept at 600 to
       *  match the other section titles across all breakpoints). */}
      <div className="reveal reveal-up flex w-full items-center justify-center px-6 pb-2 min-[768px]:py-[24px]">
        <h2 className="text-center font-display text-[25px] leading-[33px] font-semibold tracking-[0.5px] text-[#333] min-[768px]:text-[31px] min-[768px]:leading-[37px] min-[768px]:tracking-[0.62px]">
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
            /* Mobile: block layout, full-bleed panel with auto height
             * + 52/40 py — content row sits on top, Learn more (step 3
             * only) stacks below it. Tablet (Figma 1041:95801-803):
             * each card is 464 tall with 30/40 px-x and the content
             * row centred via flex items-center justify-center; the
             * Learn more is absolutely positioned at the bottom (40
             * px above the panel edge) so it doesn't compete with the
             * centred row. */
            className="reveal reveal-up relative w-full px-4 pt-[52px] pb-10 min-[768px]:flex min-[768px]:h-[464px] min-[768px]:min-h-[464px] min-[768px]:items-center min-[768px]:justify-center min-[768px]:px-[40px] min-[768px]:py-0"
            style={{ backgroundColor: step.bg, overflow: 'visible' }}
          >
            <div
              /* Mobile: 480 max content. Tablet: 688 wide / 249 tall
               * row with 48 gap between number col and text col. */
              className="mx-auto flex w-full max-w-[426px] items-center justify-center gap-2 min-[768px]:h-[249px] min-[768px]:max-w-[688px] min-[768px]:gap-[48px]"
              style={{ overflow: 'visible' }}
            >
              {/* Number column — Figma 714:36627/-65/-78 mobile.
               * Renders the COMBINED step-N.svg (digit + mascot at
               * their Figma-designed relative positions) as a
               * single inline <svg> so the whole composition stays
               * vector at any DPR. Scaled to ~0.55× of the natural
               * 256×~334 viewBox (140×~184) — roughly the visual
               * footprint of the previous 218 px text digit + its
               * companion mascot in the 98-wide mobile column. */}
              <div
                /* Mobile: 98×178 column with the combined SVG at
                 * 140×~184 inside. Tablet (Figma 1041:95496/-512/
                 * -613): the number+mascot lockup grows to 192×249. */
                className="relative h-[178px] w-[98px] shrink-0 min-[768px]:h-[249px] min-[768px]:w-[192px]"
                style={{ overflow: 'visible' }}
              >
                <div
                  aria-hidden
                  /* Tablet: SVG scales to 192 wide (~0.75× of natural
                   * 256) and re-anchors so the digit lands flush left
                   * inside the wider 192-px column. */
                  className="pointer-events-none absolute select-none [&>svg]:size-full min-[768px]:!top-0 min-[768px]:!left-0 min-[768px]:!w-[192px]"
                  style={{
                    top: step.svgTop,
                    left: step.svgLeft,
                    width: step.svgWidth,
                    /* Height auto-scales from the SVG's viewBox so
                     * each digit keeps its natural aspect ratio
                     * (step-3 is slightly taller than step-1). */
                    height: 'auto',
                  }}
                  dangerouslySetInnerHTML={{ __html: STEP_SVG[step.num] ?? '' }}
                />
              </div>

              {/* Text column — mobile: 178 tall, title 31/34 +
               * body 13/21, capped at 320 px so the body wraps to a
               * predictable 3 lines across the three steps. Tablet
               * (Figma 1041:95506-09): 249 tall items-end with
               * pb-24, title 61/61 bold tracking 1.22, body 20/32
               * tracking 0.2. */}
              <div className="flex h-[178px] min-w-0 max-w-[240px] flex-1 flex-col items-start justify-center gap-2 pr-2 min-[768px]:h-[249px] min-[768px]:w-[448px] min-[768px]:max-w-none min-[768px]:items-start min-[768px]:justify-end min-[768px]:gap-[18px] min-[768px]:pr-0 min-[768px]:pb-[24px]">
                <h3
                  className="w-full font-display text-[31px] leading-[34px] font-semibold tracking-[0.62px] whitespace-pre-line min-[768px]:text-[61px] min-[768px]:leading-[61px] min-[768px]:font-bold min-[768px]:tracking-[1.22px]"
                  style={{ color: step.titleColor }}
                >
                  {step.title}
                </h3>
                <p className="w-full font-body text-[13px] leading-[21px] font-normal tracking-[0.26px] text-[#4C4C4C] min-[768px]:text-[20px] min-[768px]:leading-[32px] min-[768px]:tracking-[0.2px]">
                  {step.body}
                </p>
              </div>
            </div>

            {/* Docs link — Figma renders this once on the Chill panel,
             * centered under the content row (mobile 714:36689,
             * tablet 1041:95624 pt-54 with 16 px Rubik Medium). */}
            {i === STEPS.length - 1 && (
              <div className="mt-2 flex w-full items-center justify-center min-[768px]:absolute min-[768px]:bottom-[40px] min-[768px]:mt-0">
                <a
                  href="https://docs.purinta.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 font-body text-[13px] leading-[21px] font-medium tracking-[0.26px] text-[#39763D] transition-opacity hover:opacity-70 min-[768px]:text-[16px] min-[768px]:leading-[26px] min-[768px]:tracking-[0.16px]"
                >
                  Learn more in the docs
                  <ChevronRight className="size-4 min-[768px]:size-5" strokeWidth={2} />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* 24 px spacer in The Stack's #FEFEFE so the green step-3 panel
       * is separated from Ecosystem by a white band (not the page's
       * cool diagonal gradient). Lives here — outside Ecosystem — so
       * the whole Stack section (bg + graphics + content) still shifts
       * down as one unit instead of only its inner content. */}
      <div className="h-6 bg-[#FEFEFE]" />
    </section>
  )
}
