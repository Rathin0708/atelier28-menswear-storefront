import { MotionConfig } from 'motion/react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { CartProvider } from '@/store/CartProvider'
import { UIProvider } from '@/store/UIProvider'
import { WishlistProvider } from '@/store/WishlistProvider'
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import Product from '@/pages/Product'
import CartPage from '@/pages/CartPage'
import Wishlist from '@/pages/Wishlist'
import NotFound from '@/pages/NotFound'

const Checkout = lazy(() => import('@/pages/Checkout'))
const About = lazy(() => import('@/pages/About'))
const Lookbook = lazy(() => import('@/pages/Lookbook'))
const InfoPage = lazy(() => import('@/pages/InfoPage'))

const infoRoutes = ['shipping', 'returns', 'faq', 'contact', 'privacy', 'terms', 'careers', 'stores', 'size-guide']

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <UIProvider>
          <WishlistProvider>
            <CartProvider>
              <Suspense fallback={<div className="min-h-[60dvh]" aria-busy="true" />}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="shop" element={<Shop />} />
                    <Route path="collections/:slug" element={<Shop />} />
                    <Route path="product/:slug" element={<Product />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="about" element={<About />} />
                    <Route path="lookbook" element={<Lookbook />} />
                    {infoRoutes.map((p) => (
                      <Route key={p} path={p} element={<InfoPage />} />
                    ))}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </CartProvider>
          </WishlistProvider>
        </UIProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}
