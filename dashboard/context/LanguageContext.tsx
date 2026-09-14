'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'ID' | 'EN'

type Translations = Record<string, string>

const DICTIONARY: Record<Language, Translations> = {
  ID: {
    // Brand & Navigation
    brand_sub: 'PRODUCT DISCOVERY',
    menu: 'MENU',
    tab_overall: 'Overall Summary',
    tab_overall_sub: 'Lanskap Pasar',
    tab_analytics: 'Analytics',
    tab_analytics_sub: 'Harga & Pain Points',
    tab_pricing_sim: 'Pricing Simulator',
    tab_pricing_sim_sub: 'Kelayakan Sourcing',

    // Header
    weekly_cycle: 'Siklus Mingguan:',
    sub_overall: 'Analitik mendalam untuk product discovery dan validasi kelayakan sourcing',
    sub_analytics: 'Analisis sweet spot harga jual dan titik kelemahan produk kompetitor',
    sub_pricing_sim: 'Validasi batas maksimal HPP supplier sebelum melakukan pemesanan stok',

    // Scope Filter & KPI Cards
    filter_label: 'Filter Scope Metrik:',
    opt_all: 'Semua Kategori (Overall - 6 Niche)',
    opt_winning: 'Winning Niche Saja (WPS ≥ 70)',
    scope_overall_badge: 'Overall (6 Kategori)',
    scope_winning_badge: 'Winning Niche Saja (WPS ≥ 70)',
    kpi_gmv: 'Est. GMV Bulanan',
    kpi_price: 'Rata-rata Harga Pasar',
    kpi_ready: 'Peluang Siap Sourcing',
    kpi_ready_sub: 'WPS ≥ 70',
    badge_overall: 'Overall',
    badge_filtered: 'Terfilter',
    badge_6cat: '6 Kategori',
    niche_unit: 'Niche',
    trend_trajectory_gmv: 'Tren 8-Mgg: ▲ Akselerasi',
    trend_trajectory_price: 'Rentang Stabil & Kompetitif',
    trend_trajectory_sourcing: 'Pipeline Prioritas Tinggi',
    trend_velocity_label: 'Velocity',

    // Market Opportunity Analytics (Bubble Chart)
    chart_title: 'Market Opportunity Analytics',
    chart_sub: 'Ukuran bubble merefleksikan estimasi GMV pasar',
    high_demand: 'Demand Tinggi',
    balanced: 'Seimbang',
    opt_all_categories: 'Semua Kategori',
    units_axis: 'Units/bln',
    trend_axis: 'Trend Index',
    units_per_month: 'Units / Bulan:',
    wps_score: 'WPS Score:',

    // Top Opportunities Table
    table_title: 'Top Product Opportunities',
    table_sub: 'Peringkat niche berdasarkan validasi algoritma Winning Product Score (WPS)',
    niche_analyzed: 'Niche Dianalisis',
    col_product: 'Niche / Produk',
    col_category: 'Kategori',
    col_units: 'Units/Bln',
    col_price: 'Median Harga',
    col_wps: 'WPS Score',
    col_status: 'Status Kelayakan',
    col_action: 'Aksi',
    action_simulate: 'Simulasi Pricing',
    action_sim_short: 'Simulasi',
    badge_high: 'High Priority',
    badge_monitor: 'Monitor',
    badge_reject: 'Reject',
    listings_analyzed: 'listings dianalisis',
    no_data: 'Belum ada data scoring. Pastikan pipeline Python telah dijalankan.',

    // Gauge Card
    gauge_title: 'Opportunity Score',
    gauge_outof: 'dari 1000',
    top_niche_high: 'Top Niche: High Priority',
    top_niche_val: 'Niche Perlu Validasi',
    gauge_desc_tail: 'mengungguli kandidat lain dengan margin sehat dan rasio komplain kompetitor tinggi.',
    btn_simulasi: 'Simulasi Pricing',

    // Quick Insights / Winning Playbook
    playbook_title: 'Winning Playbook',
    playbook_sub: 'Katalis & Strategi Sukses Produk',
    pillar_demand: 'Demand Velocity',
    pillar_demand_sub: 'Lonjakan minat pencarian & volume',
    pillar_margin: 'Target HPP & Margin',
    pillar_margin_sub: 'Batas biaya agar profit sehat ≥ 25%',
    pillar_flaw: 'Celah Komplain Kompetitor',
    pillar_flaw_sub: 'Keluhan incumbent yang bisa dieksploitasi',
    pillar_oem: 'Kesiapan Supplier / OEM',
    pillar_oem_sub: 'Pabrik lokal Tangerang & 1688 siap produksi',
    playbook_strategy_header: 'Actionable Sourcing Playbook:',
    step1_title: 'Diferensiasi Produk:',
    step1_desc: 'Gunakan kemasan tebal anti-bocor untuk merebut pangsa pasar dari kompetitor bermasalah.',
    step2_title: 'Sweet Spot Pricing:',
    step2_desc: 'Pasang harga awal dengan bonus aksesoris demi mengakselerasi rating 5 bintang.',
    btn_sourcing_action: 'Simulasi Sourcing Produk Ini',
    automated: 'Otomatis',
    calendar_month: 'September 2026',
    task_sample: 'Supplier Sample Review',
    task_sample_sub: 'Bumbu Instan (Target HPP Rp 6.800)',
    task_cron: 'Weekly Pipeline Cron',
    task_cron_sub: 'Otomatisasi GitHub Actions',
    day_sun: 'Min',
    day_mon: 'Sen',
    day_tue: 'Sel',
    day_wed: 'Rab',
    day_thu: 'Kam',
    day_fri: 'Jum',
    day_sat: 'Sab',

    // Analytics & Market Research Dashboard
    analytics_title: 'Market Research & Brand Opinion',
    analytics_sub: 'Pengukuran persepsi brand, demografi pembeli, loyalitas, dan pendorong emosional konsumen',
    tab_view_research: 'Riset Pasar & Brand',
    tab_view_pricing: 'Sweet Spot Harga & Keluhan',
    sec_cust_info: 'Informasi Pelanggan',
    age_group: 'Kelompok Usia',
    region_dist: 'Sebaran Wilayah Indonesia',
    gender_label: 'Gender Pembeli',
    female: 'Wanita',
    male: 'Pria',
    sec_brand_awareness: 'Brand Awareness & Loyalitas',
    most_recognized_brands: 'Brand Terbanyak Dikenal Konsumen',
    customer_loyalty: 'Tingkat Loyalitas / Repeat Order',
    ad_themes_title: 'Tema Promosi Pendorong Emosional Konsumen',
    ad_themes_sub: 'Rata-rata Skala Likert (1 - 5)',
    channel_title: 'Saluran Penemuan Produk',
    sec_brand_image: 'Persepsi Brand',
    brand_image_title: 'Persepsi Produk di Benak Konsumen',
    scale_totally_agree: 'Sangat Setuju',
    scale_agree: 'Setuju',
    scale_maybe: 'Netral',
    scale_disagree: 'Kurang Setuju',
    scale_totally_disagree: 'Sangat Tidak Setuju',
    attr_practical: 'Praktis & Mudah Dipakai',
    attr_durable: 'Material Awet & Kokoh',
    attr_comfortable: 'Aman & Nyaman',
    attr_value: 'Nilai Sepadan Harga',
    attr_trendy: 'Desain Menarik & Estetik',
    attr_reliable: 'Pelayanan & Pengiriman Cepat',
    hook_practical: 'Solusi Cepat Sehari-hari',
    hook_durable: 'Material Kuat Bergaransi',
    hook_guarantee: 'Garansi Rusak Ganti Baru',
    hook_budget: 'Hemat Budget Belanja',
    hook_design: 'Desain Elegan / Mewah',
    card_pain_point: 'Pendorong Sentimen Negatif Utama',
    card_pain_sub: 'Fokus diferensiasi material saat memesan ke supplier',
    card_verified: 'Total Ulasan Terverifikasi',
    card_verified_sub: 'Diekstraksi dari database review Kaggle e-commerce Indonesia',
    critical_reviews: 'Ulasan Kritis',
    chart_price_dist: 'Distribusi Harga Kompetitor',
    chart_price_sub: 'Kerapatan listing produk berdasarkan rentang harga pasar (Sweet Spot Pricing)',
    chart_complaint: 'Top Keluhan Pelanggan (Rating 1–2)',
    chart_complaint_sub: 'ulasan negatif dianalisis untuk menemukan celah perbaikan produk',
    price_label: 'Harga',
    freq_label: 'Frekuensi',
    complaint_count: 'Keluhan',
    reviews_unit: 'ulasan',

    // Complaint Aspects Translation
    aspect_material: 'Kualitas Bahan',
    aspect_packaging: 'Kemasan Rusak',
    aspect_size: 'Ukuran Terlalu Kecil',
    aspect_color: 'Warna Tidak Sesuai',
    aspect_flavor: 'Aroma/Rasa Kurang',
    aspect_shipping: 'Pengiriman Lambat',
    aspect_function: 'Fungsi Tidak Sesuai',

    // Pricing Simulator Page
    sim_title: 'Pricing & Sourcing Simulator',
    sim_sub: 'Validasi batas maksimal HPP supplier sebelum melakukan pemesanan stok',
    sim_param_title: 'Parameter Simulasi Sourcing',
    sim_selling_price_input: 'Harga Jual (Rp)',
    sim_hpp_supplier: 'HPP Supplier (Rp)',
    sim_shipping_fee: 'Biaya Ekspedisi (Rp)',
    sim_ads_budget_input: 'Budget Ads (Rp)',
    sim_healthy_margin: 'Margin Sehat (Target >= 25% Terpenuhi)',
    sim_low_margin: 'Margin di Bawah Target (< 25%)',
    sim_max_hpp_target: 'Target batas maksimal HPP supplier:',
    sim_est_profit_label: 'Estimasi Profit:',
    sim_unit_suffix: '/ unit',
    sim_waterfall_title: 'Dekomposisi Margin',
    sim_waterfall_sub: 'Revenue - Alokasi Biaya - Net Profit',
    sim_net_margin: 'Net Margin',
    wf_selling_price: 'Harga Jual',
    wf_hpp: 'HPP Supplier',
    wf_commission: 'Komisi Platform',
    wf_shipping: 'Ekspedisi',
    wf_ads: 'Ads',
    wf_profit: 'Net Profit',
    sim_selling_price: 'Target Harga Jual Konsumen',
    sim_marketplace_fee: 'Komisi Marketplace',
    sim_ads_budget: 'Budget Iklan (TACoS)',
    sim_target_margin: 'Target Net Margin',
    sim_max_cogs: 'Batas Maksimal HPP Supplier',
    sim_max_cogs_sub: 'Biaya produksi / pembelian maksimal per unit agar target margin tercapai',
    sim_est_profit: 'Estimasi Profit Bersih / Unit',
    sim_feasible: 'Sangat Layak Sourcing',
    sim_warning: 'Margin Kritis — Negosiasi HPP',
    sim_reset: 'Reset Default',
  },
  EN: {
    // Brand & Navigation
    brand_sub: 'PRODUCT DISCOVERY',
    menu: 'MENU',
    tab_overall: 'Overall Summary',
    tab_overall_sub: 'Market Landscape',
    tab_analytics: 'Analytics',
    tab_analytics_sub: 'Pricing & Pain Points',
    tab_pricing_sim: 'Pricing Simulator',
    tab_pricing_sim_sub: 'Sourcing Feasibility',

    // Header
    weekly_cycle: 'Weekly Cycle:',
    sub_overall: 'In-depth analytics for e-commerce product discovery and sourcing feasibility',
    sub_analytics: 'Sweet spot pricing analysis and competitor pain points intelligence',
    sub_pricing_sim: 'Validate supplier COGS ceiling before placing pilot stock orders',

    // Scope Filter & KPI Cards
    filter_label: 'Metric Scope Filter:',
    opt_all: 'All Categories (Overall - 6 Niches)',
    opt_winning: 'Winning Niches Only (WPS ≥ 70)',
    scope_overall_badge: 'Overall (6 Categories)',
    scope_winning_badge: 'Winning Niches Only (WPS ≥ 70)',
    kpi_gmv: 'Est. Monthly GMV',
    kpi_price: 'Average Market Price',
    kpi_ready: 'Ready for Sourcing',
    kpi_ready_sub: 'WPS ≥ 70',
    badge_overall: 'Overall',
    badge_filtered: 'Filtered',
    badge_6cat: '6 Categories',
    niche_unit: 'Niches',
    trend_trajectory_gmv: '8-Wk Trend: ▲ Accelerating',
    trend_trajectory_price: 'Stable & Competitive Band',
    trend_trajectory_sourcing: 'High Priority Pipeline',
    trend_velocity_label: 'Velocity',

    // Market Opportunity Analytics (Bubble Chart)
    chart_title: 'Market Opportunity Analytics',
    chart_sub: 'Bubble size reflects estimated market GMV',
    high_demand: 'High Demand',
    balanced: 'Balanced',
    opt_all_categories: 'All Categories',
    units_axis: 'Units/mo',
    trend_axis: 'Trend Index',
    units_per_month: 'Units / Month:',
    wps_score: 'WPS Score:',

    // Top Opportunities Table
    table_title: 'Top Product Opportunities',
    table_sub: 'Niche ranking validated by Winning Product Score (WPS) algorithm',
    niche_analyzed: 'Niches Analyzed',
    col_product: 'Niche / Product',
    col_category: 'Category',
    col_units: 'Units/Mo',
    col_price: 'Median Price',
    col_wps: 'WPS Score',
    col_status: 'Feasibility Status',
    col_action: 'Action',
    action_simulate: 'Pricing Simulator',
    action_sim_short: 'Simulate',
    badge_high: 'High Priority',
    badge_monitor: 'Monitor',
    badge_reject: 'Reject',
    listings_analyzed: 'listings analyzed',
    no_data: 'No scoring data available. Please ensure Python pipeline has run.',

    // Gauge Card
    gauge_title: 'Opportunity Score',
    gauge_outof: 'out of 1000',
    top_niche_high: 'Top Niche: High Priority',
    top_niche_val: 'Niche Needs Validation',
    gauge_desc_tail: 'leads candidates with healthy margins and high competitor complaint gaps.',
    btn_simulasi: 'Pricing Simulator',

    // Quick Insights / Winning Playbook
    playbook_title: 'Winning Playbook',
    playbook_sub: 'Catalyst & Product Launch Strategy',
    pillar_demand: 'Demand Velocity',
    pillar_demand_sub: 'Search surge & market volume',
    pillar_margin: 'Target COGS & Margin',
    pillar_margin_sub: 'Ceiling cost for healthy profit ≥ 25%',
    pillar_flaw: 'Competitor Defect Gap',
    pillar_flaw_sub: 'Incumbent complaint to exploit',
    pillar_oem: 'Supplier / OEM Readiness',
    pillar_oem_sub: 'Local Tangerang & 1688 OEM ready',
    playbook_strategy_header: 'Actionable Sourcing Playbook:',
    step1_title: 'Product Differentiation:',
    step1_desc: 'Use leak-proof reinforced packaging to capture unsatisfied competitor buyers.',
    step2_title: 'Sweet Spot Pricing:',
    step2_desc: 'Launch at median price with bundled value to accelerate initial 5-star reviews.',
    btn_sourcing_action: 'Simulate Sourcing for this Niche',
    automated: 'Automated',
    calendar_month: 'September 2026',
    task_sample: 'Supplier Sample Review',
    task_sample_sub: 'Instant Seasoning (Target COGS Rp 6,800)',
    task_cron: 'Weekly Pipeline Cron',
    task_cron_sub: 'GitHub Actions Automated',
    day_sun: 'Sun',
    day_mon: 'Mon',
    day_tue: 'Tue',
    day_wed: 'Wed',
    day_thu: 'Thu',
    day_fri: 'Fri',
    day_sat: 'Sat',

    // Analytics & Market Research Dashboard
    analytics_title: 'Market Research & Brand Opinion',
    analytics_sub: 'Brand metrics, customer perception, loyalty, demographic profile, and emotional drivers',
    tab_view_research: 'Market Research & Brand',
    tab_view_pricing: 'Pricing Sweet Spot & Pain Points',
    sec_cust_info: 'Customer Information',
    age_group: 'Age Group',
    region_dist: 'Indonesian Region Breakdown',
    gender_label: 'Buyer Gender',
    female: 'Female',
    male: 'Male',
    sec_brand_awareness: 'Brand Awareness & Loyalty',
    most_recognized_brands: 'Most Brands Recognized by Customers',
    customer_loyalty: 'Customer Loyalty towards Brand',
    ad_themes_title: 'Advertising Themes Touching Emotional Points',
    ad_themes_sub: 'Mean of Likert-Scale (1 - 5)',
    channel_title: 'Product Discovery Channels',
    sec_brand_image: 'Brand Image',
    brand_image_title: 'Brand Image in Customer Mind',
    scale_totally_agree: 'Totally Agree',
    scale_agree: 'Agree',
    scale_maybe: 'Maybe / Neutral',
    scale_disagree: 'Disagree',
    scale_totally_disagree: 'Totally Disagree',
    attr_practical: 'Practical & Easy to Use',
    attr_durable: 'Durable & Sturdy Material',
    attr_comfortable: 'Safe & Ergonomic',
    attr_value: 'Value for Money',
    attr_trendy: 'Trendy & Aesthetic Design',
    attr_reliable: 'Reliable Delivery & Service',
    hook_practical: 'Everyday Practical Solution',
    hook_durable: 'Sturdy Material with Warranty',
    hook_guarantee: 'Defect Replacement Guarantee',
    hook_budget: 'Budget-Friendly Savings',
    hook_design: 'Elegant & Compact Design',
    card_pain_point: 'Top Negative Sentiment Driver',
    card_pain_sub: 'Material differentiation focus when ordering from suppliers',
    card_verified: 'Total Verified Reviews',
    card_verified_sub: 'Extracted from Indonesian e-commerce Kaggle review database',
    critical_reviews: 'Critical Reviews',
    chart_price_dist: 'Competitor Price Distribution',
    chart_price_sub: 'Product listing density across market price brackets (Sweet Spot Pricing)',
    chart_complaint: 'Top Customer Complaints (Rating 1–2)',
    chart_complaint_sub: 'negative reviews analyzed to uncover product improvement opportunities',
    price_label: 'Price',
    freq_label: 'Frequency',
    complaint_count: 'Complaints',
    reviews_unit: 'reviews',

    // Complaint Aspects Translation
    aspect_material: 'Material Quality',
    aspect_packaging: 'Damaged Packaging',
    aspect_size: 'Size Too Small',
    aspect_color: 'Color Mismatch',
    aspect_flavor: 'Flavor/Aroma Weak',
    aspect_shipping: 'Slow Shipping',
    aspect_function: 'Defective Function',

    // Pricing Simulator Page
    sim_title: 'Pricing & Sourcing Simulator',
    sim_sub: 'Validate supplier COGS ceiling before placing pilot stock orders',
    sim_param_title: 'Sourcing Simulation Parameters',
    sim_selling_price_input: 'Selling Price (IDR)',
    sim_hpp_supplier: 'Supplier COGS (IDR)',
    sim_shipping_fee: 'Shipping Fee (IDR)',
    sim_ads_budget_input: 'Ads Budget (IDR)',
    sim_healthy_margin: 'Healthy Margin (Target >= 25% Met)',
    sim_low_margin: 'Margin Below Target (< 25%)',
    sim_max_hpp_target: 'Supplier COGS Ceiling Target:',
    sim_est_profit_label: 'Estimated Profit:',
    sim_unit_suffix: '/ unit',
    sim_waterfall_title: 'Margin Decomposition',
    sim_waterfall_sub: 'Revenue - Cost Allocation - Net Profit',
    sim_net_margin: 'Net Margin',
    wf_selling_price: 'Selling Price',
    wf_hpp: 'Supplier COGS',
    wf_commission: 'Platform Fee',
    wf_shipping: 'Shipping',
    wf_ads: 'Ads',
    wf_profit: 'Net Profit',
    sim_selling_price: 'Target Consumer Selling Price',
    sim_marketplace_fee: 'Marketplace Fee',
    sim_ads_budget: 'Ad Marketing Budget (TACoS)',
    sim_target_margin: 'Target Net Profit Margin',
    sim_max_cogs: 'Supplier COGS Ceiling',
    sim_max_cogs_sub: 'Maximum unit manufacturing/purchase cost to hit target margin',
    sim_est_profit: 'Estimated Net Profit / Unit',
    sim_feasible: 'Highly Feasible for Sourcing',
    sim_warning: 'Critical Margin — Negotiate COGS',
    sim_reset: 'Reset to Default',
  },
}

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ID',
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ID')

  useEffect(() => {
    const saved = localStorage.getItem('bis_lang') as Language
    if (saved === 'ID' || saved === 'EN') {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('bis_lang', newLang)
  }

  const toggleLang = () => {
    const next = lang === 'ID' ? 'EN' : 'ID'
    setLang(next)
  }

  const t = (key: string): string => {
    return DICTIONARY[lang][key] ?? DICTIONARY['ID'][key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
