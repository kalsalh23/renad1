import { Link } from 'react-router-dom'
import { CalendarHeart, ChevronLeft, Sparkles } from 'lucide-react'
import { useCategories, useDresses } from '@/hooks/useData'
import { useSettings } from '@/context/SettingsContext'
import { ProductGrid } from '@/components/ProductCard'
import { SectionRow, SkeletonCard } from '@/components/ui/Common'
import { useSEO } from '@/hooks/useSEO'
import { cn } from '@/lib/utils'

export default function HomePage() {
  useSEO({
    description: 'اكتشفي تشكيلة ريناد من فساتين الأعراس للإيجار والشراء، واحجزي موعد تجربتك في المعرض.',
  })
  const { categories, loading: catLoading } = useCategories()
  const { dresses, loading } = useDresses()
  const { settings } = useSettings()

  const featured = dresses.filter((d) => d.is_featured).slice(0, 8)
  const offers = dresses.filter((d) => (d.discount_percent ?? 0) > 0 && d.status === 'available').slice(0, 4)

  return (
    <div className="container-app pt-4">
      {/* بانر العروض/الهيرو */}
      <Link to="/book" className="group relative block overflow-hidden rounded-4xl shadow-lg shadow-plum/10">
        <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
          {settings.hero_image ? (
            <img
              src={settings.hero_image}
              alt="تشكيلة ريناد"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-plum-light to-plum" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/80 via-plum-dark/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-[11px] font-bold tracking-wide text-white/80">{settings.brand_name_en || 'RENAD'} · BRIDAL</p>
            <h2 className="mt-1 text-xl font-black leading-snug sm:text-2xl">
              {settings.hero_title || 'إطلالتكِ التي تحلمين بها تبدأ من ريناد'}
            </h2>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-black text-plum shadow-lg transition-transform group-hover:-translate-y-0.5">
              <CalendarHeart className="h-4 w-4" />
              احجزي موعد تجربتك
            </span>
          </div>
        </div>
      </Link>

      {/* التصنيفات — دوائر أفقية */}
      <section className="mt-8">
        <SectionRow
          title="التصنيفات"
          action={
            <Link to="/categories" className="flex items-center gap-1 text-xs font-bold text-plum">
              الكل
              <ChevronLeft className="h-4 w-4" />
            </Link>
          }
        />
        <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-7">
          {(catLoading ? Array.from({ length: 4 }) : categories.slice(0, 7)).map((cat, i) => {
            const c = cat as (typeof categories)[number] | undefined
            return c ? (
              <Link key={c.id} to={`/dresses?cat=${c.slug}`} className="flex w-20 shrink-0 flex-col items-center gap-2">
                <span className={cn('block h-20 w-20 overflow-hidden rounded-full border-[3px] bg-chip', i === 0 ? 'border-plum' : 'border-white shadow-md')}>
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name_ar} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-plum"><Sparkles className="h-6 w-6" /></span>
                  )}
                </span>
                <span className="text-center text-[11px] font-bold leading-tight text-ink">{c.name_ar}</span>
              </Link>
            ) : (
              <div key={i} className="w-20 shrink-0">
                <div className="skeleton h-20 w-20 !rounded-full" />
                <div className="skeleton mx-auto mt-2 h-3 w-12 !rounded-full" />
              </div>
            )
          })}
        </div>
      </section>

      {/* الأكثر رواجًا */}
      <section className="mt-8">
        <SectionRow
          title="الأكثر رواجًا"
          action={
            <Link to="/dresses" className="flex items-center gap-1 text-xs font-bold text-plum">
              كل الفساتين
              <ChevronLeft className="h-4 w-4" />
            </Link>
          }
        />
        <ProductGrid dresses={featured} loading={loading} count={4} />
      </section>

      {/* العروض */}
      {offers.length > 0 && (
        <section className="mt-10">
          <SectionRow title="عروض خاصة" />
          <ProductGrid dresses={offers} loading={loading} count={4} />
        </section>
      )}

      {/* دعوة الحجز */}
      <section className="mt-10">
        <div className="relative overflow-hidden rounded-4xl bg-plum p-7 text-center text-white">
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(ellipse_at_top,#B98CC7,transparent_60%)]" />
          <div className="relative z-10">
            <h3 className="text-lg font-black">جلسة تجربة خاصة تنتظركِ</h3>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-white/80">
              احجزي موعدكِ في المعرض واستشارية متخصصة ترافقكِ لاختيار فستان أحلامكِ.
            </p>
            <Link to="/book" className="btn-gradient mt-5 !py-2.5 text-xs">
              احجزي الآن
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
