'use client'

import { useLanguage } from '@/context/LanguageContext'
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

function buildWaterfall({ sellingPrice, hpp, ekspedisi, ads, marketplaceFee }: Props, t: (k: string) => string) {
  const fee = sellingPrice * marketplaceFee
  const netProfit = sellingPrice - hpp - ekspedisi - ads - fee

  return [
    { name: t('wf_selling_price'), value: sellingPrice, base: 0,                                    fill: '#245366' },
    { name: t('wf_hpp'),           value: -hpp,         base: sellingPrice,                         fill: '#c2533a' },
    { name: t('wf_commission'),    value: -fee,         base: sellingPrice - hpp,                   fill: '#d97736' },
    { name: t('wf_shipping'),      value: -ekspedisi,   base: sellingPrice - hpp - fee,             fill: '#d99b6c' },
    { name: t('wf_ads'),           value: -ads,         base: sellingPrice - hpp - fee - ekspedisi, fill: '#dfbfa8' },
    { name: t('wf_profit'),        value: netProfit,    base: 0,                                    fill: netProfit >= 0 ? '#226338' : '#c2533a' },
  ]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #245366',
      borderRadius: 12,
      padding: '0.75rem 1rem',
      fontSize: 12,
      boxShadow: '0 10px 25px -5px rgba(36, 83, 102, 0.15)',
    }}>
      <b style={{ color: '#1e293b' }}>{d.name}</b>
      <div style={{ color: d.value >= 0 ? '#226338' : '#c2533a', fontWeight: 800, marginTop: 4 }}>
        {d.value >= 0 ? '+' : ''}Rp {Math.abs(d.value).toLocaleString('id-ID')}
      </div>
    </div>
  )
}

export default function MarginWaterfall(props: Props) {
  const { t } = useLanguage()
  const data = buildWaterfall(props, t)
  const netProfit = props.sellingPrice - props.hpp - props.ekspedisi - props.ads - props.sellingPrice * props.marketplaceFee
  const margin = (netProfit / (props.sellingPrice || 1) * 100).toFixed(1)

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(36, 83, 102, 0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>{t('sim_waterfall_title')}</div>
          <div style={{ fontSize: '0.75rem', color: '#576574', marginTop: 2 }}>{t('sim_waterfall_sub')}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: netProfit >= 0 ? '#226338' : '#c2533a' }}>
            {margin}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#576574', fontWeight: 600 }}>{t('sim_net_margin')}</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={290}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: -12 }}>
          <CartesianGrid stroke="#e5dacb" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#576574', fontSize: 10.5 }} axisLine={{ stroke: '#dfd3c3' }} />
          <YAxis
            tick={{ fill: '#576574', fontSize: 11 }}
            tickFormatter={v => `Rp ${(v/1000).toFixed(0)}k`}
            axisLine={{ stroke: '#dfd3c3' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#dfd3c3" />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
