import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Plus } from 'lucide-react'
import Nav from '@/components/Nav'
import { Button } from '@/components/ui/button'

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
      className="relative flex min-h-[1100px] w-full flex-col items-center overflow-hidden"
      style={{ backgroundImage: 'var(--gradient-bg)' }}
      data-node-id="384:2207"
    >
      {/* ---------- BG layer (1920×1462, overflow-clip) ----------
          Container matches the image's exact natural size so the
          scene renders at its true proportion (no object-cover crop,
          no stretching). Section overflow-hidden + section min-h
          decide how much of the scene is visible at each viewport. */}
      <motion.div
        style={{ y: sceneY }}
        className="pointer-events-none absolute top-0 left-1/2 z-[1] -translate-x-1/2"
      >
        <div className="relative h-[1462px] w-[1920px] overflow-hidden">
          {/* Scene — Figma node 430:4341 ("Purinta Hero back - 20260512").
              Natural 1920×1462. Width pinned at the natural size, height
              auto, so aspect is preserved without any object-fit crop.
              Vertical offset -80px so the sky band sits tighter at the
              top while the mascots / hill / shadows stay anchored at
              their original positions. */}
          <motion.img
            src="/assets/figma/background.webp"
            alt=""
            width={1920}
            height={1462}
            style={{ scale: sceneScale }}
            className="absolute top-[-80px] left-0 block h-auto w-[1920px] max-w-none"
            data-node-id="430:4341"
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

          {/* Tofu / Hero mascot — single flattened SVG export from Figma.
              Bounding box mirrors the original Figma frame inset:
              top 37.29% / right 41.17% / bottom 42.94% / left 41.58%
              of the 1920×1461 BG container. */}
          <div
            className="absolute"
            style={{
              top: '37.29%',
              left: '41.58%',
              right: '41.17%',
              bottom: '42.94%',
            }}
            data-node-id="384:2224"
          >
            <img
              src="/assets/figma/hero-mascot.svg"
              alt="Purinta mascot"
              className="block h-full w-full"
            />
          </div>
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
                className="text-center font-display text-[76px] leading-[76px] font-bold tracking-[0.76px] text-[#333]"
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
                className="text-center font-body text-[20px] leading-[32px] font-medium tracking-[0.2px] text-[#181A1F]"
                data-node-id="384:2315"
              >
                The first lending protocol for memecoin degens —
                <br />
                lock your bags, borrow USDC, keep the upside.
              </p>
            </div>

            {/* CTA — shared Button from purinta-app DS (primary, lg) */}
            <Button variant="primary" size="lg" asChild>
              <a href="https://app.purinta.xyz" data-node-id="384:2316">
                <Plus className="btn-icon" strokeWidth={2.5} />
                Launch App
              </a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom white fade — sits BELOW the mascots so it only touches
          the meadow strip at the very bottom of the section, blending
          it into the next section without covering the characters.
          Mascots end at section y≈906, so the fade starts at y≈960. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-[7] h-[140px]"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(254,254,254,0) 0%, rgba(254,254,254,0.7) 60%, rgba(254,254,254,1) 100%)',
        }}
      />
    </section>
  )
}

