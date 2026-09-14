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
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(36, 83, 102, 0.05)',
    }}>
      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>
        {t('chart_price_dist')}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#576574', marginBottom: '1.25rem' }}>
        {t('chart_price_sub')}
      </div>
      <ResponsiveContainer width="100%" height={290}>
        <BarChart data={bins} margin={{ top: 10, right: 10, bottom: 35, left: 0 }}>
          <CartesianGrid stroke="#e5dacb" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="range"
            tick={{ fill: '#576574', fontSize: 10, fontWeight: 500 }}
            angle={-25}
            textAnchor="end"
            axisLine={{ stroke: '#dfd3c3' }}
          />
          <YAxis tick={{ fill: '#576574', fontSize: 11 }} axisLine={{ stroke: '#dfd3c3' }} />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #245366',
              borderRadius: 12,
              boxShadow: '0 10px 25px -5px rgba(36, 83, 102, 0.15)',
              fontSize: 12,
              color: '#1e293b',
            }}
            labelStyle={{ color: '#245366', fontWeight: 700 }}
            formatter={(v: any) => [`${v} ${t('freq_label')}`, t('price_label')]}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {bins.map((_, i) => (
              <Cell
                key={i}
                fill={i === Math.floor(bins.length / 2) ? '#245366' : '#87b7c4'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
