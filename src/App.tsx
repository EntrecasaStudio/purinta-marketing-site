import { NavMobile } from '@/components/Nav'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import HowItWorks from '@/components/sections/HowItWorks'
import Ecosystem from '@/components/sections/Ecosystem'
import Community from '@/components/sections/Community'
import Footer from '@/components/sections/Footer'
import { useReveal } from '@/hooks/useReveal'

function App() {
  useReveal()
  return (
    /* Page-level background is a solid Cream/50 (#fcfbf5) — per Figma
     * the old Blush/50 → Mint/50 diagonal gradient was dropped for a
     * single flat canvas. Every section sits on this same fill; surfaces
     * like cards / Community paint their own colour on top. Applied on
     * the root so it's ONE continuous fill across all sections. */
    <div
      /* overflow-x: clip clips the wide absolute layers in the Hero
       * (the 1920 px background scene + the 2485 px hill ellipse,
       * both centered with -translate-x-1/2) so they don't trigger a
       * horizontal scrollbar on viewports < 2485 px. Unlike
       * `overflow: hidden`, `clip` does NOT establish a scroll
       * container, so `position: sticky` in HowItWorks keeps
       * pinning to the viewport correctly. */
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-cream-50)',
        overflowX: 'clip',
      }}
    >
      <NavMobile />
      <Hero />
      <Features />
      <HowItWorks />
      <Ecosystem />
      <Community />
      <Footer />
    </div>
  )
}

export default App
