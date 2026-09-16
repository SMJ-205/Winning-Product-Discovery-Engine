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

type Timeframe = '7d' | '30d' | '90d'

const MULTI_SCOPE_TREND_DATA: Record<string, Record<Timeframe, ScopeTrend>> = {
  all: {
    '7d': {
      gmvPoints: [58, 62, 60, 68, 65, 74, 78],
      gmvTrajectoryID: 'Tren 7-Hari: ▲ Laju Mingguan',
      gmvTrajectoryEN: '7-Day Trend: ▲ Weekly Pace',
      gmvMetric: '▲ +24% Velocity 7H',
      pricePoints: [41, 40, 41, 39, 38, 37, 36],
      priceTrajectoryID: 'Harga Stabil Fluktuatif Rendah',
      priceTrajectoryEN: 'Low Volatility Price Band',
      priceMetric: 'Rp 36k–41k Band',
      sourcingPoints: [45, 50, 52, 60, 68, 75, 80],
      sourcingTrajectoryID: 'Peluang Aktif Bertambah',
      sourcingTrajectoryEN: 'Active Sourcing Rising',
      sourcingMetric: '2 WPS ≥ 70',
    },
    '30d': {
      gmvPoints: [38, 42, 45, 52, 58, 62, 70, 78],
      gmvTrajectoryID: 'Tren 30-Hari: ▲ Pertumbuhan Bulanan',
      gmvTrajectoryEN: '30-Day Trend: ▲ Monthly Growth',
      gmvMetric: '▲ +82% Akumulasi 30H',
      pricePoints: [46, 45, 44, 42, 43, 40, 38, 36],
      priceTrajectoryID: 'Rentang Stabil & Teruji',
      priceTrajectoryEN: 'Tested & Stable Price Band',
      priceMetric: 'Rp 34k–46k Band',
      sourcingPoints: [25, 30, 40, 48, 55, 65, 72, 80],
      sourcingTrajectoryID: 'Pipeline Berkualitas',
      sourcingTrajectoryEN: 'High Quality Pipeline',
      sourcingMetric: '2 WPS ≥ 70',
    },
    '90d': {
      gmvPoints: [25, 30, 42, 38, 55, 60, 52, 66, 70, 74, 72, 78],
      gmvTrajectoryID: 'Tren 90-Hari: ▲ Akselerasi Kuartal',
      gmvTrajectoryEN: '90-Day Trend: ▲ Quarterly Run-rate',
      gmvMetric: '▲ +212% Makro 90H',
      pricePoints: [48, 47, 45, 46, 42, 44, 38, 40, 39, 38, 37, 36],
      priceTrajectoryID: 'Rentang Stabil Jangka Panjang',
      priceTrajectoryEN: 'Long-term Stable Band',
      priceMetric: 'Rp 32k–50k Band',
      sourcingPoints: [10, 15, 20, 15, 35, 30, 50, 65, 70, 75, 78, 80],
      sourcingTrajectoryID: 'Ekspansi Pipeline Sourcing',
      sourcingTrajectoryEN: 'Expanded Sourcing Pipeline',
      sourcingMetric: '2 WPS ≥ 70',
    },
  },
  winning: {
    '7d': {
      gmvPoints: [78, 82, 85, 89, 92, 95, 98],
      gmvTrajectoryID: 'Tren 7-Hari: ▲ Lonjakan Tajam',
      gmvTrajectoryEN: '7-Day Trend: ▲ Sharp Surge',
      gmvMetric: '▲ +34% Velocity 7H',
      pricePoints: [67, 68, 68, 67, 68, 68, 68],
      priceTrajectoryID: 'Daya Beli Premium Kuat',
      priceTrajectoryEN: 'Strong Premium Demand',
      priceMetric: 'Rp 67k–68k Band',
      sourcingPoints: [85, 88, 90, 92, 94, 96, 98],
      sourcingTrajectoryID: 'Katalog Produk Unggulan',
      sourcingTrajectoryEN: 'Elite Winning Catalog',
      sourcingMetric: '2 Niche WPS ≥ 70',
    },
    '30d': {
      gmvPoints: [45, 52, 64, 72, 80, 88, 93, 98],
      gmvTrajectoryID: 'Tren 30-Hari: ▲ Momentum Tinggi',
      gmvTrajectoryEN: '30-Day Trend: ▲ High Momentum',
      gmvMetric: '▲ +118% Run-Rate 30H',
      pricePoints: [63, 64, 66, 67, 68, 68, 67, 68],
      priceTrajectoryID: 'Rentang Margin Premium',
      priceTrajectoryEN: 'Premium Margin Band',
      priceMetric: 'Rp 63k–68k Band',
      sourcingPoints: [55, 62, 70, 78, 85, 90, 95, 98],
      sourcingTrajectoryID: 'Konversi Sourcing Cepat',
      sourcingTrajectoryEN: 'High Sourcing Velocity',
      sourcingMetric: '2 Niche WPS ≥ 70',
    },
    '90d': {
      gmvPoints: [15, 25, 38, 50, 65, 78, 84, 88, 91, 94, 96, 98],
      gmvTrajectoryID: 'Tren 90-Hari: ▲ Lonjakan Eksponensial',
      gmvTrajectoryEN: '90-Day Trend: ▲ Exponential Surge',
      gmvMetric: '▲ +285% Surge Velocity',
      pricePoints: [60, 61, 62, 65, 66, 68, 67, 68, 67, 68, 68, 68],
      priceTrajectoryID: 'Margin Kokoh Tanpa Diskon',
      priceTrajectoryEN: 'Resilient Un-discounted Margin',
      priceMetric: 'Rp 60k–70k Band',
      sourcingPoints: [30, 40, 45, 55, 65, 75, 85, 88, 92, 94, 96, 98],
      sourcingTrajectoryID: 'Siklus Validasi Juara',
      sourcingTrajectoryEN: 'Winning Validation Run',
      sourcingMetric: '2 Niche WPS ≥ 70',
    },
  },
  'Ibu & Kebutuhan Bayi': {
    '7d': {
      gmvPoints: [82, 86, 88, 91, 93, 95, 96],
      gmvTrajectoryID: 'Tren 7-Hari: ▲ Permintaan Konsisten',
      gmvTrajectoryEN: '7-Day Trend: ▲ Consistent Demand',
      gmvMetric: '▲ +28% Surge 7H',
      pricePoints: [68, 68, 67, 68, 68, 68, 68],
      priceTrajectoryID: 'Harga Stabil & Kuat',
      priceTrajectoryEN: 'Firm Premium Pricing',
      priceMetric: 'Rp 67k–68k Band',
      sourcingPoints: [88, 90, 91, 93, 94, 95, 96],
      sourcingTrajectoryID: 'Peluang Sourcing Prioritas 1',
      sourcingTrajectoryEN: 'Top Priority Sourcing',
      sourcingMetric: 'WPS 93.4 (Rank 1)',
    },
    '30d': {
      gmvPoints: [50, 58, 68, 76, 84, 89, 93, 96],
      gmvTrajectoryID: 'Tren 30-Hari: ▲ Laju Bulanan Sehat',
      gmvTrajectoryEN: '30-Day Trend: ▲ Healthy Monthly Run',
      gmvMetric: '▲ +92% Momentum 30H',
      pricePoints: [66, 67, 67, 68, 68, 67, 68, 68],
      priceTrajectoryID: 'Ketahanan Harga Unggul',
      priceTrajectoryEN: 'Superior Price Inelasticity',
      priceMetric: 'Rp 66k–68k Band',
      sourcingPoints: [60, 68, 75, 82, 88, 91, 94, 96],
      sourcingTrajectoryID: 'Sourcing Segera Rekomendasi',
      sourcingTrajectoryEN: 'Immediate Sourcing Target',
      sourcingMetric: 'WPS 93.4 (Rank 1)',
    },
    '90d': {
      gmvPoints: [18, 28, 40, 55, 68, 78, 82, 86, 90, 92, 94, 96],
      gmvTrajectoryID: 'Tren 90-Hari: ▲ Lonjakan Kuartalan',
      gmvTrajectoryEN: '90-Day Trend: ▲ Quarterly Surge',
      gmvMetric: '▲ +85% Surge Velocity',
      pricePoints: [65, 65, 66, 67, 68, 68, 67, 68, 67, 68, 68, 68],
      priceTrajectoryID: 'Harga Stabil & Kuat',
      priceTrajectoryEN: 'Firm Premium Pricing',
      priceMetric: 'Rp 65k–70k Band',
      sourcingPoints: [20, 35, 50, 65, 78, 84, 88, 90, 92, 94, 95, 96],
      sourcingTrajectoryID: 'Peluang Sourcing Terbaik',
      sourcingTrajectoryEN: 'Top Priority Sourcing',
      sourcingMetric: 'WPS 93.4 (Rank 1)',
    },
  },
  'Dapur & Makanan': {
    '7d': {
      gmvPoints: [68, 71, 74, 76, 79, 81, 82],
      gmvTrajectoryID: 'Tren 7-Hari: ▲ Permintaan Cepat',
      gmvTrajectoryEN: '7-Day Trend: ▲ Fast Velocity',
      gmvMetric: '▲ +20% Turn Velocity',
      pricePoints: [25, 24, 25, 25, 24, 25, 25],
      priceTrajectoryID: 'Rentang Terjangkau & Cepat',
      priceTrajectoryEN: 'High Turn Velocity Band',
      priceMetric: 'Rp 24k–25k Band',
      sourcingPoints: [62, 64, 66, 68, 69, 71, 72],
      sourcingTrajectoryID: 'Siap Maklon BPOM',
      sourcingTrajectoryEN: 'Ready for OEM Sourcing',
      sourcingMetric: 'WPS 71.1 (Rank 2)',
    },
    '30d': {
      gmvPoints: [48, 54, 60, 66, 70, 74, 78, 82],
      gmvTrajectoryID: 'Tren 30-Hari: ▲ Penjualan Rutin',
      gmvTrajectoryEN: '30-Day Trend: ▲ Steady Consumer Turn',
      gmvMetric: '▲ +71% Akumulasi 30H',
      pricePoints: [23, 24, 24, 25, 24, 25, 25, 25],
      priceTrajectoryID: 'Rentang Terjangkau & Cepat',
      priceTrajectoryEN: 'High Turn Velocity Band',
      priceMetric: 'Rp 23k–25k Band',
      sourcingPoints: [45, 50, 56, 62, 65, 68, 70, 72],
      sourcingTrajectoryID: 'Siap Maklon BPOM',
      sourcingTrajectoryEN: 'Ready for OEM Sourcing',
      sourcingMetric: 'WPS 71.1 (Rank 2)',
    },
    '90d': {
      gmvPoints: [28, 35, 40, 48, 55, 64, 68, 72, 75, 77, 80, 82],
      gmvTrajectoryID: 'Tren 90-Hari: ▲ Permintaan Tinggi',
      gmvTrajectoryEN: '90-Day Trend: ▲ Strong Consumer Demand',
      gmvMetric: '▲ +52% High Demand',
      pricePoints: [22, 23, 23, 24, 24, 25, 24, 25, 24, 25, 25, 25],
      priceTrajectoryID: 'Rentang Terjangkau & Cepat',
      priceTrajectoryEN: 'High Turn Velocity Band',
      priceMetric: 'Rp 22k–26k Band',
      sourcingPoints: [15, 25, 35, 45, 55, 62, 65, 68, 69, 70, 71, 72],
      sourcingTrajectoryID: 'Siap Maklon BPOM',
      sourcingTrajectoryEN: 'Ready for OEM Sourcing',
      sourcingMetric: 'WPS 71.1 (Rank 2)',
    },
  },
  'Elektronik & Gadget': {
    '7d': {
      gmvPoints: [68, 68, 67, 67, 66, 66, 66],
      gmvTrajectoryID: 'Tren 7-Hari: ► Volume Stabil',
      gmvTrajectoryEN: '7-Day Trend: ► Stable Volume',
      gmvMetric: '► Volume Stabil 7H',
      pricePoints: [19, 19, 18, 18, 18, 18, 18],
      priceTrajectoryID: 'Persaingan Harga Ketat',
      priceTrajectoryEN: 'High Price Pressure Band',
      priceMetric: 'Rp 18k–19k Band',
      sourcingPoints: [20, 19, 18, 17, 17, 16, 16],
      sourcingTrajectoryID: 'Pasar Sangat Padat',
      sourcingTrajectoryEN: 'Saturated & Low Margin',
      sourcingMetric: 'WPS 15.4 (Saturated)',
    },
    '30d': {
      gmvPoints: [70, 69, 69, 68, 68, 67, 66, 66],
      gmvTrajectoryID: 'Tren 30-Hari: ► Tren Datar Bulanan',
      gmvTrajectoryEN: '30-Day Trend: ► Flat Monthly Run',
      gmvMetric: '► Volume 354k Unit/Bln',
      pricePoints: [20, 20, 19, 19, 19, 18, 18, 18],
      priceTrajectoryID: 'Persaingan Harga Ketat',
      priceTrajectoryEN: 'High Price Pressure Band',
      priceMetric: 'Rp 18k–20k Band',
      sourcingPoints: [26, 24, 22, 20, 19, 18, 17, 16],
      sourcingTrajectoryID: 'Pasar Sangat Padat',
      sourcingTrajectoryEN: 'Saturated & Low Margin',
      sourcingMetric: 'WPS 15.4 (Saturated)',
    },
    '90d': {
      gmvPoints: [72, 70, 68, 71, 69, 68, 67, 67, 66, 66, 66, 66],
      gmvTrajectoryID: 'Tren 90-Hari: ► Pasar Matang',
      gmvTrajectoryEN: '90-Day Trend: ► Mature Market',
      gmvMetric: '► Volume 354k Unit/Bln',
      pricePoints: [24, 22, 21, 20, 19, 19, 18, 18, 18, 18, 18, 18],
      priceTrajectoryID: 'Persaingan Harga Ketat',
      priceTrajectoryEN: 'High Price Pressure Band',
      priceMetric: 'Rp 16k–20k Band',
      sourcingPoints: [40, 35, 30, 28, 25, 22, 20, 19, 18, 17, 16, 16],
      sourcingTrajectoryID: 'Pasar Sangat Padat',
      sourcingTrajectoryEN: 'Saturated & Low Margin',
      sourcingMetric: 'WPS 15.4 (Saturated)',
    },
  },
  'Otomotif & Pengendara': {
    '7d': {
      gmvPoints: [49, 50, 51, 52, 53, 53, 54],
      gmvTrajectoryID: 'Tren 7-Hari: ▲ Permintaan Naik',
      gmvTrajectoryEN: '7-Day Trend: ▲ Rising Demand',
      gmvMetric: '▲ +10% Momentum 7H',
      pricePoints: [45, 45, 45, 46, 45, 45, 45],
      priceTrajectoryID: 'Rentang Menengah Stabil',
      priceTrajectoryEN: 'Stable Mid-Tier Pricing',
      priceMetric: 'Rp 45k Band',
      sourcingPoints: [34, 34, 35, 35, 36, 36, 36],
      sourcingTrajectoryID: 'Perlu Uji Sampel Ekstra',
      sourcingTrajectoryEN: 'Sample Testing Required',
      sourcingMetric: 'WPS 36.3 (Borderline)',
    },
    '30d': {
      gmvPoints: [44, 46, 47, 49, 50, 51, 52, 54],
      gmvTrajectoryID: 'Tren 30-Hari: ▲ Pertumbuhan Sehat',
      gmvTrajectoryEN: '30-Day Trend: ▲ Healthy Mid Run',
      gmvMetric: '▲ +23% 30-Hari',
      pricePoints: [43, 44, 44, 45, 45, 46, 45, 45],
      priceTrajectoryID: 'Rentang Menengah Stabil',
      priceTrajectoryEN: 'Stable Mid-Tier Pricing',
      priceMetric: 'Rp 43k–46k Band',
      sourcingPoints: [30, 31, 32, 33, 34, 35, 36, 36],
      sourcingTrajectoryID: 'Perlu Uji Sampel Ekstra',
      sourcingTrajectoryEN: 'Sample Testing Required',
      sourcingMetric: 'WPS 36.3 (Borderline)',
    },
    '90d': {
      gmvPoints: [38, 40, 39, 44, 46, 50, 48, 50, 51, 52, 53, 54],
      gmvTrajectoryID: 'Tren 90-Hari: ▲ Pertumbuhan Sedang',
      gmvTrajectoryEN: '90-Day Trend: ▲ Moderate Growth',
      gmvMetric: '▲ +18% Moderate',
      pricePoints: [42, 43, 44, 45, 45, 46, 45, 45, 45, 46, 45, 45],
      priceTrajectoryID: 'Rentang Menengah Stabil',
      priceTrajectoryEN: 'Stable Mid-Tier Pricing',
      priceMetric: 'Rp 42k–48k Band',
      sourcingPoints: [25, 28, 30, 32, 34, 35, 35, 36, 36, 36, 36, 36],
      sourcingTrajectoryID: 'Perlu Uji Sampel Ekstra',
      sourcingTrajectoryEN: 'Sample Testing Required',
      sourcingMetric: 'WPS 36.3 (Borderline)',
    },
  },
  'Perlengkapan Rumah & Dapur': {
    '7d': {
      gmvPoints: [38, 38, 39, 40, 40, 41, 41],
      gmvTrajectoryID: 'Tren 7-Hari: ► Niche Stabil',
      gmvTrajectoryEN: '7-Day Trend: ► Niche Stability',
      gmvMetric: '► Stabil 7H',
      pricePoints: [38, 38, 38, 38, 38, 38, 38],
      priceTrajectoryID: 'Harga Kokoh & Konsisten',
      priceTrajectoryEN: 'Firm Consistent Pricing',
      priceMetric: 'Rp 38k Band',
      sourcingPoints: [20, 20, 19, 19, 19, 18, 18],
      sourcingTrajectoryID: 'Volume Terbatas',
      sourcingTrajectoryEN: 'Limited Scalability',
      sourcingMetric: 'WPS 18.1 (Niche Only)',
    },
    '30d': {
      gmvPoints: [35, 36, 36, 37, 38, 39, 40, 41],
      gmvTrajectoryID: 'Tren 30-Hari: ► Permintaan Konstan',
      gmvTrajectoryEN: '30-Day Trend: ► Constant Monthly Turn',
      gmvMetric: '► +17% 30-Hari',
      pricePoints: [37, 37, 37, 38, 38, 38, 38, 38],
      priceTrajectoryID: 'Harga Kokoh & Konsisten',
      priceTrajectoryEN: 'Firm Consistent Pricing',
      priceMetric: 'Rp 37k–38k Band',
      sourcingPoints: [22, 22, 21, 21, 20, 20, 19, 18],
      sourcingTrajectoryID: 'Volume Terbatas',
      sourcingTrajectoryEN: 'Limited Scalability',
      sourcingMetric: 'WPS 18.1 (Niche Only)',
    },
    '90d': {
      gmvPoints: [32, 33, 35, 34, 36, 37, 39, 39, 40, 40, 41, 41],
      gmvTrajectoryID: 'Tren 90-Hari: ► Niche Stabil',
      gmvTrajectoryEN: '90-Day Trend: ► Niche Stability',
      gmvMetric: '► +12% Steady Demand',
      pricePoints: [36, 37, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38],
      priceTrajectoryID: 'Harga Kokoh & Konsisten',
      priceTrajectoryEN: 'Firm Consistent Pricing',
      priceMetric: 'Rp 35k–40k Band',
      sourcingPoints: [20, 22, 21, 23, 22, 20, 20, 19, 19, 18, 18, 18],
      sourcingTrajectoryID: 'Volume Terbatas',
      sourcingTrajectoryEN: 'Limited Scalability',
      sourcingMetric: 'WPS 18.1 (Niche Only)',
    },
  },
  'Kecantikan & Skincare': {
    '7d': {
      gmvPoints: [44, 43, 43, 42, 42, 41, 41],
      gmvTrajectoryID: 'Tren 7-Hari: ▼ Iklan Padat',
      gmvTrajectoryEN: '7-Day Trend: ▼ High Ad Friction',
      gmvMetric: '▼ -5% Weekly CAC',
      pricePoints: [79, 79, 79, 78, 79, 79, 79],
      priceTrajectoryID: 'Rentang Premium Bersaing',
      priceTrajectoryEN: 'Competitive Premium Band',
      priceMetric: 'Rp 79k Band',
      sourcingPoints: [43, 44, 44, 44, 45, 45, 45],
      sourcingTrajectoryID: 'Biaya Akuisisi Tinggi',
      sourcingTrajectoryEN: 'High Acquisition Cost',
      sourcingMetric: 'WPS 44.6 (High CAC)',
    },
    '30d': {
      gmvPoints: [48, 47, 46, 45, 44, 43, 42, 41],
      gmvTrajectoryID: 'Tren 30-Hari: ▼ Persaingan Iklan Ketat',
      gmvTrajectoryEN: '30-Day Trend: ▼ Ad Fatigue Pressure',
      gmvMetric: '▼ -15% Bulanan CAC',
      pricePoints: [81, 80, 80, 79, 78, 79, 79, 79],
      priceTrajectoryID: 'Rentang Premium Bersaing',
      priceTrajectoryEN: 'Competitive Premium Band',
      priceMetric: 'Rp 78k–81k Band',
      sourcingPoints: [38, 39, 40, 41, 42, 43, 44, 45],
      sourcingTrajectoryID: 'Biaya Akuisisi Tinggi',
      sourcingTrajectoryEN: 'High Acquisition Cost',
      sourcingMetric: 'WPS 44.6 (High CAC)',
    },
    '90d': {
      gmvPoints: [58, 55, 53, 50, 48, 46, 45, 44, 43, 42, 42, 41],
      gmvTrajectoryID: 'Tren 90-Hari: ▼ Persaingan Iklan Ketat',
      gmvTrajectoryEN: '90-Day Trend: ▼ High Ad Saturation',
      gmvMetric: '▼ -14% High Ad CAC',
      pricePoints: [86, 84, 82, 80, 79, 78, 79, 78, 79, 79, 79, 79],
      priceTrajectoryID: 'Rentang Premium Bersaing',
      priceTrajectoryEN: 'Competitive Premium Band',
      priceMetric: 'Rp 75k–85k Band',
      sourcingPoints: [30, 32, 35, 38, 40, 42, 42, 43, 44, 44, 45, 45],
      sourcingTrajectoryID: 'Biaya Akuisisi Tinggi',
      sourcingTrajectoryEN: 'High Acquisition Cost',
      sourcingMetric: 'WPS 44.6 (High CAC)',
    },
  },
}

