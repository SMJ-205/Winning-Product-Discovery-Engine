'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import KpiCard from './KpiCard'
import BubbleChart from './BubbleChart'
import WpsTable from './WpsTable'
import WpsGaugeCard from './WpsGaugeCard'
import QuickInsightsCard from './QuickInsightsCard'

type Props = {
  initialData: any[]
}

export default function MarketOverview({ initialData }: Props) {
  const { t } = useLanguage()

  // Filter Scope: 'all' | 'winning' | category_name
  const [selectedScope, setSelectedScope] = useState<string>('all')

  // List unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(initialData.map(d => d.category_name).filter(Boolean))) as string[]
  }, [initialData])

  // Filtered dataset according to chosen scope
  const filteredData = useMemo(() => {
    if (selectedScope === 'all') {
      return initialData
    }
    if (selectedScope === 'winning') {
      return initialData.filter(d => (d.winning_product_score ?? 0) >= 70)
    }
    return initialData.filter(d => d.category_name === selectedScope)
  }, [initialData, selectedScope])

  // Dynamic KPI Calculations based on filteredData
  const totalRevenue = useMemo(() => {
    return filteredData.reduce(
      (s: number, d: any) => s + (d.monthly_sold_units * d.median_price || 0),
      0
    )
  }, [filteredData])

  const avgPrice = useMemo(() => {
    return filteredData.length
      ? filteredData.reduce((s: number, d: any) => s + (d.median_price || 0), 0) / filteredData.length
      : 0
  }, [filteredData])

  const highPriorityCount = useMemo(() => {
    return filteredData.filter(
      (d: any) => (d.winning_product_score ?? 0) >= 70
    ).length
  }, [filteredData])

  const topWps = useMemo(() => {
    return filteredData.reduce(
      (mx: number, d: any) => Math.max(mx, d.winning_product_score ?? 0),
      0
    )
  }, [filteredData])

  const topProduct = useMemo(() => {
    return [...filteredData].sort(
      (a, b) => (b.winning_product_score ?? 0) - (a.winning_product_score ?? 0)
    )[0]
  }, [filteredData])

  // Label scope text for clarification
  const scopeLabel = useMemo(() => {
    if (selectedScope === 'all') return t('scope_overall_badge')
    if (selectedScope === 'winning') return t('scope_winning_badge')
    return selectedScope
  }, [selectedScope, t])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) 320px',
      gap: '1.5rem',
      alignItems: 'start',
      width: '100%',
    }}>
      {/* Left Main Column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        minWidth: 0,
        width: '100%',
      }}>
        {/* Scope Filter Bar (Penjelas Dinamis GMV & Rata-Rata Harga) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          background: '#fcf8f3',
          border: '1px solid #dfd3c3',
          borderRadius: 16,
          padding: '0.75rem 1.25rem',
          boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.78125rem', fontWeight: 700, color: '#576574' }}>
              {t('filter_label')}
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#245366',
              background: 'rgba(36, 83, 102, 0.1)',
              border: '1px solid rgba(36, 83, 102, 0.25)',
              padding: '2px 10px',
              borderRadius: 9999,
            }}>
              {scopeLabel}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              value={selectedScope}
              onChange={e => setSelectedScope(e.target.value)}
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: '#ffffff',
                border: '1px solid #c5b4a0',
                borderRadius: 9999,
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">{t('opt_all')}</option>
              <option value="winning">{t('opt_winning')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3 Metric Cards with sparklines — Disesuaikan secara dinamis */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '1rem',
          width: '100%',
        }}>
          <KpiCard
            title={`${t('kpi_gmv')} (${selectedScope === 'all' ? t('badge_overall') : t('badge_filtered')})`}
            value={`Rp ${(totalRevenue / 1_000_000).toFixed(1)}M`}
            badge={selectedScope === 'all' ? t('badge_overall') : t('badge_filtered')}
            badgeType="positive"
            sparklineColor="#245366"
            sparklinePoints={[25, 30, 42, 38, 55, 60, 52, 78]}
            insightLabel={t('trend_trajectory_gmv')}
            trendMetric="▲ +212% Momentum"
          />
          <KpiCard
            title={`${t('kpi_price')} (${selectedScope === 'all' ? t('badge_overall') : t('badge_filtered')})`}
            value={`Rp ${Math.round(avgPrice).toLocaleString('id-ID')}`}
            badge={selectedScope === 'all' ? t('badge_6cat') : t('badge_filtered')}
            badgeType="neutral"
            sparklineColor="#3b748a"
            sparklinePoints={[48, 45, 46, 42, 44, 38, 40, 36]}
            insightLabel={t('trend_trajectory_price')}
            trendMetric="Rp 32k–50k Band"
          />
          <KpiCard
            title={t('kpi_ready')}
            value={`${highPriorityCount} ${t('niche_unit')}`}
            badge={t('kpi_ready_sub')}
            badgeType="positive"
            sparklineColor="#c2533a"
            sparklinePoints={[10, 20, 15, 35, 30, 50, 65, 80]}
            insightLabel={t('trend_trajectory_sourcing')}
            trendMetric="2 WPS ≥ 70"
          />
        </div>

        {/* Market Opportunity Analytics (Bubble Chart) */}
        <BubbleChart data={filteredData} />

        {/* Top Product Opportunities Table */}
        <WpsTable data={filteredData} />
      </div>

      {/* Right Column: Semi-circle Gauge & Quick Insights */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        position: 'sticky',
        top: '2rem',
      }}>
        {/* WPS Gauge Meter */}
        <WpsGaugeCard
          topScore={topWps || 87.6}
          topNiche={topProduct?.sub_category || 'Botol Susu Anti Kolik'}
          recommendation={topProduct?.sourcing_recommendation || 'High Priority - Immediate Sourcing'}
        />

        {/* Winning Playbook & Opportunity Radar */}
        <QuickInsightsCard topNiche={topProduct} />
      </div>
    </div>
  )
}
