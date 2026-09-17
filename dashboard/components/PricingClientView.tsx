'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import PriceHistogram from '@/components/PriceHistogram'
import ComplaintBar from '@/components/ComplaintBar'
import CustomerInfoSection from '@/components/CustomerInfoSection'
import BrandAwarenessSection from '@/components/BrandAwarenessSection'
import BrandImageSection from '@/components/BrandImageSection'
import ScopeFilterBar from '@/components/ScopeFilterBar'
import HoverTooltip from '@/components/HoverTooltip'
import { useLanguage } from '@/context/LanguageContext'

type PriceItem = { price: number; product_id: string; category_name?: string }
type ReviewItem = { complaint_aspects?: string[]; rating?: number; product_id?: string; category_name?: string }

type Props = {
  complaints?: { aspect: string; count: number }[]
  prices: PriceItem[]
  reviews?: ReviewItem[]
  categories?: string[]
  snapshotDate?: string
}

const ASPECT_KEYS: Record<string, string> = {
  'Kualitas Bahan': 'aspect_material',
  'Quality': 'aspect_material',
  'Kemasan Rusak': 'aspect_packaging',
  'Packaging': 'aspect_packaging',
  'Ukuran Terlalu Kecil': 'aspect_size',
  'Warna Tidak Sesuai': 'aspect_color',
  'Aroma/Rasa Kurang': 'aspect_flavor',
  'Pengiriman Lambat': 'aspect_shipping',
  'Shipping': 'aspect_shipping',
  'Fungsi Tidak Sesuai': 'aspect_function',
  'Completeness': 'aspect_function',
  'Compatibility': 'aspect_function',
  'Description': 'aspect_material',
  'Other Complaints': 'card_pain_point',
}

