import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CalendarHeart, CheckCircle2, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'
import { useToast } from '@/context/ToastContext'
import { useDresses } from '@/hooks/useData'
import { useSEO } from '@/hooks/useSEO'
import { isValidPhone, timeSlots, todayISO, waLink, weekDayIndex } from '@/lib/utils'
import { PageHeader } from '@/components/layout/Layout'
import type { WorkingHour } from '@/lib/types'

export default function BookPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { settings } = useSettings()
  const { toast } = useToast()
  const { dresses } = useDresses()
  useSEO({ title: 'احجزي موعد تجربة' })

  const prefillDress = dresses.find((d) => d.slug === params.get('dress'))

  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    dress_id: '',
    appointment_date: '',
    appointment_time: '',
    companions: '0',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<{ date: string; time: string; code: string | null } | null>(null)

  useEffect(() => {
    if (profile) {
      setForm((f) => ({
        ...f,
        customer_name: f.customer_name || profile.full_name || '',
        phone: f.phone || profile.phone || '',
      }))
    }
  }, [profile])

  useEffect(() => {
    if (prefillDress) setForm((f) => ({ ...f, dress_id: prefillDress.id }))
  }, [prefillDress])

  const hours: WorkingHour[] = settings.working_hours ?? []
  const dayIndex = form.appointment_date ? weekDayIndex(new Date(`${form.appointment_date}T00:00:00`).getDay()) : -1
  const dayHours = dayIndex >= 0 ? hours[dayIndex] : undefined
  const isBlocked = form.appointment_date ? ((settings as { blocked_dates?: string[] }).blocked_dates ?? []).includes(form.appointment_date) : false
  const slots = useMemo(
    () => (dayHours && !dayHours.closed && !isBlocked ? timeSlots(dayHours.open, dayHours.close) : []),
    [dayHours, isBlocked],
  )

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name.trim() || !isValidPhone(form.phone)) {
      toast('error', 'يرجى إدخال الاسم ورقم هاتف صحيح.')
      return
    }
    if (!form.appointment_date || !form.appointment_time) {
      toast('error', 'يرجى اختيار تاريخ ووقت التجربة.')
      return
    }
    setSubmitting(true)
    const chosen = dresses.find((d) => d.id === form.dress_id)
    const { error } = await supabase.from('appointments').insert({
      user_id: user?.id ?? null,
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim(),
      dress_id: form.dress_id || null,
      dress_code: chosen?.code ?? null,
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      companions: Number(form.companions) || 0,
      notes: form.notes.trim() || null,
    })
    setSubmitting(false)
    if (error) {
      toast('error', 'تعذّر إرسال الطلب — تحققي من البيانات وحاولي مجددًا.')
      return
    }
    setDone({ date: form.appointment_date, time: form.appointment_time, code: chosen?.code ?? null })
    window.scrollTo({ top: 0 })
  }

  if (done) {
    return (
      <div className="container-app flex min-h-[70vh] items-center justify-center py-10">
        <div className="card w-full max-w-md p-8 text-center !rounded-4xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint/10">
            <CheckCircle2 className="h-10 w-10 text-mint" />
          </div>
          <h1 className="mt-4 text-xl font-black text-ink">تم إرسال طلب حجزكِ</h1>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-smoke">
            شكرًا {form.customer_name}! استلمنا طلب موعد بتاريخ <b className="text-ink">{done.date}</b> الساعة{' '}
            <b className="text-ink">{done.time}</b>
            {done.code && <> للفستان <b className="text-plum">{done.code}</b></>}، وسنعلمكِ بالتأكيد قريبًا.
          </p>
          <p className="mt-2 text-[11px] text-smoke">ستجدين الحجز في «حجوزاتي» مع إشعارات حالته ونقاط الولاء بعد التأكيد.</p>
          <div className="mt-6 space-y-3">
            {settings.whatsapp_number && (
              <a
                href={waLink(settings.whatsapp_number, `مرحبًا، أرسلت طلب حجز تجربة بتاريخ ${done.date} الساعة ${done.time}.`)}
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full !border-mint/40 !text-mint"
              >
                <MessageCircle className="h-4 w-4" />
                تأكيد أسرع عبر واتساب
              </a>
            )}
            <button onClick={() => navigate('/account?tab=bookings')} className="btn-primary w-full">
              حجوزاتي
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="احجزي موعد تجربة" subtitle="اخترا التاريخ والوقت المناسبين لكِ" />
      <div className="container-app pt-2">
        {prefillDress && (
          <Link to={`/dresses/${prefillDress.slug}`} className="card mb-4 flex items-center gap-4 p-4">
            {prefillDress.cover_image && <img src={prefillDress.cover_image} alt="" className="h-20 w-16 rounded-2xl object-cover" />}
            <div>
              <p className="text-[11px] font-bold text-plum">{prefillDress.code}</p>
              <p className="text-sm font-extrabold text-ink">{prefillDress.name_ar || prefillDress.category?.name_ar}</p>
              <p className="mt-0.5 text-[11px] text-smoke">عرض تفاصيل الفستان ←</p>
            </div>
          </Link>
        )}

        <form onSubmit={submit} className="card space-y-5 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="bk-name">الاسم <span className="text-rose">*</span></label>
              <input id="bk-name" required className="field" value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="اسمكِ الكامل" />
            </div>
            <div>
              <label className="field-label" htmlFor="bk-phone">رقم الهاتف <span className="text-rose">*</span></label>
              <input id="bk-phone" required dir="ltr" className="field text-right" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09xx xxx xxx" />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="bk-dress">الفستان المطلوب</label>
            <select id="bk-dress" className="field" value={form.dress_id} onChange={(e) => setForm({ ...form, dress_id: e.target.value })}>
              <option value="">— سأختار في المعرض —</option>
              {dresses.filter((d) => d.status === 'available' || d.status === 'reserved').map((d) => (
                <option key={d.id} value={d.id}>{d.code} — {d.name_ar || d.category?.name_ar}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="bk-date">تاريخ التجربة <span className="text-rose">*</span></label>
              <input id="bk-date" type="date" required min={todayISO()} className="field" value={form.appointment_date}
                onChange={(e) => setForm({ ...form, appointment_date: e.target.value, appointment_time: '' })} />
            </div>
            <div>
              <label className="field-label" htmlFor="bk-time">الوقت <span className="text-rose">*</span></label>
              <select id="bk-time" required className="field" value={form.appointment_time}
                onChange={(e) => setForm({ ...form, appointment_time: e.target.value })} disabled={!form.appointment_date}>
                <option value="">{!form.appointment_date ? 'اختاري التاريخ أولًا' : slots.length ? 'اختاري الوقت' : 'لا مواعيد هذا اليوم'}</option>
                {slots.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {form.appointment_date && (isBlocked || dayHours?.closed) && (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">
              {isBlocked ? 'هذا التاريخ غير متاح للحجز — اختاري تاريخًا آخر.' : 'المعرض مغلق هذا اليوم — اختاري يومًا آخر.'}
            </p>
          )}

          <div>
            <label className="field-label" htmlFor="bk-comp">عدد المرافقات</label>
            <select id="bk-comp" className="field" value={form.companions} onChange={(e) => setForm({ ...form, companions: e.target.value })}>
              {Array.from({ length: 7 }).map((_, i) => (
                <option key={i} value={i}>{i === 0 ? 'بدون مرافقات' : `${i} ${i === 1 ? 'مرافقة' : 'مرافقات'}`}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="bk-notes">ملاحظات (اختياري)</label>
            <textarea id="bk-notes" className="field min-h-[100px] resize-y" value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="مثال: أبحث عن فستان زفاف بقصّة أميرة..." />
          </div>

          <button type="submit" disabled={submitting} className="btn-gradient w-full !py-4">
            <CalendarHeart className="h-5 w-5" />
            {submitting ? 'جارٍ الإرسال...' : 'إرسال طلب الحجز'}
          </button>
          <p className="text-center text-[11px] leading-5 text-smoke">
            بإرسالكِ الطلب ستتواصل معكِ إدارة المعرض لتأكيد الموعد، وسيظهر الحجز تلقائيًا
            في <Link to="/account?tab=bookings" className="font-bold text-plum">حجوزاتي</Link>.
          </p>
        </form>
      </div>
    </div>
  )
}
