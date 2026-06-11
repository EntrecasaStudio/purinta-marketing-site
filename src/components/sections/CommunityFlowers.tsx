import { asset } from '@/lib/utils'

/**
 * CommunityFlowers — the decorative flower scatter at the bottom of the
 * Community section.
 *
 * Exported FLAT from Figma as a single transparent PNG per breakpoint
 * (the whole "Illustration" group, node 540:23816 desktop / 726:40000
 * mobile), with each flower's 0.4–0.5 opacity already baked into the
 * alpha channel. This replaces the earlier sprite-crop approach — one
 * <img> per breakpoint, no per-flower positioning/crop math, so nothing
 * can drift or fail to paint.
 *
 *   Desktop (≥768) → community-flowers-desktop.webp  (1361 × 289)
 *   Mobile  (<768) → community-flowers-mobile.webp   ( 680 × 145)
 *
 * In Figma the group is the last item ("Illustrations") in the centred
 * content column, vertically centred in a near-zero-height box and
 * overflowing in every direction. We mirror that: this component is the
 * last child of Community's content column, the image is centred (it's
 * wider than the column, so it overflows symmetrically) and the tiny
 * container height lets it spill down toward the Footer meadow below.
 */

type Layer = {
  src: string
  /** Natural size of the exported group (Figma px). */
  w: number
  h: number
  /** Figma "Illustrations" container height; the image is centred in it. */
  containerH: number
  className: string
}

const LAYERS: Layer[] = [
  {
    src: asset('/assets/figma/community/community-flowers-mobile.webp'),
    w: 680,
    h: 145,
    containerH: 0,
    className: 'min-[768px]:hidden',
  },
  {
    src: asset('/assets/figma/community/community-flowers-desktop.webp'),
    w: 1361,
    h: 289,
    containerH: 31,
    className: 'hidden min-[768px]:flex',
  },
]

export default function CommunityFlowers() {
  return (
    <>
      {LAYERS.map((l) => (
        <div
          key={l.src}
          aria-hidden="true"
          className={`pointer-events-none flex w-full select-none items-center justify-center ${l.className}`}
          style={{ height: `${l.containerH}px` }}
        >
          <img
            src={l.src}
            alt=""
            decoding="async"
            className="block max-w-none shrink-0"
            style={{ width: `${l.w}px`, height: `${l.h}px` }}
          />
        </div>
      ))}
    </>
  )
}
