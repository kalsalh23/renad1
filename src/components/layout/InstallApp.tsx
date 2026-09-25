import { useEffect, useState } from 'react'
import { Download, Share2, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'renad1_install_dismissed_at'
const DISMISS_DAYS = 7

/** بانر «ثبّتي تطبيق ريناد» — يفتح نافذة التثبيت الرسمية (PWA) */
export function InstallApp() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true,
    )
    setIsIOS(/iphone|ipad|ipod/i.test(window.navigator.userAgent))

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  useEffect(() => {
    if (isStandalone) return
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? 0)
    const dismissedRecently = Date.now() - dismissedAt < DISMISS_DAYS * 24 * 3600 * 1000
    const timer = setTimeout(() => {
      if (!dismissedRecently && (isIOS || deferred)) setShow(true)
    }, 6000)
    return () => clearTimeout(timer)
  }, [deferred, isIOS, isStandalone])

  if (isStandalone || !show) return null

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setShow(false)
  }

  const install = async () => {
    if (deferred) {
      await deferred.prompt()
      const { outcome } = await deferred.userChoice
      if (outcome === 'accepted') dismiss()
    }
  }

  return (
    <div className="fixed inset-x-4 bottom-24 z-[70]">
      <div className="relative overflow-hidden rounded-3xl bg-plum p-5 text-white shadow-2xl animate-fade-up">
        <button onClick={dismiss} className="absolute end-3 top-3 text-white/50 hover:text-white" aria-label="إغلاق">
          <X className="h-4 w-4" />
        </button>
        <p className="text-[10px] font-bold tracking-widest text-white/60">RENAD APP</p>
        <h3 className="mt-1.5 text-lg font-black">ثبّتي تطبيق ريناد على جهازكِ</h3>
        <p className="mt-1.5 text-xs leading-6 text-white/70">
          وصول أسرع للتشكيلة، حجز مواعيد بلمسة، ومفضلتكِ دائمًا معكِ.
        </p>
        {isIOS && !deferred ? (
          <p className="mt-3 flex items-start gap-2 rounded-2xl bg-white/10 px-3 py-2.5 text-[11px] leading-5">
            <Share2 className="mt-0.5 h-4 w-4 shrink-0" />
            على الآيفون: اضغطي زر المشاركة ثم «إضافة إلى الشاشة الرئيسية»
          </p>
        ) : null}
        <button onClick={install} className="mt-4 w-full rounded-full bg-white py-3 text-sm font-black text-plum shadow-lg">
          <Download className="me-1.5 inline h-4 w-4" />
          تثبيت التطبيق
        </button>
      </div>
    </div>
  )
}
