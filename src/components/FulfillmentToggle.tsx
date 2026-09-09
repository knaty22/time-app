import { useState } from 'react'

/**
 * Pickup / delivery choice on the review screen (decision D7).
 * UI-only and intentionally not wired to anything — real fulfilment (DoorDash
 * Drive dispatch) is out of scope for this A/B build and verified separately.
 */
export function FulfillmentToggle() {
  const [mode, setMode] = useState<'pickup' | 'delivery'>('pickup')
  return (
    <div className="fulfill">
      <span className="fulfill__label">How do you want it?</span>
      <div className="fulfill__options" role="group" aria-label="Fulfilment method">
        {(['pickup', 'delivery'] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            className={`fulfill__option${mode === m ? ' fulfill__option--on' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'pickup' ? 'Pickup at AIM booth' : 'Delivery'}
          </button>
        ))}
      </div>
    </div>
  )
}
