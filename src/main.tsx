import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import './styles/base.css'
import { CartProvider } from './cart/CartContext'
import { Home } from './routes/Home'
import { GridScreen } from './approaches/a/GridScreen'
import { CartScreen } from './approaches/a/CartScreen'
import { ReviewScreen } from './approaches/a/ReviewScreen'
import { WizardScreen } from './approaches/b/WizardScreen'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/a', element: <GridScreen /> },
  { path: '/a/cart', element: <CartScreen /> },
  { path: '/a/review', element: <ReviewScreen /> },
  { path: '/b', element: <WizardScreen /> },
  { path: '*', element: <Navigate to="/" replace /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>,
)
