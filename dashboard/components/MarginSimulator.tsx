'use client'

import { useState } from 'react'
import MarginWaterfall from './MarginWaterfall'

type Props = {
  defaultSellingPrice?:   number
  defaultMarketplaceFee?: number
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.875rem',
  background: '#11172a',
  border: '1px solid #202a48',
  borderRadius: 10,
  color: '#f8fafc',
  fontSize: 14,
  fontWeight: 600,
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
  display: 'block',
}

export default function MarginSimulator({
  defaultSellingPrice = 89000,
  defaultMarketplaceFee = 0.085,
}: Props) {
  const [sellingPrice, setSellingPrice] = useState(defaultSellingPrice)
  const [hpp, setHpp] = useState(Math.round(defaultSellingPrice * 0.35))
  const [ekspedisi, setEkspedisi] = useState(8000)
  const [ads, setAds] = useState(Math.round(defaultSellingPrice * 0.10))
  const [marketplaceFee] = useState(defaultMarketplaceFee)

  const fee = sellingPrice * marketplaceFee
  const netProfit = sellingPrice - hpp - ekspedisi - ads - fee
  const margin = (netProfit / (sellingPrice || 1) * 100).toFixed(1)
  const targetMargin = 0.25
  const maxHpp = sellingPrice * (1 - targetMargin) - ekspedisi - ads - fee
  const isHealthy = netProfit / (sellingPrice || 1) >= targetMargin

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Input Panel */}
      <div style={{
        background: '#151b2e',
        border: '1px solid #202a48',
        borderRadius: 22,
        padding: '1.5rem',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.2)',
      }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem' }}>
          Parameter Simulasi Sourcing
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
                onChange={e => set(Number(e.target.value) || 0)}
                style={INPUT_STYLE}
              />
            </div>
          ))}
        </div>

        {/* Max HPP Alert & Status without emojis */}
        <div style={{
          marginTop: '1.25rem',
          padding: '1rem 1.25rem',
          borderRadius: 14,
          background: isHealthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${isHealthy ? 'rgba(52, 211, 153, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: isHealthy ? '#34d399' : '#f87171' }}>
              {isHealthy ? 'Margin Sehat (Target >= 25% Terpenuhi)' : 'Margin di Bawah Target (< 25%)'}
            </div>
            <div style={{ fontSize: '0.8125rem', color: isHealthy ? '#a7f3d0' : '#fca5a5', marginTop: 2 }}>
              Target batas maksimal HPP supplier: <b>Rp {Math.max(0, Math.round(maxHpp)).toLocaleString('id-ID')}</b>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Estimasi Profit:</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isHealthy ? '#34d399' : '#f87171' }}>
              Rp {Math.round(netProfit).toLocaleString('id-ID')} / unit
            </div>
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
