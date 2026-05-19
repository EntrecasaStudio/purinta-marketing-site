import { asset } from '@/lib/utils'

/**
 * Footer mascot — single flat SVG export under
 * `/assets/figma/footer/mascot-footer.svg`. Natural box 500 × 468.
 *
 * The SVG ships every part with `<g id="...">` so future animations
 * can target individual parts via CSS / JS once the wrapper switches
 * from `<img>` to inline SVG. For now this is static (no animation)
 * to lock the visual to Figma 1:1.
 */

const mascotSrc = asset('/assets/figma/footer/mascot-footer.svg')

export default function FooterMascot() {
  return (
    <img
      src={mascotSrc}
      alt="Purinta mascot"
      width={500}
      height={468}
      style={{
        width: '500px',
        height: '468px',
        display: 'block',
      }}
      data-figma-node="551:37818"
    />
  )
}
