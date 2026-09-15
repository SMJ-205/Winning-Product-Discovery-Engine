'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

import { CATEGORY_DEMOGRAPHICS } from '@/lib/analyticsProfiles'
import { getCategoryAnalytics, CategoryAnalytics } from '@/lib/data'

type Props = {
  category?: string
}

// ── Pemetaan nama kategori filter → nama di DB ───────────────────────────────
const CATEGORY_NAME_MAP: Record<string, string> = {
  all: 'all',
  'Elektronik & Gadget': 'Elektronik & Gadget',
  'Dapur & Makanan': 'Dapur & Makanan',
  'Peralatan Rumah': 'Peralatan Rumah',
  'Kecantikan & Skincare': 'Kecantikan & Skincare',
  'Otomotif & Aksesoris': 'Otomotif & Aksesoris',
  'Ibu & Bayi': 'Ibu & Bayi',
}

export default function CustomerInfoSection({ category = 'all' }: Props) {
  const { t, lang } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [liveAnalytics, setLiveAnalytics] = useState<CategoryAnalytics | null>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)

  // Static estimated profile (age/gender — not available in dataset)
  const profile = CATEGORY_DEMOGRAPHICS[category] || CATEGORY_DEMOGRAPHICS.all
  const { ageData, dominantAge, femalePct, malePct } = profile

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(timer)
  }, [])

  // ── Fetch live analytics from DB ─────────────────────────────────────────
  useEffect(() => {
    setLoadingAnalytics(true)
    const dbCat = category === 'all' ? null : (CATEGORY_NAME_MAP[category] ?? null)
    getCategoryAnalytics(dbCat)
      .then((rows) => {
        if (rows.length === 0) {
          setLiveAnalytics(null)
        } else if (category === 'all' || !dbCat) {
          // Aggregate across all categories
          const total = rows.reduce(
            (acc, r) => ({
              category_name: 'all',
              n_products: acc.n_products + r.n_products,
              n_keywords: acc.n_keywords + r.n_keywords,
              total_units_monthly: acc.total_units_monthly + r.total_units_monthly,
              median_price: acc.median_price + r.median_price / rows.length,
              mall_seller_ratio: acc.mall_seller_ratio + r.mall_seller_ratio / rows.length,
              avg_review_count: acc.avg_review_count + r.avg_review_count / rows.length,
              avg_rating: acc.avg_rating + r.avg_rating / rows.length,
              negative_review_rate:
                acc.negative_review_rate + r.negative_review_rate / rows.length,
              positive_review_rate:
                acc.positive_review_rate + r.positive_review_rate / rows.length,
              avg_sentiment_score:
                acc.avg_sentiment_score + r.avg_sentiment_score / rows.length,
              rfm_recency_score:
                acc.rfm_recency_score + r.rfm_recency_score / rows.length,
              rfm_frequency_score:
                acc.rfm_frequency_score + r.rfm_frequency_score / rows.length,
              rfm_monetary_score:
                acc.rfm_monetary_score + r.rfm_monetary_score / rows.length,
              rfm_monetary_display: r.rfm_monetary_display,
              est_retention_rate:
                acc.est_retention_rate + r.est_retention_rate / rows.length,
              top_cities: null,
            }),
            {
              category_name: 'all',
              n_products: 0, n_keywords: 0,
              total_units_monthly: 0, median_price: 0, mall_seller_ratio: 0,
              avg_review_count: 0, avg_rating: 0, negative_review_rate: 0,
              positive_review_rate: 0, avg_sentiment_score: 0,
              rfm_recency_score: 0, rfm_frequency_score: 0, rfm_monetary_score: 0,
              rfm_monetary_display: '', est_retention_rate: 0, top_cities: null,
            } as CategoryAnalytics
          )
          setLiveAnalytics(total)
        } else {
          setLiveAnalytics(rows[0])
        }
      })
      .catch(() => setLiveAnalytics(null))
      .finally(() => setLoadingAnalytics(false))
  }, [category])

  // ── Derived live values ──────────────────────────────────────────────────
  const rScore  = liveAnalytics ? Math.round(liveAnalytics.rfm_recency_score  * 10) / 10 : profile.rfm.recency.score
  const fScore  = liveAnalytics ? Math.round(liveAnalytics.rfm_frequency_score * 10) / 10 : profile.rfm.frequency.score
  const mScore  = liveAnalytics ? Math.round(liveAnalytics.rfm_monetary_score  * 10) / 10 : profile.rfm.monetary.score
  const retention = liveAnalytics ? Math.round(liveAnalytics.est_retention_rate) : profile.rfm.retentionRate
  const aov = liveAnalytics?.rfm_monetary_display ?? profile.rfm.monetary.value

  // Supply cities for region card
  const supplyCities: { city: string; count: number }[] =
    liveAnalytics?.top_cities ?? []

  // Convert cities to region display
  const totalCityCount = supplyCities.reduce((a, c) => a + c.count, 0) || 1
  const cityRegions = supplyCities.map((c, i) => ({
    name: c.city,
    pct: Math.round((c.count / totalCityCount) * 100),
    hub: `${c.count} produk kompetitor`,
    idx: i,
  }))

  // Sentiment-based rating distribution for compact display
  const positivePct  = liveAnalytics ? Math.round(liveAnalytics.positive_review_rate * 100) : 0
  const negativePct  = liveAnalytics ? Math.round(liveAnalytics.negative_review_rate * 100) : 0
  const neutralPct   = Math.max(0, 100 - positivePct - negativePct)
  const avgRating    = liveAnalytics ? liveAnalytics.avg_rating.toFixed(1) : '—'

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 22,
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.06)',
      height: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Title */}
      <div>
        <div style={{
          fontSize: '0.8125rem',
          fontWeight: 800,
          color: '#245366',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 4,
        }}>
          {t('sec_cust_info')}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
          {t('age_group')} & Demographics
        </div>
      </div>

      {/* 1. Age Group Donut Chart — STATIC ESTIMATED */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 16,
        padding: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
            {t('age_group')}
          </span>
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: '#ffffff',
            background: '#245366',
            padding: '2px 8px',
            borderRadius: 9999,
            whiteSpace: 'nowrap',
          }}>
            {lang === 'ID' ? `Dominan: ${dominantAge}` : `Dominant: ${dominantAge}`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 110, height: 110, position: 'relative', flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #245366',
                    borderRadius: 10,
                    fontSize: 12,
                    color: '#1e293b',
                    padding: '6px 10px',
                  }}
                  formatter={(v: any) => [`${v}%`, t('age_group')]}
                />
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={52}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Age Legend Clean Single-Column List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            flex: 1,
            minWidth: 0,
          }}>
            {ageData.map(d => (
              <div
                key={d.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: d.color,
                    flexShrink: 0,
                  }} />
                  <span style={{ color: '#576574', fontWeight: 600 }}>
                    {d.name.replace('-', '–')}
                  </span>
                </div>
                <b style={{ color: '#1e293b', fontWeight: 800, fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                  {d.value}%
                </b>
              </div>
            ))}
          </div>
        </div>
        {/* Estimated label */}
        <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '0.5rem', fontStyle: 'italic' }}>
          {lang === 'ID' ? 'Estimasi segmen berdasarkan profil kategori e-commerce Indonesia' : 'Estimated segment based on Indonesian e-commerce category profile'}
        </div>
      </div>

      {/* 2. Buyer Gender — STATIC ESTIMATED */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 16,
        padding: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
            {t('gender_label')}
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
            Audience Split
          </span>
        </div>

        {/* Dual Split Bar */}
        <div style={{
          display: 'flex',
          height: 12,
          borderRadius: 6,
          overflow: 'hidden',
          marginBottom: '0.625rem',
          background: '#e5dacb',
        }}>
          <div style={{
            width: mounted ? `${femalePct}%` : '0%',
            background: '#dfbfa8',
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
          <div style={{
            width: mounted ? `${malePct}%` : '0%',
            background: '#245366',
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '80ms',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dfbfa8' }} />
            <span style={{ fontSize: '0.75rem', color: '#576574', fontWeight: 600 }}>{t('female')}</span>
            <b style={{ fontSize: '0.875rem', color: '#9c6f50' }}>{femalePct}%</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#245366' }} />
            <span style={{ fontSize: '0.75rem', color: '#576574', fontWeight: 600 }}>{t('male')}</span>
            <b style={{ fontSize: '0.875rem', color: '#245366' }}>{malePct}%</b>
          </div>
        </div>
        <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '0.4rem', fontStyle: 'italic' }}>
          {lang === 'ID' ? 'Estimasi segmen berdasarkan profil kategori e-commerce Indonesia' : 'Estimated segment based on Indonesian e-commerce category profile'}
        </div>
      </div>

      {/* 3. Supply Origin (LIVE from DB) + Sentiment Rating */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 16,
        padding: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
            {lang === 'ID' ? 'Pusat Supply Kompetitor' : 'Competitor Supply Hub'}
          </span>
          <span style={{
            fontSize: '0.6875rem',
            color: loadingAnalytics ? '#94a3b8' : '#245366',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            {loadingAnalytics ? (
              <span style={{ animation: 'pulse 1.5s infinite' }}>—</span>
            ) : (
              <>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#22c55e', display: 'inline-block',
                }} />
                {lang === 'ID' ? 'Data Aktual DB' : 'Live DB Data'}
              </>
            )}
          </span>
        </div>

        {/* Supply city progress bars */}
        {loadingAnalytics ? (
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', textAlign: 'center', padding: '0.5rem' }}>
            Loading...
          </div>
        ) : cityRegions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {cityRegions.map((r, idx) => (
              <div key={r.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{r.name}</span>
                  <span style={{ fontWeight: 800, color: '#245366' }}>{r.pct}%</span>
                </div>
                <div style={{
                  width: '100%', height: 6, background: '#e5dacb',
                  borderRadius: 3, overflow: 'hidden',
                }}>
                  <div style={{
                    width: mounted ? `${r.pct}%` : '0%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #245366 0%, #5c9eaf 100%)',
                    borderRadius: 3,
                    transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${idx * 90}ms`,
                  }} />
                </div>
                <div style={{ fontSize: '0.625rem', color: '#64748b', marginTop: 2 }}>
                  {r.hub}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback to static regions if no live data */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {profile.regions.map((r, idx) => (
              <div key={r.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{r.name}</span>
                  <span style={{ fontWeight: 800, color: '#245366' }}>{r.pct}%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#e5dacb', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: mounted ? `${r.pct}%` : '0%', height: '100%',
                    background: 'linear-gradient(90deg, #245366 0%, #5c9eaf 100%)',
                    borderRadius: 3,
                    transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${idx * 90}ms`,
                  }} />
                </div>
                <div style={{ fontSize: '0.625rem', color: '#64748b', marginTop: 2 }}>{r.hub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Sentiment snapshot from live data */}
        {!loadingAnalytics && liveAnalytics && (
          <div style={{
            marginTop: '0.75rem',
            paddingTop: '0.65rem',
            borderTop: '1px dashed #dfd3c3',
            display: 'flex',
            gap: '0.5rem',
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '0.625rem', color: '#64748b', marginBottom: 2 }}>
                {lang === 'ID' ? 'Avg Rating' : 'Avg Rating'}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#245366' }}>{avgRating}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '0.625rem', color: '#64748b', marginBottom: 2 }}>
                {lang === 'ID' ? 'Positif' : 'Positive'}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#22c55e' }}>{positivePct}%</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '0.625rem', color: '#64748b', marginBottom: 2 }}>
                {lang === 'ID' ? 'Negatif' : 'Negative'}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444' }}>{negativePct}%</div>
            </div>
          </div>
        )}
      </div>

      {/* 4. RFM Proxy (LIVE from DB) */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 16,
        padding: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.75rem',
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
              {t('rfm_pattern_title')}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 1 }}>
              {t('rfm_pattern_sub')}
            </div>
          </div>
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: '#245366',
            background: 'rgba(36, 83, 102, 0.1)',
            padding: '2px 8px',
            borderRadius: 9999,
            border: '1px solid rgba(36, 83, 102, 0.2)',
            whiteSpace: 'nowrap',
          }}>
            {retention}% {t('rfm_retention_label')}
          </span>
        </div>

        {/* Archetype Highlight */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #dfd3c3',
          borderRadius: 10,
          padding: '0.5rem 0.75rem',
          marginBottom: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '0.625rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              {t('rfm_archetype_label')}
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#245366', marginTop: 1 }}>
              {lang === 'ID' ? profile.rfm.archetype.id : profile.rfm.archetype.en}
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: loadingAnalytics ? '#94a3b8' : '#22c55e',
          }}>
            {!loadingAnalytics && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            )}
            {loadingAnalytics ? t('rfm_benchmark_scale') : (lang === 'ID' ? 'Skor Aktual DB' : 'Live DB Score')}
          </div>
        </div>

        {/* RFM Metric Scorecards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {/* Recency (R) */}
          <div style={{
            background: '#ffffff', border: '1px solid #e5dacb', borderRadius: 10,
            padding: '0.55rem 0.75rem', display: 'flex', flexDirection: 'column',
            gap: 4, boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#ffffff', background: '#245366', borderRadius: 4, padding: '1px 5px', lineHeight: '1.2' }}>R</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>
                  {lang === 'ID' ? 'Recency (Jeda Beli)' : 'Recency (Interval)'}
                </span>
              </div>
              <b style={{ fontSize: '0.8125rem', color: '#1e293b', fontWeight: 800 }}>
                {liveAnalytics
                  ? `${Math.round(liveAnalytics.positive_review_rate * 100)}% pos.`
                  : profile.rfm.recency.value}
              </b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748b' }}>
              <span>{lang === 'ID' ? profile.rfm.recency.labelId : profile.rfm.recency.labelEn}</span>
              <span style={{ fontWeight: 700, color: '#245366' }}>{rScore}/5</span>
            </div>
            <div style={{ width: '100%', height: 4, background: '#f0e8dc', borderRadius: 2, overflow: 'hidden', marginTop: 1 }}>
              <div style={{ width: mounted ? `${(rScore / 5) * 100}%` : '0%', height: '100%', background: '#245366', borderRadius: 2, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }} />
            </div>
          </div>

          {/* Frequency (F) */}
          <div style={{
            background: '#ffffff', border: '1px solid #e5dacb', borderRadius: 10,
            padding: '0.55rem 0.75rem', display: 'flex', flexDirection: 'column',
            gap: 4, boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#ffffff', background: '#387388', borderRadius: 4, padding: '1px 5px', lineHeight: '1.2' }}>F</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>
                  {lang === 'ID' ? 'Frekuensi (Repeat)' : 'Repeat Frequency'}
                </span>
              </div>
              <b style={{ fontSize: '0.8125rem', color: '#1e293b', fontWeight: 800 }}>
                {liveAnalytics
                  ? `${(liveAnalytics.total_units_monthly / 1000).toFixed(1)}k unit/bln`
                  : profile.rfm.frequency.value}
              </b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748b' }}>
              <span>{lang === 'ID' ? profile.rfm.frequency.labelId : profile.rfm.frequency.labelEn}</span>
              <span style={{ fontWeight: 700, color: '#387388' }}>{fScore}/5</span>
            </div>
            <div style={{ width: '100%', height: 4, background: '#f0e8dc', borderRadius: 2, overflow: 'hidden', marginTop: 1 }}>
              <div style={{ width: mounted ? `${(fScore / 5) * 100}%` : '0%', height: '100%', background: '#387388', borderRadius: 2, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '60ms' }} />
            </div>
          </div>

          {/* Monetary (M) */}
          <div style={{
            background: '#ffffff', border: '1px solid #e5dacb', borderRadius: 10,
            padding: '0.55rem 0.75rem', display: 'flex', flexDirection: 'column',
            gap: 4, boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#ffffff', background: '#528fa3', borderRadius: 4, padding: '1px 5px', lineHeight: '1.2' }}>M</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>
                  {lang === 'ID' ? 'Moneter (AOV)' : 'Monetary Value'}
                </span>
              </div>
              <b style={{ fontSize: '0.8125rem', color: '#1e293b', fontWeight: 800 }}>
                {aov}
              </b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748b' }}>
              <span>{lang === 'ID' ? profile.rfm.monetary.labelId : profile.rfm.monetary.labelEn}</span>
              <span style={{ fontWeight: 700, color: '#528fa3' }}>{mScore}/5</span>
            </div>
            <div style={{ width: '100%', height: 4, background: '#f0e8dc', borderRadius: 2, overflow: 'hidden', marginTop: 1 }}>
              <div style={{ width: mounted ? `${(mScore / 5) * 100}%` : '0%', height: '100%', background: '#528fa3', borderRadius: 2, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '120ms' }} />
            </div>
          </div>
        </div>

        {/* Compact Insight Takeaway */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.65)',
          borderRadius: 8,
          padding: '0.45rem 0.65rem',
          borderLeft: '3px solid #245366',
          fontSize: '0.6875rem',
          color: '#334155',
          lineHeight: 1.45,
        }}>
          <strong style={{ color: '#245366', fontWeight: 700 }}>Insight: </strong>
          {lang === 'ID' ? profile.rfm.summaryId : profile.rfm.summaryEn}
        </div>
      </div>
    </div>
  )
}
