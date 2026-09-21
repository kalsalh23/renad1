import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useCategories } from '@/hooks/useData'
import { PageHeader } from '@/components/layout/Layout'
import { useSEO } from '@/hooks/useSEO'

export default function CategoriesPage() {
  useSEO({ title: 'التصنيفات' })
  const { categories, loading } = useCategories()

  return (
    <div>
      <PageHeader title="التصنيفات" subtitle="اختاري الطابع الذي يشبهكِ" />
      <div className="container-app grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton aspect-[4/5] w-full" />)
          : categories.map((c) => (
              <Link key={c.id} to={`/dresses?cat=${c.slug}`} className="card group relative overflow-hidden !rounded-4xl">
                <div className="aspect-[4/5] overflow-hidden bg-chip">
                  {c.image_url ? (
                    <img
                      src={c.image_url}
                      alt={`تصنيف ${c.name_ar}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-plum"><Sparkles className="h-8 w-8" /></div>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum-dark/85 to-transparent p-4 pt-10 text-center">
                  <h3 className="text-sm font-black text-white">{c.name_ar}</h3>
                  {c.name_en && <p className="text-[10px] font-bold tracking-wide text-white/70">{c.name_en}</p>}
                </div>
              </Link>
            ))}
      </div>
    </div>
  )
}
