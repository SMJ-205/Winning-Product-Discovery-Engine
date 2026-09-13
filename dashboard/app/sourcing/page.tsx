export const dynamic = 'force-dynamic'

import { getScoringData } from '@/lib/data'
import MarginSimulator from '@/components/MarginSimulator'

async function getDefaultPrice() {
  try {
    const data = await getScoringData()
    return (data as any)?.[0]?.dim_category_keyword?.target_price_min ?? 89000
  } catch {
    return 89000
  }
}

export default async function SourcingPage() {
  const defaultPrice = await getDefaultPrice()

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
          Sourcing Feasibility Simulator
        </h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
          Validasi margin & hitung batas maksimal HPP supplier sebelum commit order
        </p>
      </div>

      {/* Guide banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #1a1d2e 100%)',
        border: '1px solid #4338ca44', borderRadius: 12,
        padding: '1rem 1.5rem', marginBottom: '2rem',
        display: 'flex', gap: '2rem', flexWrap: 'wrap',
      }}>
        {[
          { step: '1', text: 'Masukkan harga jual target dari sweet spot (Halaman 2)' },
          { step: '2', text: 'Masukkan estimasi HPP dari supplier' },
          { step: '3', text: 'Lihat apakah Net Margin ≥ 25% — jika tidak, negosiasikan HPP ke bawah' },
        ].map(({ step, text }) => (
          <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: 200 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: '#6366f1', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {step}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{text}</div>
          </div>
        ))}
      </div>

      {/* Simulator */}
      <MarginSimulator defaultSellingPrice={defaultPrice} />

      {/* Footer note */}
      <div style={{
        marginTop: '1.5rem', padding: '1rem 1.25rem',
        background: '#1a1d2e', border: '1px solid #2a2d3e',
        borderRadius: 10, fontSize: 12, color: '#475569', lineHeight: 1.7,
      }}>
        ⚠️ <b style={{ color: '#64748b' }}>Asumsi biaya</b> (komisi 8.5%) dapat dikonfigurasi per kategori di{' '}
        <code style={{ background: '#141726', padding: '1px 6px', borderRadius: 4, color: '#94a3b8' }}>
          config/cost_params.yaml
        </code>. Refresh setiap bulan agar angka tetap akurat.
      </div>
    </div>
  )
}
