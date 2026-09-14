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
    badge_filtered: 'Kategori Terpilih',
    badge_6cat: '6 Kategori',
    niche_unit: 'Niche',

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

    // Quick Insights
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

    // Analytics Page
    analytics_title: 'Pricing Intelligence & Pain Points',
    analytics_sub: 'Analisis sweet spot harga jual dan titik kelemahan produk kompetitor',
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
    badge_filtered: 'Filtered Category',
    badge_6cat: '6 Categories',
    niche_unit: 'Niches',

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

    // Quick Insights
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

    // Analytics Page
    analytics_title: 'Pricing Intelligence & Pain Points',
    analytics_sub: 'Sweet spot selling price analysis and competitor weakness points',
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
