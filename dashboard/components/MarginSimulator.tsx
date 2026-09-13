'use client'

import { useState } from 'react'
import MarginWaterfall from './MarginWaterfall'

type Props = {
  defaultSellingPrice?:  number
  defaultMarketplaceFee?: number
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '0.625rem 0.875rem',
  background: '#141726', border: '1px solid #2a2d3e',
  borderRadius: 8, color: '#e2e8f0', fontSize: 13,
  outline: 'none', transition: 'border-color 0.15s',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#64748b',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, display: 'block',
}

export default function MarginSimulator({
  defaultSellingPrice  = 89000,
  defaultMarketplaceFee = 0.085,
}: Props) {
  const [sellingPrice,  setSellingPrice]  = useState(defaultSellingPrice)
  const [hpp,           setHpp]           = useState(Math.round(defaultSellingPrice * 0.35))
  const [ekspedisi,     setEkspedisi]     = useState(8000)
  const [ads,           setAds]           = useState(Math.round(defaultSellingPrice * 0.10))
  const [marketplaceFee]                  = useState(defaultMarketplaceFee)

  const fee       = sellingPrice * marketplaceFee
  const netProfit = sellingPrice - hpp - ekspedisi - ads - fee
  const margin    = (netProfit / sellingPrice * 100).toFixed(1)
  const targetMargin = 0.25
  const maxHpp    = sellingPrice * (1 - targetMargin) - ekspedisi - ads - fee
  const isHealthy = netProfit / sellingPrice >= targetMargin

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Input Panel */}
      <div style={{
        background: '#1a1d2e', border: '1px solid #2a2d3e',
        borderRadius: 12, padding: '1.5rem',
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: '1.25rem' }}>
          🧮 Input Parameter
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { label: 'Harga Jual (Rp)', value: sellingPrice, set: setSellingPrice },
            { label: 'HPP Supplier (Rp)', value: hpp, set: setHpp },
            { label: 'Biaya Ekspedisi (Rp)', value: ekspedisi, set: setEkspedisi },
            { label: 'Budget Ads (Rp)', value: ads, set: setAds },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label style={LABEL_STYLE}>{label}</label>
              <input
                type="number"
                value={value}
                onChange={e => set(Number(e.target.value))}
                style={INPUT_STYLE}
                min={0}
              />
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '1.25rem', padding: '0.875rem 1rem',
          background: isHealthy ? '#052e16' : '#450a0a',
          border: `1px solid ${isHealthy ? '#166534' : '#991b1b'}`,
          borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 12, color: isHealthy ? '#4ade80' : '#fca5a5' }}>
              {isHealthy ? '✅ Margin sehat' : '⚠️ Margin di bawah target 25%'}
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
              Maks HPP untuk margin ≥25%: <b style={{ color: '#94a3b8' }}>Rp {Math.max(0, maxHpp).toLocaleString('id-ID')}</b>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: isHealthy ? '#10b981' : '#ef4444' }}>
              {margin}%
            </div>
            <div style={{ fontSize: 11, color: '#475569' }}>Net Margin</div>
          </div>
        </div>
      </div>

      {/* Waterfall Chart */}
      <MarginWaterfall
        sellingPrice={sellingPrice}
        hpp={hpp}
        ekspedisi={ekspedisi}
        ads={ads}
        marketplaceFee={marketplaceFee}
      />
    </div>
  )
}
