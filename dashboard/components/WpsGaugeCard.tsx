'use client'

import Link from 'next/link'

type Props = {
  topScore?: number
  topNiche?: string
  recommendation?: string
}

export default function WpsGaugeCard({
  topScore = 79.8,
  topNiche = 'Holder HP Motor',
  recommendation = 'High Priority - Immediate Sourcing',
}: Props) {
  // Semi-circular gauge parameters
  const scoreOutOf1000 = Math.round(topScore * 10)
  const percentage = Math.min(Math.max(topScore / 100, 0), 1)

  // Arc math for semi-circle
  const radius = 78
  const strokeWidth = 14
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference * (1 - percentage)

  const isHighPriority = topScore >= 70
  const statusColor = isHighPriority ? '#10b981' : topScore >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -2px rgba(15, 23, 42, 0.02)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      height: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Title */}
      <div style={{
        width: '100%',
        textAlign: 'left',
        fontSize: '0.9375rem',
        fontWeight: 700,
        color: '#0f172a',
        marginBottom: '0.5rem',
      }}>
        Opportunity Score
      </div>

      {/* Semi-circular Gauge */}
      <div style={{
        position: 'relative',
        width: 200,
        height: 110,
        marginTop: '0.75rem',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}>
        <svg
          width="200"
          height="110"
          viewBox="0 0 200 110"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 22 100 A 78 78 0 0 1 178 100"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d="M 22 100 A 78 78 0 0 1 178 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>

        {/* Center Score */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}>
            {scoreOutOf1000}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            fontWeight: 600,
            marginTop: 4,
          }}>
            out of 1000
          </div>
        </div>
      </div>

      {/* Evaluation Subtext */}
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: '#0f172a',
        }}>
          {isHighPriority ? "Top Niche is High Priority" : "Niche Needs Validation"}
        </div>
        <div style={{
          fontSize: '0.78125rem',
          color: '#64748b',
          marginTop: '0.25rem',
          lineHeight: 1.45,
          padding: '0 0.5rem',
        }}>
          <b>{topNiche}</b> mengungguli kandidat lain dengan margin 28% & komplain kompetitor tinggi.
        </div>
      </div>

      {/* Action Button */}
      <Link
        href="/sourcing"
        style={{
          marginTop: '1.25rem',
          width: '100%',
          padding: '0.7rem 1.25rem',
          borderRadius: 9999,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          color: '#4f46e5',
          fontSize: '0.8125rem',
          fontWeight: 700,
          textDecoration: 'none',
          textAlign: 'center',
          transition: 'all 0.15s ease',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          display: 'block',
          boxSizing: 'border-box',
        }}
      >
        Simulasi Sourcing →
      </Link>
    </div>
  )
}
