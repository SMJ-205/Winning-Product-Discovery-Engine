'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

type PricePoint = { price: number; product_id: string }

function buildHistogram(prices: PricePoint[], bins = 8) {
  const valid  = prices.map(p => p.price).filter(p => p > 0)
  if (!valid.length) return []

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
      background: '#1a1d2e', border: '1px solid #2a2d3e',
      borderRadius: 12, padding: '1.5rem',
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
        Distribusi Harga Kompetitor
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: '1rem' }}>
        Jumlah produk per rentang harga
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={bins} margin={{ top: 10, right: 10, bottom: 40, left: 0 }}>
          <CartesianGrid stroke="#2a2d3e" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 10 }} angle={-30} textAnchor="end" />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#1e2235', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#a5b4fc' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {bins.map((_, i) => (
              <Cell key={i} fill={i === Math.floor(bins.length / 2) ? '#6366f1' : '#334155'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
