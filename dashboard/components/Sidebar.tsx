'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/',         label: '📊 Market Landscape' },
  { href: '/pricing',  label: '🏷️ Pricing & Pain Points' },
  { href: '/sourcing', label: '🧮 Sourcing Simulator' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: 224, height: '100vh',
      background: 'linear-gradient(180deg, #1a1d2e 0%, #0f1117 100%)',
      borderRight: '1px solid #2a2d3e', padding: '2rem 1rem', zIndex: 100,
      display: 'flex', flexDirection: 'column', gap: '0.375rem',
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 2, textTransform: 'uppercase' }}>
          WPDE
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, lineHeight: 1.4 }}>
          Product Intelligence
        </div>
      </div>

      {NAV_LINKS.map(link => {
        const active = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: 'block',
              padding: '0.625rem 0.875rem',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? '#a5b4fc' : '#cbd5e1',
              textDecoration: 'none',
              background: active ? '#1e2a48' : 'transparent',
              borderLeft: active ? '2px solid #6366f1' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {link.label}
          </Link>
        )
      })}

      <div style={{ marginTop: 'auto', fontSize: 11, color: '#334155', borderTop: '1px solid #2a2d3e', paddingTop: '1rem' }}>
        Pipeline: Supabase + GitHub Actions
        <br />Dashboard: Next.js + Vercel
      </div>
    </nav>
  )
}
