import { asset } from '@/lib/utils'

/**
 * CommunityFlowers — the decorative flower scatter from Figma.
 *
 * Figma source: the `flowers` group (node 726:40370) lives INSIDE the
 * Bottom Illustration (node 551:41114). That group is NOT a flat strip —
 * it is 12 individually-placed flower instances, several positioned with
 * NEGATIVE `top` so they overflow upward past the meadow's top edge into
 * the Community section (node 551:41113). The scatter is one continuous
 * cluster that visually links Community and the Footer meadow.
 *
 * Coordinate system
 * -----------------
 * The flowers group frame sits at (423.984, -64.066) inside the Bottom
 * Illustration. The Bottom Illustration's top edge === Community's bottom
 * edge. So the group origin is 64.066 px ABOVE the Community↔Footer
 * boundary. We render this whole layer anchored to Community's bottom
 * edge: the group origin's top = (Community height − 64.066). Instance
 * `top` values then offset down from there; instances with the most
 * negative effective Y sit highest inside Community, the rest spill down
 * across the boundary into the Footer meadow.
 *
 * Why render from the Community side
 * ----------------------------------
 * Community.tsx had `overflow-hidden`, which clipped anything past the
 * boundary. We switch Community to `overflow-visible` and render the
 * scatter here as one positioned layer (z-index above the Footer) so the
 * cluster crosses the boundary as a single continuous group. Rendering
 * half from Footer would split the cluster across two coordinate systems
 * for no gain — keeping it in one component keeps the scatter coherent.
 *
 * Each instance crops the shared sprite (`flowers-sprite.png`, 2840×539)
 * exactly as Figma does: an `overflow-hidden` box with an inner <img>
 * scaled by a width % and shifted by a left % so a single flower shows.
 * Hidden below `md` so it never crowds the mobile copy (existing pattern).
 */

const sprite = asset('/assets/figma/community/flowers-sprite.png')

/**
 * Community reference width / height in Figma (node 551:41113). The
 * flowers group (726:40370) lives inside the Bottom Illustration, whose
 * top edge === Community's bottom edge. Each instance's left/top below
 * is already expressed in Bottom-Illustration coordinates (a 1440-wide
 * space sharing the boundary with Community), so we anchor this layer's
 * top to Community's bottom edge and offset instances directly.
 */
const REF_W = 1440
const REF_H = 638

type Flower = {
  id: string
  /** Bounding-box left/top, in Bottom-Illustration space (Figma px).
   *  `top` is measured from the Community↔Footer boundary: negative
   *  values sit above it (inside Community), positive ones cross down
   *  into the Footer meadow. */
  left: number
  top: number
  /** Bounding-box width/height (Figma px). */
  w: number
  h: number
  /** Optional inner rotated box — Figma wraps rotated instances. */
  rot?: number
  /** Inner (rotated) box size; defaults to bounding-box size. */
  innerW?: number
  innerH?: number
  /** Mirror on Y before rotating (Figma `-scale-y-100`). */
  flipY?: boolean
  /** Sprite crop on the inner box: img width % and left % offset. */
  imgW: string
  imgL: string
  opacity?: number
}

/**
 * The 12 instances of Figma group 726:40370, transcribed 1:1 from the
 * get_design_context output (left/top/size/rotation/opacity/sprite crop).
 */
