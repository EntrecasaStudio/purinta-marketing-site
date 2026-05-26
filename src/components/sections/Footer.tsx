import FooterMascot from '@/components/sections/FooterMascot'
import { asset } from '@/lib/utils'

/**
 * Footer — two layouts that share the band content (logo + copyright +
 * links) but diverge on the meadow scene above it.
 *
 *  Desktop (≥ md), Figma 551:41114 + 551:41115:
 *    1920 × 916 scene with the band OVERLAPPING the bottom 176 px so
 *    the meadow runs full-bleed under the legibility tint. Scaling is
 *    handled by the `.footer-scene-wrap` CSS rule (Hero pattern).
 *
 *  Mobile (< md), Figma 773:40689 + 773:40690:
 *    360 × 377 portrait scene STACKED above a 360 × 171 band — no
 *    overlap, because the mascot sits low enough in the mobile scene
 *    that a band overlay would slice through its legs. A different
 *    Figma meadow asset (`scene-bg-mobile.webp`, exported from
 *    "Purinta footer V4") drives this view; the desktop bg is too wide.
 *
 * The mascot SVG (`mascot-footer.svg`) is shared between both views.
 * It carries its own internal CSS keyframes (breath / sync-blink /
 * arm sway) so each layout just sizes the wrapper and the animation
 * scales with it.
 */

const sceneBg = asset('/assets/figma/footer/scene-bg.webp')
const sceneBgMobile = asset('/assets/figma/footer/scene-bg-mobile.webp')

type FooterLink = { label: string; href: string; external?: boolean }

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

const BAND_H = 176

