'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

type Props = {
  topNiche?: {
    sub_category?: string
    winning_product_score?: number
    monthly_sold_units?: number
    median_price?: number
    category_name?: string
    search_trend_index?: number
    cost_category?: string
    negative_review_rate?: number
    sourcing_recommendation?: string
  }
  sourcingHref?: string
}

interface PlaybookIntelligence {
  velocityLabelID: string
  velocityLabelEN: string
  netMarginPct: number
  defectTitleID: string
  defectTitleEN: string
  defectSubID: string
  defectSubEN: string
  supplierTitleID: string
  supplierTitleEN: string
  supplierSubID: string
  supplierSubEN: string
  step1TitleID: string
  step1TitleEN: string
  step1DescID: string
  step1DescEN: string
  step2TitleID: string
  step2TitleEN: string
  step2DescID: string
  step2DescEN: string
}

const CATEGORY_PLAYBOOKS: Record<string, PlaybookIntelligence> = {
  'Ibu & Kebutuhan Bayi': {
    velocityLabelID: '+85% Lonjakan Eksponensial',
    velocityLabelEN: '+85% Exponential Surge',
    netMarginPct: 34,
    defectTitleID: 'Katup Dot Macet (33%)',
    defectTitleEN: 'Valve Clogging (33%)',
    defectSubID: 'Celah: Bayi kembung & susu tersendat',
    defectSubEN: 'Gap: Infant colic & flow interruption',
    supplierTitleID: 'Medical-Grade OEM Ready',
    supplierTitleEN: 'Medical-Grade OEM Ready',
    supplierSubID: 'Tangerang & Ningbo Fast Turn',
    supplierSubEN: 'Tangerang & Ningbo Fast Turn',
    step1TitleID: 'Katup Spiral Anti-Kolik 360°:',
    step1TitleEN: '360° Anti-Colic Spiral Vent:',
    step1DescID: 'Gunakan material PPSU tahan panas 180°C anti-pecah dan dot ultra-lembut menyerupai puting ibu.',
    step1DescEN: 'Use shatterproof PPSU withstanding 180°C heat and ultra-soft breast-like silicone nipples.',
    step2TitleID: 'Bundle Starter Kit 240ml + 160ml:',
    step2TitleEN: '240ml + 160ml Starter Kit Bundle:',
    step2DescID: 'Lengkapi sikat pembersih silikon di harga sweet spot Rp 129.000 untuk menaikkan margin keranjang.',
    step2DescEN: 'Include silicone cleaning brush at sweet spot price Rp 129,000 to maximize basket margins.',
  },
  'Dapur & Makanan': {
    velocityLabelID: '+52% Permintaan Tinggi',
    velocityLabelEN: '+52% High Demand Surge',
    netMarginPct: 35,
    defectTitleID: 'Kemasan Bocor (50%)',
    defectTitleEN: 'Packaging Leaks (50%)',
    defectSubID: 'Celah: Minyak rembes saat pengiriman',
    defectSubEN: 'Gap: Oil seepage during courier transit',
    supplierTitleID: 'Pabrik Maklon PIRT / BPOM',
    supplierTitleEN: 'Certified Food Maklon OEM',
    supplierSubID: 'Sidoarjo & Sukabumi Ready',
    supplierSubEN: 'Sidoarjo & Sukabumi Ready',
    step1TitleID: 'Standing Pouch Alufoil 120μ:',
    step1TitleEN: '120μ Alufoil Standing Pouch:',
    step1DescID: 'Terapkan double-seal heat lock kedap minyak dan oxygen absorber untuk menjaga aroma bumbu segar.',
    step1DescEN: 'Apply leak-proof double-seal heat lock with oxygen absorber to lock in rich authentic spices.',
    step2TitleID: 'Trio Pack Varian Nusantara:',
    step2TitleEN: 'Trio Flavor Bundle Pack:',
    step2DescID: 'Bundle 3 varian (Rendang, Rawon, Gulai) di sweet spot Rp 49.000 untuk meningkatkan checkout rate.',
    step2DescEN: 'Bundle 3 top variants (Rendang, Rawon, Gulai) at sweet spot Rp 49,000 to drive checkout conversion.',
  },
  'Elektronik & Gadget': {
    velocityLabelID: '► Volume Tinggi 354k/Bln',
    velocityLabelEN: '► High Volume 354k/Mo',
    netMarginPct: 38,
    defectTitleID: 'Kabel Putus Dalam (72%)',
    defectTitleEN: 'Internal Core Snapping (72%)',
    defectSubID: 'Celah: Sambungan leher kabel mudah robek',
    defectSubEN: 'Gap: Weak neck joint tears after bending',
    supplierTitleID: 'Shenzhen & Cikarang OEM',
    supplierTitleEN: 'Shenzhen & Cikarang OEM',
    supplierSubID: 'Direct Factory Fast Production',
    supplierSubEN: 'Direct Factory Fast Production',
    step1TitleID: 'Reinforced Strain Relief (SR):',
    step1TitleEN: 'Reinforced Strain Relief (SR):',
    step1DescID: 'Gunakan pelindung leher TPE fleksibel lulus uji 20.000x tekukan & tembaga murni 100W PD.',
    step1DescEN: 'Use flexible TPE reinforced neck tested for 20,000+ bends and 100W PD pure copper wiring.',
    step2TitleID: 'Paket Hemat Dual Length (1m + 2m):',
    step2TitleEN: 'Dual-Length Value Pack (1m + 2m):',
    step2DescID: 'Jual bundle isi 2 kabel di sweet spot Rp 39.000 untuk menaikkan margin laba per pesanan (AOV).',
    step2DescEN: 'Price 2-cable bundle at sweet spot Rp 39,000 to increase average order value (AOV) and margins.',
  },
  'Otomotif & Pengendara': {
    velocityLabelID: '+18% Pertumbuhan Stabil',
    velocityLabelEN: '+18% Steady Growth',
    netMarginPct: 36,
    defectTitleID: 'Baut Kendor & Getar (77%)',
    defectTitleEN: 'Loose Bolts & Shaking (77%)',
    defectSubID: 'Celah: HP bergetar hebat di jalan berlubang',
    defectSubEN: 'Gap: Extreme vibration on rough roads',
    supplierTitleID: 'OEM Plastik ABS & Logam',
    supplierTitleEN: 'ABS & Metal Hardware OEM',
    supplierSubID: 'Tangerang & Yiwu Fast Turn',
    supplierSubEN: 'Tangerang & Yiwu Fast Turn',
    step1TitleID: 'Silicone Vibration Dampener:',
    step1TitleEN: 'Silicone Vibration Dampener:',
    step1DescID: 'Pasang 4 bantalan peredam silikon dan sistem penguncian rotary lock anti-copot untuk ojek online.',
    step1DescEN: 'Add 4 silicone shock-absorbing pads with rotary locking mechanism built for motorcycle riders.',
    step2TitleID: 'Bonus Bracket Spion & Garansi 6 Bln:',
    step2TitleEN: 'Mirror Mount & 6-Mo Warranty:',
    step2DescID: 'Tawarkan paket lengkap siap pasang stang + spion di sweet spot Rp 59.000 untuk dominasi pasar.',
    step2DescEN: 'Offer complete handlebar + rearview mirror kit at sweet spot Rp 59,000 to dominate sales.',
  },
  'Perlengkapan Rumah & Dapur': {
    velocityLabelID: '► +12% Niche Konsisten',
    velocityLabelEN: '► +12% Consistent Niche',
    netMarginPct: 40,
    defectTitleID: 'Kayu Berserat & Jamur (60%)',
    defectTitleEN: 'Splintering & Mold (60%)',
    defectSubID: 'Celah: Finishing kasar & bau pernis kimia',
    defectSubEN: 'Gap: Rough splinters & chemical varnish smell',
    supplierTitleID: 'Pengrajin Jepara & Sukabumi',
    supplierTitleEN: 'Jepara Certified Woodcraft',
    supplierSubID: 'Kayu Jati Legal Wood Certified',
    supplierSubEN: 'Sustainable Teakwood Certified',
    step1TitleID: 'Finishing Food-Grade Beeswax:',
    step1TitleEN: 'Food-Grade Beeswax Finish:',
    step1DescID: 'Ampelas halus 1000-grit tanpa cat kimia, aman untuk wajan teflon dan anti-jamur alami.',
    step1DescEN: '1000-grit ultra-smooth finish without chemical coats, safe for non-stick cookware with anti-mold protection.',
    step2TitleID: 'Set 5-in-1 Eco Kraft Gift Box:',
    step2TitleEN: '5-in-1 Eco Kraft Gift Box:',
    step2DescID: 'Kemas set spatula & centong dalam box kraft premium di sweet spot Rp 89.000 untuk kado & hampers.',
    step2DescEN: 'Package complete spatulas in premium kraft gift box at sweet spot Rp 89,000 for gifts & hampers.',
  },
  'Kecantikan & Skincare': {
    velocityLabelID: '► Volume 206k (Kompetisi Ketat)',
    velocityLabelEN: '► Volume 206k (High Ad CAC)',
    netMarginPct: 48,
    defectTitleID: 'Tekstur Lengket / Breakout (33%)',
    defectTitleEN: 'Sticky / Breakout Prone (33%)',
    defectSubID: 'Celah: Serum terlalu kental & menyumbat pori',
    defectSubEN: 'Gap: Heavy texture causing clogged pores',
    supplierTitleID: 'Pabrik Maklon BPOM & Halal',
    supplierTitleEN: 'GMP & Halal Certified Maklon',
    supplierSubID: 'Tangerang & Bogor Batch Ready',
    supplierSubEN: 'Tangerang & Bogor Batch Ready',
    step1TitleID: 'Formula Watery Non-Comedogenic:',
    step1TitleEN: 'Watery Non-Comedogenic Formula:',
    step1DescID: 'Tekstur cair cepat meresap dengan Niacinamide 10% + Centella Asiatica uji dermatologis & BPOM.',
    step1DescEN: 'Fast-absorbing watery texture with dermatologically tested 10% Niacinamide + Centella Asiatica.',
    step2TitleID: 'Botol Airless Pump 30ml Anti-Oksidasi:',
    step2TitleEN: '30ml Airless Anti-Oxidation Pump:',
    step2DescID: 'Cegah serum berubah warna dengan kemasan higienis di sweet spot harga penetrasi Rp 89.000.',
    step2DescEN: 'Prevent formula oxidation with hygienic airless bottle at sweet spot penetration price Rp 89,000.',
  },
}

