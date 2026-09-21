import type { ReactNode } from 'react'

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-2 ${className}`}>
      <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-plum/20 border-t-plum" />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="" />
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden !rounded-3xl">
      <div className="skeleton aspect-[3/4] w-full !rounded-none" />
      <div className="space-y-2 p-3">
        <div className="skeleton h-3 w-1/2 !rounded-full" />
        <div className="skeleton h-3 w-1/3 !rounded-full" />
      </div>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon?: ReactNode
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-chip text-plum">{icon}</div>
      )}
      <h3 className="text-lg font-extrabold text-ink">{title}</h3>
      {subtitle && <p className="max-w-xs text-sm leading-7 text-smoke">{subtitle}</p>}
      {action}
    </div>
  )
}

export function SectionRow({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      {action}
    </div>
  )
}

export function Stars({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-star ${className}`} aria-hidden>
      ★★★★★
    </span>
  )
}
