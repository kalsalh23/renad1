import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info'
interface ToastItem {
  id: number
  type: ToastType
  message: string
}

const ToastContext = createContext<{ toast: (type: ToastType, message: string) => void }>({
  toast: () => {},
})

let counter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((type: ToastType, message: string) => {
    const id = ++counter
    setItems((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 4200)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 z-[100] flex w-[92vw] max-w-sm -translate-x-1/2 flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`animate-fade-up rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl ${
              t.type === 'success'
                ? 'bg-mint text-white'
                : t.type === 'error'
                  ? 'bg-rose text-white'
                  : 'bg-ink text-white'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
