import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Layout } from '@/components/layout/Layout'
import { useAuth } from '@/context/AuthContext'
import { PageLoader } from '@/components/ui/Common'

import HomePage from '@/pages/HomePage'
import CategoriesPage from '@/pages/CategoriesPage'
import DressesPage from '@/pages/DressesPage'
import DressDetailsPage from '@/pages/DressDetailsPage'
import WishlistPage from '@/pages/WishlistPage'
import BookPage from '@/pages/BookPage'
import AuthPage from '@/pages/AuthPage'
import AccountPage from '@/pages/AccountPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import NotFoundPage from '@/pages/NotFoundPage'

/** يتطلب حسابًا — يحفظ الوجهة المطلوبة للعودة إليها بعد الدخول */
function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/auth" state={{ from: location.pathname + location.search }} replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="dresses" element={<DressesPage />} />
        <Route path="dresses/:slug" element={<DressDetailsPage />} />
        <Route path="favorites" element={<WishlistPage />} />
        <Route path="book" element={<RequireAuth><BookPage /></RequireAuth>} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
