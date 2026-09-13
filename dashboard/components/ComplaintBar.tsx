'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'

type Complaint = { aspect: string; count: number }

const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#6366f1', '#ec4899']

export default function ComplaintBar({ data }: { data: Complaint[] }) {
  const top = data.slice(0, 7)
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 22,
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -2px rgba(15, 23, 42, 0.02)',
    }}>
      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>
        Top Keluhan Pelanggan (Rating 1–2)
      </div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem' }}>
        {total.toLocaleString('id-ID')} ulasan negatif dianalisis untuk menemukan celah perbaikan produk
      </div>
      <ResponsiveContainer width="100%" height={290}>
        <BarChart
          layout="vertical"
          data={top}
          margin={{ top: 0, right: 80, bottom: 0, left: 10 }}
        >
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
          <YAxis
            type="category"
            dataKey="aspect"
            width={120}
            tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
              fontSize: 12,
              color: '#0f172a',
            }}
            formatter={(v: any) => [`${v} ulasan (${((v / (total || 1)) * 100).toFixed(1)}%)`, 'Frekuensi']}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {top.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
              formatter={(v: any) => `${v}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
