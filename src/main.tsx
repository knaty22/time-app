import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import './styles/base.css'
import { CartProvider } from './cart/CartContext'
import { ApproachHome } from './routes/ApproachHome'
import { GridScreen } from './approaches/a/GridScreen'
import { CartScreen } from './approaches/a/CartScreen'
import { ReviewScreen } from './approaches/a/ReviewScreen'
import { WizardScreen } from './approaches/b/WizardScreen'

// No shared homepage. Each option is a fully separate experience under its own
// route prefix; a test participant only ever sees one variant. "/" just falls
// through to Option A so a bare visit doesn't error.
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/a" replace /> },

  // Option A — Unified Grid
  {
    path: '/a',
    element: (
      <ApproachHome
        name="Unified Grid"
        tagline="One product grid across every Grand Lake Farmers Market vendor. Filter by category and tap to add — your cart keeps everything together for one pickup."
        startTo="/a/shop"
        startLabel="Start shopping"
      />
    ),
  },
  { path: '/a/shop', element: <GridScreen /> },
  { path: '/a/cart', element: <CartScreen /> },
  { path: '/a/review', element: <ReviewScreen /> },

  // Option B — Guided Builder
  {
    path: '/b',
    element: (
      <ApproachHome
        name="Guided Builder"
        tagline="A short step-by-step: pick the categories you're shopping for, choose items across every vendor, then review the whole order before you place it."
        startTo="/b/build"
        startLabel="Start building"
      />
    ),
  },
  { path: '/b/build', element: <WizardScreen /> },

  { path: '*', element: <Navigate to="/a" replace /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>,
)
