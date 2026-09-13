# Checklist Kepatuhan Free-Tier

Gunakan checklist ini **sebelum menjalankan pipeline pertama kali** dan **sebelum publikasi ke GitHub**.

---

## Pre-Run Checklist (Jalankan Sekali)

- [ ] **robots.txt & ToS sudah dicek** — Pastikan platform marketplace yang data-nya digunakan mengizinkan pengambilan data publik (untuk dataset Kaggle: sudah aman karena dari sumber publik berlisensi).
- [ ] **Rate limiting aktif di pytrends** — Batasi ≤ 5 keyword per run; jeda 3 detik antar batch (`time.sleep(3)` di `trends_ingestion.py`).
- [ ] **Retry/backoff aktif untuk pytrends** — Modul `trends_ingestion.py` sudah mengimplementasi retry eksponensial (max 5x). Verifikasi dengan menjalankan `python -m pipeline.ingestion.trends_ingestion` dan cek log.
- [ ] **UNIQUE constraint aktif** — Jalankan `sql/02_ddl_facts.sql` dan pastikan constraint `UNIQUE(product_id, snapshot_date)` berhasil dibuat di Supabase.
- [ ] **Data quality checks lolos** — Jalankan `pipeline/quality/data_quality_checks.py` atau `run_all.py` dan pastikan muncul `[OK] Semua data quality checks lolos.` sebelum data masuk ke dashboard.

---

## Pre-Publish GitHub Checklist

- [ ] **Data anonimkan** — File di `data/sample/` hanya berisi sampel anonim (≤ 100 baris, tanpa shop name asli jika sensitif). Data mentah penuh ada di `data/raw/` yang masuk `.gitignore`.
- [ ] **`data/raw/` tidak ter-commit** — Jalankan `git status` dan pastikan folder `data/raw/` tidak muncul sebagai file yang akan di-commit.
- [ ] **`.env.local` tidak ter-commit** — Pastikan hanya `.env.local.example` yang ada di repo, bukan `.env.local`.
- [ ] **`SUPABASE_SERVICE_ROLE_KEY` hanya di Vercel Dashboard** — Tidak ada di kode, tidak ada di GitHub Secrets, tidak ada di README.

---

## Monitoring Free-Tier (Ongoing)

- [ ] **Supabase storage dipantau** — Free-tier: 500MB. Purge `fact_product_snapshot` lama (> 6 bulan) secara berkala. Cek di Supabase Dashboard > Storage.
- [ ] **Vercel Hobby plan dipantau** — Free-tier: 100GB bandwidth/bulan, 100 GB-hours serverless. Cek di Vercel Dashboard > Usage.
- [ ] **`cost_params.yaml` di-update** — Refresh parameter HPP & komisi setiap bulan. Tandai tanggal update di komentar YAML.
- [ ] **README menyertakan ringkasan awam** — Bagian pertama README berisi headline bisnis (bukan langsung diagram arsitektur teknis).

---

## Sumber Referensi

- Supabase Free Tier: [supabase.com/pricing](https://supabase.com/pricing)
- Vercel Hobby Limits: [vercel.com/docs/limits/overview](https://vercel.com/docs/limits/overview)
- pytrends Rate Limit: [github.com/GeneralMills/pytrends#readme](https://github.com/GeneralMills/pytrends)
