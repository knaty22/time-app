import { formatPrice } from '../data/seed'
import type { CartTotals } from '../cart/selectors'

interface CartSummaryBarProps {
  totals: CartTotals
  /** 'bar' = full-width dock (option A cart entry), 'pill' = floating pill */
  variant: 'bar' | 'pill'
  ctaLabel: string
  onClick: () => void
  disabled?: boolean
}

export function CartSummaryBar({ totals, variant, ctaLabel, onClick, disabled }: CartSummaryBarProps) {
  const summary = `${totals.vendorCount} ${totals.vendorCount === 1 ? 'vendor' : 'vendors'} · ${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'}`

  return (
    <button
      type="button"
      className={`csbar csbar--${variant}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${ctaLabel}. ${summary}. ${formatPrice(totals.total)}`}
    >
      <span className="csbar__text">
        <span className="csbar__summary">{summary}</span>
        <span className="csbar__total">{formatPrice(totals.total)}</span>
      </span>
      <span className="csbar__cta">{ctaLabel}</span>
    </button>
  )
}
