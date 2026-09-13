export default function Loading() {
  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', opacity: 0.85 }}>
      {/* Header Skeleton */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          width: 180,
          height: 14,
          borderRadius: 6,
          background: '#151b2e',
          marginBottom: 12,
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <div style={{
          width: 280,
          height: 32,
          borderRadius: 8,
          background: '#151b2e',
          marginBottom: 8,
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <div style={{
          width: 420,
          height: 16,
          borderRadius: 6,
          background: '#11172a',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      </div>

      {/* Grid Skeleton */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 3 KPI cards skeleton */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '1rem',
          }}>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  height: 110,
                  background: '#151b2e',
                  border: '1px solid #1b2440',
                  borderRadius: 18,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>

          {/* Main Chart Skeleton */}
          <div style={{
            height: 380,
            background: '#151b2e',
            border: '1px solid #1b2440',
            borderRadius: 22,
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />

          {/* Table Skeleton */}
          <div style={{
            height: 260,
            background: '#151b2e',
            border: '1px solid #1b2440',
            borderRadius: 22,
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        </div>

        {/* Right column skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div style={{
            height: 290,
            background: '#151b2e',
            border: '1px solid #1b2440',
            borderRadius: 22,
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <div style={{
            height: 240,
            background: '#151b2e',
            border: '1px solid #1b2440',
            borderRadius: 22,
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>
    </div>
  )
}
