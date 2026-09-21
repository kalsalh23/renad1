import type { AppointmentStatus, Availability, DressStatus } from './types'

export const BRAND = {
  nameAr: 'ريناد',
  nameEn: 'RENAD',
}

export const DRESS_STATUS_META: Record<DressStatus, { label: string; pill: string }> = {
  available: { label: 'متوفر', pill: 'bg-mint/10 text-mint' },
  reserved: { label: 'محجوز', pill: 'bg-amber-100 text-amber-700' },
  rented: { label: 'مؤجر', pill: 'bg-sky-100 text-sky-700' },
  unavailable: { label: 'غير متوفر', pill: 'bg-smoke/10 text-smoke' },
  sold: { label: 'مباع', pill: 'bg-rose/10 text-rose' },
}

export const APPOINTMENT_STATUS_META: Record<AppointmentStatus, { label: string; pill: string; order: number }> = {
  pending: { label: 'بانتظار التأكيد', pill: 'bg-amber-100 text-amber-700', order: 1 },
  confirmed: { label: 'مؤكد', pill: 'bg-mint/10 text-mint', order: 2 },
  completed: { label: 'مكتمل', pill: 'bg-sky-100 text-sky-700', order: 3 },
  cancelled: { label: 'ملغي', pill: 'bg-rose/10 text-rose', order: 0 },
  rescheduled: { label: 'مُعدّل الموعد', pill: 'bg-indigo-100 text-indigo-600', order: 2 },
}

export const AVAILABILITY_META: Record<Availability, string> = {
  sale: 'للبيع',
  rent: 'للإيجار',
  both: 'للإيجار والشراء',
}

export const NAV_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/dresses', label: 'الفساتين' },
  { to: '/categories', label: 'التصنيفات' },
  { to: '/about', label: 'من نحن' },
  { to: '/contact', label: 'تواصل معنا' },
]
