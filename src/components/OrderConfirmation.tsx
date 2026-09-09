import { Link } from 'react-router-dom'
import type { CartTotals } from '../cart/selectors'

interface OrderConfirmationProps {
  totals: CartTotals
  onStartOver: () => void
}

/** Stub "order placed" screen (decision D4 — no real payment). */
export function OrderConfirmation({ totals, onStartOver }: OrderConfirmationProps) {
  return (
    <div className="confirm">
      <div className="confirm__check" aria-hidden="true">
        ✓
      </div>
      <h2 className="confirm__title">Order placed</h2>
      <p className="confirm__body">
        {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} from {totals.vendorCount}{' '}
        {totals.vendorCount === 1 ? 'vendor' : 'vendors'}, consolidating for one pickup.
      </p>
      <p className="confirm__note">This is a prototype — no payment was taken.</p>
      <div className="confirm__actions">
        <button type="button" className="btn btn--ghost" onClick={onStartOver}>
          Start over
        </button>
        <Link to="/" className="btn btn--primary">
          Back to start
        </Link>
      </div>
    </div>
  )
}
