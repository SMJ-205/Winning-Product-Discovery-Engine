'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  {
    href: '/',
    label: 'Overall Summary',
    sublabel: 'Market Landscape',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/pricing',
    label: 'Analytics',
    sublabel: 'Pricing & Pain Points',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/sourcing',
    label: 'Sim Calculator',
    sublabel: 'Sourcing Feasibility',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      width: 240,
      height: '100vh',
      flexShrink: 0,
      background: '#0f152b',
      borderRight: '1px solid #1b2440',
      padding: '2rem 1rem',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflowY: 'auto',
    }}>
      {/* Brand Header: Biz-In-Sight */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0 0.5rem',
        marginBottom: '2.75rem',
      }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: '-0.02em',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)',
          flexShrink: 0,
        }}>
          BIS
        </div>
        <div>
          <div style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#f8fafc',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}>
            Biz-In-Sight
          </div>
          <div style={{
            fontSize: '0.6875rem',
            color: '#38bdf8',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginTop: 2,
          }}>
            Product Discovery
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: '#64748b',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0 0.75rem',
          marginBottom: '0.5rem',
        }}>
          Menu
        </div>

        {NAV_LINKS.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.8rem 0.875rem',
                borderRadius: 12,
                fontSize: '0.875rem',
                fontWeight: active ? 700 : 500,
                color: active ? '#ffffff' : '#94a3b8',
                textDecoration: 'none',
                background: active
                  ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
                  : 'transparent',
                boxShadow: active ? '0 4px 14px rgba(14, 165, 233, 0.35)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: active ? '#ffffff' : '#64748b',
              }}>
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
