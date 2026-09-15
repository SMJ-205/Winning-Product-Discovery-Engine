'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import KpiCard from './KpiCard'
import BubbleChart from './BubbleChart'
import WpsTable from './WpsTable'
import WpsGaugeCard from './WpsGaugeCard'
import QuickInsightsCard from './QuickInsightsCard'
import ScopeFilterBar from './ScopeFilterBar'
import { CategoryAnalytics } from '@/lib/data'

type Props = {
  initialData: any[]
  categoryAnalytics?: CategoryAnalytics[]
}

function formatCompactCurrency(val: number, lang: 'ID' | 'EN'): string {
  if (!val || isNaN(val)) return 'Rp 0'

  if (lang === 'ID') {
    if (val >= 1_000_000_000_000) {
      const num = (val / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '').replace('.', ',')
      return `Rp ${num} Triliun`
    }
    if (val >= 1_000_000_000) {
      const num = (val / 1_000_000_000).toFixed(1).replace(/\.0$/, '').replace('.', ',')
      return `Rp ${num} Milyar`
    }
    if (val >= 1_000_000) {
      const num = (val / 1_000_000).toFixed(1).replace(/\.0$/, '').replace('.', ',')
      return `Rp ${num} Juta`
    }
    if (val >= 1_000) {
      const num = (val / 1_000).toFixed(1).replace(/\.0$/, '').replace('.', ',')
      return `Rp ${num} Ribu`
    }
    return `Rp ${Math.round(val).toLocaleString('id-ID')}`
  } else {
    // English
    if (val >= 1_000_000_000_000) {
      const num = (val / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '')
      return `Rp ${num} Trillion`
    }
    if (val >= 1_000_000_000) {
      const num = (val / 1_000_000_000).toFixed(1).replace(/\.0$/, '')
      return `Rp ${num} Billion`
    }
    if (val >= 1_000_000) {
      const num = (val / 1_000_000).toFixed(1).replace(/\.0$/, '')
      return `Rp ${num} Million`
    }
    if (val >= 1_000) {
      const num = (val / 1_000).toFixed(1).replace(/\.0$/, '')
      return `Rp ${num} Thousand`
    }
    return `Rp ${Math.round(val).toLocaleString('en-US')}`
  }
}

type ScopeTrend = {
  gmvPoints: number[]
  gmvTrajectoryID: string
  gmvTrajectoryEN: string
  gmvMetric: string
  pricePoints: number[]
  priceTrajectoryID: string
  priceTrajectoryEN: string
  priceMetric: string
  sourcingPoints: number[]
  sourcingTrajectoryID: string
  sourcingTrajectoryEN: string
  sourcingMetric: string
}

