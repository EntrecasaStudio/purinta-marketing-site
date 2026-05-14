import { asset } from '@/lib/utils'

const pillars = [
  { title: 'Morpho', body: 'Battle-tested lending infrastructure' },
  { title: 'Api3', body: 'First-party oracle feeds with OEV' },
  { title: 'Ethereum', body: 'Mainnet native, deep liquidity' },
  { title: 'USDC', body: 'Borrow the most trusted stablecoin' },
]

export default function Ecosystem() {
  return (
    <section
      id="ecosystem"
      className="bg-purinta-mint/20 relative overflow-hidden py-24 md:py-32"
    >
      <div className="pattern-rain absolute inset-0" />
      <div className="relative z-10 container mx-auto px-6">
        <div className="reveal reveal-down mb-12 text-center">
          <h2 className="font-display text-primary mb-6 text-4xl font-black md:text-5xl">
            Built on Giants
          </h2>
          <div className="flex justify-center">
            <div style={{ animation: 'float 4s ease-in-out infinite' }}>
              <img
                src={asset('/assets/mascot-layer.webp')}
                alt="Purinta ecosystem"
                width={208}
                height={208}
                loading="lazy"
                decoding="async"
                className="w-40 drop-shadow-2xl md:w-52"
              />
            </div>
          </div>
        </div>

        <p className="font-body text-muted-foreground mx-auto mb-10 max-w-lg text-center text-lg leading-relaxed">
          Purinta combines the best DeFi primitives into one seamless memecoin
          lending experience. No shortcuts, no compromises.
        </p>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="reveal reveal-up"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="border-border bg-card hover:border-purinta-green/40 rounded-2xl border-2 p-5 transition-colors">
                <h3 className="font-display text-primary mb-1 font-extrabold">
                  {p.title}
                </h3>
                <p className="font-body text-muted-foreground text-sm">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
