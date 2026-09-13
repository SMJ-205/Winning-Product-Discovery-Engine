'use client'

import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

type DataPoint = {
  keyword_id:         number
  sub_category:       string
  norm_competition?:  number
  norm_demand?:       number
  monthly_sold_units: number
  search_trend_index: number
  winning_product_score?: number
}

const PALETTE = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as DataPoint
  return (
    <div style={{
      background: '#1e2235', border: '1px solid #334155', borderRadius: 8,
      padding: '0.75rem 1rem', fontSize: 12, color: '#e2e8f0', maxWidth: 220,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: '#a5b4fc' }}>{d.sub_category}</div>
      <div>📈 Trend Index: <b>{d.search_trend_index?.toFixed(1)}</b></div>
      <div>🛒 Units/bulan: <b>{d.monthly_sold_units?.toLocaleString('id-ID')}</b></div>
      {d.winning_product_score && (
        <div>⭐ WPS: <b style={{ color: '#10b981' }}>{d.winning_product_score.toFixed(1)}</b></div>
      )}
    </div>
  )
}

export default function BubbleChart({ data }: { data: DataPoint[] }) {
  // Normalisasi sumbu X dan Y untuk display
  const withAxes = data.map(d => ({
    ...d,
    x: d.monthly_sold_units,
    y: d.search_trend_index,
    z: Math.max(d.monthly_sold_units * d.search_trend_index / 1000, 200),
  }))

  return (
    <div style={{
      background: '#1a1d2e', border: '1px solid #2a2d3e',
      borderRadius: 12, padding: '1.5rem',
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: '0.25rem' }}>
        Market Landscape
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: '1rem' }}>
        X = Units Terjual/Bulan &nbsp;·&nbsp; Y = Google Trend Index &nbsp;·&nbsp; Ukuran = GMV Estimasi
      </div>
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid stroke="#2a2d3e" strokeDasharray="3 3" />
          <XAxis
            dataKey="x" name="Units/bln" type="number"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)}
          />
          <YAxis
            dataKey="y" name="Trend Index" type="number"
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <ZAxis dataKey="z" range={[200, 1800]} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155' }} />
          <Scatter data={withAxes}>
            {withAxes.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.8} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
