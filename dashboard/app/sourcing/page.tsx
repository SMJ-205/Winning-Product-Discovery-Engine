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

export default async function SourcingPage() {
  const defaultPrice = await getDefaultPrice()
  const marketData: any[] = await getMarketData()
  const latestSnapshotDate = marketData?.[0]?.latest_snapshot_date || '2026-09-15'

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <Header snapshotDate={latestSnapshotDate} />

      {/* Main Sourcing Content */}
      <div style={{ maxWidth: 960 }}>
        <MarginSimulator defaultSellingPrice={defaultPrice} />
      </div>
    </div>
  )
}
