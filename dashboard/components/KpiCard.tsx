'use client'

type Props = {
  title:    string
  value:    string | number
  subtitle?: string
  accent?:  string  // CSS color
  icon?:    string
}

export default function KpiCard({ title, value, subtitle, accent = '#6366f1', icon }: Props) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1d2e 0%, #1e2235 100%)',
      border: `1px solid ${accent}33`,
      borderRadius: 12,
      padding: '1.25rem 1.5rem',
      flex: 1,
      minWidth: 160,
      transition: 'border-color 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </div>
        {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', marginTop: '0.5rem', lineHeight: 1.2 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 11, color: '#475569', marginTop: '0.375rem' }}>{subtitle}</div>
      )}
      <div style={{ height: 3, background: accent, borderRadius: 2, marginTop: '1rem', opacity: 0.7 }} />
    </div>
  )
}
