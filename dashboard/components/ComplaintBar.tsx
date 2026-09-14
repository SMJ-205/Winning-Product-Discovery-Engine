'use client'

import { useLanguage } from '@/context/LanguageContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'

type Complaint = { aspect: string; count: number }

const COLORS = ['#ff6b4a', '#f59e0b', '#8b5cf6', '#38bdf8', '#10b981', '#6366f1', '#ec4899']

const ASPECT_KEYS: Record<string, string> = {
  'Kualitas Bahan': 'aspect_material',
  'Kemasan Rusak': 'aspect_packaging',
  'Ukuran Terlalu Kecil': 'aspect_size',
  'Warna Tidak Sesuai': 'aspect_color',
  'Aroma/Rasa Kurang': 'aspect_flavor',
  'Pengiriman Lambat': 'aspect_shipping',
  'Fungsi Tidak Sesuai': 'aspect_function',
}

export default function ComplaintBar({ data }: { data: Complaint[] }) {
  const { t } = useLanguage()
  const top = data.slice(0, 7).map(d => ({
    ...d,
    displayAspect: ASPECT_KEYS[d.aspect] ? t(ASPECT_KEYS[d.aspect]) : d.aspect,
  }))
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <div style={{
      background: '#151b2e',
      border: '1px solid #202a48',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.2)',
    }}>
      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginBottom: 2 }}>
        {t('chart_complaint')}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
        {total.toLocaleString('id-ID')} {t('chart_complaint_sub')}
      </div>
      <ResponsiveContainer width="100%" height={290}>
        <BarChart
          layout="vertical"
          data={top}
          margin={{ top: 0, right: 80, bottom: 0, left: 10 }}
        >
          <CartesianGrid stroke="#1a223a" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#202a48' }} />
          <YAxis
            type="category"
            dataKey="displayAspect"
            width={120}
            tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 600 }}
            axisLine={{ stroke: '#202a48' }}
          />
          <Tooltip
            contentStyle={{
              background: '#151b2e',
              border: '1px solid #202a48',
              borderRadius: 12,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              fontSize: 12,
              color: '#f8fafc',
            }}
            formatter={(v: any) => [`${v} ${t('reviews_unit')} (${((v / (total || 1)) * 100).toFixed(1)}%)`, t('freq_label')]}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {top.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
              formatter={(v: any) => `${v}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
