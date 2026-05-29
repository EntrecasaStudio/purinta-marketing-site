import { type MouseEvent as ReactMouseEvent, useEffect, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from 'motion/react'
import { XIcon, DiscordIcon } from '@/components/icons/Social'
import { Button } from '@/components/ui/button'
import { asset } from '@/lib/utils'

/* The nav is not sticky — it scrolls away with the hero — so a fixed
 * "active" highlight on Home would always be on (uninformative) and on
 * mobile it'd be actively wrong: the menu is an overlay opened from any
 * scroll position, so flagging Home as the current section while the
 * user is mid-page is misleading. No item carries `active` until/unless
 * a scroll-spy is added (would need the nav to be sticky to be useful). */
const links = [
  { href: '#features', label: 'Why Purinta' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#ecosystem', label: 'The Stack' },
]

/* Mobile menu links — same three sections as desktop. */
const mobileLinks = links

/* Smooth scroll with a configurable duration. The native CSS
 * `scroll-behavior: smooth` on <html> finishes in ~300–500 ms, which
 * reads as a jump; this rAF loop runs ~1.1 s with an ease-in-out so
 * the user actually sees the page travel between sections. Honours
 * prefers-reduced-motion (snaps to target in one frame). */
const SCROLL_DURATION_MS = 1100

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function smoothScrollTo(targetY: number) {
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    window.scrollTo({ top: targetY, behavior: 'auto' })
    return
  }
  /* Disable CSS scroll-behavior so per-frame scrollTo calls don't
   * compound with the browser's own smooth scrolling. Restored when
   * the animation finishes. */
  const html = document.documentElement
  const prevBehavior = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'

  const startY = window.scrollY
  const distance = targetY - startY
  const startTime = performance.now()

  function step(now: number) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / SCROLL_DURATION_MS, 1)
    window.scrollTo(0, startY + distance * easeInOutCubic(t))
    if (t < 1) requestAnimationFrame(step)
    else html.style.scrollBehavior = prevBehavior
  }
  requestAnimationFrame(step)
}

function scrollToHref(href: string) {
  if (href === '#' || href === '') {
    smoothScrollTo(0)
    return
  }
  const el = document.querySelector(href) as HTMLElement | null
  if (!el) return
  const targetY = el.getBoundingClientRect().top + window.scrollY
  smoothScrollTo(targetY)
}

/**
 * Top navigation pill — Figma node 384:2293.
 * 1280 × 84 px, rounded-64, bg #FEFEFE, px-[40px] py-[24px].
 * Floats over the hero with a top margin and rounded full pill shape.
 */
