import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600

export async function GET() {
  // Ambil aspek keluhan dari ulasan rating 1-2
  const { data, error } = await supabase
    .from('fact_customer_reviews')
    .select('complaint_aspects, rating, product_id')
    .lte('rating', 2)
    .not('complaint_aspects', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
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

  return NextResponse.json({ complaints: sorted, prices: prices ?? [] })
}
