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

const links: FooterLink[] = [
  { label: 'Docs', href: 'https://docs.purinta.xyz/', external: true },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'X', href: 'https://x.com/purintaxyz', external: true },
  { label: 'Discord', href: 'https://discord.gg/purinta', external: true },
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
             * The logo is built inline at the Figma footer size
             * (134.78 × 32 — symbol 28.264 × 32, wordmark 99.932 ×
             * 19.797 at 34.77 / 7.051). The shared <Logo> component
             * hard-codes a 40 px symbol, which threw the copyright
             * line ~4 px off the logo's optical centre. */}
            <div className="flex flex-col items-center gap-2.5 md:flex-row md:items-center md:gap-[18px]">
              <div
                className="relative h-[32px] w-[134.78px] shrink-0"
                aria-label="Purinta"
              >
                <img
                  src={asset('/assets/figma/logo-symbol.svg')}
                  alt=""
                  className="absolute left-0 top-0 h-[32px] w-[28.264px]"
                />
                <img
                  src={asset('/assets/figma/wordmark.svg')}
                  alt="Purinta"
                  className="absolute left-[34.77px] top-[7.051px] h-[19.797px] w-[99.932px]"
                />
              </div>
              <p className="font-body text-[16px] leading-[26px] font-medium tracking-[0.16px] text-[#333] whitespace-nowrap">
                © {new Date().getFullYear()} Purinta Inc. All rights reserved.
              </p>
            </div>

            {/* Footer links — gap-[56px] per Figma 551:37655 */}
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center justify-center gap-x-7 gap-y-1.5 md:flex-nowrap md:gap-[56px]"
            >
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="font-body text-[16px] leading-[26px] font-medium tracking-[0.16px] whitespace-nowrap text-[#333] transition-opacity hover:opacity-70"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
