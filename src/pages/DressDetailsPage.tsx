import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CalendarHeart, ChevronRight, Heart, Images, MessageCircle, Ruler, ShieldCheck } from 'lucide-react'
import { useDressBySlug, useRelatedDresses } from '@/hooks/useData'
import { useSettings } from '@/context/SettingsContext'
import { useFavorites } from '@/context/FavoritesContext'
import { PageLoader, Stars } from '@/components/ui/Common'
import { Lightbox } from '@/components/Lightbox'
import { ProductCard } from '@/components/ProductCard'
import { AVAILABILITY_META, DRESS_STATUS_META } from '@/lib/constants'
import { cn, waLink } from '@/lib/utils'
import { useSEO } from '@/hooks/useSEO'

export default function DressDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const { dress, images, loading, notFound } = useDressBySlug(slug)
  const related = useRelatedDresses(dress)
  const { settings } = useSettings()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useSEO({
    title: dress ? `فستان ${dress.code}` : undefined,
    description: dress ? `فستان ${dress.category?.name_ar ?? ''} ${dress.code} من ريناد — ${AVAILABILITY_META[dress.availability]}.` : undefined,
    image: dress?.cover_image ?? undefined,
  })

  if (loading) return <PageLoader />
  if (notFound || !dress) return <Navigate to="/dresses" replace />

  const statusMeta = DRESS_STATUS_META[dress.status]
  const bookable = dress.status === 'available' || dress.status === 'reserved'
  const fav = isFavorite(dress.id)
  const galleryUrls = images.map((i) => i.url)
  const mainImage = galleryUrls[current] ?? dress.cover_image ?? galleryUrls[0]

  return (
    <div className="container-app pb-8 pt-4">
      {/* الصورة الرئيسية */}
      <div className="relative overflow-hidden rounded-4xl bg-chip">
        <button
          onClick={() => galleryUrls.length > 0 && setLightboxOpen(true)}
          className="block aspect-[4/5] w-full sm:aspect-[16/10]"
          aria-label="تكبير الصورة"
        >
          <img
            key={mainImage}
            src={mainImage ?? ''}
            alt={`فستان ${dress.code}`}
            className="h-full w-full animate-fade-in object-cover"
          />
        </button>
        <button
          onClick={() => toggleFavorite(dress.id)}
          className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-transform hover:scale-110"
          aria-label={fav ? 'إزالة من المفضلة' : 'أضيفي إلى المفضلة'}
        >
          <Heart className={cn('h-5 w-5', fav ? 'fill-rose text-rose animate-pop' : 'text-smoke')} />
        </button>
      </div>

      {/* المصغرات */}
      {images.length > 1 && (
        <>
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setCurrent(i)}
                className={cn(
                  'relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl border-[3px] transition-all',
                  galleryUrls[current] === img.url ? 'border-plum' : 'border-transparent opacity-60',
                )}
                aria-label={`صورة ${i + 1}`}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-smoke">
            <Images className="h-3.5 w-3.5" />
            {images.length} زوايا لنفس الفستان — اضغطي الصورة للتكبير
          </p>
        </>
      )}

      {/* المعلومات */}
      <div className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-wide text-plum">{dress.code} · {dress.category?.name_ar}</p>
            <h1 className="mt-1 text-2xl font-black leading-snug text-ink">{dress.name_ar || dress.category?.name_ar}</h1>
          </div>
          <span className={cn('shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold', statusMeta.pill)}>{statusMeta.label}</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Stars className="text-sm" />
          <span className="text-lg font-black text-plum">***</span>
          <span className="text-xs text-smoke">السعر عند الاستفسار · {AVAILABILITY_META[dress.availability]}</span>
        </div>

        {dress.description && <p className="mt-4 text-sm leading-8 text-smoke">{dress.description}</p>}

        {/* المقاسات */}
        {(dress.sizes ?? []).length > 0 && (
          <div className="mt-5">
            <p className="field-label">المقاسات المتوفرة</p>
            <div className="flex flex-wrap gap-2">
              {dress.sizes.map((s) => (
                <span key={s} className="chip !cursor-default font-black">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* الألوان */}
        {(dress.colors ?? []).length > 0 && (
          <div className="mt-4">
            <p className="field-label">الألوان</p>
            <div className="flex flex-wrap gap-2">
              {dress.colors.map((c) => (
                <span key={c} className="chip !cursor-default">{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* مواصفات */}
        <div className="card mt-5 grid grid-cols-2 gap-4 p-5 text-sm">
          {dress.fabric && (
            <div>
              <p className="text-[11px] font-bold text-smoke">نوع القماش</p>
              <p className="mt-0.5 font-bold text-ink">{dress.fabric}</p>
            </div>
          )}
          {dress.design_type && (
            <div>
              <p className="text-[11px] font-bold text-smoke">نوع التصميم</p>
              <p className="mt-0.5 font-bold text-ink">{dress.design_type}</p>
            </div>
          )}
          <div>
            <p className="text-[11px] font-bold text-smoke">الصور</p>
            <p className="mt-0.5 flex items-center gap-1 font-bold text-ink">
              <Images className="h-4 w-4 text-plum" />
              {images.length > 0 ? `${images.length} زوايا` : '—'}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-smoke">الإيجار / الشراء</p>
            <p className="mt-0.5 font-bold text-ink">{AVAILABILITY_META[dress.availability]}</p>
          </div>
        </div>

        {/* الأزرار */}
        <div className="mt-6 space-y-3">
          {bookable ? (
            <Link to={`/book?dress=${dress.slug}`} className="btn-gradient w-full !py-4">
              <CalendarHeart className="h-5 w-5" />
              احجزي موعد تجربة
            </Link>
          ) : (
            <button disabled className="btn-primary w-full !py-4">
              {statusMeta.label} — لا يمكن الحجز حاليًا
            </button>
          )}
          {settings.whatsapp_number && (
            <a
              href={waLink(settings.whatsapp_number, `مرحبًا، أود الاستفسار عن الفستان ${dress.code}.`)}
              target="_blank"
              rel="noreferrer"
              className="btn-outline w-full !border-mint/40 !text-mint hover:!border-mint"
            >
              <MessageCircle className="h-5 w-5" />
              اسألي عن الفستان عبر واتساب
            </a>
          )}
        </div>

        <ul className="mt-5 space-y-2.5 text-xs text-smoke">
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-plum" />
            تجربة داخل المعرض مع استشارية متخصصة
          </li>
          <li className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-plum" />
            تعديل المقاس متوفر حسب التصميم
          </li>
        </ul>
      </div>

      {/* مشابهة */}
      {related.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink">قد يعجبكِ أيضًا</h2>
            <Link to="/dresses" className="flex items-center gap-1 text-xs font-bold text-plum">
              الكل
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:px-0">
            {related.map((d) => (
              <div key={d.id} className="w-44 shrink-0 lg:w-auto">
                <ProductCard dress={d} />
              </div>
            ))}
          </div>
        </section>
      )}

      {lightboxOpen && galleryUrls.length > 0 && (
        <Lightbox
          images={galleryUrls}
          index={Math.max(0, Math.min(current, galleryUrls.length - 1))}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setCurrent}
          alt={`فستان ${dress.code}`}
        />
      )}
    </div>
  )
}
