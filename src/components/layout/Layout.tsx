import { lazy, Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { SizeGuideModal } from '@/components/product/SizeGuideModal'
import { Cursor } from '@/components/ui/Cursor'
import { Toaster } from '@/components/ui/Toaster'
import { useUI } from '@/store/ui'

const SearchOverlay = lazy(() => import('@/components/search/SearchOverlay'))
const QuickViewModal = lazy(() => import('@/components/product/QuickViewModal'))

function GlobalShortcuts() {
  const { openOverlay } = useUI()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing = !!el && (el.matches('input, textarea, select') || el.isContentEditable)
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey)) {
        e.preventDefault()
        openOverlay('search')
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openOverlay])
  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export function Layout() {
  const { overlay } = useUI()
  return (
    <>
      <div id="top" className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only-focusable fixed left-3 top-3 z-[200] bg-ink px-4 py-3 text-bone label">
          Skip to content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <MobileMenu />
      <SizeGuideModal />
      <Suspense fallback={null}>
        {overlay?.name === 'search' && <SearchOverlay />}
        {overlay?.name === 'quickview' && <QuickViewModal />}
      </Suspense>
      <Toaster />
      <Cursor />
      <GlobalShortcuts />
      <ScrollToTop />
    </>
  )
}
