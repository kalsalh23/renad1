import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useCategories, useDresses } from '@/hooks/useData'
import { ProductCard } from '@/components/ProductCard'
import { EmptyState, SkeletonCard } from '@/components/ui/Common'
import { PageHeader } from '@/components/layout/Layout'
import { useSEO } from '@/hooks/useSEO'
import { cn } from '@/lib/utils'
import type { Dress } from '@/lib/types'

export default function DressesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { dresses, loading } = useDresses()
  const { categories } = useCategories()
  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [cat, setCat] = useState(searchParams.get('cat') ?? '')
  const [availOnly, setAvailOnly] = useState(searchParams.get('avail') === '1')
  const [mode, setMode] = useState<'' | 'rent' | 'sale'>((searchParams.get('mode') as 'rent' | 'sale') ?? '')
  const [sort, setSort] = useState('featured')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const activeCat = categories.find((c) => c.slug === cat)

  useSEO({
    title: activeCat ? activeCat.name_ar : 'الفساتين',
    description: 'تصفحي تشكيلة فساتين الأعراس في ريناد — تصفية حسب التصنيف والمقاس واللون والسعر.',
  })

  useEffect(() => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (cat) p.set('cat', cat)
    if (availOnly) p.set('avail', '1')
    if (mode) p.set('mode', mode)
    setSearchParams(p, { replace: true })
  }, [q, cat, availOnly, mode, setSearchParams])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    const arr = dresses.filter((d) => {
      if (query) {
        const hay = [d.code, d.name_ar, d.name_en, d.design_type, d.fabric, d.colors?.join(' ')].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(query)) return false
      }
      if (cat && d.category?.slug !== cat) return false
      if (availOnly && d.status !== 'available') return false
      if (mode === 'rent' && d.availability === 'sale') return false
      if (mode === 'sale' && d.availability === 'rent') return false
      return true
    })
    if (sort === 'price_asc') arr.sort((a, b) => (a.sale_price ?? a.rent_price ?? 1e9) - (b.sale_price ?? b.rent_price ?? 1e9))
    else if (sort === 'price_desc') arr.sort((a, b) => (b.sale_price ?? b.rent_price ?? 0) - (a.sale_price ?? a.rent_price ?? 0))
    else if (sort === 'newest') arr.sort((a, b) => b.created_at.localeCompare(a.created_at))
    else arr.sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
    return arr
  }, [dresses, q, cat, availOnly, mode, sort])

  const activeCount = (cat ? 1 : 0) + (availOnly ? 1 : 0) + (mode ? 1 : 0)

  return (
    <div>
      <PageHeader title={activeCat ? activeCat.name_ar : 'كل الفساتين'} subtitle={`${filtered.length} فستان`} />

      {/* البحث + التصفية */}
      <div className="container-app sticky top-16 z-30 -mx-0 bg-lilac/95 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-[0_4px_24px_rgba(74,31,82,0.07)]">
            <Search className="h-4.5 w-4.5 h-[18px] w-[18px] shrink-0 text-smoke" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="كود أو اسم الفستان..."
              className="w-full bg-transparent text-sm focus:outline-none"
              aria-label="بحث"
            />
          </form>
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            className={cn('relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm', drawerOpen || activeCount ? 'bg-plum text-white' : 'bg-white text-ink')}
            aria-label="التصفية"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {activeCount > 0 && !drawerOpen && (
              <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose text-[10px] font-bold text-white">{activeCount}</span>
            )}
          </button>
        </div>

        {/* رقائق التصفية */}
        {drawerOpen && (
          <div className="card mt-3 animate-fade-up p-4 !rounded-3xl">
            <div className="space-y-4">
              <div>
                <p className="field-label">التصنيف</p>
                <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  <button className={cn('chip shrink-0', !cat && 'chip-active')} onClick={() => setCat('')}>الكل</button>
                  {categories.map((c) => (
                    <button key={c.id} className={cn('chip shrink-0', cat === c.slug && 'chip-active')} onClick={() => setCat(cat === c.slug ? '' : c.slug)}>
                      {c.name_ar}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="field-label">نوع الاستفادة</p>
                <div className="flex gap-2">
                  {([['', 'الكل'], ['rent', 'للإيجار'], ['sale', 'للبيع']] as const).map(([v, l]) => (
                    <button key={v} className={cn('chip', mode === v && 'chip-active')} onClick={() => setMode(v as '' | 'rent' | 'sale')}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
                  <input type="checkbox" checked={availOnly} onChange={(e) => setAvailOnly(e.target.checked)} className="h-4 w-4 accent-[#4A1F52]" />
                  متوفر الآن فقط
                </label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="field !w-auto !rounded-full !py-2 text-xs" aria-label="الترتيب">
                  <option value="featured">المميزة أولًا</option>
                  <option value="newest">الأحدث</option>
                  <option value="price_asc">السعر: الأقل</option>
                  <option value="price_desc">السعر: الأعلى</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* الشبكة */}
      <div className="container-app pt-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {filtered.map((dress: Dress, i: number) => (
              <ProductCard key={dress.id} dress={dress} priority={i < 4} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="لا توجد فساتين مطابقة"
            subtitle="جرّبي تعديل عوامل التصفية أو تصفحي تشكيلتنا كاملة."
          />
        )}
      </div>
    </div>
  )
}