const SCOPE_TREND_DATA: Record<string, ScopeTrend> = {
  all: {
    gmvPoints: [25, 30, 42, 38, 55, 60, 52, 78],
    gmvTrajectoryID: 'Tren 8-Mgg: ▲ Akselerasi',
    gmvTrajectoryEN: '8-Wk Trend: ▲ Accelerating',
    gmvMetric: '▲ +212% Momentum',
    pricePoints: [48, 45, 46, 42, 44, 38, 40, 36],
    priceTrajectoryID: 'Rentang Stabil & Kompetitif',
    priceTrajectoryEN: 'Stable & Competitive Band',
    priceMetric: 'Rp 32k–50k Band',
    sourcingPoints: [10, 20, 15, 35, 30, 50, 65, 80],
    sourcingTrajectoryID: 'Pipeline Prioritas Tinggi',
    sourcingTrajectoryEN: 'High Priority Pipeline',
    sourcingMetric: '2 WPS ≥ 70',
  },
  winning: {
    gmvPoints: [15, 25, 38, 50, 65, 78, 88, 98],
    gmvTrajectoryID: 'Tren 8-Mgg: ▲ Lonjakan Tinggi',
    gmvTrajectoryEN: '8-Wk Trend: ▲ High Velocity',
    gmvMetric: '▲ +285% Surge Velocity',
    pricePoints: [60, 62, 65, 66, 68, 67, 68, 68],
    priceTrajectoryID: 'Rentang Margin Premium',
    priceTrajectoryEN: 'Premium Margin Band',
    priceMetric: 'Rp 60k–70k Band',
    sourcingPoints: [30, 45, 55, 65, 75, 85, 92, 98],
    sourcingTrajectoryID: 'Katalog Produk Unggulan',
    sourcingTrajectoryEN: 'Elite Winning Catalog',
    sourcingMetric: '2 Niche WPS ≥ 70',
  },
  'Ibu & Kebutuhan Bayi': {
    gmvPoints: [18, 28, 40, 55, 68, 78, 88, 96],
    gmvTrajectoryID: 'Tren 8-Mgg: ▲ Lonjakan Eksponensial',
    gmvTrajectoryEN: '8-Wk Trend: ▲ Exponential Surge',
    gmvMetric: '▲ +85% Surge Velocity',
    pricePoints: [65, 66, 67, 68, 68, 67, 68, 68],
    priceTrajectoryID: 'Harga Stabil & Kuat',
    priceTrajectoryEN: 'Firm Premium Pricing',
    priceMetric: 'Rp 65k–70k Band',
    sourcingPoints: [20, 35, 50, 65, 78, 88, 92, 96],
    sourcingTrajectoryID: 'Peluang Sourcing Terbaik',
    sourcingTrajectoryEN: 'Top Priority Sourcing',
    sourcingMetric: 'WPS 93.4 (Rank 1)',
  },
  'Dapur & Makanan': {
    gmvPoints: [28, 35, 40, 48, 55, 64, 72, 82],
    gmvTrajectoryID: 'Tren 8-Mgg: ▲ Permintaan Tinggi',
    gmvTrajectoryEN: '8-Wk Trend: ▲ Strong Consumer Demand',
    gmvMetric: '▲ +52% High Demand',
    pricePoints: [22, 23, 24, 24, 25, 24, 25, 25],
    priceTrajectoryID: 'Rentang Terjangkau & Cepat',
    priceTrajectoryEN: 'High Turn Velocity Band',
    priceMetric: 'Rp 22k–26k Band',
    sourcingPoints: [15, 25, 35, 45, 55, 62, 68, 72],
    sourcingTrajectoryID: 'Siap Maklon BPOM',
    sourcingTrajectoryEN: 'Ready for OEM Sourcing',
    sourcingMetric: 'WPS 71.1 (Rank 2)',
  },
  'Elektronik & Gadget': {
    gmvPoints: [72, 70, 68, 71, 69, 68, 67, 66],
    gmvTrajectoryID: 'Tren 8-Mgg: ► Pasar Matang',
    gmvTrajectoryEN: '8-Wk Trend: ► Mature Market',
    gmvMetric: '► Volume 354k Unit/Bln',
    pricePoints: [24, 22, 21, 20, 19, 19, 18, 18],
    priceTrajectoryID: 'Persaingan Harga Ketat',
    priceTrajectoryEN: 'High Price Pressure Band',
    priceMetric: 'Rp 16k–20k Band',
    sourcingPoints: [40, 35, 30, 28, 25, 22, 18, 16],
    sourcingTrajectoryID: 'Pasar Sangat Padat',
    sourcingTrajectoryEN: 'Saturated & Low Margin',
    sourcingMetric: 'WPS 15.4 (Saturated)',
  },
  'Otomotif & Pengendara': {
    gmvPoints: [38, 40, 39, 44, 46, 50, 48, 54],
    gmvTrajectoryID: 'Tren 8-Mgg: ▲ Pertumbuhan Sedang',
    gmvTrajectoryEN: '8-Wk Trend: ▲ Moderate Growth',
    gmvMetric: '▲ +18% Moderate',
    pricePoints: [42, 43, 44, 45, 45, 46, 45, 45],
    priceTrajectoryID: 'Rentang Menengah Stabil',
    priceTrajectoryEN: 'Stable Mid-Tier Pricing',
    priceMetric: 'Rp 42k–48k Band',
    sourcingPoints: [25, 28, 30, 32, 34, 35, 36, 36],
    sourcingTrajectoryID: 'Perlu Uji Sampel Ekstra',
    sourcingTrajectoryEN: 'Sample Testing Required',
    sourcingMetric: 'WPS 36.3 (Borderline)',
  },
  'Perlengkapan Rumah & Dapur': {
    gmvPoints: [32, 33, 35, 34, 36, 37, 39, 41],
    gmvTrajectoryID: 'Tren 8-Mgg: ► Niche Stabil',
    gmvTrajectoryEN: '8-Wk Trend: ► Niche Stability',
    gmvMetric: '► +12% Steady Demand',
    pricePoints: [36, 37, 37, 38, 38, 38, 38, 38],
    priceTrajectoryID: 'Harga Kokoh & Konsisten',
    priceTrajectoryEN: 'Firm Consistent Pricing',
    priceMetric: 'Rp 35k–40k Band',
    sourcingPoints: [20, 22, 21, 23, 22, 20, 19, 18],
    sourcingTrajectoryID: 'Volume Terbatas',
    sourcingTrajectoryEN: 'Limited Scalability',
    sourcingMetric: 'WPS 18.1 (Niche Only)',
  },
  'Kecantikan & Skincare': {
    gmvPoints: [58, 55, 53, 50, 48, 46, 43, 41],
    gmvTrajectoryID: 'Tren 8-Mgg: ▼ Persaingan Iklan Ketat',
    gmvTrajectoryEN: '8-Wk Trend: ▼ High Ad Saturation',
    gmvMetric: '▼ -14% High Ad CAC',
    pricePoints: [86, 84, 82, 80, 79, 78, 79, 79],
    priceTrajectoryID: 'Rentang Premium Bersaing',
    priceTrajectoryEN: 'Competitive Premium Band',
    priceMetric: 'Rp 75k–85k Band',
    sourcingPoints: [30, 32, 35, 38, 40, 42, 44, 45],
    sourcingTrajectoryID: 'Biaya Akuisisi Tinggi',
    sourcingTrajectoryEN: 'High Acquisition Cost',
    sourcingMetric: 'WPS 44.6 (High CAC)',
  },
}

