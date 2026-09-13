'use client'

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

  // Tentukan nama tab aktif saat ini
  const currentTab =
    pathname === '/pricing'
      ? 'Analytics'
      : pathname === '/sourcing'
      ? 'Sim Calculator'
      : 'Overall Summary'

  const activeTitle = title || currentTab
  const activeSubtitle = subtitle || (
    currentTab === 'Analytics'
      ? 'Analisis sweet spot harga jual dan titik kelemahan produk kompetitor'
      : currentTab === 'Sim Calculator'
      ? 'Validasi batas maksimal HPP supplier sebelum melakukan pemesanan stok'
      : 'In-depth analytics for e-commerce product discovery and sourcing'
  )

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Breadcrumb dengan nama tab aktif */}
      <div style={{
        fontSize: '0.75rem',
        color: '#38bdf8',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
      }}>
        <span>Biz-In-Sight</span>
        <span style={{ color: '#64748b' }}>&gt;</span>
        <span>Sourcing Intelligence</span>
        <span style={{ color: '#64748b' }}>&gt;</span>
        <span style={{ color: '#f8fafc', fontWeight: 800 }}>{currentTab}</span>
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
