import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { Bell, CalendarDays, ChevronLeft, Gift, LogOut, MapPin, Phone, Sparkles, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useMyAppointments, useMyNotifications } from '@/hooks/useData'
import { usePointsBalance, POINTS_PER_DRESS } from '@/hooks/usePoints'
import { useSEO } from '@/hooks/useSEO'
import { APPOINTMENT_STATUS_META } from '@/lib/constants'
import { cn, fmtDateAr, fmtDateTimeAr } from '@/lib/utils'
import { PageHeader } from '@/components/layout/Layout'
import { EmptyState, PageLoader } from '@/components/ui/Common'
import type { Appointment } from '@/lib/types'

type Tab = 'bookings' | 'notifications' | 'profile'

export default function AccountPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) ?? 'bookings'
  const { balance } = usePointsBalance(user?.id)
  useSEO({ title: 'حسابي' })

  if (authLoading) return <PageLoader />
  if (!user) return <Navigate to="/auth" replace />

  const rows: { tab: Tab; label: string; icon: typeof User; badge?: number }[] = [
    { tab: 'bookings', label: 'حجوزاتي ومواعيدي', icon: CalendarDays },
    { tab: 'notifications', label: 'الإشعارات', icon: Bell },
    { tab: 'profile', label: 'بياناتي الشخصية', icon: User },
  ]

  return (
    <div>
      <PageHeader title="حسابي" />

      {/* الترويسة الشخصية */}
      <div className="container-app pt-2">
        <div className="card flex items-center gap-4 p-5 !rounded-4xl">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-plum text-2xl font-black text-white">
            {(profile?.full_name || 'ر').charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-black text-ink">{profile?.full_name || '—'}</h2>
            <p className="truncate text-xs text-smoke" dir="ltr">{profile?.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chip text-plum transition-colors hover:bg-rose hover:text-white"
            aria-label="تسجيل الخروج"
            title="تسجيل الخروج"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* بطاقة نقاط الولاء */}
        <div className="relative mt-3 overflow-hidden rounded-4xl bg-plum p-5 text-white">
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(ellipse_at_top,#B98CC7,transparent_60%)]" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-white/70">RENAD REWARDS</p>
              <p className="mt-1 text-3xl font-black">{balance}</p>
              <p className="text-[11px] text-white/70">نقطة ولاء</p>
            </div>
            <Gift className="h-10 w-10 text-white/60" />
          </div>
          <p className="relative z-10 mt-3 border-t border-white/15 pt-2.5 text-[10px] leading-5 text-white/70">
            <Sparkles className="me-1 inline h-3 w-3" />
            {POINTS_PER_DRESS} نقطة لكل فستان بعد تأكيد حجزكِ — استبدليها بخصم في المعرض أو فستان مجاني.
          </p>
        </div>

        {/* قائمة الأقسام */}
        {rows.map((r) => (
          <button
            key={r.tab}
            onClick={() => setParams({ tab: r.tab })}
            className={cn(
              'card mt-3 flex w-full items-center gap-4 p-4 text-start transition-shadow hover:shadow-lg',
              tab === r.tab && 'ring-2 ring-plum/30',
            )}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-chip text-plum">
              <r.icon className="h-5 w-5" />
            </span>
            <span className="flex-1 text-sm font-extrabold text-ink">{r.label}</span>
            <ChevronLeft className="h-5 w-5 text-smoke" />
          </button>
        ))}

        <div className="mt-4">
          {tab === 'bookings' && <MyBookings userId={user.id} />}
          {tab === 'notifications' && <MyNotifications userId={user.id} />}
          {tab === 'profile' && <MyProfile />}
        </div>
      </div>
    </div>
  )
}

function MyBookings({ userId }: { userId: string }) {
  const { appointments, loading } = useMyAppointments(userId)

  if (loading) return <PageLoader />
  if (!appointments.length) {
    return (
      <EmptyState
        icon={<CalendarDays className="h-8 w-8" />}
        title="لا توجد حجوزات بعد"
        subtitle="احجزي موعد تجربتك الأول وستظهر تفاصيله هنا مع حالته."
        action={
          <Link to="/book" className="btn-primary mt-2 text-xs">
            احجزي موعد تجربة
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((a) => (
        <BookingTimeline key={a.id} appointment={a} />
      ))}
    </div>
  )
}

/** خط زمني لحالة الحجز بأسلوب تتبع الطلب */
function BookingTimeline({ appointment: a }: { appointment: Appointment }) {
  const meta = APPOINTMENT_STATUS_META[a.status]
  const cancelled = a.status === 'cancelled'
  const steps = [
    { key: 'pending', label: 'طلب الحجز مستلم', date: fmtDateTimeAr(a.created_at) },
    { key: 'confirmed', label: 'تأكيد الموعد', date: a.status === 'pending' ? 'بانتظار إدارة المعرض' : a.status === 'confirmed' || a.status === 'completed' ? 'تم التأكيد' : '—' },
    { key: 'visit', label: `زيارة المعرض — ${fmtDateAr(a.appointment_date, { weekday: 'long' })} · ${a.appointment_time}`, date: a.dress ? `الفستان ${a.dress.code}` : a.dress_code ? `الفستان ${a.dress_code}` : 'تجربة عامة' },
    { key: 'completed', label: 'إتمام التجربة', date: a.status === 'completed' ? 'شكرًا لزيارتكِ 🌸' : '—' },
  ]
  const reachedOrder = meta.order
  const stepDone = (i: number) => !cancelled && i < reachedOrder + (a.status === 'completed' ? 1 : 0)
  const stepActive = (i: number) => !cancelled && i === reachedOrder

  return (
    <div className="card p-5 !rounded-4xl">
      <div className="flex items-center justify-between gap-3">
        <span className={cn('rounded-full px-3 py-1.5 text-[11px] font-bold', meta.pill)}>{meta.label}</span>
        <span className="text-[10px] text-smoke">{fmtDateTimeAr(a.created_at)}</span>
      </div>

      <div className="mt-4 space-y-0">
        {steps.map((s, i) => (
          <div key={s.key} className="relative flex gap-4 pb-5 last:pb-0">
            {/* الخط */}
            {i < steps.length - 1 && (
              <span className={cn('absolute start-[11px] top-6 h-full w-0.5', stepDone(i + 1) || stepActive(i + 1) ? 'bg-plum' : 'bg-chip')} />
            )}
            {/* النقطة */}
            <span
              className={cn(
                'relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-black',
                cancelled
                  ? 'border-rose/40 bg-rose/10 text-rose'
                  : stepDone(i)
                    ? 'border-plum bg-plum text-white'
                    : stepActive(i)
                      ? 'border-plum bg-white text-plum'
                      : 'border-chip bg-white text-transparent',
              )}
            >
              {stepDone(i) ? '✓' : i + 1}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className={cn('text-sm font-extrabold', stepDone(i) || stepActive(i) || cancelled ? 'text-ink' : 'text-smoke/70')}>{s.label}</p>
              <p className="mt-0.5 text-[11px] leading-5 text-smoke">{s.date}</p>
            </div>
          </div>
        ))}
      </div>

      {a.admin_note && (
        <p className="mt-3 rounded-2xl bg-chip px-4 py-3 text-xs leading-6 text-ink">
          ملاحظة إدارة المعرض: {a.admin_note}
        </p>
      )}
      {a.companions > 0 && (
        <p className="mt-2 text-[11px] text-smoke">عدد المرافقات: {a.companions}</p>
      )}
    </div>
  )
}

function MyNotifications({ userId }: { userId: string }) {
  const { notifications, unread, markAllRead, markRead } = useMyNotifications(userId)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold text-smoke">{unread > 0 ? `${unread} إشعار جديد` : 'لا إشعارات جديدة'}</span>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-xs font-bold text-plum">
            تعليم الكل كمقروء
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-8 w-8" />} title="لا توجد إشعارات" subtitle="ستصلكِ إشعارات حالة حجوزاتكِ هنا." />
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={cn('card p-4', !n.is_read && 'cursor-pointer ring-2 ring-plum/30')}
              onClick={() => !n.is_read && markRead(n.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-extrabold text-ink">{n.title}</h4>
                <span className="shrink-0 text-[10px] text-smoke">{fmtDateTimeAr(n.created_at)}</span>
              </div>
              {n.body && <p className="mt-1 text-xs leading-6 text-smoke">{n.body}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function MyProfile() {
  const { profile } = useAuth()
  return (
    <div className="card p-6 !rounded-4xl">
      <h3 className="text-sm font-extrabold text-ink">بياناتي</h3>
      <div className="mt-4 space-y-3 text-sm">
        <p className="flex items-center gap-3 text-ink">
          <User className="h-4 w-4 text-plum" />
          {profile?.full_name || '—'}
        </p>
        <p className="flex items-center gap-3 text-ink" dir="ltr">
          <Phone className="h-4 w-4 text-plum" />
          {profile?.phone || '—'}
        </p>
        <p className="flex items-center gap-3 text-ink" dir="ltr">
          <Bell className="h-4 w-4 text-plum" />
          {profile?.email || '—'}
        </p>
        <p className="flex items-center gap-3 text-ink">
          <MapPin className="h-4 w-4 text-plum" />
          عضوة منذ {profile ? fmtDateAr(profile.created_at.slice(0, 10)) : '—'}
        </p>
      </div>
      <p className="mt-4 rounded-2xl bg-chip px-4 py-3 text-[11px] leading-5 text-smoke">
        لتعديل بياناتكِ تواصلي مع إدارة المعرض.
      </p>
    </div>
  )
}
