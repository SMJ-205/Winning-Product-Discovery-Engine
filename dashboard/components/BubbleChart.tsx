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

const PALETTE = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899']

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as DataPoint
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: '0.875rem 1.125rem',
      fontSize: 12,
      color: '#1e293b',
      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
      minWidth: 210,
    }}>
      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6, color: '#4f46e5' }}>
        {d.sub_category}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: '#64748b' }}>📈 Trend Index:</span>
        <b>{d.search_trend_index?.toFixed(1)}</b>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: '#64748b' }}>🛒 Units / Bulan:</span>
        <b>{d.monthly_sold_units?.toLocaleString('id-ID')}</b>
      </div>
      {d.winning_product_score && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 6,
          paddingTop: 6,
          borderTop: '1px solid #f1f5f9',
        }}>
          <span style={{ color: '#64748b' }}>⭐ WPS Score:</span>
          <b style={{ color: '#10b981', fontSize: 13 }}>{d.winning_product_score.toFixed(1)}</b>
        </div>
      )}
    </div>
  )
}

export default function BubbleChart({ data }: { data: DataPoint[] }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? data
    : data.filter(d => d.category_name?.toLowerCase().includes(filter.toLowerCase()))

  const withAxes = filtered.map(d => ({
    ...d,
    x: d.monthly_sold_units || 500,
    y: d.search_trend_index || 20,
    z: Math.max((d.monthly_sold_units || 500) * (d.search_trend_index || 20) / 800, 300),
  }))

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -2px rgba(15, 23, 42, 0.02)',
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
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            Market Opportunity Analytics
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
            Ukuran bubble merefleksikan estimasi GMV pasar
          </div>
        </div>

        {/* Legend dots & Category filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '0.75rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06b6d4' }} />
              High Demand
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} />
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
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 9999,
              color: '#334155',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Semua Kategori</option>
            <option value="elektronik">Elektronik</option>
            <option value="dapur">Dapur & Rumah</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="x"
            name="Units/bln"
            type="number"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k units` : String(v)}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            dataKey="y"
            name="Trend Index"
            type="number"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <ZAxis dataKey="z" range={[250, 1800]} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }} />
          <Scatter data={withAxes}>
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
