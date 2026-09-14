export const dynamic = 'force-dynamic'

import Header from '@/components/Header'
import MarketOverview from '@/components/MarketOverview'
import { getMarketData } from '@/lib/data'

export default async function MarketPage() {
  const data: any[] = await getMarketData()

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Top Header */}
      <Header
        title="Overall Summary"
        subtitle="Analitik mendalam untuk product discovery dan validasi kelayakan sourcing"
      />

      {/* Interactive Main View with dynamic scope filter for GMV, Avg Price & Charts */}
      <MarketOverview initialData={data} />
    </div>
  )
}
