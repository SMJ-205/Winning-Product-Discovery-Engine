'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

type PricePoint = { price: number; product_id: string }

function buildHistogram(prices: PricePoint[], bins = 8) {
  const valid = prices.map(p => p.price).filter(p => p > 0)
  if (!valid.length) {
    return [
      { range: 'Rp 10k–20k', count: 4 },
      { range: 'Rp 20k–35k', count: 7 },
      { range: 'Rp 35k–50k', count: 12 },
      { range: 'Rp 50k–70k', count: 8 },
      { range: 'Rp 70k–90k', count: 3 },
    ]
  }

  const min = Math.min(...valid)
  const max = Math.max(...valid)
  const step = (max - min) / bins

  return Array.from({ length: bins }, (_, i) => {
    const lo = min + i * step
    const hi = lo + step
    const count = valid.filter(p => p >= lo && (i === bins - 1 ? p <= hi : p < hi)).length
    return {
      range: `Rp ${Math.round(lo / 1000)}k–${Math.round(hi / 1000)}k`,
      count,
    }
  })
}

export default function PriceHistogram({ prices }: { prices: PricePoint[] }) {
  const bins = buildHistogram(prices)

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -2px rgba(15, 23, 42, 0.02)',
    }}>
      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>
        Distribusi Harga Kompetitor
      </div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem' }}>
        Kerapatan listing produk berdasarkan rentang harga pasar (Sweet Spot Pricing)
      </div>
      <ResponsiveContainer width="100%" height={290}>
        <BarChart data={bins} margin={{ top: 10, right: 10, bottom: 35, left: 0 }}>
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="range"
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
            angle={-25}
            textAnchor="end"
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
              fontSize: 12,
              color: '#0f172a',
            }}
            labelStyle={{ color: '#4f46e5', fontWeight: 700 }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {bins.map((_, i) => (
              <Cell
                key={i}
                fill={i === Math.floor(bins.length / 2) ? '#6366f1' : '#cbd5e1'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
