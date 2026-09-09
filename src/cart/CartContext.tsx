// Cart state for both options. A and B keep SEPARATE carts (decision D1) so a
// tester who tries both flows doesn't see one cart bleed into the other.
// Each approach's cart is persisted to localStorage.

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { Qtys } from './selectors'

export type ApproachKey = 'a' | 'b'

type CartState = Record<ApproachKey, Qtys>

type Action =
  | { type: 'add'; approach: ApproachKey; productId: string }
  | { type: 'setQty'; approach: ApproachKey; productId: string; qty: number }
  | { type: 'remove'; approach: ApproachKey; productId: string }
  | { type: 'clear'; approach: ApproachKey }

const STORAGE_KEY = 'fulltote-carts-v1'

const EMPTY: CartState = { a: {}, b: {} }

function load(): CartState {
  if (typeof localStorage === 'undefined') return EMPTY
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<CartState>
    return { a: parsed.a ?? {}, b: parsed.b ?? {} }
  } catch {
    return EMPTY
  }
}

function reducer(state: CartState, action: Action): CartState {
  const current = state[action.approach]
  switch (action.type) {
    case 'add': {
      const qty = (current[action.productId] ?? 0) + 1
      return { ...state, [action.approach]: { ...current, [action.productId]: qty } }
    }
    case 'setQty': {
      const next = { ...current }
      if (action.qty <= 0) delete next[action.productId]
      else next[action.productId] = action.qty
      return { ...state, [action.approach]: next }
    }
    case 'remove': {
      const next = { ...current }
      delete next[action.productId]
      return { ...state, [action.approach]: next }
    }
    case 'clear':
      return { ...state, [action.approach]: {} }
    default:
      return state
  }
}

interface CartApi {
  qtys: Qtys
  add: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
}

const CartStateContext = createContext<CartState | null>(null)
const CartDispatchContext = createContext<React.Dispatch<Action> | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [state])

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>{children}</CartDispatchContext.Provider>
    </CartStateContext.Provider>
  )
}

export function useCart(approach: ApproachKey): CartApi {
  const state = useContext(CartStateContext)
  const dispatch = useContext(CartDispatchContext)
  if (!state || !dispatch) throw new Error('useCart must be used inside <CartProvider>')

  return useMemo<CartApi>(
    () => ({
      qtys: state[approach],
      add: (productId) => dispatch({ type: 'add', approach, productId }),
      setQty: (productId, qty) => dispatch({ type: 'setQty', approach, productId, qty }),
      remove: (productId) => dispatch({ type: 'remove', approach, productId }),
      clear: () => dispatch({ type: 'clear', approach }),
    }),
    [state, dispatch, approach],
  )
}