export default function Nav() {
  return (
    <nav
      /* Nav pill — Figma desktop 384:2293 (1280×84, px-24 py-24) and
       * Figma tablet 1041:29233 (720×72, px-20 py-16). All inner
       * spacings + element sizes interpolate between the two
       * breakpoints via min-[768px]: (tablet) and min-[1154px]:
       * (desktop) overrides so the same nav renders pixel-perfect
       * at both ranges. */
      className="relative z-50 mx-auto hidden w-full items-center justify-center rounded-[64px] bg-[#FEFEFE] shadow-[0_4px_24px_rgba(24,82,41,0.06)] md:flex min-[768px]:h-[72px] min-[768px]:max-w-[720px] min-[768px]:px-[20px] min-[768px]:py-[16px] min-[1154px]:h-[84px] min-[1154px]:max-w-[1280px] min-[1154px]:px-[24px] min-[1154px]:py-[24px]"
      data-node-id="384:2293"
    >
      <div className="flex w-full items-center justify-between">
        {/* Logo — Figma tablet 1041:29180 sizes the lockup at
         * 126.356 × 30 (symbol 26.5×30 + wordmark 93.69×18.56 at
         * left:32.6 top:6.61). Desktop keeps the 168.475×40
         * default lockup shipped by <Logo />. */}
        <a
          href="#"
          aria-label="Purinta"
          className="relative flex shrink-0 min-[768px]:h-[30px] min-[768px]:w-[126.36px] min-[1154px]:h-[40px] min-[1154px]:w-[168.475px]"
        >
          <img
            src={asset('/assets/figma/logo-symbol.svg')}
            alt=""
            className="absolute top-0 left-0 min-[768px]:h-[30px] min-[768px]:w-[26.5px] min-[1154px]:h-[40px] min-[1154px]:w-[35.33px]"
          />
          <img
            src={asset('/assets/figma/wordmark.svg')}
            alt="Purinta"
            className="absolute min-[768px]:top-[6.61px] min-[768px]:left-[32.6px] min-[768px]:h-[18.56px] min-[768px]:w-[93.69px] min-[1154px]:top-[8.814px] min-[1154px]:left-[43.47px] min-[1154px]:h-[24.746px] min-[1154px]:w-[124.915px]"
          />
        </a>

        {/* Outer right group — tablet collapses to a single 3-child
         * flex (links / socials / button) with gap-24; desktop
         * keeps the nested 32/64-gap structure from the original
         * 1280-wide design. */}
        <div className="flex items-center min-[768px]:gap-[24px] min-[1154px]:gap-[32px]">
          <div className="flex items-center min-[768px]:gap-[24px] min-[1154px]:gap-[64px]">
            <ul className="flex items-center justify-end min-[768px]:gap-[8px] min-[1154px]:gap-[20px]">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToHref(l.href)
                      history.pushState(null, '', l.href)
                    }}
                    /* Tablet: 13 px Rubik Regular tracking 0.26.
                     * Desktop: 16 px Rubik tracking 0.16. */
                    className="block whitespace-nowrap text-[#333] transition-colors hover:text-[var(--color-green-600)] min-[768px]:px-[8px] min-[768px]:py-[1.5px] min-[768px]:font-body min-[768px]:text-[13px] min-[768px]:leading-[21px] min-[768px]:font-normal min-[768px]:tracking-[0.26px] min-[1154px]:text-[16px] min-[1154px]:leading-[26px] min-[1154px]:font-medium min-[1154px]:tracking-[0.16px]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Socials — tablet 28×28 wrapper, gap-8. Desktop
             * 32×32, gap-24. */}
            <div className="flex items-center justify-end min-[768px]:h-[28px] min-[768px]:gap-[8px] min-[1154px]:h-[32px] min-[1154px]:gap-[24px]">
              <a
                href="https://x.com/purintaxyz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Purinta on X"
                className="flex items-center justify-center text-[#666666] transition-colors hover:text-[var(--color-green-600)] min-[768px]:size-[28px] min-[1154px]:size-[32px]"
              >
                <XIcon width={20} height={18} />
              </a>
              <a
                href="https://discord.gg/purinta"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Purinta on Discord"
                className="flex items-center justify-center text-[#666666] transition-colors hover:text-[var(--color-green-600)] min-[768px]:size-[28px] min-[1154px]:size-[32px]"
              >
                <DiscordIcon width={24} height={18.5} />
              </a>
            </div>
          </div>

          {/* Launch App — Figma tablet 541:25138 ("Extra Small"):
           * px-16 py-6 text-13 tracking-0.39, Green/700 (#185229).
           * Desktop 384:2293: px-21 py-13 text-16 tracking-0.48. */}
          <Button
            variant="primary"
            asChild
            className="shrink-0 rounded-[22px] whitespace-nowrap min-[768px]:!px-[16px] min-[768px]:!py-[6px] min-[768px]:!text-[13px] min-[768px]:!tracking-[0.39px] min-[1154px]:!px-[21px] min-[1154px]:!py-[13px] min-[1154px]:!text-[16px] min-[1154px]:!tracking-[0.48px]"
          >
            <a href="https://app.purinta.xyz">Launch App</a>
          </Button>
        </div>
      </div>
    </nav>
  )
}

/* ============================================================
 * Mobile menu — Figma node 773:40693 ("Menu-Mobile-Content").
 *
 * A full-screen overlay panel: white pill at the top (logo + a
 * morphing hamburger ⇄ X icon), four star-bulleted nav links, a
 * social row and a full-width "Launch App" CTA, over a soft green
 * gradient (mint-50 → green-100).
 *
 * Motion (designed against the site's existing vocabulary):
 *  - Panel: clip-path circle reveal blooming out of the icon, plus a
 *    fast opacity fade and a micro-scale settle — calm 180/24 spring.
 *  - Content: 6 staggered children (4 links + social + button) on a
 *    70 ms cadence, each a 360/12/0.7 "jelly pop"; the star icons
 *    pop-spin in just after their row.
 *  - Close: ~40 % faster, tween-out (no bounce), reversed stagger.
 *  - prefers-reduced-motion: all of it collapses to a 0.15 s fade.
 * ============================================================ */

const starWhite = asset('/assets/figma/menu/star2.svg')

