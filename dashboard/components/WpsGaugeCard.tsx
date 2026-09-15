'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

type Props = {
  topScore?: number
  topNiche?: string
  recommendation?: string
  sourcingHref?: string
}

export default function WpsGaugeCard({
  topScore = 79.8,
  topNiche = 'Holder HP Motor',
  recommendation = 'High Priority - Immediate Sourcing',
  sourcingHref = '/sourcing',
}: Props) {
  const { t } = useLanguage()

  // Semi-circular gauge parameters
  const scoreOutOf1000 = Math.round(topScore * 10)
  const percentage = Math.min(Math.max(topScore / 100, 0), 1)

  // Arc math for semi-circle
  const radius = 78
  const strokeWidth = 14
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference * (1 - percentage)

  const isHighPriority = topScore >= 70

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 22,
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.06)',
    }}>
      {/* Title */}
      <div style={{
        width: '100%',
        textAlign: 'left',
        fontSize: '0.9375rem',
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: '0.5rem',
      }}>
        {t('gauge_title')}
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
              <stop offset="0%" stopColor="#245366" />
              <stop offset="50%" stopColor="#5c9eaf" />
              <stop offset="100%" stopColor="#7cb8c8" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 22 100 A 78 78 0 0 1 178 100"
            fill="none"
            stroke="#e5dacb"
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
            color: '#1e293b',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}>
            {scoreOutOf1000}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#576574',
            fontWeight: 600,
            marginTop: 4,
          }}>
            {t('gauge_outof')}
          </div>
        </div>
      </div>

      {/* Evaluation Subtext */}
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: isHighPriority ? '#245366' : '#c24b3a',
        }}>
          {isHighPriority ? t('top_niche_high') : t('top_niche_val')}
        </div>
        <div style={{
          fontSize: '0.78125rem',
          color: '#576574',
          marginTop: '0.25rem',
          lineHeight: 1.45,
          padding: '0 0.5rem',
        }}>
          <b style={{ color: '#1e293b' }}>{topNiche}</b> {t('gauge_desc_tail')}
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={sourcingHref}
        style={{
          marginTop: '1.25rem',
          width: '100%',
          padding: '0.7rem 1.25rem',
          borderRadius: 9999,
          background: '#245366',
          border: '1px solid #1c4555',
          color: '#ffffff',
          fontSize: '0.8125rem',
          fontWeight: 700,
          textDecoration: 'none',
          textAlign: 'center',
          transition: 'all 0.15s ease',
          display: 'block',
          boxSizing: 'border-box',
        }}
      >
        {t('btn_simulasi')}
      </Link>
    </div>
  )
}
