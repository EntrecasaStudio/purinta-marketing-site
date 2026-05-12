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
    <div className="bg-background min-h-screen">
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
