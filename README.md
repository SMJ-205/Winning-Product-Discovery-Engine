# Winning Product Discovery Engine

**Menemukan produk e-commerce berpotensi tinggi & memvalidasi kelayakan sourcing-nya — berbasis data publik, sepenuhnya gratis.**

> Built with: Python · Supabase · Next.js 14 · Recharts · Vercel · GitHub Actions

---

## 🎯 Business Problem

Di marketplace Indonesia yang semakin kompetitif, memilih produk yang salah untuk di-sourcing berarti membakar modal tanpa hasil. Sistem ini menjawab tiga pertanyaan krusial sebelum Anda memesan dari supplier:

1. **Sub-kategori mana** yang punya demand tinggi tapi kompetisi masih longgar?
2. **Harga berapa** yang kompetitif tapi masih menghasilkan margin sehat?
3. **Spesifikasi apa** yang harus diperbaiki dibanding kompetitor (berdasarkan keluhan riil pelanggan)?

---

## 🏗️ Arsitektur Pipeline

```
TikTok Creative Center (manual)          Google Trends (pytrends)
         │                                        │
         └──────────── Keyword Discovery ─────────┘
                               │
                    Kaggle Public Dataset
                    (listings + reviews)
                               │
                    ┌──────────▼──────────┐
                    │   Supabase (PostgreSQL)  │
                    │  dim_category_keyword    │
                    │  dim_competitor_product  │
                    │  fact_product_snapshot   │
                    │  fact_customer_reviews   │
                    │  vw_subcategory_features │
                    └──────────┬──────────┘
                               │
              ┌────────────────▼────────────────┐
              │         Python Pipeline          │
              │  NLP (sentiment + complaints)    │
              │  WPS Scoring Engine              │
              │  Data Quality Checks             │
              └────────────────┬────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Next.js Dashboard  │
                    │   (Vercel)           │
                    │   • Market Landscape │
                    │   • Pricing & Pain   │
                    │   • Sourcing Sim     │
                    └─────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  GitHub Actions      │
                    │  (Weekly cron,       │
                    │   free-tier)         │
                    └─────────────────────┘
```

---

## ⭐ Formula Winning Product Score (WPS)

```
WPS = 0.35 × Demand + 0.25 × (100 − Competition) + 0.25 × Margin + 0.15 × Gap
```

| Komponen | Bobot | Deskripsi |
|----------|-------|-----------|
| **Demand** | 35% | `monthly_sold_units × search_trend_index` — seberapa besar & aktif pasarnya |
| **Competition** (dibalik) | 25% | `100 − (mall_seller_ratio × 100 + avg_review_count)` — semakin longgar kompetisi, semakin tinggi skor |
| **Margin** | 25% | `net_margin_pct × median_price` — potensi keuntungan per unit |
| **Gap** | 15% | `negative_review_rate` — proporsi keluhan kompetitor yang belum terselesaikan |

Semua komponen dinormalisasi **min-max ke skala 0–100** sebelum dijumlahkan, sehingga WPS otomatis berada di rentang [0, 100].

### Label Rekomendasi
| WPS | Label |
|-----|-------|
| ≥ 70 | 🔥 High Priority — Immediate Sourcing |
| 50–69 | 👁 Monitor & Sample Testing |
| < 50 | ❌ Reject — Saturated / Unfeasible |

---

## 📁 Struktur Repository

```
├── config/
│   ├── cost_params.yaml           # HPP & komisi per kategori (refresh bulanan)
│   └── keywords_discovery.yaml   # Seed keywords + config pytrends
├── data/
│   ├── raw/                       # Kaggle dataset mentah (.gitignored)
│   └── sample/                    # Sampel anonim untuk portofolio
├── sql/                           # DDL PostgreSQL untuk Supabase
├── pipeline/
│   ├── discovery/                 # Keyword discovery (TikTok CC + pytrends)
│   ├── ingestion/                 # Kaggle loader + Google Trends
│   ├── processing/                # NLP: sentiment scoring + complaint classification
│   ├── scoring/                   # WPS formula + feature aggregation
│   ├── quality/                   # Data quality checks (pre-publish gate)
│   ├── tests/                     # Unit tests (19 tests, 100% pass)
│   └── run_all.py                 # Entry point orkestrasi
├── dashboard/                     # Next.js 14 App — deploy ke Vercel
│   ├── app/                       # App Router: 3 halaman + API Routes
│   └── components/                # BubbleChart, WpsTable, MarginSimulator, dll.
├── docs/                          # Glossary & Compliance Checklist
└── .github/workflows/             # GitHub Actions (weekly cron)
```

---

## 🚀 Cara Menjalankan

### 1. Setup Environment
```bash
git clone https://github.com/<your-username>/Winning-Product-Discovery-Engine
cd Winning-Product-Discovery-Engine
pip install -r requirements.txt
cp dashboard/.env.local.example dashboard/.env.local
# Edit dashboard/.env.local dengan kredensial Supabase Anda
```

### 2. Setup Database (Supabase)
```bash
# Jalankan semua DDL di Supabase SQL Editor, berurutan:
# sql/01_ddl_dimensions.sql
# sql/02_ddl_facts.sql
# sql/03_ddl_scoring.sql
# sql/04_view_subcategory_features.sql
```

### 3. Keyword Discovery
```bash
python3 -m pipeline.discovery.keyword_discovery
```

### 4. Load Kaggle Dataset
```bash
# Download dataset dari Kaggle ke data/raw/products.csv dan data/raw/reviews.csv
python3 -m pipeline.ingestion.kaggle_loader
```

### 5. Jalankan Full Pipeline
```bash
python3 pipeline/run_all.py
```

### 6. Jalankan Dashboard Lokal
```bash
cd dashboard && npm install && npm run dev
# Buka http://localhost:3000
```

### 7. Deploy ke Vercel
```bash
cd dashboard && npx vercel --prod
# Set env vars di Vercel Dashboard:
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_BASE_URL
```

---

## 🧪 Unit Tests

```bash
python3 -m pytest pipeline/tests/ -v
# 19 tests covering: WPS formula, normalization, NLP classification, sentiment scoring
```

---

## 📋 Referensi

- [Panduan Setup Supabase & Vercel](docs/supabase_vercel_setup.md) — Langkah manual detail setup database & deployment
- [Glossary](docs/glossary.md) — Penjelasan semua istilah teknis (WPS, HPP, CV, dll.)
- [Compliance Checklist](docs/compliance_checklist.md) — Free-tier limits & etika data
- [Implementation Guide v2 (Audited)](Implementation_Guide_v2_Audited.docx) — Dokumen desain lengkap

---

## ⚠️ Catatan Etika & Legalitas

- Dataset yang digunakan adalah **dataset publik dari Kaggle** berlisensi terbuka — tidak ada scraping langsung ke marketplace
- Data di folder `data/sample/` sudah **dianonimkan** dan hanya berisi sampel representatif
- `SUPABASE_SERVICE_ROLE_KEY` **tidak pernah di-commit** ke repo — hanya ada di Vercel Dashboard env vars
