'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import PriceHistogram from '@/components/PriceHistogram'
import ComplaintBar from '@/components/ComplaintBar'
import CustomerInfoSection from '@/components/CustomerInfoSection'
import BrandAwarenessSection from '@/components/BrandAwarenessSection'
import BrandImageSection from '@/components/BrandImageSection'
import { useLanguage } from '@/context/LanguageContext'

type Props = {
  complaints: { aspect: string; count: number }[]
  prices: { price: number; product_id: string }[]
}

const ASPECT_KEYS: Record<string, string> = {
  'Kualitas Bahan': 'aspect_material',
  'Kemasan Rusak': 'aspect_packaging',
  'Ukuran Terlalu Kecil': 'aspect_size',
  'Warna Tidak Sesuai': 'aspect_color',
  'Aroma/Rasa Kurang': 'aspect_flavor',
  'Pengiriman Lambat': 'aspect_shipping',
  'Fungsi Tidak Sesuai': 'aspect_function',
}

export default function PricingClientView({ complaints, prices }: Props) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'research' | 'pricing'>('research')

  const totalComplaints = complaints.reduce((s: number, c: any) => s + c.count, 0)
  const rawTopComplaint = complaints[0]?.aspect ?? 'Kualitas Bahan'
  const topComplaintTranslated = ASPECT_KEYS[rawTopComplaint]
    ? t(ASPECT_KEYS[rawTopComplaint])
    : rawTopComplaint

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <Header />

      {/* View Switcher Sub-Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        background: '#151b2e',
        border: '1px solid #202a48',
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
              border: activeTab === 'research' ? '1px solid #38bdf8' : '1px solid transparent',
              background: activeTab === 'research' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeTab === 'research' ? '#38bdf8' : '#94a3b8',
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
              border: activeTab === 'pricing' ? '1px solid #38bdf8' : '1px solid transparent',
              background: activeTab === 'pricing' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeTab === 'pricing' ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {t('tab_view_pricing')}
          </button>
        </div>

        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
          {activeTab === 'research'
            ? 'Market Perception & Customer Demographics Module'
            : 'Price Sweet Spot & Negative Review NLP Clusters'}
        </div>
      </div>

      {/* TAB 1: Market Research & Brand Opinion (3-Column Layout matching the slide) */}
      {activeTab === 'research' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.25rem',
          alignItems: 'stretch',
        }}>
          {/* Column 1: Customer Information */}
          <CustomerInfoSection />

          {/* Column 2: Brand Awareness & Marketing Triggers */}
          <BrandAwarenessSection />

          {/* Column 3: Brand Image in Customer Mind */}
          <BrandImageSection />
        </div>
      )}

      {/* TAB 2: Pricing Intelligence & Pain Points (Historical Charts & Summary) */}
      {activeTab === 'pricing' && (
        <div>
          {/* Summary highlight cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            <div style={{
              background: '#151b2e',
              border: '1px solid #202a48',
              borderRadius: 18,
              padding: '1.25rem 1.5rem',
              boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.2)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                {t('card_pain_point')}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ff6b4a', marginTop: 6 }}>
                {topComplaintTranslated}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                {t('card_pain_sub')}
              </div>
            </div>

            <div style={{
              background: '#151b2e',
              border: '1px solid #202a48',
              borderRadius: 18,
              padding: '1.25rem 1.5rem',
              boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.2)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                {t('card_verified')}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginTop: 6 }}>
                {totalComplaints.toLocaleString()} {t('critical_reviews')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                {t('card_verified_sub')}
              </div>
            </div>
          </div>

          {/* 2-column charts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '1.75rem',
          }}>
            <PriceHistogram prices={prices} />
            <ComplaintBar data={complaints} />
          </div>
        </div>
      )}
    </div>
  )
}
