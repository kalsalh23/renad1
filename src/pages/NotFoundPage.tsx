import { Link } from 'react-router-dom'
import { useSEO } from '@/hooks/useSEO'

export default function NotFoundPage() {
  useSEO({ title: 'الصفحة غير موجودة' })
  return (
    <div className="container-app flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="text-5xl font-black text-plum/20">404</span>
      <h1 className="mt-2 text-xl font-black text-ink">هذه الصفحة غير موجودة</h1>
      <p className="mt-2 max-w-xs text-xs leading-6 text-smoke">
        ربما انتقلت الصفحة أو تغيّر رابطها — تصفحي تشكيلتنا واختاري فستانكِ.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="btn-primary text-xs">الرئيسية</Link>
        <Link to="/dresses" className="btn-soft text-xs">الفساتين</Link>
      </div>
    </div>
  )
}
