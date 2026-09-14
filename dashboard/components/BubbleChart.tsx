'use client'

import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { useLanguage } from '@/context/LanguageContext'

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

const PALETTE = ['#245366', '#5c9eaf', '#dfbfa8', '#d97d64', '#7cb8c8', '#b88972']

const CustomTooltip = ({ active, payload, lang = 'ID' }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as DataPoint
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #245366',
      borderRadius: 14,
      padding: '0.875rem 1.125rem',
      fontSize: 12,
      color: '#1e293b',
      boxShadow: '0 10px 25px -5px rgba(36, 83, 102, 0.15)',
      minWidth: 210,
    }}>
      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6, color: '#245366' }}>
        {d.sub_category}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: '#576574' }}>Trend Index:</span>
        <b>{d.search_trend_index?.toFixed(1)}</b>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: '#576574' }}>{lang === 'ID' ? 'Units / Bulan:' : 'Units / Month:'}</span>
        <b>{d.monthly_sold_units?.toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US')}</b>
      </div>
      {d.winning_product_score && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 6,
          paddingTop: 6,
          borderTop: '1px solid #e5dacb',
        }}>
          <span style={{ color: '#576574' }}>WPS Score:</span>
          <b style={{ color: '#245366', fontSize: 13 }}>{d.winning_product_score.toFixed(1)}</b>
        </div>
      )}
    </div>
  )
}

export default function BubbleChart({ data }: { data: DataPoint[] }) {
  const { lang, t } = useLanguage()

  const withAxes = data.map(d => ({
    ...d,
    x: d.monthly_sold_units || 500,
    y: d.search_trend_index || 20,
    z: Math.max((d.monthly_sold_units || 500) * (d.search_trend_index || 20) / 800, 300),
  }))

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.06)',
    }}>
      {/* Header with Title and Legends (Filter removed as represented in header scope filter) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>
            {t('chart_title')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#576574', marginTop: 2 }}>
            {t('chart_sub')}
          </div>
        </div>

        {/* Legend dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '0.75rem', color: '#576574' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#245366' }} />
            {t('high_demand')}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dfbfa8' }} />
            {t('balanced')}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340} style={{ outline: 'none' }}>
        <ScatterChart margin={{ top: 35, right: 25, bottom: 20, left: 0 }} style={{ outline: 'none' }}>
          <CartesianGrid stroke="#e5dacb" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="x"
            name={t('units_axis')}
            type="number"
            tick={{ fill: '#576574', fontSize: 11 }}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k units` : String(v)}
            axisLine={{ stroke: '#c5b4a0' }}
            tickLine={false}
          />
          <YAxis
            dataKey="y"
            name={t('trend_axis')}
            type="number"
            domain={[0, 120]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fill: '#576574', fontSize: 11 }}
            axisLine={{ stroke: '#c5b4a0' }}
            tickLine={false}
          />
          <ZAxis dataKey="z" range={[250, 1800]} />
          <Tooltip content={<CustomTooltip lang={lang} />} cursor={{ stroke: '#245366', strokeDasharray: '4 4' }} />
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
