export const dynamic = 'force-dynamic'

import PriceHistogram from '@/components/PriceHistogram'
import ComplaintBar    from '@/components/ComplaintBar'

async function getData() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const res  = await fetch(`${base}/api/complaints`, { next: { revalidate: 3600 } })
  if (!res.ok) return { complaints: [], prices: [] }
  return res.json()
}

export default async function PricingPage() {
  const { complaints, prices } = await getData()

  const totalComplaints = complaints.reduce((s: number, c: any) => s + c.count, 0)
  const topComplaint    = complaints[0]?.aspect ?? '—'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
          Competitor Pricing & Customer Pain Points
        </h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
          Sweet spot harga jual & spesifikasi produk yang wajib diperbaiki vs kompetitor
        </p>
      </div>

      {/* Summary bar */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap',
      }}>
        {[
          { label: 'Total Ulasan Negatif Dianalisis', value: totalComplaints.toLocaleString('id-ID'), color: '#ef4444' },
          { label: 'Keluhan Paling Sering', value: topComplaint, color: '#f59e0b' },
          { label: 'Listing Dianalisis', value: prices.length.toLocaleString('id-ID'), color: '#6366f1' },
        ].map(item => (
          <div key={item.label} style={{
            background: '#1a1d2e', border: '1px solid #2a2d3e', borderRadius: 10,
            padding: '1rem 1.25rem', flex: 1, minWidth: 180,
          }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Charts side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <PriceHistogram prices={prices} />
        <ComplaintBar   data={complaints} />
      </div>

      {/* Actionable insight */}
      <div style={{
        padding: '1.25rem', background: '#1a1d2e', border: '1px solid #2a2d3e',
        borderRadius: 12, fontSize: 13, color: '#94a3b8', lineHeight: 1.8,
      }}>
        <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>
          💡 Cara Menggunakan Halaman Ini
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#64748b' }}>
          <li>Histogram harga → identifikasi <b style={{ color: '#94a3b8' }}>sweet spot</b> (bin dengan jumlah produk terbanyak = pasar paling aktif)</li>
          <li>Bar chart keluhan → jadikan <b style={{ color: '#94a3b8' }}>spesifikasi diferensiasi</b> produk baru Anda (selesaikan keluhan yang sering muncul)</li>
          <li>Lanjut ke <a href="/sourcing" style={{ color: '#6366f1' }}>Sourcing Simulator</a> untuk validasi apakah margin masih layak di harga sweet spot tersebut</li>
        </ul>
      </div>
    </div>
  )
}
