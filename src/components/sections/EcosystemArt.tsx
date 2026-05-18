import { asset } from '@/lib/utils'

/* ============================================================
 * Decorative SVG art for the "Built on Giants" section.
 * ============================================================ */

const e = (f: string) => asset(`/assets/figma/ecosystem-v2/${f}`)

/**
 * Steps — Figma node 551:41112;567:37039. Three stacked isometric
 * cube tiers under the mascot, exported from Figma as one combined
 * 388×389 SVG (`ecosystem-v2/steps.svg`). Placed at the absolute
 * offset Figma laid out inside the 1920×1604 decorative frame.
 */
export function Steps() {
  return (
    <img
      alt=""
      aria-hidden
      src={e('steps.svg')}
      className="absolute top-[929px] left-[766px] h-[389px] w-[388px] max-w-none"
    />
  )
}
