'use client'

import { useState } from 'react'

type Props = {
  title?: string
  subtitle?: string
}

export default function Header({
  title = 'Good Evening, Product Hunter',
  subtitle = 'In-depth analytics for e-commerce product discovery and sourcing',
}: Props) {
  const [activeTab, setActiveTab] = useState<'24h' | 'week' | 'month'>('week')
  const [search, setSearch] = useState('')

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {/* Top row: Greeting & Search / Profile */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{
            fontSize: '0.75rem',
            color: '#38bdf8',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 4,
          }}>
            Dashboard &gt; Market &gt; Sourcing Intelligence
          </div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#f8fafc',
            letterSpacing: '-0.025em',
            margin: 0,
          }}>
            {title}
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            marginTop: '0.25rem',
            fontWeight: 500,
          }}>
            {subtitle}
          </p>
        </div>

        {/* Right side: Search, Notifications, Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {/* Search bar */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}>
            <svg
              style={{
                position: 'absolute',
                left: 14,
                width: 15,
                height: 15,
                color: '#64748b',
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search niche, keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: 220,
                padding: '0.55rem 1rem 0.55rem 2.35rem',
                fontSize: '0.8125rem',
                background: '#151b2e',
                border: '1px solid #202a48',
                borderRadius: '9999px',
                outline: 'none',
                color: '#f8fafc',
                transition: 'all 0.15s ease',
              }}
            />
          </div>

          {/* Notification bell button */}
          <button style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#151b2e',
            border: '1px solid #202a48',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            color: '#94a3b8',
          }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span style={{
              position: 'absolute',
              top: 8,
              right: 9,
              width: 7,
              height: 7,
              background: '#38bdf8',
              borderRadius: '50%',
              border: '2px solid #151b2e',
            }} />
          </button>

          {/* User profile avatar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '3px 8px 3px 4px',
            background: '#151b2e',
            border: '1px solid #202a48',
            borderRadius: '9999px',
            cursor: 'pointer',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 12,
            }}>
              SM
            </div>
            <svg width="12" height="12" fill="none" stroke="#64748b" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Date filter tabs (Last 24 hours / This Week / Last Month) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginTop: '1.25rem',
        borderBottom: '1px solid #1f2945',
        paddingBottom: '0.25rem',
      }}>
        {[
          { id: '24h', label: 'Last 24 hours' },
          { id: 'week', label: 'This Week' },
          { id: 'month', label: 'Last Month' },
        ].map(tab => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 0.25rem',
                fontSize: '0.85rem',
                fontWeight: active ? 700 : 500,
                color: active ? '#38bdf8' : '#64748b',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
              {active && (
                <div style={{
                  position: 'absolute',
                  bottom: -5,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: '#38bdf8',
                  borderRadius: 3,
                  boxShadow: '0 0 10px rgba(56, 189, 248, 0.7)',
                }} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
