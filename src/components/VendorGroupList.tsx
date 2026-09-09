// Renders the cart grouped by vendor with per-vendor subtotals.
// This is the shared component behind P1 task 2 ("check cart contents across
// vendors before payment") in BOTH options.

import { formatPrice } from '../data/seed'
import type { VendorGroup } from '../cart/selectors'
import { QtyStepper } from './QtyStepper'

interface VendorGroupListProps {
  groups: VendorGroup[]
  /** when set, each line gets a stepper + remove control */
  editable?: {
    setQty: (productId: string, qty: number) => void
    remove: (productId: string) => void
  }
  /** show the vendor's pickup time under its name */
  showPickup?: boolean
}

export function VendorGroupList({ groups, editable, showPickup }: VendorGroupListProps) {
  return (
    <div>
      {groups.map((group) => (
        <section key={group.vendor.id} aria-label={group.vendor.name}>
          <div className="vgroup__head">
            <div>
              <div className="vgroup__vendor">{group.vendor.name}</div>
              {showPickup && (
                <div className="kicker" style={{ letterSpacing: 0, textTransform: 'none' }}>
                  {group.vendor.stall} · pickup by {group.vendor.pickupBy}
                </div>
              )}
            </div>
            <div className="vgroup__subtotal">subtotal {formatPrice(group.subtotal)}</div>
          </div>

          {group.items.map(({ product, qty, lineTotal }) => (
            <div className="vline" key={product.id}>
              {editable ? (
                <QtyStepper
                  qty={qty}
                  onDec={() => editable.setQty(product.id, qty - 1)}
                  onInc={() => editable.setQty(product.id, qty + 1)}
                  label={`quantity of ${product.name}`}
                />
              ) : (
                <span className="vline__qty" style={{ fontWeight: 600, color: 'var(--muted)' }}>
                  {qty}×
                </span>
              )}
              <span className="vline__name">{product.name}</span>
              <span className="vline__price">{formatPrice(lineTotal)}</span>
              {editable && (
                <button
                  type="button"
                  className="vline__remove"
                  onClick={() => editable.remove(product.id)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
