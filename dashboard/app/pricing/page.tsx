export const dynamic = 'force-dynamic'

import Header from '@/components/Header'
import PriceHistogram from '@/components/PriceHistogram'
import ComplaintBar from '@/components/ComplaintBar'
import { getComplaintsData } from '@/lib/data'

export default async function PricingPage() {
  const { complaints, prices } = await getComplaintsData()

  const totalComplaints = complaints.reduce((s: number, c: any) => s + c.count, 0)
  const topComplaint = complaints[0]?.aspect ?? 'Kualitas Bahan'

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <Header
        title="Pricing Intelligence & Pain Points"
        subtitle="Analisis sweet spot harga jual dan titik kelemahan produk kompetitor"
      />

      {/* Summary highlight cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem',
      }}>
        <div style={{
          background: '#151b2e',
          border: '1px solid #202a48',
          borderRadius: 18,
          padding: '1.25rem 1.5rem',
          boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.2)',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Top Negative Sentiment Driver
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ff6b4a', marginTop: 6 }}>
            {topComplaint}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
            Fokus diferensiasi material saat memesan ke supplier
          </div>
        </div>

        <div style={{
          background: '#151b2e',
          border: '1px solid #202a48',
          borderRadius: 18,
          padding: '1.25rem 1.5rem',
          boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.2)',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Total Ulasan Terverifikasi
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginTop: 6 }}>
            {totalComplaints} Ulasan Kritis
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
            Diekstraksi dari database review Kaggle Indonesia
          </div>
        </div>
      </div>

      {/* 2-column charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '1.75rem',
      }}>
        <PriceHistogram prices={prices} />
        <ComplaintBar data={complaints} />
      </div>
    </div>
  )
}
