type Step = {
  num: string
  kanji: string
  title: string
  body: string
}

const steps: Step[] = [
  {
    num: '01',
    kanji: '預',
    title: 'Deposit Your Memes',
    body: 'Connect your wallet, pick a market (PEPE, SHIB, etc.), and deposit your memecoins as collateral.',
  },
  {
    num: '02',
    kanji: '借',
    title: 'Borrow USDC',
    body: 'Choose how much USDC to borrow — up to 62.5% of your collateral value with built-in safety buffers.',
  },
  {
    num: '03',
    kanji: '利',
    title: 'Chill',
    body: 'Use your USDC anywhere. When ready, repay your loan and get your memecoins back. Moon mission intact.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-purinta-mint/30 relative overflow-hidden py-24 md:py-32"
    >
      <div className="pattern-dots absolute inset-0" />
      <div className="relative z-10 container mx-auto px-6">
        <div className="reveal reveal-up mb-16 text-center">
          <h2 className="font-display text-primary text-4xl font-black md:text-5xl">
            How It Works
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-2 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="reveal reveal-up-lg h-full"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="relative h-full">
                <div className="group border-border bg-card hover:border-purinta-green/40 relative flex h-full flex-col overflow-hidden rounded-3xl border-2 p-8 text-center transition-colors">
                  <span className="text-purinta-light/10 group-hover:text-purinta-light/20 pointer-events-none absolute -right-2 -bottom-4 text-[8rem] leading-none font-bold transition-colors select-none">
                    {s.kanji}
                  </span>
                  <div className="bg-purinta-green mb-6 inline-flex h-16 w-16 items-center justify-center self-center rounded-2xl">
                    <span className="font-display text-background text-xl font-black">
                      {s.num}
                    </span>
                  </div>
                  <h3 className="font-display text-primary relative z-10 mb-3 text-xl font-extrabold">
                    {s.title}
                  </h3>
                  <p className="font-body text-muted-foreground relative z-10 text-sm leading-relaxed">
                    {s.body}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <>
                    <div className="absolute top-1/2 -right-6 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center md:flex">
                      <span className="text-purinta-green text-3xl font-black drop-shadow-md">
                        →
                      </span>
                    </div>
                    <div className="my-1 flex justify-center md:hidden">
                      <span className="text-purinta-green text-3xl font-black drop-shadow-md">
                        ↓
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal reveal-up mt-12 text-center">
          <a
            href="https://docs.purinta.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-muted-foreground hover:text-primary text-sm underline underline-offset-4 transition-colors"
          >
            Learn more in the docs →
          </a>
        </div>
      </div>
    </section>
  )
}
