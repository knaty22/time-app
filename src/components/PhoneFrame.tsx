import type { ReactNode } from 'react'

/** Centers the screen content in a phone-width column so /a and /b read like the Figma frames. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return <div className="phone">{children}</div>
}
