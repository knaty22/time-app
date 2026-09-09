// Pure cart selectors. These turn a { productId: qty } map into the shapes
// the screens render. `byVendor` is what powers both P1 tasks.

import { getProduct, getVendor } from '../data/seed'
import type { Product, Vendor } from '../data/seed'

export type Qtys = Record<string, number>

export interface LineItem {
  product: Product
  qty: number
  lineTotal: number
}

export interface VendorGroup {
  vendor: Vendor
  items: LineItem[]
  subtotal: number
}

export interface CartTotals {
  vendorCount: number
  itemCount: number
  total: number
}

function activeEntries(qtys: Qtys): Array<[string, number]> {
  return Object.entries(qtys).filter(([, qty]) => qty > 0)
}

export function lineItems(qtys: Qtys): LineItem[] {
  return activeEntries(qtys)
    .map(([productId, qty]) => {
      const product = getProduct(productId)
      return { product, qty, lineTotal: product.price * qty }
    })
    .sort((a, b) => a.product.name.localeCompare(b.product.name))
}

export function byVendor(qtys: Qtys): VendorGroup[] {
  const groups = new Map<string, LineItem[]>()
  for (const item of lineItems(qtys)) {
    const list = groups.get(item.product.vendorId) ?? []
    list.push(item)
    groups.set(item.product.vendorId, list)
  }
  return [...groups.entries()]
    .map(([vendorId, items]) => ({
      vendor: getVendor(vendorId),
      items,
      subtotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
    }))
    .sort((a, b) => a.vendor.name.localeCompare(b.vendor.name))
}

export function totals(qtys: Qtys): CartTotals {
  const entries = activeEntries(qtys)
  const vendorIds = new Set(entries.map(([productId]) => getProduct(productId).vendorId))
  return {
    vendorCount: vendorIds.size,
    itemCount: entries.reduce((sum, [, qty]) => sum + qty, 0),
    total: entries.reduce((sum, [productId, qty]) => sum + getProduct(productId).price * qty, 0),
  }
}
