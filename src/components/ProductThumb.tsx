import type { Product } from '../data/seed'

/**
 * Flat colour block placeholder for a product image (decision D5).
 * Dimensions are controlled by the caller's CSS (e.g. `.a-card .thumb`).
 */
export function ProductThumb({ product }: { product: Product }) {
  return (
    <span
      className="thumb"
      aria-hidden="true"
      style={{ background: product.swatch, opacity: 0.85 }}
    />
  )
}
