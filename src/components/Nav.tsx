import { useState } from 'react'
import Logo from '@/components/Logo'
import { XIcon, DiscordIcon } from '@/components/icons/Social'
import { Menu, X as Close } from 'lucide-react'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#ecosystem', label: 'Ecosystem' },
  { href: '#community', label: 'Community' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fade-in-on-load fixed top-2 right-2 left-2 z-50 overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="flex items-center justify-between px-5 py-2.5 md:px-8">
        <a href="#" aria-label="Purinta" className="flex items-center gap-3">
          <Logo className="h-9 w-9 rounded-lg" />
          <span
            aria-hidden="true"
            className="font-display text-xl text-primary"
          >
            PURINTA
          </span>
        </a>

        <div className="hidden items-center gap-8 font-body text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href="https://x.com/purintaxyz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Purinta on X / Twitter"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <XIcon />
          </a>
          <a
            href="https://discord.gg/purinta"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Purinta on Discord"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <DiscordIcon />
          </a>
          <a
            href="https://app.purinta.xyz"
            className="bg-primary text-primary-foreground font-display rounded-full px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-90"
          >
            Launch App
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-muted-foreground hover:bg-purinta-mint/40 hover:text-primary -mr-2 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden"
        >
          {open ? <Close size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t md:hidden">
          <div className="flex flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:bg-purinta-mint/40 hover:text-primary rounded-md px-3 py-2 text-sm transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between gap-3 border-t pt-3">
              <div className="flex gap-4">
                <a
                  href="https://x.com/purintaxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="text-muted-foreground hover:text-primary"
                >
                  <XIcon />
                </a>
                <a
                  href="https://discord.gg/purinta"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                  className="text-muted-foreground hover:text-primary"
                >
                  <DiscordIcon />
                </a>
              </div>
              <a
                href="https://app.purinta.xyz"
                className="bg-primary text-primary-foreground font-display rounded-full px-4 py-2 text-sm font-bold"
              >
                Launch App
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
