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

type HoveredSegment = {
  rowKey: string
  segKey: string
  label: string
  value: number
  color: string
  leftPct: number
} | null

export default function BrandImageSection() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState<HoveredSegment>(null)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(timer)
  }, [])

  const segmentsConfig: {
    key: keyof Omit<PerceptionRow, 'key'>
    labelKey: string
    color: string
    textColor: string
  }[] = [
    { key: 'totallyAgree',    labelKey: 'scale_totally_agree',    color: COLORS.totallyAgree,    textColor: '#ffffff' },
    { key: 'agree',           labelKey: 'scale_agree',            color: COLORS.agree,           textColor: '#ffffff' },
    { key: 'maybe',           labelKey: 'scale_maybe',            color: COLORS.maybe,           textColor: '#1e293b' },
    { key: 'disagree',        labelKey: 'scale_disagree',         color: COLORS.disagree,        textColor: '#1e293b' },
    { key: 'totallyDisagree', labelKey: 'scale_totally_disagree', color: COLORS.totallyDisagree, textColor: '#1e293b' },
  ]

  const legendItems = segmentsConfig.map(s => ({
    label: t(s.labelKey),
    color: s.color,
  }))

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
        {PERCEPTIONS.map((row, rowIdx) => {
          let cumulativePct = 0

          return (
            <div key={row.key} style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
              }}>
                <span style={{ fontSize: '0.78125rem', fontWeight: 700, color: '#1e293b' }}>
                  {t(row.key)}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#245366',
                  transition: 'all 0.15s ease',
                }}>
                  {hovered?.rowKey === row.key ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'rgba(36, 83, 102, 0.08)',
                      padding: '1px 6px',
                      borderRadius: 4,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: hovered.color }} />
                      <b>{hovered.label}: {hovered.value}%</b>
                    </span>
                  ) : (
                    `${row.totallyAgree + row.agree}% Positive`
                  )}
                </span>
              </div>

              {/* Floating Tooltip positioned over hovered segment */}
              {hovered && hovered.rowKey === row.key && (
                <div style={{
                  position: 'absolute',
                  top: -24,
                  left: `${Math.max(14, Math.min(86, hovered.leftPct))}%`,
                  transform: 'translateX(-50%)',
                  background: '#1e293b',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 30,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: hovered.color }} />
                  <span>{hovered.label}: {hovered.value}%</span>
                  <div style={{
                    position: 'absolute',
                    bottom: -3,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '3px solid transparent',
                    borderRight: '3px solid transparent',
                    borderTop: '3px solid #1e293b',
                  }} />
                </div>
              )}

              {/* Stacked Bar */}
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
                {segmentsConfig.map((seg, segIdx) => {
                  const val = row[seg.key] as number
                  const segLabel = t(seg.labelKey)
                  const segMidpoint = cumulativePct + val / 2
                  cumulativePct += val
                  const canFit = val >= 10
                  const isHovered = hovered?.rowKey === row.key && hovered?.segKey === seg.key

                  return (
                    <div
                      key={seg.key}
                      title={`${segLabel}: ${val}%`}
                      onMouseEnter={() => {
                        setHovered({
                          rowKey: row.key,
                          segKey: seg.key,
                          label: segLabel,
                          value: val,
                          color: seg.color,
                          leftPct: segMidpoint,
                        })
                      }}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        width: mounted ? `${val}%` : '0%',
                        background: seg.color,
                        color: seg.textColor,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        filter: isHovered ? 'brightness(1.1) saturate(1.15)' : 'none',
                        transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1), filter 0.15s ease',
                        transitionDelay: `${rowIdx * 65 + segIdx * 35}ms`,
                        userSelect: 'none',
                      }}
                    >
                      {canFit ? `${val}%` : ''}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
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
