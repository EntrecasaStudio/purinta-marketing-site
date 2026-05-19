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
    /* Page-level Blush/50 → Mint/50 gradient (per Figma — every
     * section in the design sits on this same canvas, individual
     * surfaces like cards are white on top). Applied on the root so
     * the gradient is ONE continuous fill across all sections and
     * doesn't reset at every section boundary. */
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
        backgroundImage: 'var(--gradient-bg)',
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
