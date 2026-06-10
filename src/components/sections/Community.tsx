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
 * (The decorative flower scatter that used to cross into the Footer
 * meadow was removed — the flowers are now baked into the new footer
 * background image.)
 */

export default function Community() {
  return (
    <section
      id="community"
      className="relative z-10 w-full px-6 pt-1 pb-12 min-[768px]:px-[24px] min-[768px]:py-[40px] min-[1154px]:min-h-[638px] min-[1154px]:px-[var(--ds-space-24,24px)] min-[1154px]:pt-[80px] min-[1154px]:pb-[83px]"
    >
      {/* Community surface — solid Neutral/50 (#fefefe) full-bleed behind
       * the content (z-0), on ALL breakpoints. (The shared
       * Stack→Community→Footer fade transitions are tuned separately to
       * land on this tone.) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[var(--color-neutral-50)]"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col items-center gap-[28px] min-[768px]:gap-[24px] min-[1154px]:gap-[72px]">
        {/* Heading + body — 540 px on mobile, 700 px on tablet+,
         * 1080 px on desktop. */}
        <div className="reveal reveal-up flex w-full max-w-[480px] flex-col items-center gap-[12px] text-center min-[768px]:max-w-[700px] min-[768px]:gap-[24px] min-[1154px]:gap-6">
          {/* Title: "The Meme Lending\nCommunity" stacks on two lines on
           * mobile and on desktop (Figma 551:41113). Only tablet
           * (768–1153, Figma 1047:144285) collapses them to one inline
           * line. */}
          <h2 className="w-full font-display text-[25px] leading-[33px] font-semibold tracking-[0.5px] text-[var(--color-neutral-900)] min-[768px]:text-[31px] min-[768px]:leading-[37px] min-[768px]:tracking-[0.62px] min-[1154px]:text-[39px] min-[1154px]:leading-[43px] min-[1154px]:tracking-[-0.195px]">
            <span className="block min-[768px]:inline min-[1154px]:block">The Meme Lending</span>{' '}
            <span className="block min-[768px]:inline min-[1154px]:block">Community</span>
          </h2>
          <p className="w-[312px] max-w-full font-body text-[13px] leading-[21px] font-normal tracking-[0.26px] text-[var(--color-neutral-800)] min-[768px]:w-full min-[768px]:max-w-[496px] min-[768px]:text-[20px] min-[768px]:leading-[32px] min-[768px]:tracking-[0.2px] min-[1154px]:max-w-full min-[1154px]:text-[25px] min-[1154px]:leading-[38px] min-[1154px]:tracking-[0.25px]">
            Join thousands of degens already using Purinta. Get alpha,
            share strategies, and be part of the meme lending revolution.
            Your bags deserve better.
          </p>
        </div>

        {/* CTAs — two layouts share the same three actions:
         *   - Mobile: stacked column, every button w-[260px] and ~44 px
         *     tall (Button size="md"), 8 px gap.
         *   - Tablet+: flex row, Button size="lg", 16 px gap (wraps on
         *     narrow viewports between sm and md). */}
        <div className="reveal reveal-up flex w-full flex-col items-center justify-center gap-2 min-[768px]:hidden">
          <Button
            variant="primary"
            size="md"
            className="h-[44px] w-[260px]"
            asChild
          >
            <a
              href="https://app.purinta.xyz"
              style={{ border: '1px solid #78ba68' }}
            >
              Launch App
            </a>
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="h-[44px] w-[260px]"
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
            className="h-[44px] w-[260px]"
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
        <div className="reveal reveal-up hidden w-full flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap min-[768px]:flex">
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
    </section>
  )
}
