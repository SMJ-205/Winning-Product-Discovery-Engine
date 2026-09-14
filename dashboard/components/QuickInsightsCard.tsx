'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

type Props = {
  topNiche?: {
    sub_category?: string
    winning_product_score?: number
    monthly_sold_units?: number
    median_price?: number
    category_name?: string
    search_trend_index?: number
  }
}

export default function QuickInsightsCard({ topNiche }: Props) {
  const { t, lang } = useLanguage()

  const productName = topNiche?.sub_category || 'Botol Susu Anti Kolik BPA Free'
  const wpsScore = topNiche?.winning_product_score ? topNiche.winning_product_score.toFixed(1) : '87.6'
  const categoryName = topNiche?.category_name || (lang === 'ID' ? 'Ibu & Kebutuhan Bayi' : 'Mom & Baby')
  const medianPrice = topNiche?.median_price || 68000
  const targetHpp = Math.round(medianPrice * 0.35)
  const monthlyUnits = topNiche?.monthly_sold_units
    ? `${topNiche.monthly_sold_units.toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US')} units/mo`
    : '95.600 units/mo'

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 22,
      padding: '1.4rem 1.4rem 1.25rem 1.4rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.1rem',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.06)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1e293b' }}>
            {t('playbook_title')}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#576574', marginTop: 1 }}>
            {t('playbook_sub')}
          </div>
        </div>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#245366',
          background: 'rgba(36, 83, 102, 0.1)',
          padding: '3px 9px',
          borderRadius: 9999,
          border: '1px solid rgba(36, 83, 102, 0.25)',
        }}>
          {wpsScore} WPS
        </span>
      </div>

      {/* Featured Winning Product Banner */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 14,
        padding: '0.85rem 1rem',
      }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#245366', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Top Opportunity Target
        </div>
        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1e293b', marginTop: 3 }}>
          {productName}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.72rem', color: '#576574', fontWeight: 600 }}>
          <span>{categoryName}</span>
          <span>•</span>
          <span style={{ color: '#245366', fontWeight: 700 }}>{monthlyUnits}</span>
        </div>
      </div>

      {/* 4 Pillars of Winning Product Discovery (2x2 Grid) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '0.625rem',
      }}>
        {/* Pillar 1: Demand Velocity */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 12,
          padding: '0.65rem 0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#245366' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#576574' }}>
              {t('pillar_demand')}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#245366' }}>
            +44% Spike
          </div>
          <div style={{ fontSize: '0.625rem', color: '#576574', marginTop: 1 }}>
            {monthlyUnits}
          </div>
        </div>

        {/* Pillar 2: Target COGS & Margin */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 12,
          padding: '0.65rem 0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b748a' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#576574' }}>
              {t('pillar_margin')}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#1e293b' }}>
            Rp {targetHpp.toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US')}
          </div>
          <div style={{ fontSize: '0.625rem', color: '#226338', fontWeight: 700, marginTop: 1 }}>
            Net Margin ~34%
          </div>
        </div>

        {/* Pillar 3: Competitor Pain Point Gap */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 12,
          padding: '0.65rem 0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c2533a' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#576574' }}>
              {t('pillar_flaw')}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#c2533a' }}>
            Kemasan Bocor (38%)
          </div>
          <div style={{ fontSize: '0.625rem', color: '#576574', marginTop: 1 }}>
            Celah diferensiasi produk
          </div>
        </div>

        {/* Pillar 4: Supplier Readiness */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 12,
          padding: '0.65rem 0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9c6f50' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#576574' }}>
              {t('pillar_oem')}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#1e293b' }}>
            Direct OEM Ready
          </div>
          <div style={{ fontSize: '0.625rem', color: '#576574', marginTop: 1 }}>
            Tangerang & 1688 Fast Turn
          </div>
        </div>
      </div>

      {/* Actionable Strategy Playbook */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 14,
        padding: '0.75rem 0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {t('playbook_strategy_header')}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#245366',
            color: '#ffffff',
            fontSize: '0.625rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
          }}>
            1
          </span>
          <div style={{ fontSize: '0.6875rem', color: '#1e293b', lineHeight: 1.35 }}>
            <b style={{ color: '#245366' }}>{t('step1_title')}</b> {t('step1_desc')}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#245366',
            color: '#ffffff',
            fontSize: '0.625rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
          }}>
            2
          </span>
          <div style={{ fontSize: '0.6875rem', color: '#1e293b', lineHeight: 1.35 }}>
            <b style={{ color: '#245366' }}>{t('step2_title')}</b> {t('step2_desc')}
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      <Link
        href="/sourcing"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '0.6rem 1rem',
          background: '#245366',
          color: '#ffffff',
          borderRadius: 12,
          fontSize: '0.75rem',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(36, 83, 102, 0.2)',
          transition: 'all 0.15s ease',
        }}
      >
        <span>{t('btn_sourcing_action')}</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  )
}
