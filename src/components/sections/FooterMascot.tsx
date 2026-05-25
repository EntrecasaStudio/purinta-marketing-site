import { asset } from '@/lib/utils'

/**
 * Footer mascot — flat SVG export at `/assets/figma/footer/mascot-footer.svg`.
 * Natural box 500 × 468. The SVG carries its OWN CSS animations
 * (breath / sync-blink / arm sway) inside an internal `<style>` block,
 * so loading it via `<img>` is enough — no React-level animation work.
 *
 * Renders at 100% of its parent so the caller can size it for the
 * desktop scene (500 × 468) or the mobile scene (250 × 234, half size
 * per Figma 773:40689). Aspect ratio is preserved by the SVG viewBox.
 */

const mascotSrc = asset('/assets/figma/footer/mascot-footer.svg')

export default function FooterMascot() {
  return (
    <img
      src={mascotSrc}
      alt="Purinta mascot"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
      data-figma-node="551:37818"
    />
  )
}
