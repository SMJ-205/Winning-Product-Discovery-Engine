'use client'

import Link from 'next/link'

const LABEL_STYLE: Record<string, { bg: string; color: string; border: string; text: string }> = {
  'High Priority - Immediate Sourcing': {
    bg: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    border: 'rgba(52, 211, 153, 0.3)',
    text: 'High Priority',
  },
  'Monitor & Sample Testing': {
    bg: 'rgba(245, 158, 11, 0.15)',
    color: '#fbbf24',
    border: 'rgba(251, 191, 36, 0.3)',
    text: 'Monitor',
  },
  'Reject - Saturated / Unfeasible': {
    bg: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    border: 'rgba(248, 113, 113, 0.3)',
    text: 'Reject',
  },
}

type Row = {
  keyword_id:              number
  sub_category:            string
  category_name?:          string
  winning_product_score?:  number
  sourcing_recommendation?: string
  monthly_sold_units:      number
  median_price:            number
  n_products?:             number
}

export default function WpsTable({ data }: { data: Row[] }) {
  const sorted = [...data]
    .filter(d => d.winning_product_score != null)
    .sort((a, b) => (b.winning_product_score ?? 0) - (a.winning_product_score ?? 0))

  return (
    <div style={{
      background: '#151b2e',
      border: '1px solid #202a48',
      borderRadius: 22,
      overflow: 'hidden',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.2)',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid #1a223a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
            Top Product Opportunities
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
            Peringkat niche berdasarkan validasi algoritma Winning Product Score (WPS)
          </div>
        </div>

        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#94a3b8',
          padding: '0.35rem 0.85rem',
          background: '#11172a',
          borderRadius: 9999,
          border: '1px solid #202a48',
        }}>
          Weekly
        </div>
      </div>

      {/* Table content */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr style={{ background: '#11172a' }}>
              <th>Niche / Produk</th>
              <th>Kategori</th>
              <th>Units/Bln</th>
              <th>Median Harga</th>
              <th>WPS Score</th>
              <th>Status Kelayakan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => {
              const rec = row.sourcing_recommendation ?? 'Reject - Saturated / Unfeasible'
              const badge = LABEL_STYLE[rec] ?? LABEL_STYLE['Reject - Saturated / Unfeasible']
              const wps = row.winning_product_score ?? 0

              return (
                <tr key={row.keyword_id}>
                  {/* Product / Niche Name */}
                  <td>
                    <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.875rem' }}>
                      {row.sub_category}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 2 }}>
                      {row.n_products ? `${row.n_products} listings dianalisis` : 'Kaggle Dataset'}
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
                    {row.category_name?.replace('_', ' ') ?? 'General'}
                  </td>

                  {/* Monthly Units */}
                  <td style={{ fontWeight: 600, color: '#cbd5e1', fontSize: '0.8125rem' }}>
                    {row.monthly_sold_units?.toLocaleString('id-ID')}
                  </td>

                  {/* Median Price */}
                  <td style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.875rem' }}>
                    Rp {row.median_price?.toLocaleString('id-ID')}
                  </td>

                  {/* WPS Score with mini bar */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 55,
                        height: 6,
                        background: '#11172a',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${wps}%`,
                          height: '100%',
                          background: badge.color,
                          borderRadius: 3,
                        }} />
                      </div>
                      <span style={{ fontWeight: 800, color: badge.color, fontSize: '0.875rem' }}>
                        {wps.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge without emojis */}
                  <td>
                    <span style={{
                      display: 'inline-block',
                      background: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      borderRadius: 9999,
                      padding: '3px 10px',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}>
                      {badge.text}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td>
                    <Link
                      href="/sourcing"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#38bdf8',
                        textDecoration: 'none',
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                      }}
                    >
                      Simulasi
                    </Link>
                  </td>
                </tr>
              )
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#64748b', padding: '3rem 1rem' }}>
                  Belum ada data scoring. Pastikan pipeline Python telah dijalankan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
