import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Plus } from 'lucide-react'
import Nav from '@/components/Nav'

/**
 * Hero — Figma node 384:2207 ("Purinta - Desktop 1440px").
 *
 * Structure (matches Figma):
 *  - Outer section: bg gradient (Blush/50 → Mint/50, 106.89°)
 *  - Bg layer: 1920×1461 overflow-clip with scene + shadows + ellipse + mascots
 *  - 48px top spacer (Bg flex item) → Nav (1280×84) → Hero content (1280×668)
 *  - Hero content: pt-[58] pb-[148], centered text + Launch App CTA
 *
 * Above 1920px viewport, margins grow; below ~1280 the layout starts to scale down.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Scroll-driven parallax (mascot parallax removed — would break their
  // percent-based positioning by creating a new containing block).
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative flex w-full flex-col items-center overflow-hidden"
      style={{ backgroundImage: 'var(--gradient-bg)' }}
      data-node-id="384:2207"
    >
      {/* ---------- BG layer (1920×1461, overflow-clip) ---------- */}
      <motion.div
        style={{ y: sceneY }}
        className="pointer-events-none absolute top-0 left-1/2 z-[1] -translate-x-1/2"
      >
        <div className="relative h-[1461.385px] w-[1920px] overflow-hidden">
          {/* Scene */}
          <motion.img
            src="/assets/figma/background.png"
            alt=""
            style={{ scale: sceneScale }}
            className="absolute top-[-22.64%] left-[-0.09%] h-full w-[100.17%] max-w-none object-cover"
            data-node-id="384:2212"
          />

          {/* Hill ellipse (under the mascots) */}
          <img
            src="/assets/figma/hill-ellipse.svg"
            alt=""
            className="absolute top-[839.17px] left-[-282.36px] h-[1312.311px] w-[2485.428px] max-w-none"
            data-node-id="384:2217"
          />

          {/* Drop shadows under mascots */}
          <img
            src="/assets/figma/shadows.svg"
            alt=""
            className="absolute top-[784px] left-[600.63px] h-[74.208px] w-[747.384px] mix-blend-multiply"
            data-node-id="384:2213"
          />

          {/* Mascots — direct children of the BG container so their
              percent insets resolve correctly (no `transform` parent). */}

          {/* Frog (clipped from mascots-sprite) */}
          <div
            className="absolute top-[112.83px] left-[567.32px] h-[790px] w-[216.297px] overflow-hidden"
            data-node-id="384:2222"
          >
            <img
              src="/assets/figma/mascots-sprite.png"
              alt="Pepe the frog"
              className="absolute top-0 left-[-127.71%] h-full w-[645.9%] max-w-none"
            />
          </div>

          {/* Dog (clipped from mascots-sprite) */}
          <div
            className="absolute top-[115.83px] left-[1124.96px] h-[790px] w-[272.9px] overflow-hidden"
            data-node-id="384:2220"
          >
            <img
              src="/assets/figma/mascots-sprite.png"
              alt="Shiba the dog"
              className="absolute top-0 left-[-326.81%] h-full w-[511.93%] max-w-none"
            />
          </div>

          {/* Tofu / Hero mascot — display:contents, 14 layered parts */}
          <HeroMascot />
        </div>
      </motion.div>

      {/* ---------- Top spacer (Bg flex item, 48px) ---------- */}
      <div className="h-[48px] w-full" />

      {/* ---------- Nav ---------- */}
      <div className="relative z-50 w-full px-4">
        <Nav />
      </div>

      {/* ---------- Hero content (1280 × 668, pt-58 pb-148) ---------- */}
      <div className="relative z-10 flex w-full flex-col items-center">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="flex h-[668px] w-full max-w-[1280px] flex-col items-start px-6 pt-[58px] pb-[148px]"
        >
          <div className="flex w-full flex-col items-center gap-[16px]">
            <div className="flex flex-col items-center gap-[10px]">
              {/* Headline */}
              <h1
                className="text-center font-['Ohno_Softie_Variable'] text-[76px] leading-[76px] font-bold tracking-[0.76px] text-[#333]"
                style={{
                  textShadow: '2px 2px 8px rgba(254, 254, 254, 0.52)',
                  width: '731.684px',
                  maxWidth: '100%',
                }}
                data-node-id="384:2313"
              >
                Deposit Memes,
                <br />
                <span className="text-[var(--color-green-500)]">Print</span>{' '}
                USDC.
              </h1>

              {/* Sub */}
              <p
                className="text-center font-['Rubik'] text-[20px] leading-[32px] font-medium tracking-[0.2px] text-[#181A1F]"
                data-node-id="384:2315"
              >
                The first lending protocol for memecoin degens —
                <br />
                lock your bags, borrow USDC, keep the upside.
              </p>
            </div>

            {/* CTA */}
            <a
              href="https://app.purinta.xyz"
              className="inline-flex items-center justify-center gap-[8px] rounded-[25px] border border-solid border-[var(--color-green-300)] px-[33px] py-[13px] font-['Ohno_Softie_Variable'] text-[20px] leading-[32px] tracking-[0.4px] text-[var(--color-green-700)] transition-all duration-300 hover:scale-105 hover:opacity-90"
              style={{ backgroundImage: 'var(--gradient-button)' }}
              data-node-id="384:2316"
            >
              <Plus size={20} strokeWidth={2.5} />
              Launch App
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
 * Hero Mascot — composed of 14 image layers per Figma node 384:2224.
 *
 * Figma declared the wrapper with `position: contents`, so children's
 * `inset` percentages resolve against the GRANDPARENT (1920×1461 BG).
 * We mirror that with `display: contents` here.
 *
 * Each <img> is wrapped in a positioned <div> because replaced
 * elements (<img>) use their intrinsic size instead of deriving
 * width/height from top+bottom / left+right. The img then fills
 * its wrapping box with width:100% height:100%.
 *
 * Bounding box ~ inset[37.29% 41.17% 42.94% 41.58%] of the BG container.
 * ============================================================ */