export default function MarketOverview({ initialData, categoryAnalytics }: Props) {
  const { lang, t } = useLanguage()

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

  // Baseline angka median produk per filter kategori
  // Jika filter diset ke 'all' (overall) -> undefined (tampilkan seperti as is saja)
  // Jika filter diset ke kategori tertentu -> gunakan baseline median produk kategori tersebut
  const categoryBaselinePrice = useMemo(() => {
    if (selectedScope === 'all') {
      return undefined
    }
    // Cari dari database vw_category_analytics jika ada
    const matched = categoryAnalytics?.find(c => c.category_name === selectedScope)
    if (matched && matched.median_price) {
      return matched.median_price
    }
    // Fallback: hitung median dari filteredData
    const prices = filteredData
      .map((d: any) => d.median_price)
      .filter((p: any) => typeof p === 'number' && p > 0)
      .sort((a: number, b: number) => a - b)
    if (!prices.length) return undefined
    const mid = Math.floor(prices.length / 2)
    return prices.length % 2 !== 0 ? prices[mid] : Math.round((prices[mid - 1] + prices[mid]) / 2)
  }, [selectedScope, categoryAnalytics, filteredData])

  // Dynamic Sourcing URL yang mengarah ke pricing simulator / calculator
  const sourcingHref = useMemo(() => {
    if (selectedScope === 'all' || !categoryBaselinePrice) {
      return '/sourcing'
    }
    return `/sourcing?price=${categoryBaselinePrice}&category=${encodeURIComponent(selectedScope)}`
  }, [selectedScope, categoryBaselinePrice])

  // Label scope text for clarification
  const scopeLabel = useMemo(() => {
    if (selectedScope === 'all') return t('scope_overall_badge')
    if (selectedScope === 'winning') return t('scope_winning_badge')
    return selectedScope
  }, [selectedScope, t])

  // Dynamic Trend Data based on chosen scope
  const currentTrend = useMemo(() => {
    return SCOPE_TREND_DATA[selectedScope] || SCOPE_TREND_DATA.all
  }, [selectedScope])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) 350px',
      gap: '1.5rem',
      padding: '0 2rem 3rem 2rem',
    }}>
      {/* Left Column: Scope Filter, KPIs, Chart, and Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Scope Filter Bar */}
        <ScopeFilterBar
          selectedScope={selectedScope}
          onScopeChange={setSelectedScope}
          categories={categories}
          showWinningNichesOption={true}
          totalItemsCount={filteredData.length}
          itemsLabel={t('niche_analyzed')}
        />

        {/* 3 Metric Cards with sparklines — Disesuaikan secara dinamis */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '1rem',
          width: '100%',
        }}>
          <KpiCard
            title={`${t('kpi_gmv')} (${selectedScope === 'all' ? t('badge_overall') : t('badge_filtered')})`}
            value={formatCompactCurrency(totalRevenue, lang)}
            sparklinePoints={currentTrend.gmvPoints}
            insightLabel={lang === 'ID' ? currentTrend.gmvTrajectoryID : currentTrend.gmvTrajectoryEN}
            trendMetric={currentTrend.gmvMetric}
          />
          <KpiCard
            title={`${t('kpi_price')} (${selectedScope === 'all' ? t('badge_overall') : t('badge_filtered')})`}
            value={`Rp ${Math.round(avgPrice).toLocaleString('id-ID')}`}
            sparklinePoints={currentTrend.pricePoints}
            insightLabel={lang === 'ID' ? currentTrend.priceTrajectoryID : currentTrend.priceTrajectoryEN}
            trendMetric={currentTrend.priceMetric}
          />
          <KpiCard
            title={t('kpi_ready')}
            value={`${highPriorityCount} ${t('niche_unit')}`}
            sparklinePoints={currentTrend.sourcingPoints}
            insightLabel={lang === 'ID' ? currentTrend.sourcingTrajectoryID : currentTrend.sourcingTrajectoryEN}
            trendMetric={currentTrend.sourcingMetric}
          />
        </div>

        {/* Market Opportunity Analytics (Bubble Chart) */}
        <BubbleChart data={filteredData} />

        {/* Top Product Opportunities Table — Compact & Non-scroll */}
        <WpsTable
          data={filteredData}
          categoryScope={selectedScope}
          categoryMedianPrice={categoryBaselinePrice}
        />
      </div>

      {/* Right Column: Semi-circle Gauge & Quick Insights */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'sticky',
        top: '2rem',
      }}>
        {/* WPS Gauge Meter */}
        <WpsGaugeCard
          topScore={topWps || 87.6}
          topNiche={topProduct?.sub_category || 'Botol Susu Anti Kolik'}
          recommendation={topProduct?.sourcing_recommendation || 'High Priority - Immediate Sourcing'}
          sourcingHref={sourcingHref}
        />

        {/* Winning Playbook & Opportunity Radar */}
        <QuickInsightsCard
          topNiche={topProduct}
          sourcingHref={sourcingHref}
        />
      </div>
    </div>
  )
}