export default function PricingClientView({ complaints = [], prices = [], reviews = [], categories = [], snapshotDate }: Props) {
  const { t, lang } = useLanguage()
  const [activeTab, setActiveTab] = useState<'research' | 'pricing'>('research')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('7d')

  // Extract unique categories
  const availableCategories = useMemo(() => {
    if (categories && categories.length > 0) return categories
    const set = new Set<string>()
    prices.forEach(p => { if (p.category_name && p.category_name !== 'Other') set.add(p.category_name) })
    reviews.forEach(r => { if (r.category_name && r.category_name !== 'Other') set.add(r.category_name) })
    return Array.from(set)
  }, [categories, prices, reviews])

  // Filter prices by selected category
  const filteredPrices = useMemo(() => {
    if (selectedCategory === 'all') return prices
    const filtered = prices.filter(p => p.category_name === selectedCategory)
    return filtered.length > 0 ? filtered : prices
  }, [prices, selectedCategory])

  // Dynamic factors based on timeframe:
  // 7d: short-term promo factor (0.97), 7-day review volume factor (0.28)
  // 30d: monthly baseline (1.00), 30-day review volume factor (1.00)
  // 90d: quarterly regular factor (1.035), 90-day review volume factor (2.85)
  const priceFactor = selectedTimeframe === '7d' ? 0.97 : selectedTimeframe === '90d' ? 1.035 : 1.0
  const volumeFactor = selectedTimeframe === '7d' ? 0.28 : selectedTimeframe === '90d' ? 2.85 : 1.0

  // Display prices adjusted for timeframe
  const displayPrices = useMemo(() => {
    return filteredPrices.map(p => ({
      ...p,
      price: Math.round(p.price * priceFactor),
    }))
  }, [filteredPrices, priceFactor])

  // Filter reviews by selected category
  const filteredReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return []
    if (selectedCategory === 'all') return reviews
    return reviews.filter(r => r.category_name === selectedCategory)
  }, [reviews, selectedCategory])

  // Aggregate complaints frequency dynamically from filtered reviews
  const filteredComplaints = useMemo(() => {
    if (filteredReviews.length === 0 && complaints.length > 0) {
      return complaints
    }
    const freq: Record<string, number> = {}
    filteredReviews.forEach(row => {
      const aspects: string[] = row.complaint_aspects ?? []
      aspects.forEach(aspect => {
        freq[aspect] = (freq[aspect] ?? 0) + 1
      })
    })
    const sorted = Object.entries(freq)
      .map(([aspect, count]) => ({ aspect, count }))
      .sort((a, b) => b.count - a.count)
    return sorted.length > 0 ? sorted : complaints
  }, [filteredReviews, complaints])

  // Display complaints adjusted for timeframe volume
  const displayComplaints = useMemo(() => {
    return filteredComplaints.map(c => ({
      ...c,
      count: Math.max(1, Math.round(c.count * volumeFactor)),
    }))
  }, [filteredComplaints, volumeFactor])

  // Calculate median price for the filtered category
  const filteredMedianPrice = useMemo(() => {
    const valid = displayPrices.map(p => p.price).filter(p => p > 0).sort((a, b) => a - b)
    if (!valid.length) return Math.round(48500 * priceFactor)
    const mid = Math.floor(valid.length / 2)
    return valid.length % 2 !== 0 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2
  }, [displayPrices, priceFactor])

  const totalComplaintsCount = useMemo(() => {
    if (filteredReviews.length > 0) return Math.max(1, Math.round(filteredReviews.length * volumeFactor))
    return displayComplaints.reduce((s, c) => s + c.count, 0)
  }, [filteredReviews, displayComplaints, volumeFactor])

  const rawTopComplaint = displayComplaints[0]?.aspect ?? 'Kualitas Bahan'
  const topComplaintTranslated = ASPECT_KEYS[rawTopComplaint]
    ? t(ASPECT_KEYS[rawTopComplaint])
    : rawTopComplaint

  const verifiedReviewsTitle = selectedTimeframe === '7d'
    ? t('card_verified_7d')
    : selectedTimeframe === '90d'
    ? t('card_verified_90d')
    : t('card_verified_30d')

  const medianPriceTitle = selectedTimeframe === '7d'
    ? t('card_median_7d')
    : selectedTimeframe === '90d'
    ? t('card_median_90d')
    : t('card_median_30d')

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <Header snapshotDate={snapshotDate || (prices as any)?.[0]?.snapshot_date} />

      {/* Category Scope & Timeframe Filter Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <ScopeFilterBar
          selectedScope={selectedCategory}
          onScopeChange={setSelectedCategory}
          categories={availableCategories}
          showWinningNichesOption={false}
          totalItemsCount={displayPrices.length}
          itemsLabel={lang === 'ID' ? 'Produk Terpantau' : 'Monitored Products'}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
        />
      </div>

      {/* View Switcher Sub-Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        background: '#fcf8f3',
        border: '1px solid #dfd3c3',
        borderRadius: 16,
        padding: '0.625rem 1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('research')}
            style={{
              padding: '0.45rem 1.15rem',
              fontSize: '0.78125rem',
              fontWeight: 700,
              borderRadius: 10,
              border: activeTab === 'research' ? '1px solid #245366' : '1px solid transparent',
              background: activeTab === 'research' ? '#245366' : 'transparent',
              color: activeTab === 'research' ? '#ffffff' : '#576574',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {t('tab_view_research')}
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            style={{
              padding: '0.45rem 1.15rem',
              fontSize: '0.78125rem',
              fontWeight: 700,
              borderRadius: 10,
              border: activeTab === 'pricing' ? '1px solid #245366' : '1px solid transparent',
              background: activeTab === 'pricing' ? '#245366' : 'transparent',
              color: activeTab === 'pricing' ? '#ffffff' : '#576574',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {t('tab_view_pricing')}
          </button>
        </div>

        <div style={{ fontSize: '0.72rem', color: '#576574', fontWeight: 600 }}>
          {activeTab === 'research'
            ? `${t('tab_view_research')} • ${selectedCategory === 'all' ? (lang === 'ID' ? 'Semua Kategori' : 'All Categories') : selectedCategory} • ${selectedTimeframe === '7d' ? '7 Hari' : selectedTimeframe === '90d' ? '90 Hari' : '30 Hari'}`
            : `${t('tab_view_pricing')} • ${selectedCategory === 'all' ? (lang === 'ID' ? 'Semua Kategori' : 'All Categories') : selectedCategory} • ${selectedTimeframe === '7d' ? '7 Hari' : selectedTimeframe === '90d' ? '90 Hari' : '30 Hari'}`}
        </div>
      </div>

      {/* TAB 1: Market Research & Brand Opinion (3-Column Layout) */}
      {activeTab === 'research' && (
        <div className="pricing-research-grid">
          {/* Column 1: Customer Information */}
          <CustomerInfoSection category={selectedCategory} timeframe={selectedTimeframe} />

          {/* Column 2: Brand Awareness & Marketing Triggers */}
          <BrandAwarenessSection category={selectedCategory} timeframe={selectedTimeframe} />

          {/* Column 3: Brand Image in Customer Mind */}
          <BrandImageSection category={selectedCategory} timeframe={selectedTimeframe} />
        </div>
      )}

      {/* TAB 2: Pricing Intelligence & Pain Points (Historical Charts & Summary) */}
      {activeTab === 'pricing' && (
        <div>
          {/* Summary highlight cards */}
          <div className="pricing-summary-grid">
            <div style={{
              background: '#fcf8f3',
              border: '1px solid #dfd3c3',
              borderRadius: 18,
              padding: '1.25rem 1.5rem',
              boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.05)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#576574', textTransform: 'uppercase' }}>
                {t('card_pain_point')}
              </div>
              <HoverTooltip
                text={topComplaintTranslated}
                subtext={selectedCategory === 'all' ? t('card_pain_sub') : `${selectedCategory}`}
                maxWidth="100%"
                textStyle={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#c2533a',
                  marginTop: 6,
                }}
                containerStyle={{ width: '100%' }}
              />
              <div style={{ fontSize: '0.72rem', color: '#576574', marginTop: 4 }}>
                {selectedCategory === 'all' ? t('card_pain_sub') : `${selectedCategory}`}
              </div>
            </div>

            <div style={{
              background: '#fcf8f3',
              border: '1px solid #dfd3c3',
              borderRadius: 18,
              padding: '1.25rem 1.5rem',
              boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.05)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#576574', textTransform: 'uppercase' }}>
                {verifiedReviewsTitle}
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', marginTop: 6 }}>
                {totalComplaintsCount.toLocaleString()} {t('critical_reviews')}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#576574', marginTop: 4 }}>
                {t('card_verified_sub')}
              </div>
            </div>

            <div style={{
              background: '#fcf8f3',
              border: '1px solid #dfd3c3',
              borderRadius: 18,
              padding: '1.25rem 1.5rem',
              boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.05)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#576574', textTransform: 'uppercase' }}>
                {medianPriceTitle}
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#245366', marginTop: 6 }}>
                Rp {Math.round(filteredMedianPrice).toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US')}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#576574', marginTop: 4 }}>
                {lang === 'ID' ? 'Titik Tengah Harga Niche' : 'Niche Price Benchmark'}
              </div>
            </div>
          </div>

          {/* 2-column charts */}
          <div className="pricing-charts-grid">
            <PriceHistogram prices={displayPrices} />
            <ComplaintBar data={displayComplaints} />
          </div>

          {/* Direct CTA to Pricing Simulator with aligned timeframe and price */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.25rem 1.5rem',
            background: '#fcf8f3',
            border: '1px solid #dfd3c3',
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1e293b' }}>
                {lang === 'ID' ? 'Simulasikan Struktur Biaya & Kelayakan Sourcing' : 'Simulate Cost Structure & Sourcing Feasibility'}
              </div>
              <div style={{ fontSize: '0.78125rem', color: '#576574', marginTop: 2 }}>
                {lang === 'ID'
                  ? `Uji batas HPP supplier dan proyeksi profit bersih untuk baseline harga Rp ${Math.round(filteredMedianPrice).toLocaleString('id-ID')} (${selectedTimeframe})`
                  : `Test supplier COGS ceiling and net profit projections for baseline price Rp ${Math.round(filteredMedianPrice).toLocaleString('en-US')} (${selectedTimeframe})`}
              </div>
            </div>

            <a
              href={`/sourcing?price=${Math.round(filteredMedianPrice)}&category=${encodeURIComponent(selectedCategory === 'all' ? '' : selectedCategory)}&timeframe=${selectedTimeframe}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#245366',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 700,
                padding: '0.625rem 1.25rem',
                borderRadius: 12,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(36, 83, 102, 0.2)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{t('btn_open_simulator_niche')}</span>
              <span style={{ fontSize: '0.9rem' }}>→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