export default function Footer() {
  return (
    <footer className="relative w-full">
      {/* =====================================================
       *  DESKTOP (≥ md) — scene + band overlapping, Figma
       *  551:41114 + 551:41115.
       * ===================================================== */}
      <div className="hidden md:block">
      {/* overflow-clip (not hidden): `hidden` makes the section a
       * scroll container, so a focus()/scrollIntoView() on any child
       * link silently scrolls its content — shifting the meadow up.
       * `clip` clips identically but is NOT scrollable. */}
      <div className="footer-section relative w-full overflow-clip">

        {/* Scene wrapper — Hero pattern (centered, native 1920 wide,
         * scaled to fit below md via .footer-scene-wrap rules). The
         * class also owns the wrapper height (740 on mobile so the
         * scene stays its natural ratio above the unscaled band; 916
         * on md+ so the band overlays the bottom of the scene per
         * Figma). */}
        <div
          className="footer-scene-wrap pointer-events-none absolute top-0 left-1/2"
          style={{ width: '1920px' }}
        >
          <img
            src={sceneBg}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute block max-w-none"
            style={{
              left: '-24px',
              top: '-142px',
              width: '2048px',
              height: '1325px',
            }}
          />

          {/* Mascot — Figma 551:37818, vector SVG. Natural box 500 ×
           * 468, centered at Figma (1048, 564.6) inside the 1920
           * wrapper and tilted -15.32° (Figma rotation). Static for
           * now — `<g id="...">` groups inside the SVG let future
           * animations target individual parts. */}
          <div
            className="pointer-events-auto absolute"
            style={{
              left: '1048px',
              top: '564.6px',
              width: '500px',
              height: '468px',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: 'rotate(-15.32deg)',
                transformOrigin: 'center',
              }}
            >
              <FooterMascot />
            </div>
          </div>
        </div>

        {/* Top fade — softens the meadow into Community. The meadow
         * webp already carries a baked alpha fade; this overlay adds
         * a second, longer pass painted in the page-gradient colour
         * so the very top edge is indistinguishable from Community's
         * background. Anchored to the section (not the scene wrapper)
         * and reliable now the section uses overflow-clip (no scroll
         * offset). Sits below the band, above the meadow. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[5]"
          style={{
            height: '420px',
            background:
              'linear-gradient(106.89deg, #f9f9f7 0%, #f4f7f5 100%)',
            maskImage:
              'linear-gradient(to bottom, #000 0%, #000 14%, rgba(0,0,0,0.55) 46%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 0%, #000 14%, rgba(0,0,0,0.55) 46%, transparent 100%)',
          }}
        />

        {/* Footer band — sits OVER the meadow's bottom 176 px. */}
        <div
          className="absolute inset-x-0 bottom-0 text-[#333]"
          style={{ height: `${BAND_H}px` }}
        >
          {/* Band tint — radial gradient copied 1:1 from the Figma SVG
           * fill (rgba(157,189,90,0) → rgba(100,154,96,0.61), 940 × 333
           * ellipse at 706.36 / 61.404). Rendered as its own layer and
           * vertically masked so the tint FADES IN from the band's top
           * edge — without the mask the rectangle's top is a hard line
           * of green tint over the meadow ("frame cut"). The mask
           * leaves the lower band (where the logo + links sit) fully
           * tinted for legibility. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 940px 333px at 706.36px 61.404px, rgba(157,189,90,0) 0%, rgba(100,154,96,0.61) 100%)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, #000 46%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, #000 46%)',
            }}
          />
          {/* Content row — Figma 551:37650. Shared with the mobile
           * band via <BandInner />; responsive classes inside switch
           * between stacked (mobile) and side-by-side (desktop). */}
          <BandInner />
        </div>
      </div>
      </div>

      {/* =====================================================
       *  MOBILE (< md) — Figma 773:40689 (scene 360×377) +
       *  773:40690 (band 360×171). One overflow-clipped section,
       *  548 tall total. The meadow runs FULL-bleed under both the
       *  scene area and the band, so the band's logo + links sit
       *  over the grass (Figma intent) — no solid plane behind them.
       * ===================================================== */}
      <div
        className="md:hidden relative w-full overflow-clip"
        style={{ height: '548px' }}
      >
        {/* Scene — Figma 726:40007 sized 960 × 730.692. Centered
         * horizontally so x-positions copied from Figma still resolve
         * 1:1; vertical anchor stays at top so the mascot lands at its
         * Figma y. The 960-wide canvas overflows the 360 viewport and
         * is clipped by the section. */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
          style={{ width: '960px', height: '730.692px' }}
        >
          {/* Background meadow — Figma 726:40364 "Purinta footer V4".
           * Native 4096×2651 (RGBA) downsampled to 1200×776 webp.
           * Sits at Figma offset (-40, 0), rendered into a 1040×581
           * box with object-fit:cover so the lush meadow + flowers
           * fill the box edge-to-edge. The 581-tall image covers the
           * full 548-tall section so the meadow is visible behind
           * everything — including the band logo + links. */}
          <img
            src={sceneBgMobile}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute block max-w-none"
            style={{
              left: '-40px',
              top: '0px',
              width: '1040px',
              height: '581px',
              objectFit: 'cover',
              objectPosition: '50% 50%',
            }}
          />

          {/* Mascot — Figma 726:40023, MascotFooter size="sm" (250 ×
           * 234) wrapped in a -15.32° rotation. The rotated bounding
           * box (302.939 × 291.734) sits at Figma (341, 117); we
           * place the unrotated 250×234 mascot at the centre of that
           * box and apply the same -15.32° rotation. The animated
           * SVG (sync-blink / breath / arm sway) scales 1:1 with
           * this wrapper. */}
          <div
            className="pointer-events-auto absolute"
            style={{
              left: `${341 + 302.939 / 2}px`,
              top: `${117 + 291.734 / 2}px`,
              width: '250px',
              height: '234px',
              transform: 'translate(-50%, -50%) rotate(-15.32deg)',
              transformOrigin: 'center',
            }}
          >
            <FooterMascot />
          </div>
        </div>

        {/* Top fade — softens the meadow into Community (the section
         * above). Solid Neutral-50 (#fefefe) — the same tone as the
         * page background showing through Community's transparent
         * section, so the fade's opaque top reads as a continuation
         * of Community rather than introducing a new tint. Taller
         * mask (320 px) + a longer fully-opaque region (0–22 %) so
         * the meadow's hard top edge stays covered until the gradient
         * has space to dissolve into the grass. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[5]"
          style={{
            height: '320px',
            background: '#fefefe',
            maskImage:
              'linear-gradient(to bottom, #000 0%, #000 22%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.25) 78%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 0%, #000 22%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.25) 78%, transparent 100%)',
          }}
        />

        {/* Band — Figma 773:40690, absolute bottom 171. The radial
         * tint is the SAME pattern as desktop (transparent at the top
         * edge → green tint at the bottom for text legibility),
         * scaled down for the 360-wide viewport. The meadow keeps
         * showing through; the logo + links sit on top of the grass,
         * not on a solid plane. */}
        <div
          className="absolute inset-x-0 bottom-0 text-[#333]"
          style={{ height: '171px' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 360px 171px at 50% 100%, rgba(100,154,96,0.55) 0%, rgba(157,189,90,0) 100%)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, #000 46%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, #000 46%)',
            }}
          />
          <BandInner />
        </div>
      </div>
    </footer>
  )
}

