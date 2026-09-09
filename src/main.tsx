import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import './styles/base.css'
import { CartProvider } from './cart/CartContext'
import { Home } from './routes/Home'
import { ApproachHome } from './routes/ApproachHome'
import { GridScreen } from './approaches/a/GridScreen'
import { CartScreen } from './approaches/a/CartScreen'
import { ReviewScreen } from './approaches/a/ReviewScreen'
import { WizardScreen } from './approaches/b/WizardScreen'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },

  // Option A — Unified Grid
  {
    path: '/a',
    element: (
      <ApproachHome
        option="A"
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
        option="B"
        name="Guided Builder"
        tagline="A short step-by-step: pick the categories you're shopping for, choose items across every vendor, then review the whole order before you place it."
        startTo="/b/build"
        startLabel="Start building"
      />
    ),
  },
  { path: '/b/build', element: <WizardScreen /> },

  { path: '*', element: <Navigate to="/" replace /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>,
)
