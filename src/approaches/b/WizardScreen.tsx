import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { PhoneFrame } from '../../components/PhoneFrame'
import { QtyStepper } from '../../components/QtyStepper'
import { VendorGroupList } from '../../components/VendorGroupList'
import { OrderConfirmation } from '../../components/OrderConfirmation'
import { FulfillmentToggle } from '../../components/FulfillmentToggle'
import { useCart } from '../../cart/CartContext'
import { byVendor, totals as cartTotals } from '../../cart/selectors'
import { CATEGORIES, PRODUCTS, formatPrice, getVendor } from '../../data/seed'
import type { Category } from '../../data/seed'
import './b.css'

const STEPS = ['Categories', 'Items', 'Review'] as const
type StepIndex = 0 | 1 | 2

export function WizardScreen() {
  const { qtys, add, setQty, remove, clear } = useCart('b')
  const [step, setStep] = useState<StepIndex>(0)
  const [chosen, setChosen] = useState<Category[]>([])
  const [placed, setPlaced] = useState(false)

  const totals = cartTotals(qtys)
  const groups = byVendor(qtys)

  const itemsForChosen = useMemo(
    () => PRODUCTS.filter((p) => chosen.includes(p.category)),
    [chosen],
  )

  function toggleCategory(c: Category) {
    setChosen((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  const canContinue = step === 0 ? chosen.length > 0 : step === 1 ? totals.itemCount > 0 : true

  if (placed) {
    return (
      <PhoneFrame>
        <WizardHeader step={2} />
        <div className="phone__scroll">
          <OrderConfirmation
            totals={totals}
            onStartOver={() => {
              clear()
              setChosen([])
              setStep(0)
              setPlaced(false)
            }}
          />
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <WizardHeader step={step} />

      <div className="phone__scroll b-body">
        {step === 0 && (
          <>
            <h2 className="b-q">What are you shopping for today?</h2>
            <p className="b-sub">Pick one or more. We'll show you items across every vendor.</p>
            <div className="b-cats">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={chosen.includes(c)}
                  className={`b-cat${chosen.includes(c) ? ' b-cat--on' : ''}`}
                  onClick={() => toggleCategory(c)}
                >
                  <span className="b-cat__name">{c}</span>
                  <span className="b-cat__mark" aria-hidden="true">
                    {chosen.includes(c) ? '✓' : ''}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="b-q">Add the items you want</h2>
            <p className="b-sub">From any vendor — we'll group them for one pickup.</p>
            {chosen.map((category) => (
              <section key={category} className="b-section">
                <div className="kicker">{category}</div>
                {itemsForChosen
                  .filter((p) => p.category === category)
                  .map((product) => {
                    const qty = qtys[product.id] ?? 0
                    return (
                      <div className={`b-item${qty > 0 ? ' b-item--on' : ''}`} key={product.id}>
                        <span className="b-item__check" aria-hidden="true">
                          {qty > 0 ? '✓' : ''}
                        </span>
                        <span className="b-item__info">
                          <span className="b-item__name">{product.name}</span>
                          <span className="b-item__meta">
                            {getVendor(product.vendorId).name} · {formatPrice(product.price)}
                          </span>
                        </span>
                        {qty > 0 ? (
                          <QtyStepper
                            qty={qty}
                            onDec={() => setQty(product.id, qty - 1)}
                            onInc={() => setQty(product.id, qty + 1)}
                            label={`quantity of ${product.name}`}
                          />
                        ) : (
                          <button
                            type="button"
                            className="b-item__add"
                            onClick={() => add(product.id)}
                            aria-label={`Add ${product.name}`}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    )
                  })}
              </section>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="b-q">Review your order</h2>
            {groups.length === 0 ? (
              <p className="b-sub">
                Nothing added yet. <Link to="/b">Start over</Link>.
              </p>
            ) : (
              <>
                <FulfillmentToggle />
                <VendorGroupList groups={groups} editable={{ setQty, remove }} showPickup />
              </>
            )}
          </>
        )}
      </div>

      <footer className="b-foot">
        <div className="b-foot__running">
          <span>
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} · {totals.vendorCount}{' '}
            {totals.vendorCount === 1 ? 'vendor' : 'vendors'}
          </span>
          <strong>{formatPrice(totals.total)}</strong>
        </div>
        <div className="b-foot__btns">
          {step > 0 ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setStep((s) => (s - 1) as StepIndex)}
            >
              Back
            </button>
          ) : (
            <Link to="/" className="btn btn--ghost">
              Exit
            </Link>
          )}
          {step < 2 ? (
            <button
              type="button"
              className="btn btn--primary b-foot__next"
              disabled={!canContinue}
              onClick={() => setStep((s) => (s + 1) as StepIndex)}
            >
              {step === 0 ? 'Continue to items' : 'Continue to review'} →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary b-foot__next"
              disabled={groups.length === 0}
              onClick={() => setPlaced(true)}
            >
              Place order
            </button>
          )}
        </div>
      </footer>
    </PhoneFrame>
  )
}

function WizardHeader({ step }: { step: StepIndex }) {
  return (
    <header className="b-head">
      <div className="b-head__row">
        <span className="kicker">Step {step + 1} of 3</span>
        <Link to="/" className="b-head__cancel">
          Cancel
        </Link>
      </div>
      <ol className="b-steps">
        {STEPS.map((label, i) => {
          const state = i < step ? 'done' : i === step ? 'active' : 'todo'
          return (
            <li key={label} className={`b-step b-step--${state}`}>
              <span className="b-step__dot">{state === 'done' ? '✓' : i + 1}</span>
              <span className="b-step__label">{label}</span>
            </li>
          )
        })}
      </ol>
    </header>
  )
}
