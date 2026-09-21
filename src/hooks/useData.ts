import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Appointment, BusinessSettings, Category, Dress, DressImage, Notification } from '@/lib/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setCategories((data as Category[]) ?? [])
        setLoading(false)
      })
  }, [])

  return { categories, loading }
}

export function useDresses() {
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('dresses')
      .select('*, category:categories(id, slug, name_ar, name_en)')
      .eq('is_active', true)
      .order('sort_order')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setDresses((data as unknown as Dress[]) ?? [])
        setLoading(false)
      })
  }, [])

  return { dresses, loading }
}

export function useDressBySlug(slug: string | undefined) {
  const [dress, setDress] = useState<Dress | null>(null)
  const [images, setImages] = useState<DressImage[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    ;(async () => {
      const { data, error } = await supabase
        .from('dresses')
        .select('*, category:categories(id, slug, name_ar, name_en)')
        .eq('slug', slug)
        .maybeSingle()
      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }
      const dressRow = data as unknown as Dress
      setDress(dressRow)
      const imgRes = await supabase.from('dress_images').select('*').eq('dress_id', dressRow.id).order('sort_order')
      setImages((imgRes.data as DressImage[]) ?? [])
      setLoading(false)
    })()
  }, [slug])

  return { dress, images, loading, notFound }
}

export function useRelatedDresses(dress: Dress | null, count = 4) {
  const [related, setRelated] = useState<Dress[]>([])
  useEffect(() => {
    if (!dress?.category_id) {
      setRelated([])
      return
    }
    supabase
      .from('dresses')
      .select('*, category:categories(id, slug, name_ar, name_en)')
      .eq('is_active', true)
      .eq('category_id', dress.category_id)
      .neq('id', dress.id)
      .limit(count)
      .then(({ data }) => setRelated((data as unknown as Dress[]) ?? []))
  }, [dress, count])
  return related
}

export function useMyAppointments(userId?: string | null) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) {
      setAppointments([])
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('appointments')
      .select('*, dress:dresses(code, name_ar, slug, cover_image)')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: false })
    setAppointments((data as unknown as Appointment[]) ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  return { appointments, loading, reload: load }
}

export function useMyNotifications(userId?: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)

  const load = useCallback(async () => {
    if (!userId) {
      setNotifications([])
      setUnread(0)
      return
    }
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('audience', 'customer')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    const rows = (data as Notification[]) ?? []
    setNotifications(rows)
    setUnread(rows.filter((n) => !n.is_read).length)
  }, [userId])

  useEffect(() => {
    load()
    const t = setInterval(load, 30_000)
    return () => clearInterval(t)
  }, [load])

  const markRead = useCallback(
    async (id: string) => {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id)
      load()
    },
    [load],
  )

  const markAllRead = useCallback(async () => {
    if (!userId) return
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('audience', 'customer')
      .eq('user_id', userId)
      .eq('is_read', false)
    load()
  }, [userId, load])

  return { notifications, unread, markRead, markAllRead }
}

export type { BusinessSettings }
