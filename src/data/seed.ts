// Seed data for the FullTote Build-order A/B prototype.
// No backend — this is the entire product catalogue for both options.

export type Category = 'Produce' | 'Bakery' | 'Dairy' | 'Artisan'

export interface Vendor {
  id: string
  name: string
  stall: string
  pickupBy: string
}

export interface Product {
  id: string
  vendorId: string
  name: string
  price: number
  unit: string
  category: Category
  /** hex colour used for the flat placeholder image block */
  swatch: string
}

export const CATEGORIES: Category[] = ['Produce', 'Bakery', 'Dairy', 'Artisan']

export const VENDORS: Vendor[] = [
  { id: 'sunrise', name: 'Sunrise Farm', stall: 'Stall 4', pickupBy: '1:00 PM' },
  { id: 'berryhill', name: 'Berry Hill', stall: 'Stall 12', pickupBy: '1:00 PM' },
  { id: 'millers', name: "Miller's Bakery", stall: 'Stall 22', pickupBy: '1:00 PM' },
  { id: 'soapco', name: 'Soap Co.', stall: 'Stall 31', pickupBy: '1:00 PM' },
  { id: 'greenthumb', name: 'Green Thumb', stall: 'Stall 38', pickupBy: '1:00 PM' },
]

export const PRODUCTS: Product[] = [
  { id: 'tomatoes', vendorId: 'sunrise', name: 'Heirloom Tomatoes', price: 4.5, unit: 'basket', category: 'Produce', swatch: '#d9694b' },
  { id: 'greens', vendorId: 'sunrise', name: 'Salad Greens', price: 5.0, unit: 'bag', category: 'Produce', swatch: '#5f8f4e' },
  { id: 'chard', vendorId: 'sunrise', name: 'Rainbow Chard', price: 3.5, unit: 'bunch', category: 'Produce', swatch: '#7a9e3f' },
  { id: 'eggs', vendorId: 'sunrise', name: 'Farm Eggs', price: 7.0, unit: 'dozen', category: 'Dairy', swatch: '#e6cfa1' },

  { id: 'strawberries', vendorId: 'berryhill', name: 'Strawberries', price: 6.0, unit: 'basket', category: 'Produce', swatch: '#c33b52' },
  { id: 'blueberries', vendorId: 'berryhill', name: 'Blueberries', price: 7.0, unit: 'pint', category: 'Produce', swatch: '#4b5f9e' },
  { id: 'jam', vendorId: 'berryhill', name: 'Berry Jam', price: 9.0, unit: 'jar', category: 'Artisan', swatch: '#8a3355' },

  { id: 'sourdough', vendorId: 'millers', name: 'Sourdough Loaf', price: 8.0, unit: 'each', category: 'Bakery', swatch: '#c9a15e' },
  { id: 'baguette', vendorId: 'millers', name: 'Baguette', price: 4.0, unit: 'each', category: 'Bakery', swatch: '#d8b87a' },
  { id: 'buns', vendorId: 'millers', name: 'Morning Buns', price: 12.0, unit: 'half-dozen', category: 'Bakery', swatch: '#b98a55' },

  { id: 'lavendersoap', vendorId: 'soapco', name: 'Lavender Soap', price: 9.0, unit: 'bar', category: 'Artisan', swatch: '#8f7bb0' },
  { id: 'oatmealsoap', vendorId: 'soapco', name: 'Oatmeal Soap', price: 9.0, unit: 'bar', category: 'Artisan', swatch: '#c7b299' },

  { id: 'basil', vendorId: 'greenthumb', name: 'Basil Plant', price: 6.0, unit: 'pot', category: 'Produce', swatch: '#4f7c3a' },
  { id: 'flowers', vendorId: 'greenthumb', name: 'Cut Flowers', price: 15.0, unit: 'bunch', category: 'Artisan', swatch: '#d76a86' },
]

const VENDOR_BY_ID = new Map(VENDORS.map((v) => [v.id, v]))
const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]))

export function getVendor(id: string): Vendor {
  const v = VENDOR_BY_ID.get(id)
  if (!v) throw new Error(`Unknown vendor: ${id}`)
  return v
}

export function getProduct(id: string): Product {
  const p = PRODUCT_BY_ID.get(id)
  if (!p) throw new Error(`Unknown product: ${id}`)
  return p
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`
}
