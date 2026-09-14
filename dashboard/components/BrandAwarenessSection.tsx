'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts'

import { CATEGORY_AWARENESS } from '@/lib/analyticsProfiles'

type Props = {
  category?: string
}

export default function BrandAwarenessSection({ category = 'all' }: Props) {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  const profile = CATEGORY_AWARENESS[category] || CATEGORY_AWARENESS.all
  const { brandsRecognized, customerLoyalty, discoveryChannels, emotionalScores } = profile

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(timer)
  }, [])

  const emotionalThemes = [
    { name: t('hook_practical'), score: emotionalScores.practical, color: '#245366' },
    { name: t('hook_durable'),   score: emotionalScores.durable,   color: '#2e6378' },
    { name: t('hook_guarantee'), score: emotionalScores.guarantee, color: '#48879e' },
    { name: t('hook_budget'),    score: emotionalScores.budget,    color: '#62a0b3' },
    { name: t('hook_design'),    score: emotionalScores.design,    color: '#dfbfa8' },
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
          {t('sec_brand_awareness')}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
          Brand Recognition & Market Positioning
        </div>
      </div>

      {/* Row: Most Brands Recognized + Customer Loyalty side by side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
      }}>
        {/* Most Brands Recognized */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 16,
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
            {t('most_recognized_brands')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {brandsRecognized.map((b, idx) => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#576574',
                  width: 105,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {b.name}
                </span>
                <div style={{ flex: 1, height: 16, background: '#e5dacb', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: mounted ? `${b.share}%` : '0%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #1b4352 0%, #245366 50%, #5c9eaf 100%)',
                    borderRadius: 4,
                    transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${idx * 75}ms`,
                  }} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1e293b', width: 32, textAlign: 'right' }}>
                  {b.share}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Loyalty towards Brand */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 16,
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
            {t('customer_loyalty')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {customerLoyalty.map((b, idx) => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#576574',
                  width: 105,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {b.name}
                </span>
                <div style={{ flex: 1, height: 16, background: '#e5dacb', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: mounted ? `${b.loyalty}%` : '0%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #245366 0%, #76b3c4 100%)',
                    borderRadius: 4,
                    transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${idx * 75}ms`,
                  }} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#245366', width: 32, textAlign: 'right' }}>
                  {b.loyalty}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Advertising Themes (Likert Scale) + Product Discovery Channels Donut */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
      }}>
        {/* Advertising Themes Touching Emotional Points */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 16,
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>
            {t('ad_themes_title')}
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.75rem' }}>
            {t('ad_themes_sub')}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {emotionalThemes.map((item, idx) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#334155',
                  width: 120,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {item.name}
                </span>
                <div style={{ flex: 1, height: 16, background: '#e5dacb', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: mounted ? `${(item.score / 5) * 100}%` : '0%',
                    height: '100%',
                    background: '#245366',
                    borderRadius: 4,
                    transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${idx * 75}ms`,
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#245366', width: 28, textAlign: 'right' }}>
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Discovery & Brand Channels */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 16,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>
              {t('channel_title')}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Traffic & Video Showcase
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <div style={{ width: 110, height: 110, position: 'relative' }}>
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
                    formatter={(v: any) => [`${v}%`, 'Share']}
                  />
                  <Pie
                    data={discoveryChannels}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {discoveryChannels.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              {discoveryChannels.map(ch => (
                <div key={ch.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.6875rem' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: ch.color }} />
                  <span style={{ color: '#576574', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ch.name}
                  </span>
                  <b style={{ color: '#1e293b' }}>{ch.value}%</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
