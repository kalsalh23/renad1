import { Link } from 'react-router-dom'
import { CalendarHeart, Gem, HeartHandshake, Sparkles } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { useSEO } from '@/hooks/useSEO'
import { PageHeader } from '@/components/layout/Layout'

export default function AboutPage() {
  const { settings } = useSettings()
  useSEO({ title: 'من نحن', description: 'قصة معرض ريناد لفساتين الأعراس — رؤيتنا ورسالتنا.' })

  const pillars = [
    { icon: Gem, title: 'جودة الفساتين', body: 'نختار كل فستان بأقمشة فاخرة وتطريز متقن.' },
    { icon: Sparkles, title: 'تشكيلة مختارة', body: 'تنوّع مدروس بين الكلاسيكي والعصري، للإيجار والشراء.' },
    { icon: HeartHandshake, title: 'خدمة العميلات', body: 'استشارة شخصية ومتابعة كاملة حتى يوم العمر.' },
  ]

  return (
    <div>
      <PageHeader title="من نحن" />
      <div className="container-app pt-2">
        {/* بطاقة القصة */}
        <div className="card overflow-hidden !rounded-4xl">
          <div className="relative h-44 bg-plum sm:h-56">
            {settings.hero_image && (
              <img src={settings.hero_image} alt="" className="h-full w-full object-cover opacity-40" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-xs font-bold tracking-widest text-white/70">{settings.brand_name_en || 'RENAD'}</span>
              <h2 className="mt-1 text-xl font-black">{settings.tagline}</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm leading-8 text-smoke">
              {settings.about_body ||
                'بدأت ريناد من فكرة بسيطة: أن تجربة اختيار فستان الزفاف تستحق أن تكون لحظة لا تُنسى بقدر يوم العمر نفسه. اليوم نقدم تشكيلة منتقاة من فساتين الأعراس للإيجار والشراء، مع جلسة تجربة خاصة ترافقكِ فيها حتى تختاري بثقة.'}
            </p>
          </div>
        </div>

        {/* الركائز */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="card p-5 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-chip text-plum">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-extrabold text-ink">{p.title}</h3>
              <p className="mt-1.5 text-xs leading-6 text-smoke">{p.body}</p>
            </div>
          ))}
        </div>

        <Link to="/book" className="btn-gradient mt-6 w-full !py-3.5">
          <CalendarHeart className="h-4 w-4" />
          احجزي موعد تجربة
        </Link>
      </div>
    </div>
  )
}