export default function MarketOverview({ initialData, categoryAnalytics }: Props) {
  const { lang, t } = useLanguage()

  // Filter Scope: 'all' | 'winning' | category_name
  const [selectedScope, setSelectedScope] = useState<string>('all')

  // Filter Timeframe: '7d' | '30d' | '90d'
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('7d')

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

  // Dynamic Trend Data based on chosen scope and timeframe
  const currentTrend = useMemo(() => {
    const scopeData = MULTI_SCOPE_TREND_DATA[selectedScope] || MULTI_SCOPE_TREND_DATA.all
    return scopeData[selectedTimeframe] || scopeData['7d']
  }, [selectedScope, selectedTimeframe])

  // Data with timeframe-responsive search trend index
  const displayData = useMemo(() => {
    return filteredData.map((d: any) => {
      const factor = selectedTimeframe === '7d' ? 1.05 : selectedTimeframe === '90d' ? 0.95 : 1.0
      const trend = Math.min(100, Math.max(1, Math.round((d.search_trend_index || 50) * factor * 10) / 10))
      return {
        ...d,
        search_trend_index: trend,
      }
    })
  }, [filteredData, selectedTimeframe])

  return (
    <div className="market-overview-grid">
      {/* Left Column: Scope Filter, KPIs, Chart, and Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Scope Filter Bar with Timeframe Filter */}
        <ScopeFilterBar
          selectedScope={selectedScope}
          onScopeChange={setSelectedScope}
          categories={categories}
          showWinningNichesOption={true}
          totalItemsCount={filteredData.length}
          itemsLabel={t('niche_analyzed')}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
        />

        {/* 3 Metric Cards with sparklines — Disesuaikan secara dinamis */}
        <div className="kpi-grid">
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
        <BubbleChart data={displayData} />

        {/* Top Product Opportunities Table — Compact & Non-scroll */}
        <WpsTable
          data={displayData}
          categoryScope={selectedScope}
          categoryMedianPrice={categoryBaselinePrice}
        />
      </div>

      {/* Right Column: Semi-circle Gauge & Quick Insights */}
      <div className="market-right-col">
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
