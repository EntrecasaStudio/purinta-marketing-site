import { motion } from 'motion/react'
import { Sparkles, Zap, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'Crafted',
    body: 'Every detail tuned for clarity and delight.',
  },
  {
    icon: Zap,
    title: 'Fast',
    body: 'Built on a modern stack — Vite + React + Tailwind.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliable',
    body: 'Production-grade foundations you can ship on.',
  },
]

export default function Features() {
  return (
    <section className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-5xl"
        >
          Why teams choose Purinta.
        </motion.h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border bg-card p-8"
            >
              <f.icon className="size-6" />
              <h3 className="mt-6 text-xl font-medium">{f.title}</h3>
              <p className="mt-2 text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
