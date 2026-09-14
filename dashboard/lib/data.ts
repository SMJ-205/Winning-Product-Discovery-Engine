import { getSupabase } from './supabase'

// In-memory session cache untuk menghemat kuota Supabase Free Tier
// dan mempercepat response time perpindahan tab (0ms)
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 menit per sesi

type CacheEntry<T> = {
  data: T
  timestamp: number
}

const memoryCache = new Map<string, CacheEntry<any>>()

function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    memoryCache.delete(key)
    return null
  }
  return entry.data
}

function setCache<T>(key: string, data: T): void {
  memoryCache.set(key, { data, timestamp: Date.now() })
}

export function clearDataCache(): void {
  memoryCache.clear()
}

export async function getMarketData() {
  const cached = getCached<any[]>('market_data')
  if (cached) {
    return cached
  }

  const supabase = getSupabase()
  
  const { data, error } = await supabase
    .from('vw_subcategory_features')
    .select('*')
    .order('monthly_sold_units', { ascending: false })

  if (error) {
    console.error('Error fetching vw_subcategory_features:', error)
    return []
  }

  // Ambil WPS terbaru per keyword dari fact_sourcing_opportunity
  const { data: scores, error: scoresError } = await supabase
    .from('fact_sourcing_opportunity')
    .select('keyword_id, winning_product_score, sourcing_recommendation, scored_at')
    .order('scored_at', { ascending: false })

  if (scoresError) {
    console.error('Error fetching fact_sourcing_opportunity:', scoresError)
  }

  // Join: gabungkan skor ke features
  const scoresMap = new Map(scores?.map(s => [s.keyword_id, s]) ?? [])
  const enriched  = data?.map(row => ({
    ...row,
    winning_product_score:   scoresMap.get(row.keyword_id)?.winning_product_score ?? null,
    sourcing_recommendation: scoresMap.get(row.keyword_id)?.sourcing_recommendation ?? null,
  })) ?? []

  setCache('market_data', enriched)
  return enriched
}

export async function getComplaintsData() {
  const cached = getCached<any>('complaints_data')
  if (cached) {
    return cached
  }

  const supabase = getSupabase()

  // Ambil aspek keluhan dari ulasan rating 1-2
  const { data, error } = await supabase
    .from('fact_customer_reviews')
    .select('complaint_aspects, rating, product_id')
    .lte('rating', 2)
    .not('complaint_aspects', 'is', null)

  if (error) {
    console.error('Error fetching complaints:', error)
    return { complaints: [], prices: [] }
  }

  // Hitung frekuensi per aspek keluhan
  const freq: Record<string, number> = {}
  data?.forEach(row => {
    const aspects: string[] = row.complaint_aspects ?? []
    aspects.forEach(aspect => {
      freq[aspect] = (freq[aspect] ?? 0) + 1
    })
  })

  const sorted = Object.entries(freq)
    .map(([aspect, count]) => ({ aspect, count }))
    .sort((a, b) => b.count - a.count)

  // Distribusi harga per keyword (untuk histogram)
  const { data: prices } = await supabase
    .from('fact_product_snapshot')
    .select('product_id, price, snapshot_date')
    .order('snapshot_date', { ascending: false })
    .limit(2000)

  const result = { complaints: sorted, prices: prices ?? [] }
  setCache('complaints_data', result)
  return result
}

export async function getScoringData(keywordId?: string | null) {
  const cacheKey = `scoring_data_${keywordId || 'all'}`
  const cached = getCached<any[]>(cacheKey)
  if (cached) {
    return cached
  }

  const supabase = getSupabase()

  let query = supabase
    .from('fact_sourcing_opportunity')
    .select(`
      opportunity_id, keyword_id, scored_at,
      demand_score, competition_score, margin_score, gap_score,
      winning_product_score, sourcing_recommendation,
      n_products_analyzed, n_reviews_analyzed,
      dim_category_keyword ( sub_category, category_name, cost_category,
                             target_price_min, target_price_max )
    `)
    .order('scored_at', { ascending: false })

  if (keywordId) {
    query = query.eq('keyword_id', keywordId)
  }

  const { data, error } = await query.limit(50)

  if (error) {
    console.error('Error fetching scoring data:', error)
    return []
  }

  const result = data ?? []
  setCache(cacheKey, result)
  return result
}
