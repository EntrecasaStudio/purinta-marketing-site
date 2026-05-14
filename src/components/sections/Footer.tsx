import Logo from '@/components/Logo'
import { asset } from '@/lib/utils'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="relative h-[350px] w-full md:h-[500px]">
        <img
          src={asset('/assets/footer-bg.webp')}
          alt=""
          width={1920}
          height={500}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />
        <div className="from-purinta-forest absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t to-transparent" />
      </div>

      <div className="bg-purinta-forest relative -mt-1 text-white">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <Logo className="h-9 w-9 rounded-lg" />
                <span className="font-display text-xl font-extrabold text-white">
                  PURINTA
                </span>
              </div>
              <p className="font-body mt-4 text-xs leading-relaxed text-white/80">
                © {new Date().getFullYear()} Purinta Inc.
                <br />
                All rights reserved.
              </p>
            </div>
            <div>
              <h2 className="font-display mb-4 text-sm font-bold text-white/70">
                Links
              </h2>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="https://docs.purinta.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-white/80 transition-colors hover:text-white"
                  >
                    Docs
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="font-body text-sm text-white/80 transition-colors hover:text-white"
                  >
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-display mb-4 text-sm font-bold text-white/70">
                Connect
              </h2>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="https://x.com/purintaxyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-white/80 transition-colors hover:text-white"
                  >
                    X / Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/purinta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-white/80 transition-colors hover:text-white"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
