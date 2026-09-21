import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'

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

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="dresses" element={<DressesPage />} />
        <Route path="dresses/:slug" element={<DressDetailsPage />} />
        <Route path="favorites" element={<WishlistPage />} />
        <Route path="book" element={<BookPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
