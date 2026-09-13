import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Server-side only — SUPABASE_SERVICE_ROLE_KEY tidak pernah dikirim ke browser.
// Client dibuat lazy agar build Next.js tidak gagal tanpa env vars.

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'

  _client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  return _client
}

// Convenience export — gunakan getSupabase() di API Routes agar selalu fresh
export const supabase = getSupabase()
