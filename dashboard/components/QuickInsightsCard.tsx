'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function QuickInsightsCard() {
  const { t } = useLanguage()

  const days = [
    { dayKey: 'day_sun', date: '11' },
    { dayKey: 'day_mon', date: '12' },
    { dayKey: 'day_tue', date: '13' },
    { dayKey: 'day_wed', date: '14', active: true },
    { dayKey: 'day_thu', date: '15' },
    { dayKey: 'day_fri', date: '16' },
    { dayKey: 'day_sat', date: '17' },
  ]

  return (
    <div style={{
      background: '#151b2e',
      border: '1px solid #202a48',
      borderRadius: 22,
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#f8fafc' }}>
          {t('calendar_month')}
        </span>
        <span style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: '#38bdf8',
          background: 'rgba(56, 189, 248, 0.1)',
          padding: '2px 8px',
          borderRadius: 9999,
          border: '1px solid rgba(56, 189, 248, 0.25)',
        }}>
          {t('automated')}
        </span>
      </div>

      {/* Calendar day pills */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.4rem 0',
      }}>
        {days.map(d => (
          <div
            key={d.date}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>
              {t(d.dayKey)}
            </span>
            <span style={{
              fontSize: '0.8125rem',
              fontWeight: d.active ? 800 : 600,
              width: 26,
              height: 26,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: d.active ? '#38bdf8' : 'transparent',
              color: d.active ? '#0c1021' : '#cbd5e1',
            }}>
              {d.date}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Events / Insights list with clean SVG icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem',
          background: '#11172a',
          borderRadius: 12,
          border: '1px solid #1a223a',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f8fafc' }}>
                {t('task_sample')}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                {t('task_sample_sub')}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>
            12pm
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem',
          background: '#11172a',
          borderRadius: 12,
          border: '1px solid #1a223a',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f8fafc' }}>
                {t('task_cron')}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                {t('task_cron_sub')}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>
            9pm
          </span>
        </div>
      </div>
    </div>
  )
}
