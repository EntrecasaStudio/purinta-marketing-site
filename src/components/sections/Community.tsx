import { XIcon, DiscordIcon } from '@/components/icons/Social'

export default function Community() {
  return (
    <section
      id="community"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="pattern-scanlines absolute inset-0" />
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="reveal reveal-up">
            <h2 className="font-display text-primary mb-6 text-4xl leading-tight font-black md:text-5xl">
              The Meme Lending
              <br />
              Community
            </h2>
          </div>

          <div className="reveal reveal-scale">
            <div style={{ animation: 'float 4s ease-in-out infinite' }}>
              <img
                src="/assets/mascot-wave.webp"
                alt="Purinta waving"
                width={288}
                height={288}
                loading="lazy"
                decoding="async"
                className="w-56 drop-shadow-2xl md:w-72"
              />
            </div>
          </div>

          <p className="font-body text-muted-foreground mx-auto mb-2 max-w-lg text-center text-lg leading-relaxed">
            Join thousands of degens already using Purinta. Get alpha, share
            strategies, and be part of the meme lending revolution. Your bags
            deserve better.
          </p>

          <div className="reveal reveal-up">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <a
                href="https://app.purinta.xyz"
                className="bg-primary text-primary-foreground font-display shadow-purinta-green/20 rounded-full px-8 py-4 text-sm font-bold shadow-lg transition-opacity hover:opacity-90"
              >
                Launch App
              </a>
              <a
                href="https://x.com/purintaxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-card text-primary font-display hover:bg-muted inline-flex items-center gap-2 rounded-full border-2 px-8 py-4 text-sm font-bold transition-colors"
              >
                <XIcon width={16} height={16} />
                X / Twitter
              </a>
              <a
                href="https://discord.gg/purinta"
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-card text-primary font-display hover:bg-muted inline-flex items-center gap-2 rounded-full border-2 px-8 py-4 text-sm font-bold transition-colors"
              >
                <DiscordIcon width={16} height={16} />
                Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
