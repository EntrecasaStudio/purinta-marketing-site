import Logo from '@/components/Logo'
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
      <div className="footer-section relative w-full overflow-hidden">

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

        {/* Top fade overlay — fades the meadow into the previous
         * section. Per Figma node 551:37816 the fade goes from #fefefe
         * to a semi-opaque green tint; here we keep the white top and
         * fade to transparent so the meadow's own colour takes over
         * (the green tint would re-introduce a seam against the page
         * gradient that fills Community above). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: '180px',
            background:
              'linear-gradient(to bottom, #fefefe 0%, rgba(254,254,254,0) 100%)',
          }}
        />

        {/* Footer band — sits OVER the meadow's bottom 176 px. Radial
         * gradient values copied 1:1 from the Figma SVG fill
         * (rgba(157,189,90,0) → rgba(100,154,96,0.61), 940 × 333 ellipse
         * at 706.36, 61.404 within the band). The transparent centre
         * is intentional: it lets the meadow read through while the
         * green-tinted edges keep the logo / links legible. */}
        <div
          className="absolute inset-x-0 bottom-0 text-[#333]"
          style={{
            height: `${BAND_H}px`,
            background:
              'radial-gradient(ellipse 940px 333px at 706.36px 61.404px, rgba(157,189,90,0) 0%, rgba(100,154,96,0.61) 100%)',
          }}
        >
          <div className="mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center gap-4 px-6 md:flex-row md:justify-between md:px-[156px]">
            {/* Logotype + copyright */}
            <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-[18px]">
              <Logo className="relative h-[32px] w-[134.78px] shrink-0" />
              <p className="font-body text-[16px] leading-[26px] font-medium tracking-[0.16px] text-[#333] whitespace-nowrap">
                © {new Date().getFullYear()} Purinta Inc. All rights reserved.
              </p>
            </div>

            {/* Footer links */}
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 md:gap-[56px]"
            >
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="font-body text-[16px] leading-[26px] font-medium tracking-[0.16px] text-[#333] transition-opacity hover:opacity-70"
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
