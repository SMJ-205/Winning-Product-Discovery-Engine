'use client'

import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { CATEGORY_AWARENESS } from '@/lib/analyticsProfiles'

type Props = {
  category?: string
  timeframe?: '7d' | '30d' | '90d'
}

export default function BrandAwarenessSection({ category = 'all', timeframe = '7d' }: Props) {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  const profile = CATEGORY_AWARENESS[category] || CATEGORY_AWARENESS.all

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(timer)
  }, [])

  // 1. Dynamic Brand Recognition Shares
  const brandsRecognized = useMemo(() => {
    const base = profile.brandsRecognized
    const adjusted = base.map((b, idx) => {
      let delta = 0
      if (timeframe === '7d') {
        // Fast-moving challenger & viral brands gain share in 7-day surge
        if (idx === 1) delta = 5
        else if (idx === 2) delta = 4
        else if (idx === 0) delta = -5
        else delta = -2
      } else if (timeframe === '90d') {
        // Official mall brand / incumbent dominates 90-day window
        if (idx === 0) delta = 6
        else if (idx === 1) delta = 2
        else delta = -3
      }
      return {
        ...b,
        share: Math.max(5, b.share + delta),
      }
    })
    const sum = adjusted.reduce((acc, x) => acc + x.share, 0) || 1
    return adjusted.map((b, idx, arr) => {
      if (idx === arr.length - 1) {
        const others = arr.slice(0, -1).reduce((acc, x) => acc + Math.round((x.share / sum) * 100), 0)
        return { ...b, share: Math.max(2, 100 - others) }
      }
      return { ...b, share: Math.round((b.share / sum) * 100) }
    })
  }, [profile.brandsRecognized, timeframe])

  // 2. Dynamic Customer Loyalty / Repeat Rates
  const customerLoyalty = useMemo(() => {
    return profile.customerLoyalty.map((b) => {
      let rate = b.loyalty
      if (timeframe === '7d') {
        rate = Math.round(b.loyalty * 0.42) // 7-day immediate repeat
      } else if (timeframe === '90d') {
        rate = Math.min(88, Math.round(b.loyalty * 1.35)) // 90-day cumulative retention
      }
      return {
        ...b,
        loyalty: Math.max(12, rate),
      }
    })
  }, [profile.customerLoyalty, timeframe])

  // 3. Dynamic Emotional Themes
  const emotionalThemes = useMemo(() => {
    const scores = { ...profile.emotionalScores }
    if (timeframe === '7d') {
      scores.practical = Math.min(5.0, Math.round((scores.practical + 0.5) * 10) / 10)
      scores.budget = Math.min(5.0, Math.round((scores.budget + 0.6) * 10) / 10)
      scores.design = Math.min(5.0, Math.round((scores.design + 0.4) * 10) / 10)
      scores.durable = Math.max(2.5, Math.round((scores.durable - 0.5) * 10) / 10)
      scores.guarantee = Math.max(2.5, Math.round((scores.guarantee - 0.4) * 10) / 10)
    } else if (timeframe === '90d') {
      scores.durable = Math.min(5.0, Math.round((scores.durable + 0.6) * 10) / 10)
      scores.guarantee = Math.min(5.0, Math.round((scores.guarantee + 0.7) * 10) / 10)
      scores.practical = Math.max(3.0, Math.round((scores.practical - 0.2) * 10) / 10)
      scores.budget = Math.max(3.0, Math.round((scores.budget - 0.4) * 10) / 10)
    }

    return [
      { name: t('hook_practical'), score: scores.practical, color: '#245366' },
      { name: t('hook_durable'),   score: scores.durable,   color: '#2e6378' },
      { name: t('hook_guarantee'), score: scores.guarantee, color: '#48879e' },
      { name: t('hook_budget'),    score: scores.budget,    color: '#62a0b3' },
      { name: t('hook_design'),    score: scores.design,    color: '#dfbfa8' },
    ]
  }, [profile.emotionalScores, t, timeframe])

  // 4. Dynamic Discovery Channels
  const discoveryChannels = useMemo(() => {
    return profile.discoveryChannels.map((ch) => {
      let val = ch.value
      const lower = ch.name.toLowerCase()
      if (timeframe === '7d') {
        if (lower.includes('tik') || lower.includes('video') || lower.includes('live') || lower.includes('feed')) val = Math.round(val * 1.55)
        else if (lower.includes('search') || lower.includes('pencarian')) val = Math.round(val * 0.65)
        else val = Math.round(val * 0.85)
      } else if (timeframe === '90d') {
        if (lower.includes('search') || lower.includes('pencarian') || lower.includes('toko')) val = Math.round(val * 1.45)
        else if (lower.includes('tik') || lower.includes('video') || lower.includes('live')) val = Math.round(val * 0.60)
        else val = Math.round(val * 1.10)
      }
      return { ...ch, value: Math.max(5, val) }
    }).map((ch, idx, arr) => {
      const sum = arr.reduce((acc, x) => acc + x.value, 0) || 1
      if (idx === arr.length - 1) {
        const others = arr.slice(0, -1).reduce((acc, x) => acc + Math.round((x.value / sum) * 100), 0)
        return { ...ch, value: Math.max(2, 100 - others) }
      }
      return { ...ch, value: Math.round((ch.value / sum) * 100) }
    })
  }, [profile.discoveryChannels, timeframe])

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
      {/* Title & Timeframe Badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
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

        <span style={{
          fontSize: '0.7rem',
          fontWeight: 800,
          color: '#245366',
          background: 'rgba(36, 83, 102, 0.08)',
          border: '1px solid rgba(36, 83, 102, 0.22)',
          padding: '2px 8px',
          borderRadius: 8,
          whiteSpace: 'nowrap',
        }}>
          {timeframe === '7d' ? '7 Hari' : timeframe === '90d' ? '90 Hari' : '30 Hari'}
        </span>
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
            <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Traffic & Video Showcase
            </div>
          </div>

          <div>
            {/* Horizontal 100% Segmented Stacked Bar (Zero-clipping, responsive) */}
            <div style={{
              display: 'flex',
              height: 22,
              borderRadius: 8,
              overflow: 'hidden',
              background: '#e5dacb',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.08)',
            }}>
              {discoveryChannels.map((ch, idx) => (
                <div
                  key={ch.name}
                  style={{
                    width: mounted ? `${ch.value}%` : '0%',
                    height: '100%',
                    background: ch.color,
                    borderRight: idx < discoveryChannels.length - 1 ? '1.5px solid #f5ede2' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${idx * 75}ms`,
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    color: ch.color === '#dfbfa8' ? '#1e293b' : '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                  title={`${ch.name}: ${ch.value}%`}
                >
                  {ch.value >= 14 ? `${ch.value}%` : ''}
                </div>
              ))}
            </div>

            {/* Segment Breakdown Cards with Color Swatches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.85rem' }}>
              {discoveryChannels.map((ch) => (
                <div
                  key={ch.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.65rem',
                    background: 'rgba(255, 255, 255, 0.75)',
                    border: '1px solid rgba(223, 211, 195, 0.7)',
                    borderRadius: 9,
                    fontSize: '0.72rem',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: ch.color, flexShrink: 0 }} />
                    <span style={{
                      color: '#475569',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {ch.name}
                    </span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.78rem', marginLeft: 8, flexShrink: 0 }}>
                    {ch.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
