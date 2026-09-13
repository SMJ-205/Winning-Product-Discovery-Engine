'use client'

type Props = {
  title?: string
  subtitle?: string
}

export default function Header({
  title = 'Overall Summary',
  subtitle = 'In-depth analytics for e-commerce product discovery and sourcing',
}: Props) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        fontSize: '0.75rem',
        color: '#38bdf8',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 6,
      }}>
        Biz-In-Sight &gt; Sourcing Intelligence
      </div>
      <h1 style={{
        fontSize: '1.85rem',
        fontWeight: 800,
        color: '#f8fafc',
        letterSpacing: '-0.025em',
        margin: 0,
        lineHeight: 1.2,
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: '0.9rem',
        color: '#94a3b8',
        marginTop: '0.35rem',
        fontWeight: 500,
      }}>
        {subtitle}
      </p>
    </div>
  )
}
