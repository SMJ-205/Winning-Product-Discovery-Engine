'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'

type Props = {
  sellingPrice:  number
  hpp:           number
  ekspedisi:     number
  ads:           number
  marketplaceFee: number
}

function buildWaterfall({ sellingPrice, hpp, ekspedisi, ads, marketplaceFee }: Props) {
  const fee     = sellingPrice * marketplaceFee
  const netProfit = sellingPrice - hpp - ekspedisi - ads - fee

  return [
    { name: 'Harga Jual',       value: sellingPrice, base: 0,                     fill: '#6366f1' },
    { name: 'HPP Supplier',     value: -hpp,          base: sellingPrice,          fill: '#ef4444' },
    { name: 'Komisi Platform',  value: -fee,          base: sellingPrice - hpp,    fill: '#f59e0b' },
    { name: 'Ekspedisi',        value: -ekspedisi,    base: sellingPrice - hpp - fee,             fill: '#8b5cf6' },
    { name: 'Ads',              value: -ads,          base: sellingPrice - hpp - fee - ekspedisi, fill: '#ec4899' },
    { name: 'Net Profit',       value: netProfit,     base: 0,                     fill: netProfit >= 0 ? '#10b981' : '#ef4444' },
  ]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{ background: '#1e2235', border: '1px solid #334155', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 12 }}>
      <b style={{ color: '#e2e8f0' }}>{d.name}</b>
      <div style={{ color: d.value >= 0 ? '#10b981' : '#ef4444', fontWeight: 700, marginTop: 4 }}>
        {d.value >= 0 ? '+' : ''}Rp {Math.abs(d.value).toLocaleString('id-ID')}
      </div>
    </div>
  )
}

export default function MarginWaterfall(props: Props) {
  const data = buildWaterfall(props)
  const netProfit = props.sellingPrice - props.hpp - props.ekspedisi - props.ads - props.sellingPrice * props.marketplaceFee
  const margin    = (netProfit / props.sellingPrice * 100).toFixed(1)

  return (
    <div style={{
      background: '#1a1d2e', border: '1px solid #2a2d3e',
      borderRadius: 12, padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Dekomposisi Margin</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Revenue → Net Profit</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: netProfit >= 0 ? '#10b981' : '#ef4444' }}>
            {margin}%
          </div>
          <div style={{ fontSize: 11, color: '#475569' }}>Net Margin</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
          <CartesianGrid stroke="#2a2d3e" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} angle={-15} textAnchor="end" />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickFormatter={v => `Rp ${(v/1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#475569" />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
