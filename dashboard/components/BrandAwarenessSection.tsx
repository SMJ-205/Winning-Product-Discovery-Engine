'use client'

import { useLanguage } from '@/context/LanguageContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts'

const BRANDS_RECOGNIZED = [
  { name: 'MotoGadget Official', share: 45, color: '#1e3a8a' },
  { name: 'Bintang Aksesoris',    share: 36, color: '#2563eb' },
  { name: 'Dapur Cantik ID',      share: 27, color: '#3b82f6' },
  { name: 'Anker Style Store',    share: 19, color: '#60a5fa' },
  { name: 'Dapur Minang',         share: 12, color: '#93c5fd' },
  { name: 'Toko Kabel Murah',     share: 10, color: '#bfdbfe' },
]

const CUSTOMER_LOYALTY = [
  { name: 'MotoGadget Official', loyalty: 52, color: '#0f172a' },
  { name: 'Bintang Aksesoris',    loyalty: 41, color: '#1e293b' },
  { name: 'Dapur Cantik ID',      loyalty: 29, color: '#2563eb' },
  { name: 'Anker Style Store',    loyalty: 21, color: '#38bdf8' },
  { name: 'Dapur Minang',         loyalty: 14, color: '#0ea5e9' },
  { name: 'Toko Kabel Murah',     loyalty: 12, color: '#0284c7' },
]

const DISCOVERY_CHANNELS = [
  { name: 'TikTok Live & Affiliate', value: 41, color: '#38bdf8' },
  { name: 'Shopee & Tokopedia Video', value: 34, color: '#1e293b' },
  { name: 'Organic Search & Ads', value: 25, color: '#60a5fa' },
]

export default function BrandAwarenessSection() {
  const { t } = useLanguage()

  const emotionalThemes = [
    { name: t('hook_practical'), score: 4.6, color: '#0f172a' },
    { name: t('hook_durable'),   score: 4.1, color: '#1e293b' },
    { name: t('hook_guarantee'), score: 3.7, color: '#2563eb' },
    { name: t('hook_budget'),    score: 3.4, color: '#38bdf8' },
    { name: t('hook_design'),    score: 2.9, color: '#93c5fd' },
  ]

  return (
    <div style={{
      background: '#151b2e',
      border: '1px solid #202a48',
      borderRadius: 22,
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.2)',
      height: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Title */}
      <div>
        <div style={{
          fontSize: '0.8125rem',
          fontWeight: 800,
          color: '#38bdf8',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 4,
        }}>
          {t('sec_brand_awareness')}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
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
          background: '#11172a',
          border: '1px solid #1a223a',
          borderRadius: 16,
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
            {t('most_recognized_brands')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {BRANDS_RECOGNIZED.map(b => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#94a3b8',
                  width: 105,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {b.name}
                </span>
                <div style={{ flex: 1, height: 16, background: '#1f2945', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${b.share}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #1e3a8a 0%, #38bdf8 100%)',
                    borderRadius: 4,
                  }} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f8fafc', width: 32, textAlign: 'right' }}>
                  {b.share}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Loyalty towards Brand */}
        <div style={{
          background: '#11172a',
          border: '1px solid #1a223a',
          borderRadius: 16,
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
            {t('customer_loyalty')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {CUSTOMER_LOYALTY.map(b => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#94a3b8',
                  width: 105,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {b.name}
                </span>
                <div style={{ flex: 1, height: 16, background: '#1f2945', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${b.loyalty}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
                    borderRadius: 4,
                  }} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', width: 32, textAlign: 'right' }}>
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
          background: '#11172a',
          border: '1px solid #1a223a',
          borderRadius: 16,
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#cbd5e1', marginBottom: 2 }}>
            {t('ad_themes_title')}
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.75rem' }}>
            {t('ad_themes_sub')}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {emotionalThemes.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#cbd5e1',
                  width: 120,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {item.name}
                </span>
                <div style={{ flex: 1, height: 16, background: '#1f2945', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(item.score / 5) * 100}%`,
                    height: '100%',
                    background: '#38bdf8',
                    borderRadius: 4,
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', width: 28, textAlign: 'right' }}>
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Discovery & Brand Channels */}
        <div style={{
          background: '#11172a',
          border: '1px solid #1a223a',
          borderRadius: 16,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#cbd5e1', marginBottom: 2 }}>
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
                      background: '#151b2e',
                      border: '1px solid #202a48',
                      borderRadius: 10,
                      fontSize: 12,
                      color: '#f8fafc',
                    }}
                    formatter={(v: any) => [`${v}%`, 'Share']}
                  />
                  <Pie
                    data={DISCOVERY_CHANNELS}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {DISCOVERY_CHANNELS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>41%</div>
                <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Live</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              {DISCOVERY_CHANNELS.map(ch => (
                <div key={ch.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.6875rem' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: ch.color }} />
                  <span style={{ color: '#94a3b8', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ch.name}
                  </span>
                  <b style={{ color: '#f8fafc' }}>{ch.value}%</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
