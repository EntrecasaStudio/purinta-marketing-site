import CommunityFlowers from '@/components/sections/CommunityFlowers'
import { XIcon, DiscordIcon } from '@/components/icons/Social'
import { Button } from '@/components/ui/button'

/**
 * Community — Figma 551:41113 ("04_Community") on desktop, 773:40688 on
 * mobile. The two breakpoints share the same copy + CTAs but diverge on
 * type scale, spacing and button sizing:
 *
 *  Desktop (≥ md, 1440 px reference):
 *    - Section pads 80 / 83 vertical, 24 horizontal (Figma DS Space/24)
 *    - Content column max-w 1080, 72 px gap between blocks
 *    - h2: Ohno Softie 39 / 43, body Rubik 25 / 38
 *    - CTAs use <Button size="lg"> in a flex row
 *
 *  Mobile (< md, 360 px reference):
 *    - Section pads pt-1 / pb-4 / px-6 (4 / 16 / 24)
 *    - Content column max-w 540, 28 px gap between blocks
 *    - h2: Ohno Softie 25 / 33 tracking 0.5
 *    - Body: Rubik 13 / 21 tracking 0.26, width 312 px (capped)
 *    - CTAs use <Button size="md"> stacked, w-[260] each (44 px tall)
 *
 * Both breakpoints reuse the shared <Button> (btn-primary / btn-secondary)
 * so hover / focus / active match Hero and the dapp source of truth.
 *
 * Decorative flowers (<CommunityFlowers />) are a desktop-only scatter
 * that crosses the boundary into the Footer meadow; the section stays
 * `overflow-visible` so the cluster reads as one piece. The mobile
 * flower instances from Figma 726:39999 are deferred (5 small sprite
 * crops; can be added under <CommunityFlowers /> with a `mobile` mode
 * if the design needs them).
 */

export default function Community() {
  return (
    <section
      id="community"
      /* z-10 promotes Community to its own stacking context so the
       * CommunityFlowers scatter (with z-20 inside) paints OVER the
       * Footer section that follows in document order. Without this
       * the later <Footer /> sibling covers the flowers that overflow
       * Community's bottom edge into the Footer meadow. */
      className="relative z-10 w-full overflow-visible px-6 pt-1 pb-12 md:min-h-[638px] md:px-[var(--ds-space-24,24px)] md:pt-[80px] md:pb-[83px]"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col items-center gap-[28px] md:gap-[72px]">
        {/* Heading + body — 540 px column on mobile, 700 px column at md+ */}
        <div className="reveal reveal-up flex w-full max-w-[540px] flex-col items-center gap-[12px] text-center md:max-w-[700px] md:gap-6">
          <h2 className="w-full font-display text-[25px] leading-[33px] font-semibold tracking-[0.5px] text-[var(--color-neutral-900)] md:text-[39px] md:leading-[43px] md:tracking-[-0.195px]">
            <span className="block">The Meme Lending</span>
            <span className="block">Community</span>
          </h2>
          <p className="w-[312px] max-w-full font-body text-[13px] leading-[21px] font-normal tracking-[0.26px] text-[var(--color-neutral-800)] md:w-full md:text-[25px] md:leading-[38px] md:tracking-[0.25px]">
            Purinta combines the best DeFi primitives into one seamless
            memecoin lending experience. No shortcuts, no compromises
          </p>
        </div>

        {/* CTAs — two layouts share the same three actions:
         *   - Mobile: stacked column, every button w-[260px] and ~44 px
         *     tall (Button size="md"), 8 px gap.
         *   - Desktop: flex row, Button size="lg", 16 px gap (wraps on
         *     narrow viewports between sm and md). */}
        <div className="reveal reveal-up flex w-full flex-col items-center justify-center gap-2 md:hidden">
          <Button
            variant="primary"
            size="md"
            className="w-[260px]"
            asChild
          >
            <a href="https://app.purinta.xyz">Launch App</a>
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="w-[260px]"
            asChild
          >
            <a
              href="https://x.com/purintaxyz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <XIcon className="btn-icon" />
              Follow on X
            </a>
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="w-[260px]"
            asChild
          >
            <a
              href="https://discord.gg/purinta"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordIcon className="btn-icon" />
              Join Discord
            </a>
          </Button>
        </div>
        <div className="reveal reveal-up hidden w-full flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap md:flex">
          <Button variant="primary" size="lg" asChild>
            <a href="https://app.purinta.xyz">Launch App</a>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a
              href="https://x.com/purintaxyz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <XIcon className="btn-icon" />
              Follow on X
            </a>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a
              href="https://discord.gg/purinta"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordIcon className="btn-icon" />
              Join Discord
            </a>
          </Button>
        </div>

      </div>

      {/* Decorative flower scatter — Figma 726:40370, desktop-only. */}
      <CommunityFlowers />
    </section>
  )
}
