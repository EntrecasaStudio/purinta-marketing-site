import { type MouseEvent as ReactMouseEvent, useEffect, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from 'motion/react'
import Logo from '@/components/Logo'
import { XIcon, DiscordIcon } from '@/components/icons/Social'
import { Button } from '@/components/ui/button'
import { asset } from '@/lib/utils'

const links = [
  { href: '#', label: 'Home', active: true },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#ecosystem', label: 'Ecosystem' },
  // { href: '#community', label: 'Community' }, // section hidden for now
]

/* Mobile menu links — matches Figma node 773:40693 (Menu-Mobile-Content). */
const mobileLinks = [
  { href: '#', label: 'Home', active: true },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#community', label: 'Community' },
]

/**
 * Top navigation pill — Figma node 384:2293.
 * 1280 × 84 px, rounded-64, bg #FEFEFE, px-[40px] py-[24px].
 * Floats over the hero with a top margin and rounded full pill shape.
 */
export default function Nav() {
  return (
    <nav
      className="relative z-50 mx-auto hidden h-[84px] w-full max-w-[1280px] items-center justify-center rounded-[64px] bg-[#FEFEFE] px-[40px] py-[24px] shadow-[0_4px_24px_rgba(24,82,41,0.06)] md:flex"
      data-node-id="384:2293"
    >
      <div className="flex w-full items-center justify-between pl-4">
        <a href="#" aria-label="Purinta" className="flex shrink-0">
          <Logo />
        </a>

        <div className="flex items-center gap-[32px]">
          <div className="flex items-center gap-[64px]">
            <ul className="flex items-center justify-end gap-[20px]">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className={`block px-[8px] py-[1.5px] font-body text-[16px] leading-[26px] tracking-[0.16px] whitespace-nowrap text-[#333] transition-colors hover:text-[var(--color-green-600)] ${
                      l.active
                        ? 'border-b border-solid border-[#B2B2B2]'
                        : ''
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex h-[32px] items-center justify-end gap-[24px]">
              <a
                href="https://x.com/purintaxyz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Purinta on X"
                className="flex size-[32px] items-center justify-center text-[#666666] transition-colors hover:text-[var(--color-green-600)]"
              >
                <XIcon width={20} height={18} />
              </a>
              <a
                href="https://discord.gg/purinta"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Purinta on Discord"
                className="flex size-[32px] items-center justify-center text-[#666666] transition-colors hover:text-[var(--color-green-600)]"
              >
                <DiscordIcon width={24} height={18.5} />
              </a>
            </div>
          </div>

          {/* Nav primary button uses Figma-specific dimensions
              (font 16, px-[21] py-[13], rounded-[22]) — bigger font
              than .btn-sm (13 px), smaller padding than .btn (12/24). */}
          <Button
            variant="primary"
            asChild
            className="rounded-[22px] !px-[21px] !py-[13px] !text-[16px] tracking-[0.48px]"
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

const starGreen = asset('/assets/figma/menu/star.svg')
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

  /* Runs once the panel's exit animation has fully completed. */
  const runPendingScroll = () => {
    if (pendingScroll == null) return
    const target = pendingScroll
    setPendingScroll(null)
    if (target === '#' || target === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document
      .querySelector(target)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
                      src={l.active ? starGreen : starWhite}
                      alt=""
                      aria-hidden
                      variants={starVariants}
                      className="size-4 shrink-0"
                    />
                  </span>
                  {/* Text block sizes to the word (not flex-1), so the
                   * "Home" underline rule spans only the label width —
                   * per Figma, where the divider is w-full of a
                   * shrink-to-content text block. */}
                  <a
                    href={l.href}
                    onClick={handleNavClick(l.href)}
                    className="flex h-[61px] flex-col gap-2 pt-[10px]"
                  >
                    <span className="font-body text-[20px] leading-[32px] font-normal tracking-[0.2px] text-[#333]">
                      {l.label}
                    </span>
                    {l.active && (
                      <span className="block h-[1.5px] w-full bg-[#57A053]" />
                    )}
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
