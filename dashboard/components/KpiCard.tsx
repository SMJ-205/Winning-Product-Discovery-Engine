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
  sparklineColor = '#38bdf8',
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
    badgeType === 'positive'
      ? 'rgba(16, 185, 129, 0.15)'
      : badgeType === 'negative'
      ? 'rgba(239, 68, 68, 0.15)'
      : 'rgba(56, 189, 248, 0.15)'

  const badgeColor =
    badgeType === 'positive'
      ? '#34d399'
      : badgeType === 'negative'
      ? '#f87171'
      : '#38bdf8'

  const badgeBorder =
    badgeType === 'positive'
      ? 'rgba(52, 211, 153, 0.3)'
      : badgeType === 'negative'
      ? 'rgba(248, 113, 113, 0.3)'
      : 'rgba(56, 189, 248, 0.3)'

  return (
    <div style={{
      background: '#151b2e',
      border: '1px solid #202a48',
      borderRadius: 18,
      padding: '1.25rem 1.4rem 1rem 1.4rem',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Title */}
      <div style={{
        fontSize: '0.8125rem',
        color: '#94a3b8',
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
          color: '#f8fafc',
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
            border: `1px solid ${badgeBorder}`,
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
          <polyline
            fill="none"
            stroke={sparklineColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  )
}
