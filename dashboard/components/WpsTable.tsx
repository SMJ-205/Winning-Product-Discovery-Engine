'use client'

import Link from 'next/link'

const LABEL_STYLE: Record<string, { bg: string; color: string; border: string; text: string }> = {
  'High Priority - Immediate Sourcing': {
    bg: '#ecfdf5',
    color: '#059669',
    border: '#a7f3d0',
    text: '🔥 High Priority',
  },
  'Monitor & Sample Testing': {
    bg: '#fffbeb',
    color: '#d97706',
    border: '#fde68a',
    text: '👁 Monitor',
  },
  'Reject - Saturated / Unfeasible': {
    bg: '#fef2f2',
    color: '#dc2626',
    border: '#fecaca',
    text: '❌ Reject',
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
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 22,
      overflow: 'hidden',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -2px rgba(15, 23, 42, 0.02)',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            Top Product Opportunities
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
            Peringkat niche berdasarkan validasi algoritma Winning Product Score (WPS)
          </div>
        </div>

        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#475569',
          padding: '0.35rem 0.85rem',
          background: '#f8fafc',
          borderRadius: 9999,
          border: '1px solid #e2e8f0',
        }}>
          Weekly ▾
        </div>
      </div>

      {/* Table content */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
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
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                      {row.sub_category}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: 2 }}>
                      {row.n_products ? `${row.n_products} listings dianalisis` : 'Kaggle Dataset'}
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ color: '#64748b', fontSize: '0.8125rem' }}>
                    {row.category_name?.replace('_', ' ') ?? 'General'}
                  </td>

                  {/* Monthly Units */}
                  <td style={{ fontWeight: 600, color: '#334155', fontSize: '0.8125rem' }}>
                    {row.monthly_sold_units?.toLocaleString('id-ID')}
                  </td>

                  {/* Median Price */}
                  <td style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                    Rp {row.median_price?.toLocaleString('id-ID')}
                  </td>

                  {/* WPS Score with mini bar */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 55,
                        height: 6,
                        background: '#f1f5f9',
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

                  {/* Status Badge */}
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
                        color: '#6366f1',
                        textDecoration: 'none',
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: '#f5f3ff',
                      }}
                    >
                      Simulasi →
                    </Link>
                  </td>
                </tr>
              )
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem 1rem' }}>
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
