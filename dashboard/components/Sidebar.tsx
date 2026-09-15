'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

export default function Sidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navLinks = [
    {
      href: '/',
      label: t('tab_overall'),
      sublabel: t('tab_overall_sub'),
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/pricing',
      label: t('tab_analytics'),
      sublabel: t('tab_analytics_sub'),
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      href: '/sourcing',
      label: t('tab_pricing_sim'),
      sublabel: t('tab_pricing_sim_sub'),
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      width: 240,
      height: 'calc(100vh / 0.9)',
      minHeight: '100%',
      flexShrink: 0,
      background: '#245366',
      borderRight: '1px solid #1c4555',
      padding: '2rem 1rem',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflowY: 'auto',
      boxShadow: '4px 0 20px rgba(36, 83, 102, 0.15)',
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
          background: '#183c4b',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          flexShrink: 0,
        }}>
          <span style={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: '-0.02em',
            display: 'inline-flex',
            alignItems: 'baseline',
          }}>
            BIS
            <span style={{
              fontSize: '10px',
              fontStyle: 'italic',
              fontWeight: 800,
              color: '#f3ece3',
              transform: 'translateY(-5px)',
              marginLeft: '-1.5px',
              display: 'inline-block',
            }}>
              t
            </span>
          </span>
        </div>
        <div>
          <div style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}>
            Biz-In-Sight
          </div>
          <div style={{
            fontSize: '0.6875rem',
            color: '#a8d4e2',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginTop: 2,
          }}>
            {t('brand_sub')}
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: '#85b4c4',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0 0.75rem',
          marginBottom: '0.5rem',
        }}>
          {t('menu')}
        </div>

        {navLinks.map(link => {
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
                color: active ? '#ffffff' : '#d5e7ee',
                textDecoration: 'none',
                background: active
                  ? '#163947'
                  : 'transparent',
                border: active ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
                boxShadow: active ? '0 4px 14px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: active ? '#ffffff' : '#a2cad8',
              }}>
                {link.icon}
              </span>
              <div>
                <div>{link.label}</div>
                <div style={{ fontSize: '0.6875rem', color: active ? '#a5d3e0' : '#88b3c2', fontWeight: 500 }}>
                  {link.sublabel}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
