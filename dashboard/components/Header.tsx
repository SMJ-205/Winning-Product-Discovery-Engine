'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

type Props = {
  title?: string
  subtitle?: string
  snapshotDate?: string
}

export default function Header({
  title,
  subtitle,
  snapshotDate,
}: Props) {
  const pathname = usePathname()
  const { lang, toggleLang, t } = useLanguage()

  // Tentukan nama tab aktif saat ini
  const currentTab =
    pathname === '/pricing'
      ? t('tab_analytics')
      : pathname === '/sourcing'
      ? t('tab_pricing_sim')
      : t('tab_overall')

  const activeTitle = title
    ? (title === 'Overall Summary' ? t('tab_overall') : title === 'Pricing Intelligence & Pain Points' ? t('analytics_title') : title === 'Pricing & Sourcing Simulator' ? t('sim_title') : title)
    : pathname === '/pricing'
    ? t('analytics_title')
    : pathname === '/sourcing'
    ? t('sim_title')
    : t('tab_overall')
  const activeSubtitle = subtitle || (
    pathname === '/pricing'
      ? t('sub_analytics')
      : pathname === '/sourcing'
      ? t('sub_pricing_sim')
      : t('sub_overall')
  )

  // Fixed Weekly Window: Terkunci pada tanggal batch snapshot pipeline aktual
  // (misal 8 Sep – 15 Sep 2026), tidak bergeser harian.
  const weekRangeText = useMemo(() => {
    // Gunakan snapshotDate dari data pipeline riil, atau fallback ke tanggal batch aktif
    let anchor: Date
    if (snapshotDate) {
      anchor = new Date(snapshotDate)
    } else {
      anchor = new Date('2026-09-15')
    }

    if (isNaN(anchor.getTime())) {
      anchor = new Date('2026-09-15')
    }

    // 7 hari siklus mingguan: anchor - 7 hari hingga anchor
    const start = new Date(anchor)
    start.setDate(anchor.getDate() - 7)

    const formatDate = (d: Date) =>
      d.toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short' })
    const formatFullDate = (d: Date) =>
      d.toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })

    return `${formatDate(start)} – ${formatFullDate(anchor)}`
  }, [lang, snapshotDate])

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
          color: '#245366',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span>Biz-In-Sight</span>
          <span style={{ color: '#94a3b8' }}>&gt;</span>
          <span style={{ color: '#1e293b', fontWeight: 800 }}>{currentTab}</span>
        </div>

        {/* Right Controls: Rentang Waktu 1 Minggu & Switch Bahasa */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {/* Rentang waktu 1 minggu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: '#ede3d5',
            border: '1px solid #dfd0bf',
            padding: '4px 12px',
            borderRadius: 9999,
            fontSize: '0.72rem',
            color: '#576574',
            fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#245366' }} />
            <span>{lang === 'ID' ? 'Siklus Mingguan:' : 'Weekly Window:'} <b style={{ color: '#1e293b' }}>{weekRangeText}</b> <span style={{ color: '#245366', fontWeight: 700 }}>(7D)</span></span>
          </div>

          {/* Icon / Button Fitur Bahasa ENG & IND */}
          <button
            onClick={toggleLang}
            title={lang === 'ID' ? 'Ganti Bahasa ke English' : 'Switch Language to Indonesian'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: '#ede3d5',
              border: '1px solid #dfd0bf',
              padding: '4px 10px',
              borderRadius: 9999,
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#1e293b',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <svg width="13" height="13" fill="none" stroke="#245366" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span style={{ color: lang === 'ID' ? '#245366' : '#94a3b8', fontWeight: 800 }}>ID</span>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: lang === 'EN' ? '#245366' : '#94a3b8', fontWeight: 800 }}>EN</span>
          </button>
        </div>
      </div>

      <h1 className="header-title">
        {activeTitle}
      </h1>
      <p style={{
        fontSize: '0.9rem',
        color: '#576574',
        marginTop: '0.35rem',
        lineHeight: 1.5,
      }}>
        {activeSubtitle}
      </p>
    </div>
  )
}
