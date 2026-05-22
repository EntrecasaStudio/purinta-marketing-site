import FooterMascot from '@/components/sections/FooterMascot'
import { asset } from '@/lib/utils'

/**
 * Footer — Figma nodes 551:41114 ("05_Bottom Illustration") + 551:41115
 * ("Footer"), composed into one section so the footer band can sit
 * over the meadow scene with the Figma radial gradient providing
 * legibility (transparent center, semi-opaque green edges) — exactly
 * the visual the source design intends.
 *
 * Structure (top → bottom inside the section):
 *   1. Scene wrapper (Hero pattern): 1920 × 916 native, centered with
 *      `footer-scene-wrap` class so ≥ 1920 fills edge-to-edge, 768–1920
 *      clips the sides, and <768 scales proportionally.
 *   2. BG image (`scene-bg.webp`) at Figma offset (-24, -142), natural
 *      2048 × 1325.
 *   3. Mascot (`<FooterMascot>`) at Figma node 551:37818, rendered as
 *      composed SVG parts so each piece can be animated independently.
 *      Float keyframe runs on the wrapper; Figma's static -15.32° tilt
 *      lives on the inner div so the keyframe's transform doesn't
 *      overwrite it.
 *   4. Top fade overlay: vertical gradient from #fefefe at the top to
 *      transparent, fading the meadow into the previous section's
 *      page-level bg (matches Figma's bg-gradient-to-b on node 551:37816).
 *   5. Footer band overlay: bottom 176 px, radial gradient per Figma
 *      551:41115. Transparent center lets the meadow show through;
 *      green-tinted edges hold the text & links readable.
 */

const sceneBg = asset('/assets/figma/footer/scene-bg.webp')

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
          {/* Content row — Figma 551:37650: flex, items-center,
           * justify-between, band padding pt-88 / pb-56 / px-156 at
           * md+; on mobile it stacks and centers with looser padding. */}
          <div className="relative mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between md:gap-10 md:px-[156px] md:pt-[88px] md:pb-[56px]">
            {/* Logotype + copyright — gap-[18px] per Figma 551:37651.
             * Single combined SVG export (symbol with cut-out "P" +
             * wordmark, all in Neutral-900 / #333). Natural 135 × 34;
             * rendered 1:1 so the symbol keeps its 32 px footer height. */}
            <div className="flex flex-col items-center gap-2.5 md:flex-row md:items-center md:gap-[18px]">
              <img
                src={asset('/assets/figma/footer/logotype-footer.svg')}
                alt="Purinta"
                className="h-[34px] w-[135px] shrink-0"
              />
              <p className="font-body text-[16px] leading-[26px] font-medium tracking-[0.16px] text-[#333] whitespace-nowrap">
                © {new Date().getFullYear()} Purinta Inc. All rights reserved.
              </p>
            </div>

            {/* Footer links — Figma 551:37655: two pipe-separated
             * groups, gap-[64px] apart; each group gap-[16px] with a
             * #808080 "|" divider between its two links. */}
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 md:flex-nowrap md:gap-[64px]"
            >
              {linkGroups.map((group, gi) => (
                <div
                  key={gi}
                  className="flex items-center gap-[16px]"
                >
                  {group.map((l, li) => (
                    <span key={l.label} className="flex items-center gap-[16px]">
                      <a
                        href={l.href}
                        {...(l.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="font-body text-[16px] leading-[26px] font-medium tracking-[0.16px] whitespace-nowrap text-[#333] transition-opacity hover:opacity-70"
                      >
                        {l.label}
                      </a>
                      {li === 0 && (
                        <span
                          aria-hidden
                          className="font-body text-[16px] leading-[26px] font-medium text-[#808080]"
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
        </div>
      </div>
    </footer>
  )
}