/* Shared band content — logotype + copyright + two link groups.
 * Responsive utilities switch the type scale & layout per breakpoint:
 *
 *   Mobile  (Figma 773:40690): logo 20 px, text Rubik Medium 13/21
 *                              tracking 0.26, gap-8 logo↔copyright,
 *                              gap-24 logo-block↔links-block, links
 *                              flex-wrap with separator pipes.
 *   Desktop (Figma 551:41115):  logo 34 px, text 16/26 tracking 0.16,
 *                              gap-18 logo↔copyright, flex-row, gap-64
 *                              between link groups.
 */
function BandInner() {
  return (
    <div className="relative mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center gap-[24px] px-[16px] py-[24px] md:flex-row md:items-center md:justify-between md:gap-10 md:px-[156px] md:pt-[88px] md:pb-[56px]">
      <div className="flex flex-col items-center gap-[8px] md:flex-row md:items-center md:gap-[18px]">
        {/* Logo — Figma sizes the mobile lockup at 20 × 84 (symbol
         * 17.66 × 20 + wordmark 62.46 × 12.37). Rendering the 135×34
         * SVG at h=20 keeps the same composition at the natural 3.97:1
         * aspect → 79.4 px wide (≈ Figma's 84). Desktop stays 34×135. */}
        <img
          src={asset('/assets/figma/footer/logotype-footer.svg')}
          alt="Purinta"
          className="h-[20px] w-[79.4px] shrink-0 md:h-[34px] md:w-[135px]"
        />
        <p className="font-body text-[13px] leading-[21px] font-medium tracking-[0.26px] text-[#333] whitespace-nowrap md:text-[16px] md:leading-[26px] md:tracking-[0.16px]">
          © {new Date().getFullYear()} Purinta Inc. All rights reserved.
        </p>
      </div>
      <nav
        aria-label="Footer"
        className="flex flex-wrap items-start justify-center gap-y-2 gap-x-[32px] px-[56px] md:flex-nowrap md:items-center md:gap-[64px] md:px-0"
      >
        {linkGroups.map((group, gi) => (
          <div
            key={gi}
            className="flex items-center gap-[12px] md:gap-[16px]"
          >
            {group.map((l, li) => (
              <span
                key={l.label}
                className="flex items-center gap-[12px] md:gap-[16px]"
              >
                <a
                  href={l.href}
                  {...(l.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="font-body text-[13px] leading-[21px] font-medium tracking-[0.26px] whitespace-nowrap text-[#333] transition-opacity hover:opacity-70 md:text-[16px] md:leading-[26px] md:tracking-[0.16px]"
                >
                  {l.label}
                </a>
                {li === 0 && (
                  <span
                    aria-hidden
                    className="font-body text-[13px] leading-[21px] font-medium text-[#808080] md:text-[16px] md:leading-[26px]"
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