// Mapping parameter biaya & target margin selaras dengan config/cost_params.yaml
const COST_PARAMS_MAP: Record<string, { cogsRatio: number; netMarginPct: number }> = {
  ibu_dan_bayi: { cogsRatio: 0.32, netMarginPct: 34 },
  dapur_dan_makan: { cogsRatio: 0.35, netMarginPct: 35 },
  elektronik_aksesoris: { cogsRatio: 0.40, netMarginPct: 38 },
  otomotif_aksesoris: { cogsRatio: 0.38, netMarginPct: 36 },
  peralatan_rumah: { cogsRatio: 0.36, netMarginPct: 35 },
  kecantikan_skincare: { cogsRatio: 0.28, netMarginPct: 45 },
  default: { cogsRatio: 0.35, netMarginPct: 35 },
}

export default function QuickInsightsCard({ topNiche, sourcingHref = '/sourcing' }: Props) {
  const { t, lang } = useLanguage()

  const productName = topNiche?.sub_category || 'Botol Susu Anti Kolik BPA Free'
  const wpsScore = topNiche?.winning_product_score ? topNiche.winning_product_score.toFixed(1) : '93.4'
  const categoryName = topNiche?.category_name || (lang === 'ID' ? 'Ibu & Kebutuhan Bayi' : 'Mom & Baby')
  const medianPrice = topNiche?.median_price || 68000
  
  // Dynamic Cost & HPP calculation aligning with weekly database snapshots & cost_params.yaml
  const costCategory = topNiche?.cost_category || 'default'
  const costParams = COST_PARAMS_MAP[costCategory] || COST_PARAMS_MAP.default
  const targetHpp = Math.round(medianPrice * costParams.cogsRatio)
  
  // Format weekly sales volume directly from database aggregation
  const monthlyUnits = topNiche?.monthly_sold_units
    ? `${topNiche.monthly_sold_units.toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US')} units/mo`
    : '95.600 units/mo'

  // Dynamic Bundle Sweet Spot Price derived from live weekly median price
  const bundleSweetSpot = Math.round((medianPrice * 1.8) / 1000) * 1000

  // Live Weekly Trend Index & Negative Review Rate from Supabase / Python Pipeline
  const liveTrendIndex = topNiche?.search_trend_index ? Math.round(topNiche.search_trend_index) : null
  const liveDefectPct = topNiche?.negative_review_rate ? Math.round(topNiche.negative_review_rate * 100) : null

  // Dynamic Universal Fallback for any newly added weekly categories
  const universalFallback: PlaybookIntelligence = {
    velocityLabelID: liveTrendIndex ? `+${liveTrendIndex}% Lonjakan Tren` : '+48% Momentum Pasar',
    velocityLabelEN: liveTrendIndex ? `+${liveTrendIndex}% Trend Surge` : '+48% Market Momentum',
    netMarginPct: costParams.netMarginPct,
    defectTitleID: `Tingkat Komplain (${liveDefectPct || 32}%)`,
    defectTitleEN: `Complaint Rate (${liveDefectPct || 32}%)`,
    defectSubID: 'Celah: Perlu upgrade durabilitas material & kemasan',
    defectSubEN: 'Gap: Material durability & packaging upgrade needed',
    supplierTitleID: 'Sentra OEM & Manufaktur Terverifikasi',
    supplierTitleEN: 'Verified OEM & Domestic Hub',
    supplierSubID: 'Kapasitas Batch Produksi Cepat',
    supplierSubEN: 'Fast Turnaround Production Ready',
    step1TitleID: 'Peningkatan Spesifikasi Material:',
    step1TitleEN: 'Material Specification Upgrade:',
    step1DescID: `Gunakan komponen grade premium tersertifikasi untuk menciptakan diferensiasi kuat dari kompetitor pasar ${productName}.`,
    step1DescEN: `Adopt certified premium grade components to establish high durability and sharp market advantage for ${productName}.`,
    step2TitleID: 'Taktik Bundling Sweet Spot:',
    step2TitleEN: 'Sweet Spot Bundle Strategy:',
    step2DescID: `Tawarkan paket bundling komplementer di kisaran sweet spot Rp ${bundleSweetSpot.toLocaleString('id-ID')} untuk memaksimalkan margin keranjang belanja.`,
    step2DescEN: `Offer high-perceived-value complementary bundles at sweet spot Rp ${bundleSweetSpot.toLocaleString('en-US')} to maximize Average Order Value.`,
  }

  // Dynamic Playbook Selection: Use category-specific playbook or universal dynamic fallback
  const playbook = (topNiche?.category_name && CATEGORY_PLAYBOOKS[topNiche.category_name])
    ? CATEGORY_PLAYBOOKS[topNiche.category_name]
    : universalFallback

  // Prioritize live weekly search trend index if available
  const velocityLabel = liveTrendIndex && liveTrendIndex > 0
    ? (lang === 'ID' ? `+${liveTrendIndex}% Lonjakan Tren` : `+${liveTrendIndex}% Trend Surge`)
    : (lang === 'ID' ? playbook.velocityLabelID : playbook.velocityLabelEN)

  // Live Defect Title & Net Margin
  const netMarginPct = playbook.netMarginPct || costParams.netMarginPct
  const defectTitle = lang === 'ID' ? playbook.defectTitleID : playbook.defectTitleEN
  const defectSub = lang === 'ID' ? playbook.defectSubID : playbook.defectSubEN
  const supplierTitle = lang === 'ID' ? playbook.supplierTitleID : playbook.supplierTitleEN
  const supplierSub = lang === 'ID' ? playbook.supplierSubID : playbook.supplierSubEN
  const step1Title = lang === 'ID' ? playbook.step1TitleID : playbook.step1TitleEN
  const step1Desc = lang === 'ID' ? playbook.step1DescID : playbook.step1DescEN
  const step2Title = lang === 'ID' ? playbook.step2TitleID : playbook.step2TitleEN
  const step2Desc = lang === 'ID' ? playbook.step2DescID : playbook.step2DescEN

  return (
    <div style={{
      background: '#fcf8f3',
      border: '1px solid #dfd3c3',
      borderRadius: 22,
      padding: '1.4rem 1.4rem 1.25rem 1.4rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.1rem',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: '0 4px 16px -2px rgba(36, 83, 102, 0.06)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1e293b' }}>
            {t('playbook_title')}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#576574', marginTop: 1 }}>
            {t('playbook_sub')}
          </div>
        </div>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#245366',
          background: 'rgba(36, 83, 102, 0.1)',
          padding: '3px 9px',
          borderRadius: 9999,
          border: '1px solid rgba(36, 83, 102, 0.25)',
        }}>
          {wpsScore} WPS
        </span>
      </div>

      {/* Featured Winning Product Banner */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 14,
        padding: '0.85rem 1rem',
      }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#245366', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Top Opportunity Target
        </div>
        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1e293b', marginTop: 3 }}>
          {productName}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.72rem', color: '#576574', fontWeight: 600 }}>
          <span>{categoryName}</span>
          <span>•</span>
          <span style={{ color: '#245366', fontWeight: 700 }}>{monthlyUnits}</span>
        </div>
      </div>

      {/* 4 Pillars of Winning Product Discovery (2x2 Grid) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '0.625rem',
      }}>
        {/* Pillar 1: Demand Velocity */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 12,
          padding: '0.65rem 0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#245366' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#576574' }}>
              {t('pillar_demand')}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#245366', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {velocityLabel}
          </div>
          <div style={{ fontSize: '0.625rem', color: '#576574', marginTop: 1 }}>
            {monthlyUnits}
          </div>
        </div>

        {/* Pillar 2: Target COGS & Margin */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 12,
          padding: '0.65rem 0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b748a' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#576574' }}>
              {t('pillar_margin')}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#1e293b' }}>
            Rp {targetHpp.toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US')}
          </div>
          <div style={{ fontSize: '0.625rem', color: '#226338', fontWeight: 700, marginTop: 1 }}>
            Net Margin ~{netMarginPct}%
          </div>
        </div>

        {/* Pillar 3: Competitor Pain Point Gap */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 12,
          padding: '0.65rem 0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c2533a' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#576574' }}>
              {t('pillar_flaw')}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#c2533a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {defectTitle}
          </div>
          <div style={{ fontSize: '0.625rem', color: '#576574', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {defectSub}
          </div>
        </div>

        {/* Pillar 4: Supplier Readiness */}
        <div style={{
          background: '#f5ede2',
          border: '1px solid #e2d5c5',
          borderRadius: 12,
          padding: '0.65rem 0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9c6f50' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#576574' }}>
              {t('pillar_oem')}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {supplierTitle}
          </div>
          <div style={{ fontSize: '0.625rem', color: '#576574', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {supplierSub}
          </div>
        </div>
      </div>

      {/* Actionable Strategy Playbook */}
      <div style={{
        background: '#f5ede2',
        border: '1px solid #e2d5c5',
        borderRadius: 14,
        padding: '0.75rem 0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {t('playbook_strategy_header')}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#245366',
            color: '#ffffff',
            fontSize: '0.625rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
          }}>
            1
          </span>
          <div style={{ fontSize: '0.6875rem', color: '#1e293b', lineHeight: 1.35 }}>
            <b style={{ color: '#245366' }}>{step1Title}</b> {step1Desc}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#245366',
            color: '#ffffff',
            fontSize: '0.625rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
          }}>
            2
          </span>
          <div style={{ fontSize: '0.6875rem', color: '#1e293b', lineHeight: 1.35 }}>
            <b style={{ color: '#245366' }}>{step2Title}</b> {step2Desc}
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      <Link
        href={sourcingHref}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '0.6rem 1rem',
          background: '#245366',
          color: '#ffffff',
          borderRadius: 12,
          fontSize: '0.75rem',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(36, 83, 102, 0.2)',
          transition: 'all 0.15s ease',
        }}
      >
        <span>{t('btn_sourcing_action')}</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  )
}
