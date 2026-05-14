import { Fragment } from 'react'
import { asset } from '@/lib/utils'

/* ============================================================
 * Decorative SVG art for the "Built on Giants" section, rebuilt from
 * the individual Figma vector parts so the cube platform stays crisp
 * at any resolution instead of being a flattened raster export.
 * ============================================================ */

const e = (f: string) => asset(`/assets/figma/ecosystem/${f}`)

/**
 * Steps — Figma node 495:11683. The isometric stepped platform under
 * the mascot: a cube base plus 3 stacked tiers. Each tier is a vector
 * "union" (side faces + edge lines) topped with a CSS-transformed
 * rounded gradient face. All offsets are relative to the 1920×1604
 * decorative frame; rendered as a fragment of absolutely-positioned
 * elements.
 */
const STEP_TIERS = [
  { unionTop: 1192, faceTop: 1118 }, // lowest tier — drawn first (back)
  { unionTop: 1137, faceTop: 1063 },
  { unionTop: 1078, faceTop: 1005 }, // highest tier — drawn last (front)
]

export function Steps() {
  return (
    <>
      {/* Cube base */}
      <img
        alt=""
        aria-hidden
        src={e('cube-group.svg')}
        className="absolute top-[1089px] left-[790px] h-[198px] w-[340px] max-w-none"
      />
      {STEP_TIERS.map((t) => (
        <Fragment key={t.unionTop}>
          {/* Side faces + edge lines */}
          <img
            alt=""
            aria-hidden
            src={e('cube-union.svg')}
            className="absolute left-[788px] h-[199px] w-[342px] max-w-none"
            style={{ top: t.unionTop }}
          />
          {/* Rounded gradient top face — isometric transform */}
          <div
            className="absolute flex h-[222px] w-[385px] items-center justify-center"
            style={{ left: 767, top: t.faceTop }}
          >
            <div
              className="flex-none"
              style={{ transform: 'rotate(30deg) skewX(-30deg) scaleY(0.87)' }}
            >
              <div className="size-[222px] rounded-[48px] border-[3.541px] border-solid border-[#c8e6d0] bg-gradient-to-b from-[#ffeeed] to-[#fffdf3]" />
            </div>
          </div>
        </Fragment>
      ))}
    </>
  )
}
