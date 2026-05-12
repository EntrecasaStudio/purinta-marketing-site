import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

/* ---------- Grass blades (decorative bottom strip) ---------- */
const blades = Array.from({ length: 40 }, (_, i) => {
  // Stable pseudo-random values seeded by index — keeps SSR/CSR consistent
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) + 1) / 2)
  return {
    left: r(1) * 100,
    height: 20 + r(2) * 30,
    rotate: (r(3) - 0.5) * 16,
    duration: 2.5 + r(4) * 1.6,
    delay: r(5) * 2,
  }
})

/* ---------- Light particles ---------- */
const particles = Array.from({ length: 12 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 41.231 + n * 17.7321) + 1) / 2)
  return {
    left: 10 + r(1) * 80,
    top: 20 + r(2) * 60,
    duration: 4 + r(3) * 3,
    delay: r(4) * 4,
  }
})

/* ---------- Shooting stars ---------- */
const stars = [
  { top: '30%', duration: '6s', delay: '0s' },
  { top: '42%', duration: '4.5s', delay: '2s' },
  { top: '54%', duration: '5.5s', delay: '1s' },
  { top: '66%', duration: '4s', delay: '3.5s' },
  { top: '78%', duration: '7s', delay: '0.5s' },
]

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Background scene parallax — slowest layer
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  // Clouds parallax — different speeds
  const cloud1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const cloud2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-60%'])
  const cloud3Y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])

  // Foreground text — fades out as user scrolls
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      {/* Soft gradient under everything */}
      <div className="from-purinta-mint/30 via-background to-background absolute inset-0 bg-gradient-to-b" />

      {/* Background scene — meadow with mascots */}
      <motion.div
        style={{ y: sceneY, scale: sceneScale }}
        className="absolute inset-0 z-[1]"
      >
        <img
          src="/assets/hero-scene.webp"
          alt="Purinta and friends in a meadow"
          width={1536}
          height={1024}
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
          style={{ animation: 'hero-zoom 20s ease-in-out infinite alternate' }}
        />
      </motion.div>

      {/* Clouds */}
      <motion.img
        style={{ y: cloud1Y, animation: 'cloud-drift-1 8s ease-in-out infinite' }}
        src="/assets/cloud1.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-[5%] left-[-8%] z-[3] w-[300px] opacity-70 md:w-[450px]"
      />
      <motion.img
        style={{ y: cloud2Y, animation: 'cloud-drift-2 10s ease-in-out infinite' }}
        src="/assets/cloud2.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-[12%] right-[-5%] z-[3] w-[250px] opacity-60 md:w-[380px]"
      />
      <motion.img
        style={{ y: cloud3Y, animation: 'cloud-drift-3 9s ease-in-out 1s infinite' }}
        src="/assets/cloud3.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-[25%] left-[20%] z-[3] w-[180px] opacity-40 md:w-[260px]"
      />
      <motion.img
        style={{ y: cloud1Y, animation: 'cloud-drift-4 7s ease-in-out 0.5s infinite' }}
        src="/assets/cloud1.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-[8%] left-[50%] z-[3] w-[120px] -scale-x-100 opacity-35 md:w-[200px]"
      />

      {/* Shooting stars */}
      <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              top: s.top,
              left: '-10%',
              width: '15%',
              animation: `shooting-star ${s.duration} linear ${s.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 z-[4]">
        {particles.map((p, i) => (
          <div
            key={i}
            className="bg-purinta-light/60 absolute h-1.5 w-1.5 rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `particle-bob ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Grass strip */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-[5] h-16 overflow-hidden">
        {blades.map((b, i) => (
          <div
            key={i}
            className="from-purinta-green/60 to-purinta-light/30 absolute bottom-0 origin-bottom rounded-t-full bg-gradient-to-t"
            style={{
              left: `${b.left}%`,
              width: '3px',
              height: `${b.height}px`,
              ['--blade-r' as string]: `${b.rotate}deg`,
              animation: `grass-sway ${b.duration}s ease-in-out ${b.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Subtle scanlines overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[6] opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)',
        }}
      />

      {/* Foreground content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-start px-6 pt-24 md:pt-10"
      >
        <div className="fade-in-on-load max-w-2xl text-center">
          <h1 className="font-display mb-2 text-4xl leading-[1.1] font-black tracking-tight text-black md:text-6xl xl:text-7xl">
            Deposit Memes, <span className="text-primary">Print</span> USDC.
          </h1>
          <p className="font-body text-muted-foreground mx-auto mb-3 max-w-md text-base leading-relaxed md:text-lg">
            The first lending protocol for memecoin degens. Lock your bags,
            borrow USDC, keep the upside.
          </p>
          <a
            href="https://app.purinta.xyz"
            className="bg-primary text-primary-foreground font-display shadow-primary/40 inline-block rounded-full px-8 py-3 text-base font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90"
          >
            Launch App
          </a>
        </div>
      </motion.div>
    </section>
  )
}
