import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { useSEO } from '@/hooks/useSEO'
import { PageHeader } from '@/components/layout/Layout'
import { waLink } from '@/lib/utils'

export default function ContactPage() {
  const { settings } = useSettings()
  useSEO({ title: 'تواصل معنا', description: 'معلومات التواصل مع معرض ريناد.' })

  return (
    <div>
      <PageHeader title="تواصل معنا" />
      <div className="container-app space-y-4 pt-2">
        {settings.phone && (
          <a href={`tel:${settings.phone}`} className="card flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-chip text-plum">
              <Phone className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-smoke">الهاتف</p>
              <p className="text-sm font-extrabold text-ink" dir="ltr">{settings.phone}</p>
            </div>
          </a>
        )}

        {settings.whatsapp_number && (
          <a
            href={waLink(settings.whatsapp_number, 'مرحبًا، أود الاستفسار عن فساتين ريناد.')}
            target="_blank"
            rel="noreferrer"
            className="card flex items-center gap-4 p-5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/10 text-mint">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-smoke">واتساب</p>
              <p className="text-sm font-extrabold text-ink" dir="ltr">{settings.whatsapp_number}</p>
            </div>
          </a>
        )}

        {settings.email && (
          <a href={`mailto:${settings.email}`} className="card flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-chip text-plum">
              <Mail className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-smoke">البريد الإلكتروني</p>
              <p className="text-sm font-extrabold text-ink" dir="ltr">{settings.email}</p>
            </div>
          </a>
        )}

        {settings.address && (
          <div className="card flex items-start gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-chip text-plum">
              <MapPin className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-smoke">عنوان المعرض</p>
              <p className="text-sm font-extrabold leading-6 text-ink">{settings.address}</p>
              {settings.maps_url && (
                <a href={settings.maps_url} target="_blank" rel="noreferrer" className="btn-primary mt-3 !py-2 text-[11px]">
                  <Navigation className="h-3.5 w-3.5" />
                  احصلي على الاتجاهات
                </a>
              )}
            </div>
          </div>
        )}

        {(settings.instagram_url || settings.facebook_url) && (
          <div className="flex gap-4">
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="card flex flex-1 items-center gap-3 p-4">
                <Instagram className="h-5 w-5 text-plum" />
                <span className="text-xs font-extrabold text-ink">انستغرام</span>
              </a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="card flex flex-1 items-center gap-3 p-4">
                <Facebook className="h-5 w-5 text-plum" />
                <span className="text-xs font-extrabold text-ink">فيسبوك</span>
              </a>
            )}
          </div>
        )}

        {settings.working_hours?.length > 0 && (
          <div className="card p-5">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <Clock className="h-4 w-4 text-plum" />
              أوقات العمل
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {settings.working_hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between">
                  <span className="font-semibold text-ink">{h.day}</span>
                  <span className={h.closed ? 'text-xs text-smoke' : 'font-bold text-plum'}>
                    {h.closed ? 'مغلق' : `${h.open} — ${h.close}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
