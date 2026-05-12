import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Button } from '@/components/ui/button'

export default function CTA() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Parallax: background drifts down as we scroll past
  const bgY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden px-6 py-40 md:py-56"
    >
      <motion.div
        style={{ y: bgY }}
        aria-hidden
        className="absolute inset-0 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,theme(colors.neutral.200),theme(colors.neutral.50),theme(colors.neutral.200))] dark:bg-[conic-gradient(from_180deg_at_50%_50%,theme(colors.neutral.800),theme(colors.neutral.950),theme(colors.neutral.800))]"
      />

      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-semibold tracking-tight text-balance md:text-6xl"
        >
          Ready to see Purinta in motion?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-lg text-muted-foreground"
        >
          Replace this with a strong closing line that gets the click.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10"
        >
          <Button size="lg">Get started</Button>
        </motion.div>
      </div>
    </section>
  )
}
