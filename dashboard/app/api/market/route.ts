import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600 // cache 1 jam (ISR)

export async function GET() {
  const { data, error } = await supabase
    .from('vw_subcategory_features')
    .select('*')
    .order('monthly_sold_units', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Ambil WPS terbaru per keyword dari fact_sourcing_opportunity
  const { data: scores } = await supabase
    .from('fact_sourcing_opportunity')
    .select('keyword_id, winning_product_score, sourcing_recommendation, scored_at')
    .order('scored_at', { ascending: false })

  // Join: gabungkan skor ke features
  const scoresMap = new Map(scores?.map(s => [s.keyword_id, s]) ?? [])
  const enriched  = data?.map(row => ({
    ...row,
    winning_product_score:   scoresMap.get(row.keyword_id)?.winning_product_score ?? null,
    sourcing_recommendation: scoresMap.get(row.keyword_id)?.sourcing_recommendation ?? null,
  })) ?? []

  return NextResponse.json(enriched)
}
