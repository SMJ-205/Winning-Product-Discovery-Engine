'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

import { CATEGORY_DEMOGRAPHICS } from '@/lib/analyticsProfiles'

type Props = {
  category?: string
}

export default function CustomerInfoSection({ category = 'all' }: Props) {
  const { t, lang } = useLanguage()
  const [mounted, setMounted] = useState(false)

  const profile = CATEGORY_DEMOGRAPHICS[category] || CATEGORY_DEMOGRAPHICS.all
  const { ageData, dominantAge, femalePct, malePct, regions, rfm } = profile

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 22,
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.06)',
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
          {t('sec_cust_info')}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
          {t('age_group')} & Demographics
        </div>
      </div>

      {/* 1. Age Group Donut Chart */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 16,
        padding: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
            {t('age_group')}
          </span>
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: '#ffffff',
            background: '#245366',
            padding: '2px 8px',
            borderRadius: 9999,
          }}>
            Dominant: {dominantAge}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 130, height: 130, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #245366',
                    borderRadius: 10,
                    fontSize: 12,
                    color: '#1e293b',
                  }}
                  formatter={(v: any) => [`${v}%`, t('age_group')]}
                />
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={56}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Age Legend pills */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.35rem 0.6rem',
            flex: 1,
          }}>
            {ageData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: d.color }} />
                <span style={{ color: '#576574', fontWeight: 500 }}>{d.name}:</span>
                <b style={{ color: '#1e293b' }}>{d.value}%</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Buyer Gender Representation Split (Moved right under Age Card per request) */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 16,
        padding: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
            {t('gender_label')}
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
            Audience Split
          </span>
        </div>

        {/* Dual Split Bar */}
        <div style={{
          display: 'flex',
          height: 12,
          borderRadius: 6,
          overflow: 'hidden',
          marginBottom: '0.625rem',
          background: '#e5dacb',
        }}>
          <div style={{
            width: mounted ? `${femalePct}%` : '0%',
            background: '#dfbfa8',
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
          <div style={{
            width: mounted ? `${malePct}%` : '0%',
            background: '#245366',
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '80ms',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dfbfa8' }} />
            <span style={{ fontSize: '0.75rem', color: '#576574', fontWeight: 600 }}>{t('female')}</span>
            <b style={{ fontSize: '0.875rem', color: '#9c6f50' }}>{femalePct}%</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#245366' }} />
            <span style={{ fontSize: '0.75rem', color: '#576574', fontWeight: 600 }}>{t('male')}</span>
            <b style={{ fontSize: '0.875rem', color: '#245366' }}>{malePct}%</b>
          </div>
        </div>
      </div>

      {/* 3. Indonesian Region Distribution Progress Bars */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 16,
        padding: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
            {t('region_dist')}
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#245366', fontWeight: 700 }}>
            Indonesia Hub
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {regions.map((r, idx) => (
            <div key={r.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{r.name}</span>
                <span style={{ fontWeight: 800, color: '#245366' }}>{r.pct}%</span>
              </div>
              <div style={{
                width: '100%',
                height: 6,
                background: '#e5dacb',
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: mounted ? `${r.pct}%` : '0%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #245366 0%, #5c9eaf 100%)',
                  borderRadius: 3,
                  transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${idx * 90}ms`,
                }} />
              </div>
              <div style={{ fontSize: '0.625rem', color: '#64748b', marginTop: 2 }}>
                {r.hub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Customer Purchasing Behavior based on RFM (Compact Insight Viz) */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 16,
        padding: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.75rem',
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
              {t('rfm_pattern_title')}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 1 }}>
              {t('rfm_pattern_sub')}
            </div>
          </div>
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: '#245366',
            background: 'rgba(36, 83, 102, 0.1)',
            padding: '2px 8px',
            borderRadius: 9999,
            border: '1px solid rgba(36, 83, 102, 0.2)',
            whiteSpace: 'nowrap',
          }}>
            {rfm.retentionRate}% {t('rfm_retention_label')}
          </span>
        </div>

        {/* Archetype Highlight */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #dfd3c3',
          borderRadius: 10,
          padding: '0.5rem 0.75rem',
          marginBottom: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '0.625rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              {t('rfm_archetype_label')}
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#245366', marginTop: 1 }}>
              {lang === 'ID' ? rfm.archetype.id : rfm.archetype.en}
            </div>
          </div>
          <div style={{
            textAlign: 'right',
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#576574',
          }}>
            {t('rfm_benchmark_scale')}
          </div>
        </div>

        {/* RFM Metric Scorecards - Stacked Full-Width Row Cards (Guaranteed No Overlap) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {/* Recency (R) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5dacb',
            borderRadius: 10,
            padding: '0.55rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  background: '#245366',
                  borderRadius: 4,
                  padding: '1px 5px',
                  lineHeight: '1.2',
                }}>R</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>
                  {lang === 'ID' ? 'Recency (Jeda Beli)' : 'Recency (Interval)'}
                </span>
              </div>
              <b style={{ fontSize: '0.8125rem', color: '#1e293b', fontWeight: 800 }}>
                {rfm.recency.value}
              </b>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748b' }}>
              <span>{lang === 'ID' ? rfm.recency.labelId : rfm.recency.labelEn}</span>
              <span style={{ fontWeight: 700, color: '#245366' }}>{rfm.recency.score}/5</span>
            </div>

            <div style={{ width: '100%', height: 4, background: '#f0e8dc', borderRadius: 2, overflow: 'hidden', marginTop: 1 }}>
              <div style={{
                width: mounted ? `${(rfm.recency.score / 5) * 100}%` : '0%',
                height: '100%',
                background: '#245366',
                borderRadius: 2,
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />
            </div>
          </div>

          {/* Frequency (F) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5dacb',
            borderRadius: 10,
            padding: '0.55rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  background: '#387388',
                  borderRadius: 4,
                  padding: '1px 5px',
                  lineHeight: '1.2',
                }}>F</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>
                  {lang === 'ID' ? 'Frekuensi (Repeat)' : 'Repeat Frequency'}
                </span>
              </div>
              <b style={{ fontSize: '0.8125rem', color: '#1e293b', fontWeight: 800 }}>
                {rfm.frequency.value}
              </b>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748b' }}>
              <span>{lang === 'ID' ? rfm.frequency.labelId : rfm.frequency.labelEn}</span>
              <span style={{ fontWeight: 700, color: '#387388' }}>{rfm.frequency.score}/5</span>
            </div>

            <div style={{ width: '100%', height: 4, background: '#f0e8dc', borderRadius: 2, overflow: 'hidden', marginTop: 1 }}>
              <div style={{
                width: mounted ? `${(rfm.frequency.score / 5) * 100}%` : '0%',
                height: '100%',
                background: '#387388',
                borderRadius: 2,
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '60ms',
              }} />
            </div>
          </div>

          {/* Monetary (M) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5dacb',
            borderRadius: 10,
            padding: '0.55rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  background: '#528fa3',
                  borderRadius: 4,
                  padding: '1px 5px',
                  lineHeight: '1.2',
                }}>M</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>
                  {lang === 'ID' ? 'Moneter (AOV)' : 'Monetary Value'}
                </span>
              </div>
              <b style={{ fontSize: '0.8125rem', color: '#1e293b', fontWeight: 800 }}>
                {rfm.monetary.value}
              </b>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748b' }}>
              <span>{lang === 'ID' ? rfm.monetary.labelId : rfm.monetary.labelEn}</span>
              <span style={{ fontWeight: 700, color: '#528fa3' }}>{rfm.monetary.score}/5</span>
            </div>

            <div style={{ width: '100%', height: 4, background: '#f0e8dc', borderRadius: 2, overflow: 'hidden', marginTop: 1 }}>
              <div style={{
                width: mounted ? `${(rfm.monetary.score / 5) * 100}%` : '0%',
                height: '100%',
                background: '#528fa3',
                borderRadius: 2,
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '120ms',
              }} />
            </div>
          </div>
        </div>

        {/* Compact Insight Takeaway */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.65)',
          borderRadius: 8,
          padding: '0.45rem 0.65rem',
          borderLeft: '3px solid #245366',
          fontSize: '0.6875rem',
          color: '#334155',
          lineHeight: 1.45,
        }}>
          <strong style={{ color: '#245366', fontWeight: 700 }}>{lang === 'ID' ? 'Insight: ' : 'Insight: '}</strong>
          {lang === 'ID' ? rfm.summaryId : rfm.summaryEn}
        </div>
      </div>
    </div>
  )
}
