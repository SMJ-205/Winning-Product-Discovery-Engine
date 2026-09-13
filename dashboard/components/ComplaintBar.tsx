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
      background: '#1a1d2e', border: '1px solid #2a2d3e',
      borderRadius: 12, padding: '1.5rem',
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
        Top Keluhan Pelanggan (Rating 1–2)
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: '1rem' }}>
        {total.toLocaleString('id-ID')} ulasan negatif dianalisis
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          layout="vertical"
          data={top}
          margin={{ top: 0, right: 80, bottom: 0, left: 10 }}
        >
          <CartesianGrid stroke="#2a2d3e" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
          <YAxis
            type="category" dataKey="aspect" width={110}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ background: '#1e2235', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
            formatter={(v: any) => [`${v} ulasan (${((v / total) * 100).toFixed(1)}%)`, 'Frekuensi']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {top.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fill: '#94a3b8', fontSize: 12 }}
              formatter={(v: any) => `${v}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
