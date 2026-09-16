'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

const LABEL_STYLE: Record<string, { bg: string; color: string; border: string; key: string }> = {
  'High Priority - Immediate Sourcing': {
    bg: 'rgba(36, 83, 102, 0.1)',
    color: '#245366',
    border: 'rgba(36, 83, 102, 0.25)',
    key: 'badge_high',
  },
  'Monitor & Sample Testing': {
    bg: 'rgba(217, 155, 100, 0.15)',
    color: '#b46f2c',
    border: 'rgba(217, 155, 100, 0.35)',
    key: 'badge_monitor',
  },
  'Reject - Saturated / Unfeasible': {
    bg: 'rgba(217, 100, 80, 0.12)',
    color: '#c24b3a',
    border: 'rgba(217, 100, 80, 0.3)',
    key: 'badge_reject',
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

type Props = {
  data: Row[]
  categoryScope?: string
  categoryMedianPrice?: number
}

export default function WpsTable({ data, categoryScope, categoryMedianPrice }: Props) {
  const { t } = useLanguage()

  const sorted = [...data]
    .filter(d => d.winning_product_score != null)
    .sort((a, b) => (b.winning_product_score ?? 0) - (a.winning_product_score ?? 0))

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.06)',
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid #e5dacb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1e293b' }}>
            {t('table_title')}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#576574', marginTop: 2 }}>
            {t('table_sub')}
          </div>
        </div>

        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#245366',
          padding: '0.25rem 0.75rem',
          background: 'rgba(36, 83, 102, 0.1)',
          borderRadius: 9999,
          border: '1px solid rgba(36, 83, 102, 0.25)',
        }}>
          {sorted.length} {t('niche_analyzed')}
        </div>
      </div>

      {/* Compact Table content */}
      <div className="wps-table-compact-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="wps-table-compact">
          <thead>
            <tr style={{ background: '#ede3d5' }}>
              <th style={{ textAlign: 'left' }}>{t('col_product')}</th>
              <th style={{ textAlign: 'left' }}>{t('col_category')}</th>
              <th style={{ textAlign: 'right' }}>{t('col_units')}</th>
              <th style={{ textAlign: 'right' }}>{t('col_price')}</th>
              <th style={{ textAlign: 'left' }}>{t('col_wps')}</th>
              <th style={{ textAlign: 'center' }}>{t('col_status')}</th>
              <th style={{ textAlign: 'center' }}>{t('col_action')}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => {
              const rec = row.sourcing_recommendation ?? 'Reject - Saturated / Unfeasible'
              const badge = LABEL_STYLE[rec] ?? LABEL_STYLE['Reject - Saturated / Unfeasible']
              const wps = row.winning_product_score ?? 0

              // Jika filter bukan 'all', gunakan baseline harga median kategori yang terfilter
              // Kecuali filter diset ke overall ('all') -> tampilkan seperti as is saja (/sourcing)
              const actionHref = (categoryScope && categoryScope !== 'all')
                ? `/sourcing?price=${categoryMedianPrice || row.median_price}&category=${encodeURIComponent(categoryScope)}`
                : '/sourcing'

              return (
                <tr key={row.keyword_id}>
                  {/* Product / Niche Name */}
                  <td>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.8125rem', lineHeight: 1.25 }}>
                      {row.sub_category}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 2 }}>
                      {row.n_products ? `${row.n_products} ${t('listings_analyzed')}` : 'Dataset'}
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ color: '#475569', fontSize: '0.75rem', lineHeight: 1.25 }}>
                    {row.category_name?.replace('_', ' ') ?? 'General'}
                  </td>

                  {/* Monthly Units */}
                  <td style={{ fontWeight: 600, color: '#334155', fontSize: '0.78125rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {row.monthly_sold_units?.toLocaleString('id-ID')}
                  </td>

                  {/* Median Price */}
                  <td style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.8125rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    Rp {row.median_price?.toLocaleString('id-ID')}
                  </td>

                  {/* WPS Score with mini bar */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                      <div style={{
                        width: 36,
                        height: 5,
                        background: '#e5dacb',
                        borderRadius: 3,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}>
                        <div style={{
                          width: `${wps}%`,
                          height: '100%',
                          background: badge.color,
                          borderRadius: 3,
                        }} />
                      </div>
                      <span style={{ fontWeight: 800, color: badge.color, fontSize: '0.8125rem' }}>
                        {wps.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge without emojis */}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      background: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      borderRadius: 9999,
                      padding: '2px 8px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}>
                      {t(badge.key)}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td style={{ textAlign: 'center' }}>
                    <Link
                      href={actionHref}
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        textDecoration: 'none',
                        padding: '4px 9px',
                        borderRadius: 6,
                        background: '#245366',
                        border: '1px solid #1c4555',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {t('action_sim_short')}
                    </Link>
                  </td>
                </tr>
              )
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#64748b', padding: '3rem 1rem' }}>
                  {t('no_data')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
