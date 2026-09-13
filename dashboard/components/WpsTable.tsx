'use client'

const LABEL_COLOR: Record<string, string> = {
  'High Priority - Immediate Sourcing': '#10b981',
  'Monitor & Sample Testing':           '#f59e0b',
  'Reject - Saturated / Unfeasible':    '#ef4444',
}

type Row = {
  keyword_id:             number
  sub_category:           string
  winning_product_score?: number
  sourcing_recommendation?: string
  monthly_sold_units:     number
  median_price:           number
  n_products?:            number
}

export default function WpsTable({ data }: { data: Row[] }) {
  const sorted = [...data]
    .filter(d => d.winning_product_score != null)
    .sort((a, b) => (b.winning_product_score ?? 0) - (a.winning_product_score ?? 0))
    .slice(0, 10)

  return (
    <div style={{
      background: '#1a1d2e', border: '1px solid #2a2d3e',
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #2a2d3e' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
          🏆 Top 10 Winning Products
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
          Diranking berdasarkan Winning Product Score (WPS)
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr style={{ background: '#141726' }}>
              <th>#</th>
              <th>Sub-Kategori</th>
              <th>WPS</th>
              <th>Rekomendasi</th>
              <th>Units/Bln</th>
              <th>Median Harga</th>
              <th>Kompetitor</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const rec   = row.sourcing_recommendation ?? ''
              const color = LABEL_COLOR[rec] ?? '#94a3b8'
              const wps   = row.winning_product_score ?? 0

              return (
                <tr key={row.keyword_id}>
                  <td style={{ color: '#475569', fontWeight: 700, width: 36 }}>{i + 1}</td>
                  <td style={{ fontWeight: 500, color: '#e2e8f0' }}>{row.sub_category}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 60, height: 6, background: '#2a2d3e', borderRadius: 3, overflow: 'hidden',
                      }}>
                        <div style={{ width: `${wps}%`, height: '100%', background: color, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontWeight: 700, color, fontSize: 13 }}>{wps.toFixed(1)}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      background: `${color}22`, color, border: `1px solid ${color}44`,
                      borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                    }}>
                      {rec === 'High Priority - Immediate Sourcing' ? '🔥 High Priority'
                        : rec === 'Monitor & Sample Testing' ? '👁 Monitor'
                        : '❌ Reject'}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8' }}>{row.monthly_sold_units?.toLocaleString('id-ID')}</td>
                  <td style={{ color: '#94a3b8' }}>
                    Rp {row.median_price?.toLocaleString('id-ID')}
                  </td>
                  <td style={{ color: '#64748b' }}>{row.n_products ?? '—'}</td>
                </tr>
              )
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#475569', padding: '2rem' }}>
                  Belum ada data scoring. Jalankan pipeline terlebih dahulu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
