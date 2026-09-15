'use client'

import { useLanguage } from '@/context/LanguageContext'

type Props = {
  selectedScope: string
  onScopeChange: (scope: string) => void
  categories: string[]
  showWinningNichesOption?: boolean
  totalItemsCount?: number
  itemsLabel?: string
}

export default function ScopeFilterBar({
  selectedScope,
  onScopeChange,
  categories,
  showWinningNichesOption = false,
  totalItemsCount,
  itemsLabel,
}: Props) {
  const { t, lang } = useLanguage()

  // Format human-readable active badge label
  const activeDisplayLabel = () => {
    if (selectedScope === 'all') {
      return lang === 'ID' ? 'Semua Kategori' : 'All Categories'
    }
    if (selectedScope === 'winning') {
      return lang === 'ID' ? 'Winning Niches Saja' : 'Winning Niches Only'
    }
    return selectedScope
  }

  return (
    <div
      style={{
        background: '#fcf8f3',
        border: '1px solid #dfd3c3',
        borderRadius: 18,
        padding: '0.9rem 1.35rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Left Section: Icon + Title + Subtitle + Live Status Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Filter Funnel Icon with Deep Ocean Teal Gradient */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #245366 0%, #163947 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 3px 8px rgba(36, 83, 102, 0.25)',
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </div>

        {/* Text Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 800,
                color: '#1e293b',
                letterSpacing: '-0.01em',
              }}
            >
              {t('scope_filter_label')}
            </span>

            {/* Active Pill Badge with Live Pulsing Dot */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#245366',
                background: '#f5ede2',
                border: '1px solid #dfd0bf',
                padding: '3px 10px',
                borderRadius: 9999,
                boxShadow: '0 1px 2px rgba(36, 83, 102, 0.06)',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#245366',
                  boxShadow: '0 0 0 2px rgba(36, 83, 102, 0.25)',
                }}
              />
              <span>{activeDisplayLabel()}</span>
            </span>
          </div>

          <div
            style={{
              fontSize: '0.72rem',
              color: '#576574',
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            {t('scope_filter_sub')}
          </div>
        </div>
      </div>

      {/* Right Section: Dropdown Selector & Quick Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Optional Total Items Counter */}
        {totalItemsCount !== undefined && itemsLabel && (
          <span
            style={{
              fontSize: '0.72rem',
              color: '#576574',
              fontWeight: 600,
              background: '#f5ede2',
              border: '1px solid #dfd0bf',
              padding: '4px 10px',
              borderRadius: 8,
              display: 'none',
            }}
            className="md:inline-block"
          >
            <b style={{ color: '#245366' }}>{totalItemsCount}</b> {itemsLabel}
          </span>
        )}

        {/* Custom Styled Select Dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            value={selectedScope}
            onChange={(e) => onScopeChange(e.target.value)}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              background: '#ffffff',
              border: '1.5px solid #245366',
              borderRadius: 12,
              padding: '0.55rem 2.25rem 0.55rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#1e293b',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 2px 6px rgba(36, 83, 102, 0.1)',
              transition: 'all 0.15s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#163947'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(36, 83, 102, 0.15)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#245366'
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(36, 83, 102, 0.1)'
            }}
          >
            <option value="all">
              {lang === 'ID' ? 'Semua Kategori' : 'All Categories'}
            </option>

            {showWinningNichesOption && (
              <option value="winning">
                {lang === 'ID' ? 'Winning Niches Saja' : 'Winning Niches Only'}
              </option>
            )}

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Styled Chevron Icon */}
          <div
            style={{
              position: 'absolute',
              right: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#245366',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
