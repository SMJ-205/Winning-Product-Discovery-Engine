'use client'

type Props = {
  title:     string
  value:     string | number
  badge?:    string
  badgeType?: 'positive' | 'negative' | 'neutral'
  sparklineColor?: string
  sparklinePoints?: number[]
}

export default function KpiCard({
  title,
  value,
  badge = '+2.4%',
  badgeType = 'positive',
  sparklineColor = '#6366f1',
  sparklinePoints = [20, 35, 25, 45, 30, 60, 48, 75],
}: Props) {
  // Generate SVG path for sparkline
  const width = 180
  const height = 45
  const minVal = Math.min(...sparklinePoints)
  const maxVal = Math.max(...sparklinePoints)
  const range = maxVal - minVal || 1

  const points = sparklinePoints
    .map((val, idx) => {
      const x = (idx / (sparklinePoints.length - 1)) * width
      const y = height - ((val - minVal) / range) * (height - 12) - 6
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const badgeBg =
    badgeType === 'positive' ? '#ecfdf5' : badgeType === 'negative' ? '#fef2f2' : '#f1f5f9'
  const badgeColor =
    badgeType === 'positive' ? '#10b981' : badgeType === 'negative' ? '#ef4444' : '#64748b'

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 18,
      padding: '1.25rem 1.4rem 1rem 1.4rem',
      flex: 1,
      minWidth: 200,
      boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.03), 0 2px 4px -2px rgba(15, 23, 42, 0.02)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Title */}
      <div style={{
        fontSize: '0.8125rem',
        color: '#64748b',
        fontWeight: 600,
      }}>
        {title}
      </div>

      {/* Value & Trend Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.625rem',
        marginTop: '0.45rem',
        marginBottom: '0.75rem',
      }}>
        <span style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.02em',
        }}>
          {value}
        </span>
        {badge && (
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            background: badgeBg,
            color: badgeColor,
            padding: '2px 8px',
            borderRadius: 9999,
          }}>
            {badge}
          </span>
        )}
      </div>

      {/* Sparkline curve */}
      <div style={{ marginTop: 'auto', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 38, overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={`grad-${sparklineColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={sparklineColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke={sparklineColor}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  )
}
