'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'

type Props = {
  sellingPrice:   number
  hpp:            number
  ekspedisi:      number
  ads:            number
  marketplaceFee: number
}

function buildWaterfall({ sellingPrice, hpp, ekspedisi, ads, marketplaceFee }: Props) {
  const fee = sellingPrice * marketplaceFee
  const netProfit = sellingPrice - hpp - ekspedisi - ads - fee

  return [
    { name: 'Harga Jual',      value: sellingPrice, base: 0,                                    fill: '#38bdf8' },
    { name: 'HPP Supplier',    value: -hpp,         base: sellingPrice,                         fill: '#ff6b4a' },
    { name: 'Komisi Platform', value: -fee,         base: sellingPrice - hpp,                   fill: '#f59e0b' },
    { name: 'Ekspedisi',       value: -ekspedisi,   base: sellingPrice - hpp - fee,             fill: '#8b5cf6' },
    { name: 'Ads',             value: -ads,         base: sellingPrice - hpp - fee - ekspedisi, fill: '#ec4899' },
    { name: 'Net Profit',      value: netProfit,    base: 0,                                    fill: netProfit >= 0 ? '#10b981' : '#ff6b4a' },
  ]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#151b2e',
      border: '1px solid #202a48',
      borderRadius: 12,
      padding: '0.75rem 1rem',
      fontSize: 12,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
    }}>
      <b style={{ color: '#f8fafc' }}>{d.name}</b>
      <div style={{ color: d.value >= 0 ? '#34d399' : '#f87171', fontWeight: 800, marginTop: 4 }}>
        {d.value >= 0 ? '+' : ''}Rp {Math.abs(d.value).toLocaleString('id-ID')}
      </div>
    </div>
  )
}

export default function MarginWaterfall(props: Props) {
  const data = buildWaterfall(props)
  const netProfit = props.sellingPrice - props.hpp - props.ekspedisi - props.ads - props.sellingPrice * props.marketplaceFee
  const margin = (netProfit / (props.sellingPrice || 1) * 100).toFixed(1)

  return (
    <div style={{
      background: '#151b2e',
      border: '1px solid #202a48',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.2)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>Dekomposisi Margin</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>Revenue - Alokasi Biaya - Net Profit</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: netProfit >= 0 ? '#34d399' : '#f87171' }}>
            {margin}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Net Margin</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={290}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
          <CartesianGrid stroke="#1a223a" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#202a48' }} />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={v => `Rp ${(v/1000).toFixed(0)}k`}
            axisLine={{ stroke: '#202a48' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#202a48" />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