const flowers: Flower[] = [
  { id: 'f1', left: 1332.6, top: 23.93, w: 140.52, h: 181.5, imgW: '680.56%', imgL: '-580.56%' },
  { id: 'f3', left: 516.8, top: 23.93, w: 321.949, h: 181.5, imgW: '297.04%', imgL: '0%' },
  {
    id: 'f4', left: 1300.17, top: 17, w: 259.205, h: 179.361,
    rot: 168.13, innerW: 236.806, innerH: 133.5, imgW: '297.04%', imgL: '0%',
  },
  { id: 'f5', left: 951.37, top: 31.93, w: 89.201, h: 133.5, imgW: '788.57%', imgL: '0%', opacity: 0.4 },
  { id: 'f6', left: 1055.37, top: -64.07, w: 89.201, h: 133.5, imgW: '788.57%', imgL: '0%' },
  { id: 'f7', left: 799.98, top: -49.12, w: 57.2, h: 85.606, imgW: '788.57%', imgL: '0%', opacity: 0.5 },
  { id: 'f9', left: 423.98, top: 15.88, w: 57.2, h: 85.606, imgW: '788.57%', imgL: '0%', opacity: 0.5 },
  { id: 'f8', left: 943.98, top: 15.88, w: 57.2, h: 85.606, imgW: '788.57%', imgL: '0%', opacity: 0.5 },
  {
    id: 'f2', left: 563.39, top: 12.35, w: 88.361, h: 130.71,
    rot: -176.05, flipY: true, innerW: 79.9, innerH: 125.5, imgW: '827.61%', imgL: '-727.61%',
  },
  {
    id: 'f10', left: 513.47, top: -6.82, w: 60.198, h: 89.049,
    rot: -3.95, innerW: 54.434, innerH: 85.5, imgW: '827.61%', imgL: '-727.61%', opacity: 0.5,
  },
  {
    id: 'f11', left: 833.47, top: 17.18, w: 60.198, h: 89.049,
    rot: -3.95, innerW: 54.434, innerH: 85.5, imgW: '827.61%', imgL: '-727.61%', opacity: 0.5,
  },
  {
    id: 'f12', left: 1257.47, top: 105.18, w: 60.198, h: 89.049,
    rot: -3.95, innerW: 54.434, innerH: 85.5, imgW: '827.61%', imgL: '-727.61%', opacity: 0.5,
  },
]

/** A single sprite-cropped flower. */
function FlowerCrop({
  w,
  h,
  imgW,
  imgL,
  opacity,
}: Pick<Flower, 'w' | 'h' | 'imgW' | 'imgL' | 'opacity'>) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: `${w}px`, height: `${h}px`, opacity }}
    >
      <img
        src={sprite}
        alt=""
        className="absolute top-0 block h-full max-w-none"
        style={{ width: imgW, left: imgL }}
      />
    </div>
  )
}

export default function CommunityFlowers() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute hidden select-none md:block"
      style={{
        // Anchor the layer's origin (y = 0) to the Community↔Footer
        // boundary, i.e. Community's bottom edge. Instance `top` values
        // offset from here (negative → up into Community).
        top: `${REF_H}px`,
        // Center the 1440-wide coordinate space (same pattern as the
        // Footer scene-wrap); flowers overflow below into the Footer
        // meadow, hence z-20 so the cluster paints over it.
        left: '50%',
        width: `${REF_W}px`,
        height: 0,
        transform: 'translateX(-50%)',
        zIndex: 20,
      }}
    >
      <div className="relative" style={{ width: `${REF_W}px` }}>
        {flowers.map((fl) => {
          const inner = (
            <FlowerCrop
              w={fl.innerW ?? fl.w}
              h={fl.innerH ?? fl.h}
              imgW={fl.imgW}
              imgL={fl.imgL}
              opacity={fl.opacity}
            />
          )
          // Rotated/flipped instances: Figma centers the inner box in the
          // bounding box, then applies flip + rotation.
          const content =
            fl.rot !== undefined ? (
              <div className="flex h-full w-full items-center justify-center">
                <div
                  className="flex-none"
                  style={{
                    transform: `${fl.flipY ? 'scaleY(-1) ' : ''}rotate(${fl.rot}deg)`,
                  }}
                >
                  {inner}
                </div>
              </div>
            ) : (
              inner
            )

          return (
            <div
              key={fl.id}
              className="absolute"
              style={{
                left: `${fl.left}px`,
                top: `${fl.top}px`,
                width: `${fl.w}px`,
                height: `${fl.h}px`,
              }}
            >
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
