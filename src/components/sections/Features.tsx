import { useState } from 'react'

type Feature = {
  id: string
  title: string
  body: string
  img: string
}

const features: Feature[] = [
  {
    id: 'borrow',
    title: 'Borrow Against Memes',
    body: 'Lock your PEPE, SHIB, or any supported memecoin as collateral and borrow USDC without selling your bags. Your memes stay yours — you just unlock their liquidity.',
    img: '/assets/mascot-heart.webp',
  },
  {
    id: 'apy',
    title: 'Best APY on the Market',
    body: 'Competitive rates powered by efficient market design. Lenders earn real yield from memecoin borrowers, while borrowers get the best rates available anywhere.',
    img: '/assets/mascot-wave.webp',
  },
  {
    id: 'morpho',
    title: 'Built on Morpho',
    body: "Purinta is built on Morpho's battle-tested lending infrastructure — the same protocol securing billions in DeFi. No shortcuts on security.",
    img: '/assets/mascot-layer.webp',
  },
  {
    id: 'mainnet',
    title: 'Mainnet Native',
    body: 'Live on Ethereum mainnet from day one. Deep liquidity, real security, no testnet games. Your memes deserve the real thing.',
    img: '/assets/mascot-sleep.webp',
  },
  {
    id: 'api3',
    title: 'Powered by Api3',
    body: 'First-party oracle feeds with OEV capture. Accurate pricing for your memecoins, with value flowing back to the protocol.',
    img: '/assets/mascot-smirk.webp',
  },
]

export default function Features() {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = features[activeIdx]

  return (
    <section
      id="features"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="pattern-scanlines absolute inset-0" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="reveal reveal-up mb-16 text-center">
          <h2 className="font-display text-primary text-4xl font-black md:text-5xl">
            Why Degens Love Purinta
          </h2>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left rail: tabs */}
          <div className="space-y-2 lg:col-span-5">
            {features.map((f, i) => {
              const isActive = i === activeIdx
              return (
                <div
                  key={f.id}
                  className="reveal reveal-left"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <button
                    onClick={() => setActiveIdx(i)}
                    className={`group relative w-full overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300 md:p-5 ${
                      isActive
                        ? 'border-purinta-green/60 bg-card shadow-purinta-green/5 shadow-lg'
                        : 'border-border bg-card/50 hover:border-purinta-green/30 hover:bg-card'
                    }`}
                  >
                    {/* Active marker */}
                    <div
                      className={`from-purinta-forest to-purinta-green absolute top-0 bottom-0 left-0 w-1 rounded-full bg-gradient-to-b transition-all duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <div className="flex items-center gap-4 pl-2">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'ring-purinta-green/40 shadow-md ring-2'
                            : 'opacity-60'
                        }`}
                      >
                        <img
                          src={f.img}
                          alt={f.title}
                          width={44}
                          height={44}
                          loading="lazy"
                          decoding="async"
                          className="h-11 w-11 object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3
                          className={`font-display text-base font-extrabold transition-colors duration-300 ${
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          {f.title}
                        </h3>
                        <div
                          className="hidden overflow-hidden transition-all duration-300 lg:grid"
                          style={{
                            gridTemplateRows: isActive ? '1fr' : '0fr',
                            opacity: isActive ? 1 : 0,
                          }}
                        >
                          <div className="min-h-0">
                            <p className="font-body text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                              {f.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile body */}
                    <div
                      className="overflow-hidden transition-all duration-300 lg:hidden"
                      style={{
                        gridTemplateRows: isActive ? '1fr' : '0fr',
                        opacity: isActive ? 1 : 0,
                        display: 'grid',
                      }}
                    >
                      <div className="min-h-0">
                        <div className="border-border mt-4 border-t pt-4">
                          <p className="font-body text-muted-foreground text-sm leading-relaxed">
                            {f.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>

          {/* Right detail panel — desktop only */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="border-border bg-card relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-3xl border-2 p-8 md:p-10">
              <div className="from-purinta-forest to-purinta-green pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-gradient-to-br opacity-10 blur-3xl" />
              <div className="mb-6">
                <img
                  key={active.id}
                  src={active.img}
                  alt={active.title}
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 drop-shadow-lg md:h-24 md:w-24"
                />
              </div>
              <div className="relative z-10 flex flex-1 flex-col">
                <p className="font-body text-muted-foreground mb-6 text-sm leading-relaxed md:text-base">
                  {active.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
