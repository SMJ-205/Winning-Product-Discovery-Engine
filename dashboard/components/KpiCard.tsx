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
      ? 'rgba(36, 83, 102, 0.1)'
      : badgeType === 'negative'
      ? 'rgba(217, 100, 80, 0.1)'
      : 'rgba(92, 158, 175, 0.12)'

  const badgeColor =
    badgeType === 'positive'
      ? '#245366'
      : badgeType === 'negative'
      ? '#c24b3a'
      : '#3b7987'

  const badgeBorder =
    badgeType === 'positive'
      ? 'rgba(36, 83, 102, 0.25)'
      : badgeType === 'negative'
      ? 'rgba(217, 100, 80, 0.25)'
      : 'rgba(92, 158, 175, 0.25)'

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 18,
      padding: '1.25rem 1.4rem 1rem 1.4rem',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.06)',
    }}>
      {/* Title */}
      <div style={{
        fontSize: '0.8125rem',
        color: '#576574',
        fontWeight: 700,
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
          color: '#1e293b',
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

      {/* Mini Sparkline Chart */}
      <div style={{ width: '100%', height: 45, marginTop: 'auto' }}>
        <svg width="100%" height="45" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`sparklineGrad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <polygon
            points={`0,${height} ${points} ${width},${height}`}
            fill={`url(#sparklineGrad-${title})`}
          />
          <polyline
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  )
}
