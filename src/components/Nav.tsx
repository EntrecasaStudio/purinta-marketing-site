import { useState } from 'react'
import Logo from '@/components/Logo'
import { XIcon, DiscordIcon } from '@/components/icons/Social'
import { Menu, X as Close, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const links = [
  { href: '#', label: 'Home', active: true },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#ecosystem', label: 'Ecosystem' },
  { href: '#community', label: 'Community' },
]

/**
 * Top navigation pill — Figma node 384:2293.
 * 1280 × 84 px, rounded-64, bg #FEFEFE, px-[40px] py-[24px].
 * Floats over the hero with a top margin and rounded full pill shape.
 */
export default function Nav() {
  return (
    <nav
      className="fade-in-on-load relative z-50 mx-auto hidden h-[84px] w-full max-w-[1280px] items-center justify-center rounded-[64px] bg-[#FEFEFE] px-[40px] py-[24px] shadow-[0_4px_24px_rgba(24,82,41,0.06)] md:flex"
      data-node-id="384:2293"
    >
      <div className="flex w-full items-center justify-between pl-4">
        <a href="#" aria-label="Purinta" className="flex shrink-0">
          <Logo />
        </a>

        <div className="flex items-center gap-[32px]">
          <div className="flex items-center gap-[64px]">
            <ul className="flex items-center justify-end gap-[20px]">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className={`block px-[8px] py-[1.5px] font-body text-[16px] leading-[26px] tracking-[0.16px] whitespace-nowrap text-[#333] transition-colors hover:text-[var(--color-green-600)] ${
                      l.active
                        ? 'border-b border-solid border-[#B2B2B2]'
                        : ''
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex h-[32px] items-center justify-end gap-[24px]">
              <a
                href="https://x.com/purintaxyz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Purinta on X"
                className="flex size-[32px] items-center justify-center text-[#B0B2B5] transition-colors hover:text-[var(--color-green-600)]"
              >
                <XIcon width={20} height={18} />
              </a>
              <a
                href="https://discord.gg/purinta"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Purinta on Discord"
                className="flex size-[32px] items-center justify-center text-[#B0B2B5] transition-colors hover:text-[var(--color-green-600)]"
              >
                <DiscordIcon width={24} height={18.5} />
              </a>
            </div>
          </div>

          {/* Nav primary button uses Figma-specific dimensions
              (font 16, px-[21] py-[13], rounded-[22]) — bigger font
              than .btn-sm (13 px), smaller padding than .btn (12/24). */}
          <Button
            variant="primary"
            asChild
            className="rounded-[22px] !px-[21px] !py-[13px] !text-[16px] tracking-[0.48px]"
          >
            <a href="https://app.purinta.xyz">Launch App</a>
          </Button>
        </div>
      </div>
    </nav>
  )
}

/**
 * Mobile navigation — simpler menu since the Figma desktop pill doesn't
 * collapse cleanly on small viewports. Kept until we get a mobile design.
 */
export function NavMobile() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fade-in-on-load fixed top-2 right-2 left-2 z-50 overflow-hidden rounded-2xl bg-[#FEFEFE] shadow-lg md:hidden">
      <div className="flex items-center justify-between px-5 py-3">
        <a href="#" aria-label="Purinta" className="flex shrink-0">
          <Logo />
        </a>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#333] transition-colors hover:bg-[var(--color-green-50)]"
        >
          {open ? <Close size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#E5E1BE]">
          <div className="flex flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 font-body text-base text-[#333] hover:bg-[var(--color-green-50)]"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-[#E5E1BE] pt-3">
              <div className="flex gap-4 text-[#181A1F]">
                <a
                  href="https://x.com/purintaxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                  <XIcon />
                </a>
                <a
                  href="https://discord.gg/purinta"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                >
                  <DiscordIcon />
                </a>
              </div>
              <Button variant="primary" size="sm" asChild>
                <a href="https://app.purinta.xyz">
                  <Plus className="size-3.5" />
                  Launch App
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
