'use client'

import { useLanguage } from '@/context/LanguageContext'
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
  const { t } = useLanguage()
  const bins = buildHistogram(prices)

  return (
    <div style={{
      background: '#151b2e',
      border: '1px solid #202a48',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.2)',
    }}>
      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginBottom: 2 }}>
        {t('chart_price_dist')}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
        {t('chart_price_sub')}
      </div>
      <ResponsiveContainer width="100%" height={290}>
        <BarChart data={bins} margin={{ top: 10, right: 10, bottom: 35, left: 0 }}>
          <CartesianGrid stroke="#1a223a" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="range"
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
            angle={-25}
            textAnchor="end"
            axisLine={{ stroke: '#202a48' }}
          />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#202a48' }} />
          <Tooltip
            contentStyle={{
              background: '#151b2e',
              border: '1px solid #202a48',
              borderRadius: 12,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              fontSize: 12,
              color: '#f8fafc',
            }}
            labelStyle={{ color: '#38bdf8', fontWeight: 700 }}
            formatter={(v: any) => [`${v} ${t('freq_label')}`, t('price_label')]}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {bins.map((_, i) => (
              <Cell
                key={i}
                fill={i === Math.floor(bins.length / 2) ? '#38bdf8' : '#232d4d'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
