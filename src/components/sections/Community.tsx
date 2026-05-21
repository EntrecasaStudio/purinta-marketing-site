import CommunityFlowers from '@/components/sections/CommunityFlowers'
import { XIcon, DiscordIcon } from '@/components/icons/Social'
import { Button } from '@/components/ui/button'

/**
 * Community — Figma node 551:41113 ("04_Community").
 *
 * Pixel-perfect at the 1440 px reference width:
 *   - Section pads 80 / 83 vertical, 24 horizontal (Figma DS Space/24)
 *   - Content column max-w 1080 px, 72 px gap between blocks
 *   - h2: Rubik Medium 39 / 55, color Neutral-900 (#333)
 *   - Body: Rubik Regular 25 / 38, color Neutral-800 (#4C4C4C), 700 px wide
 *   - CTAs reuse the shared <Button> (btn-primary / btn-secondary) so
 *     hover & active states match the dapp source of truth (Hero uses
 *     the same component). Primary lifts + scales with the green-500
 *     stamp shadow; secondary lifts + scales with the green-300 stamp
 *     shadow.
 *
 * Decorative flowers (<CommunityFlowers />) are a scatter of individual
 * Figma instances anchored to the section's bottom; several deliberately
 * overflow downward across the boundary into the Footer meadow, so the
 * section uses `overflow-visible` (not `overflow-hidden`) — clipping
 * would cut the cluster in half at the boundary. Hidden below md so the
 * scatter never crowds the mobile copy.
 */

export default function Community() {
  return (
    <section
      id="community"
      className="relative w-full overflow-visible px-6 pt-20 pb-[83px] md:min-h-[638px] md:px-[var(--ds-space-24,24px)] md:pt-[80px]"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col items-center gap-[72px]">
        {/* Heading + body — 700 px column at md+, fluid below */}
        <div className="reveal reveal-up flex w-full max-w-[700px] flex-col items-center gap-6 text-center">
          <h2 className="w-full font-body text-[32px] leading-[44px] font-medium tracking-[-0.16px] text-[var(--color-neutral-900)] md:text-[39px] md:leading-[55px] md:tracking-[-0.195px]">
            <span className="block">The Meme Lending</span>
            <span className="block">Community</span>
          </h2>
          <p className="w-full font-body text-[18px] leading-[28px] font-normal tracking-[0.18px] text-[var(--color-neutral-800)] md:text-[25px] md:leading-[38px] md:tracking-[0.25px]">
            Join thousands of degens already using Purinta. Get alpha,
            share strategies, and be part of the meme lending
            revolution. Your bags deserve better.
          </p>
        </div>

        {/* Buttons — reuse the shared <Button> so hover / focus / active
         * match Hero and the dapp (btn-primary stamp shadow + scale,
         * btn-secondary stamp shadow + scale). */}
        <div className="reveal reveal-up flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
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

      {/* Decorative flower scatter — Figma group 726:40370. Rendered as
       * individually-positioned instances that flow from the lower part
       * of Community across the boundary into the Footer meadow. */}
      <CommunityFlowers />
    </section>
  )
}
