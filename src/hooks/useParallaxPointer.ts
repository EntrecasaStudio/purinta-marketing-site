import { useEffect } from 'react'
import { useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/**
 * Tracks the pointer position relative to the viewport centre and returns two
 * smoothed motion values `px` / `py` in the range [-1, 1] (centre = 0). Feed
 * them into per-layer `useTransform` calls to drive cursor parallax.
 *
 * Inert (stays at 0) when the user prefers reduced motion or the device has no
 * fine pointer (touch) — so callers don't need their own guards and mobile gets
 * scroll-only parallax for free.
 */
export function useParallaxPointer() {
  const reduceMotion = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const px = useSpring(rawX, { stiffness: 80, damping: 20, mass: 0.4 })
  const py = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.4 })

  useEffect(() => {
    if (reduceMotion) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1)
      rawY.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduceMotion, rawX, rawY])

  return { px, py }
}
