import { Link, useNavigate } from 'react-router-dom'

import { AppHeader } from '../../components/AppHeader'
import { PhoneFrame } from '../../components/PhoneFrame'
import { VendorGroupList } from '../../components/VendorGroupList'
import { useCart } from '../../cart/CartContext'
import { byVendor, totals as cartTotals } from '../../cart/selectors'
import { formatPrice } from '../../data/seed'
import './a.css'

export function CartScreen() {
  const navigate = useNavigate()
  const { qtys, setQty, remove } = useCart('a')
  const groups = byVendor(qtys)
  const totals = cartTotals(qtys)

  return (
    <PhoneFrame>
      <AppHeader title="Your cart" backTo="/a/shop" backLabel="Keep shopping" />

      <div className="phone__scroll">
        {groups.length === 0 ? (
          <p className="a-empty">
            Your cart is empty. <Link to="/a/shop">Browse the market →</Link>
          </p>
        ) : (
          <>
            <p className="a-cart-summary">
              {totals.vendorCount} {totals.vendorCount === 1 ? 'vendor' : 'vendors'} ·{' '}
              {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} · one pickup
            </p>
            <VendorGroupList groups={groups} editable={{ setQty, remove }} showPickup />
          </>
        )}
      </div>

      {groups.length > 0 && (
        <div className="a-dock a-dock--review">
          <div className="a-dock__total">
            <span>Total</span>
            <strong>{formatPrice(totals.total)}</strong>
          </div>
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => navigate('/a/review')}
          >
            Review &amp; check out
          </button>
        </div>
      )}
    </PhoneFrame>
  )
}
