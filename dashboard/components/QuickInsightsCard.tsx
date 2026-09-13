'use client'

export default function QuickInsightsCard() {
  const days = [
    { day: 'Sun', date: '11' },
    { day: 'Mon', date: '12' },
    { day: 'Tue', date: '13' },
    { day: 'Wed', date: '14', active: true },
    { day: 'Thu', date: '15' },
    { day: 'Fri', date: '16' },
    { day: 'Sat', date: '17' },
  ]

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -2px rgba(15, 23, 42, 0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    }}>
      {/* Header with arrows */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
          September 2026
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
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
            <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 600 }}>
              {d.day}
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
              background: d.active ? '#6366f1' : 'transparent',
              color: d.active ? '#ffffff' : '#334155',
            }}>
              {d.date}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Events / Insights list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem',
          background: '#f8fafc',
          borderRadius: 12,
          border: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#e0e7ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}>
              🤝
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                Supplier Sample Review
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                Holder HP Motor (Target HPP Rp 28k)
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
          background: '#f8fafc',
          borderRadius: 12,
          border: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}>
              🔄
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                Weekly Pipeline Cron
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                GitHub Actions Automated
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>
            Sun 03am
          </span>
        </div>
      </div>
    </div>
  )
}
