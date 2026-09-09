import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppHeader } from '../../components/AppHeader'
import { PhoneFrame } from '../../components/PhoneFrame'
import { ProductThumb } from '../../components/ProductThumb'
import { QtyStepper } from '../../components/QtyStepper'
import { CartSummaryBar } from '../../components/CartSummaryBar'
import { useCart } from '../../cart/CartContext'
import { totals as cartTotals } from '../../cart/selectors'
import { CATEGORIES, PRODUCTS, formatPrice, getVendor } from '../../data/seed'
import type { Category } from '../../data/seed'
import './a.css'

type Filter = 'All' | Category

export function GridScreen() {
  const navigate = useNavigate()
  const { qtys, add, setQty } = useCart('a')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter((p) => {
      if (filter !== 'All' && p.category !== filter) return false
      if (q && !p.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, filter])

  const totals = cartTotals(qtys)

  return (
    <PhoneFrame>
      <AppHeader title="Shop the whole market" />

      <div className="a-toolbar">
        <input
          className="a-search"
          type="search"
          placeholder="Search produce, bread, soap…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />
        <div className="a-chips" role="tablist" aria-label="Category filter">
          {(['All', ...CATEGORIES] as Filter[]).map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={filter === c}
              className={`a-chip${filter === c ? ' a-chip--on' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="phone__scroll a-grid-scroll">
        {visible.length === 0 && <p className="a-empty">No products match that.</p>}
        <div className="a-grid">
          {visible.map((product) => {
            const qty = qtys[product.id] ?? 0
            return (
              <article className="a-card" key={product.id}>
                <ProductThumb product={product} />
                <div className="a-card__body">
                  <div className="a-card__name">{product.name}</div>
                  <div className="a-card__price">
                    {formatPrice(product.price)} <span>/ {product.unit}</span>
                  </div>
                  <div className="a-card__vendor">{getVendor(product.vendorId).name}</div>
                  <div className="a-card__action">
                    {qty === 0 ? (
                      <button
                        type="button"
                        className="a-add"
                        onClick={() => add(product.id)}
                        aria-label={`Add ${product.name}`}
                      >
                        + Add
                      </button>
                    ) : (
                      <QtyStepper
                        qty={qty}
                        onDec={() => setQty(product.id, qty - 1)}
                        onInc={() => setQty(product.id, qty + 1)}
                        label={`quantity of ${product.name}`}
                      />
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {totals.itemCount > 0 && (
        <div className="a-dock">
          <CartSummaryBar
            totals={totals}
            variant="bar"
            ctaLabel="View cart"
            onClick={() => navigate('/a/cart')}
          />
        </div>
      )}
    </PhoneFrame>
  )
}
