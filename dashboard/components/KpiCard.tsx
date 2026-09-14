'use client'

import { useId } from 'react'

type Props = {
  title:            string
  value:            string | number
  badge?:           string
  badgeType?:       'positive' | 'negative' | 'neutral'
  sparklineColor?:  string
  sparklinePoints?: number[]
  insightLabel?:    string
  trendMetric?:     string
}

// Generate smooth cubic Bézier curve through coordinate points
function getSmoothPath(coords: { x: number; y: number }[]): string {
  if (coords.length <= 1) return ''
  let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? 0 : i - 1]
    const p1 = coords[i]
    const p2 = coords[i + 1]
    const p3 = coords[i + 2] || p2

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

export default function KpiCard({
  title,
  value,
  badge = '+2.4%',
  badgeType = 'positive',
  sparklineColor = '#245366',
  sparklinePoints = [25, 32, 40, 38, 55, 62, 54, 78],
  insightLabel,
  trendMetric,
}: Props) {
  const rawId = useId()
  const gradId = 'spark_' + rawId.replace(/[^a-zA-Z0-9]/g, '')

  // Dimensions for SVG canvas
  const width = 240
  const height = 50
  const minVal = Math.min(...sparklinePoints)
  const maxVal = Math.max(...sparklinePoints)
  const range = maxVal - minVal || 1
  const avgVal = sparklinePoints.reduce((s, v) => s + v, 0) / sparklinePoints.length

  // Calculate coordinates with comfortable vertical margins
  const coords = sparklinePoints.map((val, idx) => {
    const x = (idx / (sparklinePoints.length - 1)) * width
    const y = height - ((val - minVal) / range) * (height - 18) - 9
    return { x, y, val }
  })

  const yAvg = height - ((avgVal - minVal) / range) * (height - 18) - 9
  const lastCoord = coords[coords.length - 1]
  const peakCoord = coords.reduce((max, c) => (c.val > max.val ? c : max), coords[0])

  // Generate cubic Bézier spline and closed area path
  const curvePath = getSmoothPath(coords)
  const areaPath = coords.length > 1
    ? `${curvePath} L ${coords[coords.length - 1].x.toFixed(1)} ${height} L ${coords[0].x.toFixed(1)} ${height} Z`
    : ''

  // Default trend velocity calculation if none provided
  const firstVal = sparklinePoints[0] || 1
  const lastVal = sparklinePoints[sparklinePoints.length - 1] || 1
  const pctChange = Math.round(((lastVal - firstVal) / firstVal) * 100)
  const defaultTrendMetric = pctChange >= 0 ? `▲ +${pctChange}% 8-Wk` : `▼ ${pctChange}% 8-Wk`
  const displayedTrendMetric = trendMetric || defaultTrendMetric

  const badgeBg =
    badgeType === 'positive'
      ? 'rgba(36, 83, 102, 0.08)'
      : badgeType === 'negative'
      ? 'rgba(194, 75, 58, 0.08)'
      : 'rgba(92, 158, 175, 0.1)'

  const badgeColor =
    badgeType === 'positive'
      ? '#245366'
      : badgeType === 'negative'
      ? '#c24b3a'
      : '#3b748a'

  const badgeBorder =
    badgeType === 'positive'
      ? 'rgba(36, 83, 102, 0.22)'
      : badgeType === 'negative'
      ? 'rgba(194, 75, 58, 0.22)'
      : 'rgba(92, 158, 175, 0.22)'

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 18,
      padding: '1.25rem 1.35rem 0.875rem 1.35rem',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.05)',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    }}>
      {/* Title */}
      <div style={{
        fontSize: '0.8125rem',
        color: '#576574',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>{title}</span>
      </div>

      {/* Value & Trend Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginTop: '0.45rem',
        marginBottom: '0.5rem',
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

      {/* Insightful Trend Context Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.6875rem',
        marginTop: '0.15rem',
        marginBottom: '0.25rem',
        paddingBottom: '0.2rem',
        borderBottom: '1px dashed #ede3d5',
      }}>
        <span style={{ color: '#576574', fontWeight: 600 }}>
          {insightLabel || '8-Wk Trajectory'}
        </span>
        <span style={{
          color: sparklineColor,
          fontWeight: 800,
          fontSize: '0.6875rem',
          letterSpacing: '0.02em',
        }}>
          {displayedTrendMetric}
        </span>
      </div>

      {/* Insightful Smooth Sparkline Chart */}
      <div style={{ width: '100%', height: 50, marginTop: 4 }}>
        <svg
          width="100%"
          height="50"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Luminous Watercolor Gradient: soft opacity, zero dark black fallbacks */}
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.22} />
              <stop offset="65%" stopColor={sparklineColor} stopOpacity={0.05} />
              <stop offset="100%" stopColor={sparklineColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Average Baseline Reference Line with Micro Label */}
          <line
            x1="0"
            y1={yAvg.toFixed(1)}
            x2={width}
            y2={yAvg.toFixed(1)}
            stroke="#dfd3c3"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x="2"
            y={(yAvg - 3).toFixed(1)}
            fill="#a89a88"
            fontSize="7"
            fontWeight="700"
            letterSpacing="0.04em"
          >
            AVG
          </text>

          {/* Translucent Luminous Gradient Area */}
          <path
            d={areaPath}
            fill={`url(#${gradId})`}
          />

          {/* Smooth Cubic Bézier Trend Line */}
          <path
            d={curvePath}
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle Peak Marker */}
          {peakCoord && (
            <circle
              cx={peakCoord.x.toFixed(1)}
              cy={peakCoord.y.toFixed(1)}
              r="2"
              fill={sparklineColor}
              fillOpacity="0.75"
            />
          )}

          {/* Current Milestone Beacon Marker */}
          {lastCoord && (
            <g>
              <circle
                cx={lastCoord.x.toFixed(1)}
                cy={lastCoord.y.toFixed(1)}
                r="5.5"
                fill={sparklineColor}
                fillOpacity="0.18"
              />
              <circle
                cx={lastCoord.x.toFixed(1)}
                cy={lastCoord.y.toFixed(1)}
                r="3"
                fill={sparklineColor}
                stroke="#fcf8f3"
                strokeWidth="1.6"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}
