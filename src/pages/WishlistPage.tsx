import { Link } from 'react-router-dom'
import { CalendarHeart, Heart } from 'lucide-react'
import { useDresses } from '@/hooks/useData'
import { useFavorites } from '@/context/FavoritesContext'
import { ProductCard } from '@/components/ProductCard'
import { EmptyState, SkeletonCard } from '@/components/ui/Common'
import { PageHeader } from '@/components/layout/Layout'
import { useSEO } from '@/hooks/useSEO'

export default function WishlistPage() {
  useSEO({ title: 'المفضلة' })
  const { dresses, loading } = useDresses()
  const { ids } = useFavorites()
  const list = dresses.filter((d) => ids.includes(d.id))

  return (
    <div>
      <PageHeader title="المفضلة" subtitle={`${list.length} فستان محفوظ`} />
      <div className="container-app pt-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : list.length ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {list.map((d) => (
              <ProductCard key={d.id} dress={d} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="h-8 w-8" />}
            title="مفضلتكِ فارغة"
            subtitle="اضغطي على القلب في أي فستان ليُحفظ هنا."
            action={
              <Link to="/dresses" className="btn-primary mt-2 text-xs">
                تصفحي الفساتين
              </Link>
            }
          />
        )}
      </div>
    </div>
  )
}
