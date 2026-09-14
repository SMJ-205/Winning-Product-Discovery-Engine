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

export default function WpsTable({ data }: { data: Row[] }) {
  const { t } = useLanguage()

  const sorted = [...data]
    .filter(d => d.winning_product_score != null)
    .sort((a, b) => (b.winning_product_score ?? 0) - (a.winning_product_score ?? 0))

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 22,
      overflow: 'hidden',
      boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.06)',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid #e5dacb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>
            {t('table_title')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#576574', marginTop: 2 }}>
            {t('table_sub')}
          </div>
        </div>

        <div style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#245366',
          padding: '0.35rem 0.85rem',
          background: 'rgba(36, 83, 102, 0.1)',
          borderRadius: 9999,
          border: '1px solid rgba(36, 83, 102, 0.25)',
        }}>
          {sorted.length} {t('niche_analyzed')}
        </div>
      </div>

      {/* Table content */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr style={{ background: '#ede3d5' }}>
              <th>{t('col_product')}</th>
              <th>{t('col_category')}</th>
              <th>{t('col_units')}</th>
              <th>{t('col_price')}</th>
              <th>{t('col_wps')}</th>
              <th>{t('col_status')}</th>
              <th>{t('col_action')}</th>
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
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>
                      {row.sub_category}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 2 }}>
                      {row.n_products ? `${row.n_products} ${t('listings_analyzed')}` : 'Dataset'}
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ color: '#475569', fontSize: '0.8125rem' }}>
                    {row.category_name?.replace('_', ' ') ?? 'General'}
                  </td>

                  {/* Monthly Units */}
                  <td style={{ fontWeight: 600, color: '#334155', fontSize: '0.8125rem' }}>
                    {row.monthly_sold_units?.toLocaleString('id-ID')}
                  </td>

                  {/* Median Price */}
                  <td style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>
                    Rp {row.median_price?.toLocaleString('id-ID')}
                  </td>

                  {/* WPS Score with mini bar */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 55,
                        height: 6,
                        background: '#e5dacb',
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
                      {t(badge.key)}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td>
                    <Link
                      href="/sourcing"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        textDecoration: 'none',
                        padding: '5px 12px',
                        borderRadius: 8,
                        background: '#245366',
                        border: '1px solid #1c4555',
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
