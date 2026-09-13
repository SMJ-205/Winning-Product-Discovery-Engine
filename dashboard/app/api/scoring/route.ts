import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keywordId = searchParams.get('keyword_id')

  // Ambil data scoring terbaru per keyword
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
