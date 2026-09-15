'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import MarginWaterfall from './MarginWaterfall'

type Props = {
  defaultSellingPrice?:   number
  defaultMarketplaceFee?: number
  categoryScope?:         string
  nicheScope?:            string
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.875rem',
  background: '#ffffff',
  border: '1px solid #dfd3c3',
  borderRadius: 10,
  color: '#1e293b',
  fontSize: 14,
  fontWeight: 600,
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#576574',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
  display: 'block',
}

export default function MarginSimulator({
  defaultSellingPrice = 89000,
  defaultMarketplaceFee = 0.085,
  categoryScope,
  nicheScope,
}: Props) {
  const { t } = useLanguage()
  const [sellingPrice, setSellingPrice] = useState(defaultSellingPrice)
  const [hpp, setHpp] = useState(Math.round(defaultSellingPrice * 0.35))
  const [ekspedisi, setEkspedisi] = useState(8000)
  const [ads, setAds] = useState(Math.round(defaultSellingPrice * 0.10))
  const [marketplaceFee] = useState(defaultMarketplaceFee)

  useEffect(() => {
    setSellingPrice(defaultSellingPrice)
    setHpp(Math.round(defaultSellingPrice * 0.35))
    setAds(Math.round(defaultSellingPrice * 0.10))
  }, [defaultSellingPrice])

  const handleReset = () => {
    setSellingPrice(defaultSellingPrice)
    setHpp(Math.round(defaultSellingPrice * 0.35))
    setEkspedisi(8000)
    setAds(Math.round(defaultSellingPrice * 0.10))
  }

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
        background: '#fcf8f3',
        border: '1px solid #dfd3c3',
        borderRadius: 22,
        padding: '1.5rem',
        boxShadow: '0 4px 20px -2px rgba(36, 83, 102, 0.05)',
      }}>
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
              {t('sim_param_title')}
            </div>
            {categoryScope && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(36, 83, 102, 0.08)',
                border: '1px solid rgba(36, 83, 102, 0.22)',
                borderRadius: 9999,
                padding: '3px 10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#245366',
                marginTop: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#245366' }} />
                <span>
                  {t('sim_baseline_badge')} <b>{categoryScope}</b> (Median Rp {defaultSellingPrice.toLocaleString('id-ID')})
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleReset}
            type="button"
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#576574',
              background: '#ede3d5',
              border: '1px solid #dfd0bf',
              borderRadius: 8,
              padding: '5px 12px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {t('sim_reset')}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { label: t('sim_selling_price_input'), value: sellingPrice, set: setSellingPrice },
            { label: t('sim_hpp_supplier'), value: hpp, set: setHpp },
            { label: t('sim_shipping_fee'), value: ekspedisi, set: setEkspedisi },
            { label: t('sim_ads_budget_input'), value: ads, set: setAds },
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
          background: isHealthy ? '#eef7f0' : '#fcf0ed',
          border: `1px solid ${isHealthy ? '#b8dfc4' : '#f5c5bd'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: isHealthy ? '#226338' : '#b83223' }}>
              {isHealthy ? t('sim_healthy_margin') : t('sim_low_margin')}
            </div>
            <div style={{ fontSize: '0.8125rem', color: isHealthy ? '#2e7d4d' : '#99261a', marginTop: 2 }}>
              {t('sim_max_hpp_target')} <b>Rp {Math.max(0, Math.round(maxHpp)).toLocaleString('id-ID')}</b>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#576574' }}>{t('sim_est_profit_label')}</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isHealthy ? '#226338' : '#b83223' }}>
              Rp {Math.round(netProfit).toLocaleString('id-ID')} {t('sim_unit_suffix')}
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
