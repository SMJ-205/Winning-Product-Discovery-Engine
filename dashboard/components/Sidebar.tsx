'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

export default function Sidebar() {
  const pathname = usePathname()
  const { t, lang, toggleLang } = useLanguage()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Prevent background scrolling and close drawer on Escape key
  useEffect(() => {
    if (!isDrawerOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDrawerOpen])

  const navLinks = [
    {
      href: '/',
      label: t('tab_overall'),
      mobileLabel: lang === 'ID' ? 'Ringkasan' : 'Overall',
      sublabel: t('tab_overall_sub'),
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/insight',
      label: t('tab_analytics'),
      mobileLabel: 'Insight',
      sublabel: t('tab_analytics_sub'),
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      href: '/sourcing',
      label: t('tab_pricing_sim'),
      mobileLabel: lang === 'ID' ? 'Sourcing' : 'Sourcing',
      sublabel: t('tab_pricing_sim_sub'),
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
  ]

  const closeDrawer = () => setIsDrawerOpen(false)

  return (
    <>
      {/* ================================================================
          1. DESKTOP SIDEBAR (Untouched, identical styling on screens >= 1025px)
          ================================================================ */}
      <nav
        className="desktop-sidebar"
        style={{
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
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflowY: 'auto',
          boxShadow: '4px 0 20px rgba(36, 83, 102, 0.15)',
        }}
      >
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
            const active = pathname === link.href || (link.href === '/insight' && pathname === '/pricing')
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

      {/* ================================================================
          2. MOBILE TOP BAR (Screens <= 1024px, completely hidden on Desktop)
          ================================================================ */}
      <div
        className="mobile-nav-top"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 54,
          background: '#245366',
          borderBottom: '1px solid #1c4555',
          padding: '0 1rem',
          zIndex: 50,
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: BIS Brand Icon & Name */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: '#183c4b',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            flexShrink: 0,
          }}>
            <span style={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: '-0.02em',
              display: 'inline-flex',
              alignItems: 'baseline',
            }}>
              BIS
              <span style={{
                fontSize: '8px',
                fontStyle: 'italic',
                fontWeight: 800,
                color: '#f3ece3',
                transform: 'translateY(-4.5px)',
                marginLeft: '-1px',
                display: 'inline-block',
              }}>
                t
              </span>
            </span>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Biz-In-Sight
          </span>
        </Link>

        {/* Right: Language switch & Menu Drawer Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleLang}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: '#183c4b',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 9999,
              padding: '4px 8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <span style={{ color: lang === 'ID' ? '#ffffff' : '#7cb8c8' }}>ID</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
            <span style={{ color: lang === 'EN' ? '#ffffff' : '#7cb8c8' }}>EN</span>
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Buka Menu"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: '#183c4b',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, background 0.15s ease',
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* ================================================================
          3. MOBILE BOTTOM NAVIGATION (Ergonomic thumb-friendly 3 tabs)
          ================================================================ */}
      <div
        className="mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: '#245366',
          borderTop: '1px solid #1c4555',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)',
          zIndex: 45,
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 0.5rem',
          boxSizing: 'border-box',
        }}
      >
        {navLinks.map(link => {
          const active = pathname === link.href || (link.href === '/insight' && pathname === '/pricing')
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                flex: 1,
                padding: '6px 4px',
                textDecoration: 'none',
                color: active ? '#ffffff' : '#93c2d2',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: active ? '#163947' : 'transparent',
                borderRadius: 12,
                padding: '3px 12px',
                transition: 'background 0.15s ease',
              }}>
                {link.icon}
              </div>
              <span style={{
                fontSize: '0.6875rem',
                fontWeight: active ? 800 : 500,
                letterSpacing: '-0.01em',
              }}>
                {link.mobileLabel}
              </span>
            </Link>
          )
        })}
      </div>

      {/* ================================================================
          4. MOBILE DRAWER OVERLAY (Side menu for phone view with smooth animation)
          ================================================================ */}
      <div
        className={`mobile-drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        aria-hidden={!isDrawerOpen}
        onClick={closeDrawer}
      >
        <div
          className="mobile-drawer-panel"
          onClick={e => e.stopPropagation()}
        >
            {/* Drawer Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: '#183c4b',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  flexShrink: 0,
                }}>
                  <span style={{
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: 13,
                    letterSpacing: '-0.02em',
                    display: 'inline-flex',
                    alignItems: 'baseline',
                  }}>
                    BIS
                    <span style={{
                      fontSize: '9px',
                      fontStyle: 'italic',
                      fontWeight: 800,
                      color: '#f3ece3',
                      transform: 'translateY(-4.5px)',
                      marginLeft: '-1px',
                      display: 'inline-block',
                    }}>
                      t
                    </span>
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Biz-In-Sight</div>
                  <div style={{ fontSize: '0.65rem', color: '#a8d4e2', fontWeight: 700 }}>
                    {t('brand_sub')}
                  </div>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Tutup Menu"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#183c4b',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, background 0.15s ease',
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation links inside drawer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <div style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#85b4c4',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0 0.5rem',
                marginBottom: '0.25rem',
              }}>
                {t('menu')}
              </div>

              {navLinks.map(link => {
                const active = pathname === link.href || (link.href === '/insight' && pathname === '/pricing')
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeDrawer}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 0.85rem',
                      borderRadius: 12,
                      fontSize: '0.875rem',
                      fontWeight: active ? 700 : 500,
                      color: active ? '#ffffff' : '#d5e7ee',
                      textDecoration: 'none',
                      background: active ? '#163947' : 'transparent',
                      border: active ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
                    }}
                  >
                    <span style={{ color: active ? '#ffffff' : '#a2cad8' }}>{link.icon}</span>
                    <div>
                      <div>{link.label}</div>
                      <div style={{ fontSize: '0.6875rem', color: active ? '#a5d3e0' : '#88b3c2' }}>
                        {link.sublabel}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Language Switcher Footer in Drawer */}
            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid #1c4555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#a8d4e2', fontWeight: 600 }}>Bahasa / Language:</span>
              <button
                onClick={toggleLang}
                style={{
                  background: '#183c4b',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 9999,
                  padding: '4px 12px',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {lang === 'ID' ? 'ID (Indonesia)' : 'EN (English)'}
              </button>
            </div>
          </div>
        </div>
    </>
  )
}