/** Hamburger ⇄ X — three bars; top/bottom rotate to the X, mid fades. */
function MenuIcon({ open, reduce }: { open: boolean; reduce: boolean }) {
  const t = reduce
    ? { duration: 0 }
    : ({ type: 'spring', stiffness: 300, damping: 20 } as const)
  const bar =
    'absolute left-0 h-[2px] w-full rounded-full bg-[#666666]'
  return (
    <span className="relative block h-[16px] w-[20px]">
      <motion.span
        className={bar}
        style={{ top: 'calc(50% - 1px)' }}
        initial={false}
        animate={open ? { y: 0, rotate: 45 } : { y: -6, rotate: 0 }}
        transition={t}
      />
      <motion.span
        className={bar}
        style={{ top: 'calc(50% - 1px)' }}
        initial={false}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={t}
      />
      <motion.span
        className={bar}
        style={{ top: 'calc(50% - 1px)' }}
        initial={false}
        animate={open ? { y: 0, rotate: -45 } : { y: 6, rotate: 0 }}
        transition={t}
      />
    </span>
  )
}

export function NavMobile() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion() ?? false
  /* Section to scroll to AFTER the close animation finishes — set when
   * a nav link is tapped so the menu's exit animation plays out fully
   * before the page jumps to the section. */
  const [pendingScroll, setPendingScroll] = useState<string | null>(null)

  /* Tapping a link reverses the open animation, then scrolls. The
   * actual scroll runs in <AnimatePresence onExitComplete>. */
  const handleNavClick =
    (href: string) => (e: ReactMouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      setPendingScroll(href)
      setOpen(false)
    }

  /* Runs once the panel's exit animation has fully completed. Uses the
   * same custom-duration smooth scroll as the desktop nav so the
   * travel between sections feels consistent across breakpoints. */
  const runPendingScroll = () => {
    if (pendingScroll == null) return
    const target = pendingScroll
    setPendingScroll(null)
    scrollToHref(target)
    if (target !== '#' && target !== '') {
      history.pushState(null, '', target)
    }
  }

  /* Lock body scroll + wire Escape-to-close while the menu is open. */
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  /* ---- Motion variants (UX spec) ---- */
  const panelVariants: Variants = {
    closed: {
      opacity: 0,
      scale: 0.98,
      clipPath: 'circle(0% at calc(100% - 44px) 50px)',
      transition: reduce
        ? { duration: 0.12 }
        : {
            /* Reverse of the open sequence: the children (links →
             * social → button) exit FIRST, staggered in reverse
             * order; only once they are all gone does the panel /
             * background collapse. `when: 'afterChildren'` gates the
             * panel's own clip-path + fade on the children finishing. */
            when: 'afterChildren',
            staggerChildren: 0.05,
            staggerDirection: -1,
            clipPath: { duration: 0.3, ease: [0.4, 0, 1, 1] },
            scale: { duration: 0.3, ease: [0.4, 0, 1, 1] },
            opacity: { duration: 0.22, ease: 'easeIn' },
          },
    },
    open: {
      opacity: 1,
      scale: 1,
      clipPath: 'circle(150% at calc(100% - 44px) 50px)',
      transition: reduce
        ? { duration: 0.15, staggerChildren: 0, delayChildren: 0 }
        : {
            clipPath: { type: 'spring', stiffness: 180, damping: 24 },
            scale: { type: 'spring', stiffness: 180, damping: 24 },
            opacity: { duration: 0.18, ease: 'easeOut' },
            delayChildren: 0.16,
            staggerChildren: 0.07,
          },
    },
  }

  const itemVariants: Variants = {
    closed: {
      opacity: 0,
      y: 16,
      scale: 0.96,
      transition: { duration: 0.18, ease: 'easeIn' },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: reduce
        ? { duration: 0 }
        : { type: 'spring', stiffness: 360, damping: 12, mass: 0.7 },
    },
  }

  const starVariants: Variants = {
    closed: { opacity: 0, scale: 0.3, rotate: -90, transition: { duration: 0.12 } },
    open: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: reduce
        ? { duration: 0 }
        : { type: 'spring', stiffness: 500, damping: 11, mass: 0.6, delay: 0.06 },
    },
  } as const

  return (
    <div className="md:hidden">
      {/* ---- Full-screen menu panel ---- */}
      <AnimatePresence onExitComplete={runPendingScroll}>
        {open && (
          <motion.div
            key="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="fixed inset-0 z-[60] flex flex-col items-center overflow-y-auto overscroll-contain px-6 pt-6 pb-6"
            style={{
              transformOrigin: 'top right',
              backgroundImage:
                'linear-gradient(4deg, #f2f7f4 1.36%, #c8e4b0 61.84%)',
            }}
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Pill spacer — the real pill is fixed on top of the panel */}
            <div className="h-[52px] w-full shrink-0" />

            {/* Nav links — Figma "Sections" (730:30621). Each row is
             * items-center: the star wrapper carries a 10 px bottom
             * pad and the 61 px text block a 10 px top pad, so the
             * star's centre lands on the text's first-line centre
             * (≈26 px from the row top) — that's the bullet⇄text
             * alignment. The "Home" divider is a 1.5 px Green/400
             * (#57A053) rule, full-width. */}
            <nav
              aria-label="Mobile"
              className="mt-10 flex w-full max-w-[340px] flex-col gap-2 px-[10px]"
            >
              {mobileLinks.map((l) => (
                <motion.div
                  key={l.label}
                  variants={itemVariants}
                  className="flex w-full items-center gap-2 pl-[2px]"
                >
                  <span className="flex items-center pb-[10px]">
                    <motion.img
                      src={starWhite}
                      alt=""
                      aria-hidden
                      variants={starVariants}
                      className="size-4 shrink-0"
                    />
                  </span>
                  <a
                    href={l.href}
                    onClick={handleNavClick(l.href)}
                    className="flex h-[61px] flex-col gap-2 pt-[10px]"
                  >
                    <span className="font-body text-[20px] leading-[32px] font-normal tracking-[0.2px] text-[#333]">
                      {l.label}
                    </span>
                  </a>
                </motion.div>
              ))}
            </nav>

            <div className="flex-1" />

            {/* Social row */}
            <motion.div
              variants={itemVariants}
              className="flex w-full max-w-[360px] items-center gap-6 px-[30px] py-[2px]"
            >
              <a
                href="https://x.com/purintaxyz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Purinta on X"
                onClick={() => setOpen(false)}
                className="flex size-7 items-center justify-center text-[#333] transition-opacity hover:opacity-70"
              >
                <XIcon width={17} height={15.3} />
              </a>
              <a
                href="https://discord.gg/purinta"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Purinta on Discord"
                onClick={() => setOpen(false)}
                className="flex size-7 items-center justify-center text-[#333] transition-opacity hover:opacity-70"
              >
                <DiscordIcon width={21.2} height={16.2} />
              </a>
            </motion.div>

            {/* Launch App CTA */}
            <motion.div
              variants={itemVariants}
              className="mt-[88px] w-full max-w-[360px] px-[10px]"
            >
              <Button
                variant="primary"
                fullWidth
                asChild
                className="!rounded-full border border-solid border-[#78ba68] !px-[21px] !py-[13px] !text-[16px] tracking-[0.48px]"
              >
                <a href="https://app.purinta.xyz">Launch App</a>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Floating pill ----
       * Not sticky: when closed it is `absolute`, so it sits at the
       * top of the page and scrolls away with the hero. While the
       * menu is open it switches to `fixed` so it stays pinned to the
       * viewport over the full-screen panel (body scroll is locked
       * anyway, so there is no visible jump). */}
      <nav
        className={`fade-in-on-load top-6 right-6 left-6 z-[70] flex h-[52px] items-center justify-between rounded-[64px] border border-solid border-[#9ECF84] bg-[#FEFEFE] px-6 ${
          open
            ? 'fixed'
            : 'absolute shadow-[0_4px_24px_rgba(24,82,41,0.06)]'
        }`}
      >
        {/* Logo built inline at the Figma mobile-pill size (84.237 × 20
         * — symbol 17.665 × 20, wordmark 62.458 × 12.373 at 21.73 /
         * 4.407). The shared <Logo> hard-codes a 40 px symbol. */}
        <a
          href="#"
          aria-label="Purinta"
          onClick={open ? handleNavClick('#') : undefined}
          className="relative block h-[20px] w-[84.237px] shrink-0"
        >
          <img
            src={asset('/assets/figma/logo-symbol.svg')}
            alt=""
            className="absolute top-0 left-0 h-[20px] w-[17.665px]"
          />
          <img
            src={asset('/assets/figma/wordmark.svg')}
            alt="Purinta"
            className="absolute top-[4.407px] left-[21.73px] h-[12.373px] w-[62.458px]"
          />
        </a>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-mr-1 inline-flex size-8 items-center justify-center rounded-full text-[#333] transition-colors hover:bg-[var(--color-green-50)]"
        >
          <MenuIcon open={open} reduce={reduce} />
        </button>
      </nav>
    </div>
  )
}
