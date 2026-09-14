'use client'

import { useState } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

type DataPoint = {
  keyword_id:         number
  sub_category:       string
  category_name?:     string
  norm_competition?:  number
  norm_demand?:       number
  monthly_sold_units: number
  search_trend_index: number
  winning_product_score?: number
}

const PALETTE = ['#38bdf8', '#ff6b4a', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899']

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as DataPoint
  return (
    <div style={{
      background: '#151b2e',
      border: '1px solid #202a48',
      borderRadius: 14,
      padding: '0.875rem 1.125rem',
      fontSize: 12,
      color: '#f8fafc',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
      minWidth: 210,
    }}>
      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6, color: '#38bdf8' }}>
        {d.sub_category}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: '#94a3b8' }}>Trend Index:</span>
        <b>{d.search_trend_index?.toFixed(1)}</b>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: '#94a3b8' }}>Units / Bulan:</span>
        <b>{d.monthly_sold_units?.toLocaleString('id-ID')}</b>
      </div>
      {d.winning_product_score && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 6,
          paddingTop: 6,
          borderTop: '1px solid #1a223a',
        }}>
          <span style={{ color: '#94a3b8' }}>WPS Score:</span>
          <b style={{ color: '#34d399', fontSize: 13 }}>{d.winning_product_score.toFixed(1)}</b>
        </div>
      )}
    </div>
  )
}

export default function BubbleChart({ data }: { data: DataPoint[] }) {
  const [filter, setFilter] = useState('all')
  const categories = Array.from(
    new Set(data.map(d => d.category_name).filter(Boolean))
  ) as string[]

  const filtered = filter === 'all'
    ? data
    : data.filter(d => d.category_name === filter)

  const withAxes = filtered.map(d => ({
    ...d,
    x: d.monthly_sold_units || 500,
    y: d.search_trend_index || 20,
    z: Math.max((d.monthly_sold_units || 500) * (d.search_trend_index || 20) / 800, 300),
  }))

  return (
    <div style={{
      background: '#151b2e',
      border: '1px solid #202a48',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.2)',
    }}>
      {/* Header with Title, Legends, and Dropdown */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
            Market Opportunity Analytics
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
            Ukuran bubble merefleksikan estimasi GMV pasar
          </div>
        </div>

        {/* Legend dots & Category filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }} />
              High Demand
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff6b4a' }} />
              Balanced
            </span>
          </div>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: '#11172a',
              border: '1px solid #202a48',
              borderRadius: 9999,
              color: '#f8fafc',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Semua Kategori ({data.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320} style={{ outline: 'none' }}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }} style={{ outline: 'none' }}>
          <CartesianGrid stroke="#1a223a" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="x"
            name="Units/bln"
            type="number"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k units` : String(v)}
            axisLine={{ stroke: '#202a48' }}
            tickLine={false}
          />
          <YAxis
            dataKey="y"
            name="Trend Index"
            type="number"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#202a48' }}
            tickLine={false}
          />
          <ZAxis dataKey="z" range={[250, 1800]} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#38bdf8', strokeDasharray: '4 4' }} />
          <Scatter data={withAxes} activeShape={false} stroke="none">
            {withAxes.map((_, i) => (
              <Cell
                key={i}
                fill={PALETTE[i % PALETTE.length]}
                fillOpacity={0.85}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
