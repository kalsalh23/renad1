export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function fmtDateAr(dateStr: string, opts: Intl.DateTimeFormatOptions = {}): string {
  try {
    const d = new Date(`${dateStr}T00:00:00`)
    return new Intl.DateTimeFormat('ar-u-nu-latn', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...opts,
    }).format(d)
  } catch {
    return dateStr
  }
}

export function fmtDateTimeAr(iso: string): string {
  try {
    return new Intl.DateTimeFormat('ar-u-nu-latn', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function weekDayIndex(jsDay: number): number {
  return (jsDay + 1) % 7
}

export function waLink(number: string | null | undefined, text: string): string {
  const digits = (number ?? '').replace(/[^\d]/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export function timeSlots(open?: string, close?: string, stepMinutes = 30): string[] {
  if (!open || !close) return []
  const [oh, om] = open.split(':').map(Number)
  const [ch, cm] = close.split(':').map(Number)
  const start = oh * 60 + om
  const end = ch * 60 + cm
  const slots: string[] = []
  for (let t = start; t <= end - 30; t += stepMinutes) {
    const h = String(Math.floor(t / 60)).padStart(2, '0')
    const m = String(t % 60).padStart(2, '0')
    slots.push(`${h}:${m}`)
  }
  return slots
}

export function todayISO(): string {
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

export function isValidPhone(phone: string): boolean {
  return /^[+\d][\d\s-]{6,17}$/.test(phone.trim())
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}
