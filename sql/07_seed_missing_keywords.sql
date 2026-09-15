-- =============================================================================
-- 07_seed_missing_keywords.sql — Tambah keyword_id 7–13 ke dim_category_keyword
--
-- Mengapa dibutuhkan:
--   Pipeline Kaggle loader gagal ForeignKeyViolation karena produk baru
--   (P701–PD05) mereferensi keyword_id 7–13 yang belum ada di DB.
--   Setelah file ini dijalankan, re-run pipeline akan berhasil ingest
--   semua 65 produk dan 13 sub-kategori.
--
-- Catatan: keyword_id SERIAL — jika DB sudah memiliki ID berbeda, sesuaikan
-- nilai 'keyword_id' dengan hasil SELECT MAX(keyword_id) FROM dim_category_keyword.
--
-- Jalankan sekali di Supabase SQL Editor:
--   \i sql/07_seed_missing_keywords.sql
--
-- Last updated: 2026-09-15
-- =============================================================================

INSERT INTO dim_category_keyword
  (keyword_id, category_name, sub_category, search_keyword,
   target_price_min, target_price_max, cost_category, is_active)
VALUES
  -- Dapur & Makanan
  (7,  'Dapur & Makanan', 'Saringan Minyak Goreng', 'saringan minyak goreng',
       15000, 75000, 'dapur_dan_makan', TRUE),

  -- Peralatan Rumah
  (8,  'Peralatan Rumah', 'Talenan Kayu', 'talenan kayu',
       35000, 150000, 'peralatan_rumah', TRUE),
  (9,  'Peralatan Rumah', 'Rak Sepatu Minimalis', 'rak sepatu minimalis',
       40000, 200000, 'peralatan_rumah', TRUE),
  (10, 'Peralatan Rumah', 'Organizer Laci Kamar', 'organizer laci kamar',
       30000, 120000, 'peralatan_rumah', TRUE),

  -- Kecantikan & Skincare
  (11, 'Kecantikan & Skincare', 'Serum Pencerah Wajah', 'serum pencerah wajah',
       60000, 200000, 'kecantikan_skincare', TRUE),
  (12, 'Kecantikan & Skincare', 'Organizer Makeup Meja Rias', 'organizer makeup meja rias',
       60000, 250000, 'kecantikan_skincare', TRUE),
  (13, 'Kecantikan & Skincare', 'Cermin Kaca Rias', 'cermin kaca rias',
       80000, 300000, 'kecantikan_skincare', TRUE)

ON CONFLICT (search_keyword) DO UPDATE SET
  category_name    = EXCLUDED.category_name,
  sub_category     = EXCLUDED.sub_category,
  target_price_min = EXCLUDED.target_price_min,
  target_price_max = EXCLUDED.target_price_max,
  cost_category    = EXCLUDED.cost_category,
  is_active        = EXCLUDED.is_active,
  updated_at       = NOW();

-- Verifikasi hasil
SELECT keyword_id, category_name, sub_category, search_keyword, is_active
FROM dim_category_keyword
ORDER BY keyword_id;
