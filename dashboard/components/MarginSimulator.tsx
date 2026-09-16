'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import MarginWaterfall from './MarginWaterfall'

type Props = {
  defaultSellingPrice?:   number
  defaultMarketplaceFee?: number
  categoryScope?:         string
  nicheScope?:            string
  initialTimeframe?:      '7d' | '30d' | '90d'
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

const DEFAULT_VOLUMES: Record<'7d' | '30d' | '90d', number> = {
  '7d': 850,
  '30d': 3500,
  '90d': 10500,
}

export default function MarginSimulator({
  defaultSellingPrice = 89000,
  defaultMarketplaceFee = 0.085,
  categoryScope,
  nicheScope,
  initialTimeframe = '7d',
}: Props) {
  const { t, lang } = useLanguage()
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>(initialTimeframe)
  const [sellingPrice, setSellingPrice] = useState(defaultSellingPrice)
  const [hpp, setHpp] = useState(Math.round(defaultSellingPrice * 0.35))
  const [ekspedisi, setEkspedisi] = useState(8000)
  const [ads, setAds] = useState(Math.round(defaultSellingPrice * 0.10))
  const [marketplaceFee] = useState(defaultMarketplaceFee)
  const [targetVolume, setTargetVolume] = useState<number>(DEFAULT_VOLUMES[initialTimeframe])

  useEffect(() => {
    if (initialTimeframe) {
      setTimeframe(initialTimeframe)
      setTargetVolume(DEFAULT_VOLUMES[initialTimeframe])
    }
  }, [initialTimeframe])

  useEffect(() => {
    setSellingPrice(defaultSellingPrice)
    setHpp(Math.round(defaultSellingPrice * 0.35))
    setAds(Math.round(defaultSellingPrice * 0.10))
  }, [defaultSellingPrice])

  const handleTimeframeChange = (tf: '7d' | '30d' | '90d') => {
    setTimeframe(tf)
    setTargetVolume(DEFAULT_VOLUMES[tf])
  }

  const handleReset = () => {
    setSellingPrice(defaultSellingPrice)
    setHpp(Math.round(defaultSellingPrice * 0.35))
    setEkspedisi(8000)
    setAds(Math.round(defaultSellingPrice * 0.10))
    setTimeframe(initialTimeframe || '7d')
    setTargetVolume(DEFAULT_VOLUMES[initialTimeframe || '7d'])
  }

  // Per-unit metrics
  const fee = sellingPrice * marketplaceFee
  const netProfit = sellingPrice - hpp - ekspedisi - ads - fee
  const margin = (netProfit / (sellingPrice || 1) * 100).toFixed(1)
  const targetMargin = 0.25
  const maxHpp = sellingPrice * (1 - targetMargin) - ekspedisi - ads - fee
  const isHealthy = netProfit / (sellingPrice || 1) >= targetMargin

  // Horizon-level volume & cash flow projections
  const totalGrossRevenue = Math.max(0, targetVolume * sellingPrice)
  const totalCogs = Math.max(0, targetVolume * hpp)
  const totalNetProfit = Math.round(targetVolume * netProfit)
  const totalOperatingCosts = Math.max(0, targetVolume * (hpp + ekspedisi + ads + fee))
  const roi = totalCogs > 0 ? (totalNetProfit / totalCogs) * 100 : 0

  const horizonLabel = timeframe === '7d'
    ? t('timeframe_7d_short')
    : timeframe === '90d'
    ? t('timeframe_90d_short')
    : t('timeframe_30d_short')

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
        {/* Header & Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
          marginBottom: '1.25rem',
        }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>
              {t('sim_param_title')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
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
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#245366' }} />
                  <span>
                    {t('sim_baseline_badge')} <b>{categoryScope}</b> (Rp {defaultSellingPrice.toLocaleString('id-ID')})
                  </span>
                </div>
              )}
              {nicheScope && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background: '#ede3d5',
                  border: '1px solid #dfd0bf',
                  borderRadius: 9999,
                  padding: '3px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#475569',
                }}>
                  <span>Niche: <b>{nicheScope}</b></span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Clean Segmented Timeframe Toggle Pills (NO emojis) */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: '#ede3d5',
              border: '1px solid #dfd0bf',
              borderRadius: 10,
              padding: '3px',
            }}>
              {(['7d', '30d', '90d'] as const).map(tf => {
                const active = timeframe === tf
                return (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => handleTimeframeChange(tf)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 7,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      background: active ? '#245366' : 'transparent',
                      color: active ? '#ffffff' : '#576574',
                      boxShadow: active ? '0 2px 4px rgba(36, 83, 102, 0.2)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tf === '7d' ? t('timeframe_7d_short') : tf === '30d' ? t('timeframe_30d_short') : t('timeframe_90d_short')}
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleReset}
              type="button"
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#576574',
                background: '#ffffff',
                border: '1px solid #dfd0bf',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {t('sim_reset')}
            </button>
          </div>
        </div>

        {/* 4 Inputs */}
        <div className="simulator-inputs-grid">
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

        {/* Max HPP Alert & Status (Per-unit) */}
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
              {isHealthy ? t('sim_healthy_margin') : t('sim_low_margin')} ({margin}%)
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

      {/* Waterfall Chart (Unit Economics) */}
      <MarginWaterfall
        sellingPrice={sellingPrice}
        hpp={hpp}
        ekspedisi={ekspedisi}
        ads={ads}
        marketplaceFee={marketplaceFee}
      />

      {/* Horizon Volume & Total Profit Projection Section */}
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
              {t('sim_projection_title')} ({horizonLabel})
            </div>
            <div style={{ fontSize: '0.78125rem', color: '#576574', marginTop: 2 }}>
              {lang === 'ID'
                ? `Simulasi skala perputaran modal dan akumulasi laba bersih untuk siklus penjualan ${horizonLabel}`
                : `Simulated working capital turnover and cumulative net profit for ${horizonLabel} sales horizon`}
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#ffffff',
            border: '1px solid #dfd0bf',
            borderRadius: 12,
            padding: '6px 14px',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#576574' }}>
              {t('sim_target_volume_label')}:
            </span>
            <input
              type="number"
              min={1}
              step={50}
              value={targetVolume}
              onChange={e => setTargetVolume(Math.max(1, Number(e.target.value) || 1))}
              style={{
                width: 80,
                padding: '3px 8px',
                border: '1px solid #dfd3c3',
                borderRadius: 6,
                fontWeight: 700,
                color: '#245366',
                fontSize: 13,
                textAlign: 'center',
                outline: 'none',
              }}
            />
            <span style={{ fontSize: '0.72rem', color: '#576574', fontWeight: 600 }}>
              {t('sim_volume_unit')}
            </span>
          </div>
        </div>

        {/* 4 KPI Cards for Horizon Projection */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {/* Card 1: Gross Revenue */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #dfd3c3',
            borderRadius: 16,
            padding: '1rem 1.15rem',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#576574', textTransform: 'uppercase' }}>
              {t('sim_proj_revenue')}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginTop: 6 }}>
              Rp {totalGrossRevenue.toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US')}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#576574', marginTop: 3 }}>
              {targetVolume.toLocaleString()} {t('sim_volume_unit')} × Rp {sellingPrice.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Card 2: Sourcing Capital (COGS) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #dfd3c3',
            borderRadius: 16,
            padding: '1rem 1.15rem',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#576574', textTransform: 'uppercase' }}>
              {t('sim_proj_cogs')}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c2533a', marginTop: 6 }}>
              Rp {totalCogs.toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US')}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#576574', marginTop: 3 }}>
              {targetVolume.toLocaleString()} {t('sim_volume_unit')} × Rp {hpp.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Card 3: Projected Net Profit */}
          <div style={{
            background: '#ffffff',
            border: `1px solid ${totalNetProfit >= 0 ? '#b8dfc4' : '#f5c5bd'}`,
            borderRadius: 16,
            padding: '1rem 1.15rem',
            backgroundClip: 'padding-box',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#576574', textTransform: 'uppercase' }}>
              {t('sim_proj_net_profit')}
            </div>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: totalNetProfit >= 0 ? '#226338' : '#b83223',
              marginTop: 6,
            }}>
              Rp {totalNetProfit.toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US')}
            </div>
            <div style={{ fontSize: '0.7rem', color: totalNetProfit >= 0 ? '#2e7d4d' : '#99261a', marginTop: 3 }}>
              {margin}% Net Margin ({horizonLabel})
            </div>
          </div>

          {/* Card 4: Estimated ROI on Sourcing */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #dfd3c3',
            borderRadius: 16,
            padding: '1rem 1.15rem',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#576574', textTransform: 'uppercase' }}>
              {t('sim_proj_roi')}
            </div>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: roi >= 50 ? '#226338' : roi >= 20 ? '#245366' : '#b83223',
              marginTop: 6,
            }}>
              {roi.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.7rem', color: '#576574', marginTop: 3 }}>
              {lang === 'ID' ? 'Laba bersih vs modal COGS' : 'Net profit vs inventory cost'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
