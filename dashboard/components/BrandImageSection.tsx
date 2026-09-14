'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type PerceptionRow = {
  key: string
  totallyAgree: number
  agree: number
  maybe: number
  disagree: number
  totallyDisagree: number
}

const PERCEPTIONS: PerceptionRow[] = [
  { key: 'attr_practical',   totallyAgree: 42, agree: 33, maybe: 11, disagree: 10, totallyDisagree: 4 },
  { key: 'attr_durable',     totallyAgree: 35, agree: 42, maybe: 17, disagree: 4,  totallyDisagree: 2 },
  { key: 'attr_comfortable', totallyAgree: 41, agree: 23, maybe: 18, disagree: 12, totallyDisagree: 6 },
  { key: 'attr_reliable',    totallyAgree: 28, agree: 36, maybe: 10, disagree: 14, totallyDisagree: 12 },
  { key: 'attr_value',       totallyAgree: 22, agree: 37, maybe: 21, disagree: 12, totallyDisagree: 8 },
  { key: 'attr_trendy',      totallyAgree: 13, agree: 38, maybe: 19, disagree: 18, totallyDisagree: 12 },
]

const COLORS = {
  totallyAgree: '#245366',    // Deep ocean teal
  agree: '#5c9eaf',           // Muted cyan
  maybe: '#a5d3dd',           // Soft ice cyan
  disagree: '#dfbfa8',        // Warm tan / sand
  totallyDisagree: '#e8a89b', // Warm terracotta / peach
}

export default function BrandImageSection() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(timer)
  }, [])

  const legendItems = [
    { label: t('scale_totally_agree'),    color: COLORS.totallyAgree },
    { label: t('scale_agree'),            color: COLORS.agree },
    { label: t('scale_maybe'),            color: COLORS.maybe },
    { label: t('scale_disagree'),         color: COLORS.disagree },
    { label: t('scale_totally_disagree'), color: COLORS.totallyDisagree },
  ]

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 22,
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(36, 83, 102, 0.05)',
      height: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Title */}
      <div>
        <div style={{
          fontSize: '0.8125rem',
          fontWeight: 800,
          color: '#245366',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 4,
        }}>
          {t('sec_brand_image')}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
          {t('brand_image_title')}
        </div>
      </div>

      {/* Stacked Likert Scale Bars */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 16,
        padding: '1.25rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        flex: 1,
      }}>
        {PERCEPTIONS.map((row, rowIdx) => (
          <div key={row.key}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 5,
            }}>
              <span style={{ fontSize: '0.78125rem', fontWeight: 700, color: '#1e293b' }}>
                {t(row.key)}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#245366', fontWeight: 700 }}>
                {row.totallyAgree + row.agree}% Positive
              </span>
            </div>

            {/* Stacked Bar with percentages inside segment */}
            <div style={{
              display: 'flex',
              height: 22,
              borderRadius: 6,
              overflow: 'hidden',
              background: '#dfd3c3',
              fontSize: '0.625rem',
              fontWeight: 800,
              lineHeight: '22px',
              textAlign: 'center',
            }}>
              <div style={{
                width: mounted ? `${row.totallyAgree}%` : '0%',
                background: COLORS.totallyAgree,
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${rowIdx * 65}ms`,
              }}>
                {row.totallyAgree}%
              </div>
              <div style={{
                width: mounted ? `${row.agree}%` : '0%',
                background: COLORS.agree,
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${rowIdx * 65 + 35}ms`,
              }}>
                {row.agree}%
              </div>
              <div style={{
                width: mounted ? `${row.maybe}%` : '0%',
                background: COLORS.maybe,
                color: '#1e293b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${rowIdx * 65 + 70}ms`,
              }}>
                {row.maybe}%
              </div>
              <div style={{
                width: mounted ? `${row.disagree}%` : '0%',
                background: COLORS.disagree,
                color: '#1e293b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${rowIdx * 65 + 105}ms`,
              }}>
                {row.disagree}%
              </div>
              <div style={{
                width: mounted ? `${row.totallyDisagree}%` : '0%',
                background: COLORS.totallyDisagree,
                color: '#1e293b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${rowIdx * 65 + 140}ms`,
              }}>
                {row.totallyDisagree}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem 1rem',
        padding: '0.5rem 0.25rem',
      }}>
        {legendItems.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: item.color,
              display: 'inline-block',
            }} />
            <span style={{ fontSize: '0.6875rem', color: '#576574', fontWeight: 600 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
