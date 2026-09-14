'use client'

import { useLanguage } from '@/context/LanguageContext'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const AGE_DATA = [
  { name: '<25', value: 14, color: '#dfbfa8' },
  { name: '25-34', value: 28, color: '#245366' },
  { name: '35-44', value: 24, color: '#387388' },
  { name: '45-54', value: 18, color: '#528fa3' },
  { name: '55-64', value: 11, color: '#7bb0c0' },
  { name: '>64', value: 5, color: '#a6cfda' },
]

const REGIONS = [
  { name: 'Jabodetabek', pct: 44, hub: 'Jakarta, Tangerang, Bekasi' },
  { name: 'Jawa Barat', pct: 22, hub: 'Bandung, Bogor, Depok' },
  { name: 'Jawa Timur & Tengah', pct: 18, hub: 'Surabaya, Semarang, Malang' },
  { name: 'Luar Jawa', pct: 16, hub: 'Medan, Makassar, Padang' },
]

export default function CustomerInfoSection() {
  const { t } = useLanguage()

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
          {t('sec_cust_info')}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
          {t('age_group')} & Demographics
        </div>
      </div>

      {/* Age Group Donut Chart */}
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
            Dominant: 25–34 (28%)
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
                  data={AGE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={56}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {AGE_DATA.map((entry, index) => (
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
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>28%</div>
              <div style={{ fontSize: '0.5625rem', color: '#576574' }}>25-34</div>
            </div>
          </div>

          {/* Age Legend pills */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.35rem 0.6rem',
            flex: 1,
          }}>
            {AGE_DATA.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: d.color }} />
                <span style={{ color: '#576574', fontWeight: 500 }}>{d.name}:</span>
                <b style={{ color: '#1e293b' }}>{d.value}%</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Region Distribution Progress Bars */}
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
          {REGIONS.map(r => (
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
                  width: `${r.pct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #245366 0%, #5c9eaf 100%)',
                  borderRadius: 3,
                }} />
              </div>
              <div style={{ fontSize: '0.625rem', color: '#64748b', marginTop: 2 }}>
                {r.hub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gender Representation Split */}
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
        }}>
          <div style={{
            width: '54%',
            background: '#dfbfa8',
            transition: 'width 0.5s ease',
          }} />
          <div style={{
            width: '46%',
            background: '#245366',
            transition: 'width 0.5s ease',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dfbfa8' }} />
            <span style={{ fontSize: '0.75rem', color: '#576574', fontWeight: 600 }}>{t('female')}</span>
            <b style={{ fontSize: '0.875rem', color: '#9c6f50' }}>54%</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#245366' }} />
            <span style={{ fontSize: '0.75rem', color: '#576574', fontWeight: 600 }}>{t('male')}</span>
            <b style={{ fontSize: '0.875rem', color: '#245366' }}>46%</b>
          </div>
        </div>
      </div>
    </div>
  )
}