type PartProps = {
  src: string
  inset: { top: string; left: string; right: string; bottom: string }
  flipX?: boolean
  alt?: string
}

function MascotPart({ src, inset, flipX, alt = '' }: PartProps) {
  return (
    <div className="absolute" style={inset}>
      <img
        src={src}
        alt={alt}
        className={`block h-full w-full max-w-none ${flipX ? '-scale-x-100' : ''}`}
      />
    </div>
  )
}

function HeroMascot() {
  return (
    <div style={{ display: 'contents' }} data-node-id="384:2224">
      {/* Legs */}
      <MascotPart
        src="/assets/figma/mascot-leg-r.svg"
        inset={{ top: '52.17%', left: '51.22%', right: '45.19%', bottom: '42.94%' }}
      />
      <MascotPart
        src="/assets/figma/mascot-leg-l.svg"
        inset={{ top: '51.65%', left: '46.25%', right: '49.89%', bottom: '43.57%' }}
      />

      {/* Body */}
      <MascotPart
        src="/assets/figma/mascot-body-stroke.svg"
        inset={{ top: '37.29%', left: '44.79%', right: '42.33%', bottom: '47.07%' }}
      />
      <MascotPart
        src="/assets/figma/mascot-body-fill.svg"
        inset={{ top: '37.65%', left: '45.09%', right: '42.63%', bottom: '47.43%' }}
      />
      <MascotPart
        src="/assets/figma/mascot-body-shadow.svg"
        inset={{ top: '38.99%', left: '48.72%', right: '42.82%', bottom: '47.75%' }}
      />
      <MascotPart
        src="/assets/figma/mascot-body-lateral-line.svg"
        inset={{ top: '39.01%', left: '49.91%', right: '44.12%', bottom: '47.55%' }}
      />

      {/* Face */}
      <MascotPart
        src="/assets/figma/mascot-slot-bills.svg"
        inset={{ top: '47.67%', left: '45.55%', right: '45.45%', bottom: '49.26%' }}
      />
      <MascotPart
        src="/assets/figma/mascot-eye-r.svg"
        inset={{ top: '40.75%', left: '51.21%', right: '46.26%', bottom: '55.74%' }}
      />
      <MascotPart
        src="/assets/figma/mascot-eye-l.svg"
        inset={{ top: '40.2%', left: '46.58%', right: '50.71%', bottom: '56.1%' }}
      />
      <MascotPart
        src="/assets/figma/mascot-cheeks.svg"
        inset={{ top: '42.5%', left: '46.29%', right: '45.9%', bottom: '53.41%' }}
      />
      <MascotPart
        src="/assets/figma/mascot-slot-line.svg"
        inset={{ top: '47.05%', left: '45.1%', right: '42.61%', bottom: '50.49%' }}
      />
      <MascotPart
        src="/assets/figma/mascot-mouth.svg"
        inset={{ top: '43.62%', left: '48.13%', right: '48.05%', bottom: '51.88%' }}
      />

      {/* Hands */}
      <MascotPart
        src="/assets/figma/mascot-hand-l.svg"
        inset={{ top: '44.78%', left: '41.58%', right: '55.21%', bottom: '51.05%' }}
      />
      <MascotPart
        src="/assets/figma/mascot-hand-r.svg"
        inset={{ top: '46.07%', left: '55.62%', right: '41.17%', bottom: '49.75%' }}
        flipX
      />
    </div>
  )
}
