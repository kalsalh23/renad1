import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, Heart, Search } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useMyNotifications } from '@/hooks/useData'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/constants'
import { InstallApp } from './InstallApp'

/** ترويسة شبيهة بالتطبيق: ترحيب + بحث + إشعارات */
export function Header() {
  const { user, profile } = useAuth()
  const { ids } = useFavorites()
  const { unread } = useMyNotifications(user?.id)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    setQ(new URLSearchParams(location.search).get('q') ?? '')
  }, [location.pathname])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/dresses?q=${encodeURIComponent(q.trim())}`)
  }

  if (isHome) {
    return (
      <div className="container-app pt-5">
        <div className="flex items-center justify-between">
          <Link to={user ? '/account' : '/auth'} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-plum text-lg font-black text-white">
              {(profile?.full_name || 'ر').charAt(0)}
            </span>
            <span className="leading-tight">
              <span className="block text-xs text-smoke">أهلًا بكِ في</span>
              <span className="block text-sm font-extrabold text-ink">
                {user ? profile?.full_name || 'ريناد' : 'ريناد | RENAD'}
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {user && (
              <Link to="/account?tab=notifications" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-sm" aria-label="الإشعارات">
                <Bell className="h-5 w-5" />
                {unread > 0 && <span className="absolute left-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-rose" />}
              </Link>
            )}
            <Link to="/favorites" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-sm" aria-label="المفضلة">
              <Heart className="h-5 w-5" />
              {ids.length > 0 && (
                <span className="absolute -top-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-white">
                  {ids.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* البحث */}
        <form onSubmit={submit} className="mt-5">
          <div className="flex items-center gap-2 rounded-full bg-white px-5 py-3.5 shadow-[0_4px_24px_rgba(74,31,82,0.07)]">
            <Search className="h-5 w-5 shrink-0 text-smoke" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحثي عن فستان..."
              className="w-full bg-transparent text-sm text-ink placeholder:text-smoke/70 focus:outline-none"
              aria-label="بحث"
            />
          </div>
        </form>
      </div>
    )
  }

  // ترويسة الصفحات الداخلية
  return (
    <div className="sticky top-0 z-40 border-b border-chip bg-lilac/95 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-plum text-sm font-black text-white">ر</span>
          <span className="text-base font-black text-ink">ريناد</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="التنقل">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn('text-sm font-bold transition-colors', location.pathname === l.to ? 'text-plum' : 'text-smoke hover:text-ink')}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/favorites" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-sm" aria-label="المفضلة">
            <Heart className="h-4.5 w-4.5 h-[18px] w-[18px]" />
            {ids.length > 0 && (
              <span className="absolute -top-1 -left-1 flex h-4.5 min-w-4.5 h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-white">
                {ids.length}
              </span>
            )}
          </Link>
          {user ? (
            <Link to="/account" className="flex h-10 w-10 items-center justify-center rounded-full bg-plum text-sm font-bold text-white" aria-label="حسابي">
              {(profile?.full_name || 'ر').charAt(0)}
            </Link>
          ) : (
            <Link to="/auth" className="btn-primary !rounded-full !px-5 !py-2 text-xs">
              دخول
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

/** شريط تنقل سفلي كالتطبيقات */
export function BottomNav() {
  const { user } = useAuth()
  const { ids } = useFavorites()
  const location = useLocation()

  const items = [
    { to: '/', label: 'الرئيسية', icon: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5', match: (p: string) => p === '/' },
    { to: '/dresses', label: 'الفساتين', icon: 'M4 4h16v6H4zM4 14h16v6H4z', match: (p: string) => p.startsWith('/dresses') || p.startsWith('/categories') },
    { to: '/favorites', label: 'المفضلة', icon: 'M12 21C7 16.5 3 13.3 3 9.4 3 6.9 5 5 7.5 5c1.7 0 3.3.9 4.5 2.4C13.2 5.9 14.8 5 16.5 5 19 5 21 6.9 21 9.4c0 3.9-4 7.1-9 11.6z', badge: ids.length, match: (p: string) => p.startsWith('/favorites') },
    { to: '/account?tab=bookings', label: 'حجوزاتي', icon: 'M7 3v3M17 3v3M3.5 9h17M5 5h14v16H5zM9 15l2 2 4-4', match: (p: string) => p.startsWith('/account') && new URLSearchParams(p.split('?')[1] ?? '').get('tab') === 'bookings' },
    { to: user ? '/account' : '/auth', label: 'حسابي', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0', match: (p: string) => p.startsWith('/account') || p.startsWith('/auth') },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-chip bg-white pb-[env(safe-area-inset-bottom)]" aria-label="التنقل السفلي">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const active = item.match(location.pathname + (location.search || ''))
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-colors',
                active ? 'text-plum' : 'text-smoke',
              )}
            >
              <svg
                viewBox="0 0 24 24"
                fill={active ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d={item.icon} />
              </svg>
              {item.label}
              {!!item.badge && item.badge > 0 && (
                <span className="absolute right-1/2 top-1 flex h-4 min-w-4 translate-x-4.5 translate-x-[18px] items-center justify-center rounded-full bg-rose px-1 text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const navigate = useNavigate()
  return (
    <div className="container-app flex items-center gap-3 pb-2 pt-6">
      <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm" aria-label="رجوع">
        <ChevronRight className="h-5 w-5 text-ink" />
      </button>
      <div>
        <h1 className="text-xl font-black text-ink">{title}</h1>
        {subtitle && <p className="text-xs text-smoke">{subtitle}</p>}
      </div>
    </div>
  )
}

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <BottomNav />
      <InstallApp />
    </div>
  )
}
