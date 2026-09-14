'use client'

import { useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'

type Props = {
  title?: string
  subtitle?: string
}

export default function Header({
  title,
  subtitle,
}: Props) {
  const pathname = usePathname()
  const [lang, setLang] = useState<'ID' | 'EN'>('ID')

  // Tentukan nama tab aktif saat ini
  const currentTab =
    pathname === '/pricing'
      ? 'Analytics'
      : pathname === '/sourcing'
      ? 'Pricing Simulator'
      : 'Overall Summary'

  const activeTitle = title || currentTab
  const activeSubtitle = subtitle || (
    currentTab === 'Analytics'
      ? (lang === 'ID' ? 'Analisis sweet spot harga jual dan titik kelemahan produk kompetitor' : 'Price sweet spot analysis and competitor complaint insights')
      : currentTab === 'Pricing Simulator'
      ? (lang === 'ID' ? 'Validasi batas maksimal HPP supplier sebelum melakukan pemesanan stok' : 'Supplier COGS ceiling and target margin feasibility simulator')
      : (lang === 'ID' ? 'Analitik mendalam untuk product discovery dan validasi kelayakan sourcing' : 'In-depth analytics for e-commerce product discovery and sourcing')
  )

  // Hitung rentang 1 minggu persis (7 hari terakhir dari hari ini)
  const weekRangeText = useMemo(() => {
    const now = new Date()
    const past7d = new Date()
    past7d.setDate(now.getDate() - 7)
    
    const formatDate = (d: Date) =>
      d.toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short' })
    const formatFullDate = (d: Date) =>
      d.toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    
    return `${formatDate(past7d)} – ${formatFullDate(now)}`
  }, [lang])

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Row: Breadcrumb, Rentang Waktu 1 Minggu, dan Language Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: 10,
      }}>
        {/* Breadcrumb */}
        <div style={{
          fontSize: '0.75rem',
          color: '#38bdf8',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span>Biz-In-Sight</span>
          <span style={{ color: '#64748b' }}>&gt;</span>
          <span style={{ color: '#f8fafc', fontWeight: 800 }}>{currentTab}</span>
        </div>

        {/* Right Controls: Rentang Waktu 1 Minggu & Switch Bahasa */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {/* Rentang waktu 1 minggu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: 'rgba(21, 27, 46, 0.85)',
            border: '1px solid #202a48',
            padding: '4px 12px',
            borderRadius: 9999,
            fontSize: '0.72rem',
            color: '#94a3b8',
            fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />
            <span>{lang === 'ID' ? 'Siklus Mingguan:' : 'Weekly Window:'} <b style={{ color: '#f8fafc' }}>{weekRangeText}</b> <span style={{ color: '#38bdf8', fontWeight: 700 }}>(7D)</span></span>
          </div>

          {/* Icon / Button Fitur Bahasa ENG & IND */}
          <button
            onClick={() => setLang(l => l === 'ID' ? 'EN' : 'ID')}
            title={lang === 'ID' ? 'Ganti Bahasa ke English' : 'Switch Language to Indonesian'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'rgba(21, 27, 46, 0.85)',
              border: '1px solid #202a48',
              padding: '4px 10px',
              borderRadius: 9999,
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#f8fafc',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <svg width="13" height="13" fill="none" stroke="#38bdf8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span style={{ color: lang === 'ID' ? '#38bdf8' : '#64748b', fontWeight: 800 }}>ID</span>
            <span style={{ color: '#334155' }}>/</span>
            <span style={{ color: lang === 'EN' ? '#38bdf8' : '#64748b', fontWeight: 800 }}>EN</span>
          </button>
        </div>
      </div>

      <h1 style={{
        fontSize: '1.85rem',
        fontWeight: 800,
        color: '#f8fafc',
        letterSpacing: '-0.025em',
        margin: 0,
        lineHeight: 1.2,
      }}>
        {activeTitle}
      </h1>
      <p style={{
        fontSize: '0.9rem',
        color: '#94a3b8',
        marginTop: '0.35rem',
        fontWeight: 500,
      }}>
        {activeSubtitle}
      </p>
    </div>
  )
}
