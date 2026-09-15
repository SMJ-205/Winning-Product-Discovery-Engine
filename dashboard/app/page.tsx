export const dynamic = 'force-dynamic'

import Header from '@/components/Header'
import MarketOverview from '@/components/MarketOverview'
import { getMarketData } from '@/lib/data'

export default async function MarketPage() {
  const data: any[] = await getMarketData()
  const latestSnapshotDate = data?.[0]?.latest_snapshot_date || '2026-09-15'

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Top Header */}
      <Header snapshotDate={latestSnapshotDate} />

      {/* Interactive Main View with dynamic scope filter for GMV, Avg Price & Charts */}
      <MarketOverview initialData={data} />
    </div>
  )
}
