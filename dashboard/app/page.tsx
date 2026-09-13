export const dynamic = 'force-dynamic'

import KpiCard    from '@/components/KpiCard'
import BubbleChart from '@/components/BubbleChart'
import WpsTable    from '@/components/WpsTable'

async function getData() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const res  = await fetch(`${base}/api/market`, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  return res.json()
}

export default async function MarketPage() {
  const data: any[] = await getData()

  const totalRevenue  = data.reduce((s: number, d: any) => s + (d.monthly_sold_units * d.median_price || 0), 0)
  const avgPrice      = data.length ? data.reduce((s: number, d: any) => s + (d.median_price || 0), 0) / data.length : 0
  const topWps        = data.reduce((mx: number, d: any) => Math.max(mx, d.winning_product_score ?? 0), 0)
  const highPriority  = data.filter((d: any) => d.sourcing_recommendation === 'High Priority - Immediate Sourcing').length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
          Market Landscape
        </h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
          Identifikasi sub-kategori dengan demand tinggi & persaingan rendah
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <KpiCard
          title="Est. Total GMV Bulanan"
          value={`Rp ${(totalRevenue / 1_000_000).toFixed(0)}M`}
          subtitle={`dari ${data.length} sub-kategori`}
          accent="#6366f1"
          icon="💰"
        />
        <KpiCard
          title="Rata-rata Harga Pasar"
          value={`Rp ${Math.round(avgPrice).toLocaleString('id-ID')}`}
          subtitle="median per sub-kategori"
          accent="#8b5cf6"
          icon="🏷️"
        />
        <KpiCard
          title="Top WPS Score"
          value={topWps.toFixed(1)}
          subtitle="dari skala 0–100"
          accent="#10b981"
          icon="⭐"
        />
        <KpiCard
          title="High Priority Niches"
          value={highPriority}
          subtitle="WPS ≥ 70"
          accent="#f59e0b"
          icon="🔥"
        />
      </div>

      {/* Bubble Chart */}
      <div style={{ marginBottom: '2rem' }}>
        <BubbleChart data={data} />
      </div>

      {/* Top-10 Table */}
      <WpsTable data={data} />

      {/* Footer guide */}
      <div style={{
        marginTop: '2rem', padding: '1rem 1.25rem',
        background: '#1a1d2e', border: '1px solid #2a2d3e',
        borderRadius: 10, fontSize: 12, color: '#64748b', lineHeight: 1.7,
      }}>
        🧭 <b style={{ color: '#94a3b8' }}>Cara baca:</b>{' '}
        Cari bubble besar di kiri atas (GMV tinggi, kompetisi rendah) — itu kandidat paling menjanjikan.
        Lanjut ke <a href="/pricing" style={{ color: '#6366f1' }}>Pricing & Pain Points</a>{' '}
        untuk cek harga wajar & keluhan utama.
      </div>
    </div>
  )
}
