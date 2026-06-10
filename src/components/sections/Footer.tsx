import type { CSSProperties } from 'react'
import FooterMascot from '@/components/sections/FooterMascot'
import { asset } from '@/lib/utils'

/**
 * Footer — one meadow scene per breakpoint, all built from the same
 * `Footer-Background` illustration scaled to three widths (the flowers
 * and the faded edges are baked into the image, so there are no separate
 * flower layers). The animated <FooterMascot> is the only live element;
 * it's centred horizontally in every breakpoint and sits on the meadow.
 *
 *   Desktop ≥1154 → footer-bg.webp        (1920 × 1132)
 *   Tablet 768–1153 → footer-bg-tablet.webp (1320 ×  778)
 *   Mobile  <768   → footer-bg-mobile.webp  ( 960 ×  566)
 *
 * The image carries its OWN alpha edge-fade (top + sides baked in), so it
 * dissolves into the Community section above on its own — no extra fade
 * overlay needed. The band (logo + copyright + links) overlaps the bottom
 * of the scene.
 */

const footerBg = asset('/assets/figma/footer/footer-bg.webp')
const footerBgTablet = asset('/assets/figma/footer/footer-bg-tablet.webp')
const footerBgMobile = asset('/assets/figma/footer/footer-bg-mobile.webp')

type FooterLink = { label: string; href: string; external?: boolean }
/* (The footer image bakes in its own top/edge fade — no CSS dissolve.) */

/* Footer links — Figma 551:37655: two pipe-separated groups.
 * Group 1 (773:43242 "Socila"): X | Discord.
 * Group 2 (773:43139 "T&C"):    Docs | Terms & Conditions. */
