import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import CTA from '@/components/sections/CTA'
import Footer from '@/components/sections/Footer'

function App() {
  return (
    <main className="relative bg-background text-foreground">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  )
}

export default App
