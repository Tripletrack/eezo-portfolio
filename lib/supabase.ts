import { createClient } from '@supabase/supabase-js'

export type Project = {
  id: number
  title: string
  category: string | null
  subtitle: string | null
  youtube_id: string
  thumbnail_url: string | null
  sort_order: number
  created_at: string
}

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url === 'your_supabase_url_here') return null
  return createClient(url, key)
}
