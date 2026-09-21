import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import type { Dress } from '@/lib/types'
import { AVAILABILITY_META, DRESS_STATUS_META } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/context/FavoritesContext'
import { Stars } from '@/components/ui/Common'

/** بطاقة فستان بنمط التطبيق: صورة + قلب + اسم + إشارة السعر */
export function ProductCard({ dress, priority = false }: { dress: Dress; priority?: boolean }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(dress.id)
  const unavailable = dress.status === 'sold' || dress.status === 'unavailable'
  const hasDiscount = (dress.discount_percent ?? 0) > 0

  return (
    <div className="card group relative overflow-hidden !rounded-3xl">
      <Link to={`/dresses/${dress.slug}`} className="block" aria-label={`فستان ${dress.code}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-chip">
          {dress.cover_image ? (
            <img
              src={dress.cover_image}
              alt={`فستان ${dress.code} - ${dress.category?.name_ar ?? 'فساتين أعراس'}`}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              className={cn(
                'h-full w-full object-cover transition-transform duration-700 group-hover:scale-105',
                unavailable && 'opacity-70 saturate-50',
              )}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl font-black text-plum/30">{dress.code}</div>
          )}

          {dress.status !== 'available' && (
            <span className={cn('absolute start-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold', DRESS_STATUS_META[dress.status].pill)}>
              {DRESS_STATUS_META[dress.status].label}
            </span>
          )}
          {hasDiscount && dress.status === 'available' && (
            <span className="absolute start-2.5 top-2.5 rounded-full bg-plum px-2.5 py-1 text-[10px] font-bold text-white">
              عرض {dress.discount_percent}%
            </span>
          )}
        </div>

        <div className="p-3 text-center">
          <h3 className="truncate text-sm font-extrabold text-ink">{dress.name_ar || dress.category?.name_ar || dress.code}</h3>
          <p className="mt-0.5 text-[11px] text-smoke">{AVAILABILITY_META[dress.availability]}</p>
          <div className="mt-1.5 flex items-center justify-center gap-1.5">
            <Stars className="text-[11px]" />
            <span className="text-sm font-black text-plum">***</span>
          </div>
        </div>
      </Link>

      <button
        onClick={() => toggleFavorite(dress.id)}
        className={cn(
          'absolute end-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-all hover:scale-110',
        )}
        aria-label={fav ? 'إزالة من المفضلة' : 'أضيفي إلى المفضلة'}
        aria-pressed={fav}
      >
        <Heart className={cn('h-4 w-4 transition-colors', fav ? 'fill-rose text-rose animate-pop' : 'text-smoke')} />
      </button>
    </div>
  )
}

export function ProductGrid({ dresses, loading, count = 6 }: { dresses: Dress[]; loading?: boolean; count?: number }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCardMini key={i} />
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {dresses.map((dress, i) => (
        <ProductCard key={dress.id} dress={dress} priority={i < 4} />
      ))}
    </div>
  )
}

function SkeletonCardMini() {
  return (
    <div className="card overflow-hidden !rounded-3xl">
      <div className="skeleton aspect-[3/4] w-full !rounded-none" />
      <div className="space-y-2 p-3">
        <div className="skeleton h-3 w-2/3 !rounded-full" />
        <div className="skeleton h-3 w-1/3 !rounded-full" />
      </div>
    </div>
  )
}
