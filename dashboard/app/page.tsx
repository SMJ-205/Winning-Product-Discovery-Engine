export const dynamic = 'force-dynamic'

import Header from '@/components/Header'
import KpiCard from '@/components/KpiCard'
import BubbleChart from '@/components/BubbleChart'
import WpsTable from '@/components/WpsTable'
import WpsGaugeCard from '@/components/WpsGaugeCard'
import QuickInsightsCard from '@/components/QuickInsightsCard'
import { getMarketData } from '@/lib/data'

export default async function MarketPage() {
  const data: any[] = await getMarketData()

  const totalRevenue = data.reduce(
    (s: number, d: any) => s + (d.monthly_sold_units * d.median_price || 0),
    0
  )
  const avgPrice = data.length
    ? data.reduce((s: number, d: any) => s + (d.median_price || 0), 0) / data.length
    : 0
  const topWps = data.reduce(
    (mx: number, d: any) => Math.max(mx, d.winning_product_score ?? 0),
    0
  )
  const highPriority = data.filter(
    (d: any) => d.sourcing_recommendation === 'High Priority - Immediate Sourcing'
  ).length

  // Find top product
  const topProduct = [...data].sort(
    (a, b) => (b.winning_product_score ?? 0) - (a.winning_product_score ?? 0)
  )[0]

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Top Header */}
      <Header
        title="Good Evening, Product Hunter!"
        subtitle="Have an in-depth look at all e-commerce market opportunity metrics"
      />

      {/* Main Grid: Left Column & Right Column */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: '1.5rem',
        alignItems: 'start',
        width: '100%',
      }}>
        {/* Left Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          minWidth: 0,
          width: '100%',
        }}>
          {/* 3 Metric Cards with sparklines */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '1rem',
            width: '100%',
          }}>
            <KpiCard
              title="Est. Total GMV Bulanan"
              value={`Rp ${(totalRevenue / 1_000_000).toFixed(1)}M`}
              badge="+14.2%"
              badgeType="positive"
              sparklineColor="#6366f1"
              sparklinePoints={[25, 30, 42, 38, 55, 60, 52, 78]}
            />
            <KpiCard
              title="Rata-rata Harga Pasar"
              value={`Rp ${Math.round(avgPrice).toLocaleString('id-ID')}`}
              badge="-1.8%"
              badgeType="negative"
              sparklineColor="#ef4444"
              sparklinePoints={[50, 45, 48, 40, 42, 36, 38, 32]}
            />
            <KpiCard
              title="Peluang Siap Sourcing"
              value={`${highPriority} Niche`}
              badge="WPS ≥ 70"
              badgeType="positive"
              sparklineColor="#10b981"
              sparklinePoints={[10, 20, 15, 35, 30, 50, 65, 80]}
            />
          </div>

          {/* Market Opportunity Analytics (Bubble Chart) */}
          <BubbleChart data={data} />

          {/* Top Product Opportunities Table */}
          <WpsTable data={data} />
        </div>

        {/* Right Column: Semi-circle Gauge & Quick Insights */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          position: 'sticky',
          top: '2rem',
        }}>
          {/* WPS Gauge Meter (styled like Cust. Satisfaction Score) */}
          <WpsGaugeCard
            topScore={topWps || 79.8}
            topNiche={topProduct?.sub_category || 'Holder HP Motor'}
            recommendation={topProduct?.sourcing_recommendation || 'High Priority - Immediate Sourcing'}
          />

          {/* Quick Insights & Schedule widget */}
          <QuickInsightsCard />
        </div>
      </div>
    </div>
  )
}
