'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import PriceHistogram from '@/components/PriceHistogram'
import ComplaintBar from '@/components/ComplaintBar'
import CustomerInfoSection from '@/components/CustomerInfoSection'
import BrandAwarenessSection from '@/components/BrandAwarenessSection'
import BrandImageSection from '@/components/BrandImageSection'
import { useLanguage } from '@/context/LanguageContext'

type PriceItem = { price: number; product_id: string; category_name?: string }
type ReviewItem = { complaint_aspects?: string[]; rating?: number; product_id?: string; category_name?: string }

type Props = {
  complaints?: { aspect: string; count: number }[]
  prices: PriceItem[]
  reviews?: ReviewItem[]
  categories?: string[]
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

export default function PricingClientView({ complaints = [], prices = [], reviews = [], categories = [] }: Props) {
  const { t, lang } = useLanguage()
  const [activeTab, setActiveTab] = useState<'research' | 'pricing'>('research')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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

  // Calculate median price for the filtered category
  const filteredMedianPrice = useMemo(() => {
    const valid = filteredPrices.map(p => p.price).filter(p => p > 0).sort((a, b) => a - b)
    if (!valid.length) return 48500
    const mid = Math.floor(valid.length / 2)
    return valid.length % 2 !== 0 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2
  }, [filteredPrices])

  const totalComplaintsCount = useMemo(() => {
    if (filteredReviews.length > 0) return filteredReviews.length
    return filteredComplaints.reduce((s, c) => s + c.count, 0)
  }, [filteredReviews, filteredComplaints])

  const rawTopComplaint = filteredComplaints[0]?.aspect ?? 'Kualitas Bahan'
  const topComplaintTranslated = ASPECT_KEYS[rawTopComplaint]
    ? t(ASPECT_KEYS[rawTopComplaint])
    : rawTopComplaint

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <Header />

      {/* Category Scope Filter Bar */}
      <div style={{
        background: '#fcf8f3',
        border: '1px solid #dfd3c3',
        borderRadius: 16,
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxShadow: '0 2px 8px rgba(36, 83, 102, 0.04)',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
            {t('scope_filter_label')}
          </span>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#245366',
            background: 'rgba(36, 83, 102, 0.1)',
            padding: '3px 9px',
            borderRadius: 6,
            border: '1px solid rgba(36, 83, 102, 0.25)',
          }}>
            {selectedCategory === 'all'
              ? (lang === 'ID' ? 'Semua Kategori' : 'All Categories')
              : selectedCategory}
          </span>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            background: '#f5ede2',
            border: '1px solid #dfd3c3',
            borderRadius: 10,
            padding: '0.45rem 0.9rem',
            fontSize: '0.78125rem',
            fontWeight: 600,
            color: '#1e293b',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="all">
            {lang === 'ID' ? 'Semua Kategori (Lintas Pasar)' : 'All Categories (Cross-Market)'}
          </option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
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
            ? `${t('tab_view_research')} • ${selectedCategory === 'all' ? (lang === 'ID' ? 'Semua Kategori' : 'All Categories') : selectedCategory}`
            : `${t('tab_view_pricing')} • ${selectedCategory === 'all' ? (lang === 'ID' ? 'Semua Kategori' : 'All Categories') : selectedCategory}`}
        </div>
      </div>

      {/* TAB 1: Market Research & Brand Opinion (3-Column Layout) */}
      {activeTab === 'research' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.25rem',
          alignItems: 'stretch',
        }}>
          {/* Column 1: Customer Information */}
          <CustomerInfoSection category={selectedCategory} />

          {/* Column 2: Brand Awareness & Marketing Triggers */}
          <BrandAwarenessSection category={selectedCategory} />

          {/* Column 3: Brand Image in Customer Mind */}
          <BrandImageSection category={selectedCategory} />
        </div>
      )}

      {/* TAB 2: Pricing Intelligence & Pain Points (Historical Charts & Summary) */}
      {activeTab === 'pricing' && (
        <div>
          {/* Summary highlight cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
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
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#c2533a', marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {topComplaintTranslated}
              </div>
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
                {t('card_verified')}
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
                {lang === 'ID' ? 'Median Harga Pasar' : 'Median Market Price'}
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '1.75rem',
          }}>
            <PriceHistogram prices={filteredPrices} />
            <ComplaintBar data={filteredComplaints} />
          </div>
        </div>
      )}
    </div>
  )
}
