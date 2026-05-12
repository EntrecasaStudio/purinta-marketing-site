import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Background moves slowly (deeper plane)
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  // Mid layer moves at medium speed
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  // Foreground text moves faster (closer plane)
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      className="relative isolate flex h-[120svh] items-center justify-center overflow-hidden"
    >
      {/* Background gradient (slowest) */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_at_top,theme(colors.neutral.200),theme(colors.neutral.50))] dark:bg-[radial-gradient(ellipse_at_top,theme(colors.neutral.800),theme(colors.neutral.950))]"
      />

      {/* Decorative blobs (mid layer) */}
      <motion.div
        style={{ y: midY }}
        className="absolute inset-0 -z-20"
        aria-hidden
      >
        <div className="absolute top-[20%] left-[15%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[10%] bottom-[20%] h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </motion.div>

      {/* Foreground content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-5xl font-semibold tracking-tight text-balance md:text-7xl"
        >
          Purinta — clean, fast, beautiful.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="mt-6 text-lg text-muted-foreground md:text-xl"
        >
          A short, punchy promise that explains what Purinta does in one line.
          Replace this with the real value prop.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <Button size="lg" className="group">
            Get started
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button size="lg" variant="ghost">
            Learn more
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-widest text-muted-foreground uppercase"
      >
        Scroll
      </motion.div>
    </section>
  )
}
