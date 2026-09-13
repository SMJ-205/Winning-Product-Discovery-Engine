import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Server-side only — SUPABASE_SERVICE_ROLE_KEY tidak pernah dikirim ke browser.
// Client dibuat dinamis dan aman dengan fallback ke anon key jika service role key belum diset.

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (_client) return _client

  if (supabaseUrl && serviceKey) {
    _client = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    })
    return _client
  }

  return createClient('https://placeholder.supabase.co', 'placeholder', {
    auth: { persistSession: false },
  })
}

export const supabase = getSupabase()
