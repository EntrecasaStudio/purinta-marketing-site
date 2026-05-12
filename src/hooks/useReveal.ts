import { useEffect } from 'react'

/**
 * Adds `.visible` to all `.reveal` elements once they intersect the viewport.
 * Pair with the `.reveal`, `.reveal-up`, `.reveal-left`, etc. CSS classes.
 */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal:not(.visible)')
    if (els.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
