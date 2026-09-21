import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { BusinessSettings } from '@/lib/types'

const DEFAULT_SETTINGS: Partial<BusinessSettings> = {
  brand_name_ar: 'ريناد',
  brand_name_en: 'RENAD',
  tagline: 'إطلالتكِ التي تحلمين بها تبدأ من ريناد',
  working_hours: [],
}

interface SettingsContextValue {
  settings: BusinessSettings
  loading: boolean
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS as BusinessSettings,
  loading: true,
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS as BusinessSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('business_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data as BusinessSettings)
        setLoading(false)
      })
  }, [])

  return <SettingsContext.Provider value={{ settings, loading }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