const linkGroups: FooterLink[][] = [
  [
    { label: 'X', href: 'https://x.com/purintaxyz', external: true },
    { label: 'Discord', href: 'https://discord.gg/purinta', external: true },
  ],
  [
    { label: 'Docs', href: 'https://docs.purinta.xyz/', external: true },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
]

type SceneProps = {
  visibility: string
  img: string
  imgW: number
  imgH: number
  sceneH: number
  /** mascot box size + vertical centre (px from scene top) */
  mascotW: number
  mascotH: number
  mascotCenterY: number
  bandH: number
}

function FooterScene({
  visibility,
  img,
  imgW,
  imgH,
  sceneH,
  mascotW,
  mascotH,
  mascotCenterY,
  bandH,
}: SceneProps) {
  /* Top-aligned: the image's faded TOP edge stays visible (dissolving
   * into Community); only the bottom is cropped by the shorter sceneH —
   * matching Figma (1279:76837 / 76838). */
  const imgStyle: CSSProperties = {
    width: imgW,
    height: imgH,
    top: 0,
  }
  return (
    <div className={visibility}>
      {/* overflow-clip (not hidden): `hidden` would make the section a
       * scroll container and a focus()/scrollIntoView on a link could
       * shift the meadow. `clip` clips identically but isn't scrollable. */}
      <div
        className="relative w-full overflow-clip"
        style={{ height: sceneH }}
      >
        {/* Meadow — native width, centred (sides clip on narrow viewports);
         * the image's baked alpha fades the edges. */}
        <img
          src={img}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute left-1/2 z-0 block max-w-none -translate-x-1/2"
          style={imgStyle}
        />

        {/* Mascot — centred horizontally, tilted -15.32° (Figma). The
         * animated SVG (breath / blink / arm sway) scales with the box. */}
        <div
          className="pointer-events-auto absolute left-1/2 z-[10]"
          style={{
            top: mascotCenterY,
            width: mascotW,
            height: mascotH,
            transform: 'translate(-50%, -50%) rotate(-15.32deg)',
            transformOrigin: 'center',
          }}
        >
          <FooterMascot />
        </div>

        {/* Band — overlaps the bottom of the scene (sits over the meadow's
         * faded, light lower edge; no tint needed — Figma keeps it clean). */}
        <div
          className="absolute inset-x-0 bottom-0 z-[20] text-[#333]"
          style={{ height: bandH }}
        >
          <BandInner />
        </div>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="relative w-full">
      <FooterScene
        visibility="min-[768px]:hidden"
        img={footerBgMobile}
        imgW={960}
        imgH={566}
        sceneH={480}
        mascotW={250}
        mascotH={234}
        mascotCenterY={238}
        bandH={103}
      />
      <FooterScene
        visibility="hidden min-[768px]:block min-[1152px]:hidden"
        img={footerBgTablet}
        imgW={1320}
        imgH={778}
        sceneH={774}
        mascotW={344}
        mascotH={322}
        mascotCenterY={327}
        bandH={114}
      />
      <FooterScene
        visibility="hidden min-[1152px]:block"
        img={footerBg}
        imgW={1920}
        imgH={1132}
        sceneH={916}
        mascotW={500}
        mascotH={468}
        mascotCenterY={475}
        bandH={176}
      />
    </footer>
  )
}

/* Shared band content — logotype + copyright + two link groups.
 * Layout per Figma (Footer links 773:40690 / 1044:47782 / 551:41115):
 *
 *   Mobile  (<768)  : column, links row ON TOP (px-56), then logo+©
 *                     row below. Logo 16px, © 11/18 ls0.33, links 13/21
 *                     ls0.26; group-gap 16, in-group gap 4, logo↔© gap 8.
 *   Tablet  (768-1153): same column order. Logo 24px, © 11/18 ls0.33,
 *                     links 16/26 ls0.16; group-gap 32, in-group 8,
 *                     logo↔© 18.
 *   Desktop (≥1154) : single row, logo+© LEFT, links RIGHT (space-
 *                     between, px-156). Logo 32px, © 13/21 ls0.26, links
 *                     16/26 ls0.16; group-gap 64, in-group 16, logo↔© 18.
 *
 * `order` flips the stack so the links sit on top on mobile/tablet but
 * to the right on desktop. (Each FooterScene only renders at its own
 * breakpoint, so the min-[…] utilities here are effectively scoped.)
 */
function BandInner() {
  return (
    <div className="relative mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center gap-4 px-4 py-6 min-[768px]:gap-4 min-[768px]:px-6 min-[1152px]:flex-row min-[1152px]:justify-between min-[1152px]:gap-10 min-[1152px]:px-[156px] min-[1152px]:py-0">
      {/* Logo + copyright (always a row) — below the links on mobile/
       * tablet, to the left on desktop. */}
      <div className="order-2 flex items-center gap-2 min-[768px]:gap-[18px] min-[1152px]:order-1">
        <img
          src={asset('/assets/figma/footer/logotype-footer.svg')}
          alt="Purinta"
          className="h-4 w-[67.39px] shrink-0 min-[768px]:h-6 min-[768px]:w-[101.085px] min-[1152px]:h-8 min-[1152px]:w-[134.78px]"
        />
        <p className="font-body text-[11px] leading-[18px] font-medium tracking-[0.33px] text-[#333] whitespace-nowrap min-[1152px]:text-[13px] min-[1152px]:leading-[21px] min-[1152px]:tracking-[0.26px]">
          © {new Date().getFullYear()} Purinta Inc. All rights reserved.
        </p>
      </div>
      <nav
        aria-label="Footer"
        className="order-1 flex items-start justify-center gap-4 px-14 min-[768px]:gap-8 min-[768px]:px-0 min-[1152px]:order-2 min-[1152px]:gap-[64px]"
      >
        {linkGroups.map((group, gi) => (
          <div
            key={gi}
            className="flex items-center gap-1 min-[768px]:gap-2 min-[1152px]:gap-4"
          >
            {group.map((l, li) => (
              <span
                key={l.label}
                className="flex items-center gap-1 min-[768px]:gap-2 min-[1152px]:gap-4"
              >
                <a
                  href={l.href}
                  {...(l.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="font-body text-[13px] leading-[21px] font-medium tracking-[0.26px] whitespace-nowrap text-[#333] transition-opacity hover:opacity-70 min-[768px]:text-[16px] min-[768px]:leading-[26px] min-[768px]:tracking-[0.16px]"
                >
                  {l.label}
                </a>
                {li === 0 && (
                  <span
                    aria-hidden
                    className="font-body text-[13px] leading-[21px] font-medium text-[#808080] min-[768px]:text-[16px] min-[768px]:leading-[26px]"
                  >
                    |
                  </span>
                )}
              </span>
            ))}
          </div>
        ))}
      </nav>
    </div>
  )
}
