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
      className="min-h-screen"
      style={{ backgroundImage: 'var(--gradient-bg)' }}
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
