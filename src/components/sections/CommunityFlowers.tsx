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
 *
 * Two layers
 * ----------
 *   Desktop (≥ md): the 12-flower scatter from 726:40370, positioned in
 *   a 1440-wide reference frame, anchored to Community's bottom at
 *   y = REF_H (638).
 *
 *   Mobile  (< md): the 12-flower scatter from 773:40689's flowers group
 *   (726:40369), positioned in the 960-wide Bottom-Illustration scene
 *   and centered horizontally inside the 360-wide section so the same
 *   x-coords resolve 1:1. Anchored to Community's bottom edge via
 *   `bottom: 0` so the section's actual height doesn't matter.
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
 * Mobile reference: the Bottom-Illustration scene is 960 wide and sits
 * centered inside the 360-wide section, so x-coords from Figma resolve
 * 1:1 once the layer wrapper is centered too. The layer uses
 * `bottom: 0` (anchored to Community's bottom edge) so the section's
 * actual height isn't needed.
 */
const REF_W_MOBILE = 960

/**
 * The 12 instances of Figma group 726:40370 (desktop, Bottom-Illustration
 * 1440-wide scene), transcribed 1:1 from get_design_context.
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

/**
 * The 12 instances of Figma group 726:40369 (mobile, Bottom-Illustration
 * 960-wide scene), transcribed 1:1 from 773:40689 get_design_context.
 * Several have NEGATIVE top so they overflow up into Community; the
 * rest sit in the Footer meadow. Same sprite as desktop.
 */
const flowersMobile: Flower[] = [
  { id: 'mf1', left: 666.3, top: 12.47, w: 70.26, h: 90.75, imgW: '680.56%', imgL: '-580.56%' },
  { id: 'mf3', left: 258.4, top: 12.47, w: 160.975, h: 90.75, imgW: '297.04%', imgL: '0%' },
  {
    id: 'mf4', left: 650.09, top: 9, w: 129.602, h: 89.681,
    rot: 168.13, innerW: 118.403, innerH: 66.75, imgW: '297.04%', imgL: '0%',
  },
  { id: 'mf5', left: 475.69, top: 16.47, w: 44.601, h: 66.75, imgW: '788.57%', imgL: '0%', opacity: 0.4 },
  { id: 'mf6', left: 527.69, top: -31.53, w: 44.601, h: 66.75, imgW: '788.57%', imgL: '0%' },
  { id: 'mf7', left: 399.99, top: -24.06, w: 28.6, h: 42.803, imgW: '788.57%', imgL: '0%', opacity: 0.5 },
  { id: 'mf9', left: 211.99, top: 8.44, w: 28.6, h: 42.803, imgW: '788.57%', imgL: '0%', opacity: 0.5 },
  { id: 'mf8', left: 471.99, top: 8.44, w: 28.6, h: 42.803, imgW: '788.57%', imgL: '0%', opacity: 0.5 },
  {
    id: 'mf2', left: 281.69, top: 6.68, w: 44.181, h: 65.355,
    rot: -176.05, flipY: true, innerW: 39.95, innerH: 62.75, imgW: '827.61%', imgL: '-727.61%',
  },
  {
    id: 'mf10', left: 256.73, top: -2.91, w: 30.099, h: 44.525,
    rot: -3.95, innerW: 27.217, innerH: 42.75, imgW: '827.61%', imgL: '-727.61%', opacity: 0.5,
  },
  {
    id: 'mf11', left: 416.73, top: 9.09, w: 30.099, h: 44.525,
    rot: -3.95, innerW: 27.217, innerH: 42.75, imgW: '827.61%', imgL: '-727.61%', opacity: 0.5,
  },
  {
    id: 'mf12', left: 628.73, top: 53.09, w: 30.099, h: 44.525,
    rot: -3.95, innerW: 27.217, innerH: 42.75, imgW: '827.61%', imgL: '-727.61%', opacity: 0.5,
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

/** Render a list of flowers inside a fixed-width coord space. */
function FlowerLayer({ items, width }: { items: Flower[]; width: number }) {
  return (
    <div className="relative" style={{ width: `${width}px` }}>
      {items.map((fl) => {
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
  )
}

export default function CommunityFlowers() {
  return (
    <>
      {/* Desktop layer — 1440-wide scene, anchored to top: REF_H so it
       *  sits at Community's bottom edge (section has md:min-h-[638]). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden select-none md:block"
        style={{
          top: `${REF_H}px`,
          left: '50%',
          width: `${REF_W}px`,
          height: 0,
          transform: 'translateX(-50%)',
          zIndex: 20,
        }}
      >
        <FlowerLayer items={flowers} width={REF_W} />
      </div>

      {/* Mobile layer — 960-wide Bottom-Illustration scene, anchored
       *  via bottom: 0 so the section's natural height is honoured.
       *  The 960-wide layer overflows the 360 viewport symmetrically
       *  (the section is overflow-visible at the page level, but the
       *  Footer below is overflow-clip so anything that lands inside
       *  the Footer is clipped to it). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute select-none md:hidden"
        style={{
          bottom: 0,
          left: '50%',
          width: `${REF_W_MOBILE}px`,
          height: 0,
          transform: 'translateX(-50%)',
          zIndex: 20,
        }}
      >
        <FlowerLayer items={flowersMobile} width={REF_W_MOBILE} />
      </div>
    </>
  )
}
