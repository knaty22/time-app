interface QtyStepperProps {
  qty: number
  onDec: () => void
  onInc: () => void
  label?: string
}

export function QtyStepper({ qty, onDec, onInc, label = 'quantity' }: QtyStepperProps) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={onDec} aria-label="decrease">
        –
      </button>
      <span aria-live="polite">{qty}</span>
      <button type="button" onClick={onInc} aria-label="increase">
        +
      </button>
    </div>
  )
}
