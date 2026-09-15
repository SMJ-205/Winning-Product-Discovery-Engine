export const dynamic = 'force-dynamic'

import Header from '@/components/Header'
import MarginSimulator from '@/components/MarginSimulator'
import { getScoringData, getMarketData } from '@/lib/data'

async function getDefaultPrice() {
  try {
    const data = await getScoringData()
    return (data as any)?.[0]?.dim_category_keyword?.target_price_min ?? 68000
  } catch {
    return 68000
  }
}

type Props = {
  searchParams?: Promise<{ price?: string; category?: string; niche?: string }>
}

export default async function SourcingPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {}
  const defaultPrice = await getDefaultPrice()
  const marketData: any[] = await getMarketData()
  const latestSnapshotDate = marketData?.[0]?.latest_snapshot_date || '2026-09-15'

  const parsedPrice = params.price ? parseInt(params.price, 10) : undefined
  const initialSellingPrice = (parsedPrice && !isNaN(parsedPrice) && parsedPrice > 0)
    ? parsedPrice
    : defaultPrice

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <Header snapshotDate={latestSnapshotDate} />

      {/* Main Sourcing Content */}
      <div style={{ maxWidth: 960 }}>
        <MarginSimulator
          defaultSellingPrice={initialSellingPrice}
          categoryScope={params.category}
          nicheScope={params.niche}
        />
      </div>
    </div>
  )
}
