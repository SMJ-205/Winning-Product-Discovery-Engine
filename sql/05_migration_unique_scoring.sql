-- =============================================================================
-- 05_migration_unique_scoring.sql — Tambah UNIQUE constraint untuk mencegah
-- duplikasi baris scoring pada fact_sourcing_opportunity.
--
-- Masalah (C8):
--   Jika pipeline dijalankan >1x dengan pipeline_run_id yang sama dalam satu
--   sesi, baris scoring ganda bisa masuk. Query join di data.ts mengambil
--   `latest` via ORDER BY scored_at DESC — tapi race condition tetap mungkin.
--
-- Solusi:
--   UNIQUE(keyword_id, pipeline_run_id) memastikan satu run ID hanya bisa
--   menghasilkan 1 baris skor per sub-kategori. Jika pipeline di-retry dengan
--   run_id yang sama, gunakan INSERT ... ON CONFLICT DO UPDATE (upsert).
--
-- Jalankan sekali di Supabase SQL Editor (atau via psql):
--   \i sql/05_migration_unique_scoring.sql
--
-- Last updated: 2026-09-15
-- =============================================================================

-- Step 1: Hapus duplikat lama (jika ada) — simpan hanya baris terbaru per
-- kombinasi (keyword_id, pipeline_run_id)
DELETE FROM fact_sourcing_opportunity
WHERE opportunity_id NOT IN (
    SELECT MAX(opportunity_id)
    FROM fact_sourcing_opportunity
    GROUP BY keyword_id, COALESCE(pipeline_run_id, 'NULL')
);

-- Step 2: Tambah UNIQUE constraint
--   Gunakan COALESCE-based partial index untuk handle NULL pipeline_run_id
--   (rows dari run lokal tanpa GITHUB_RUN_ID yang eksplisit)
ALTER TABLE fact_sourcing_opportunity
  ADD CONSTRAINT uq_scoring_keyword_run
  UNIQUE (keyword_id, pipeline_run_id);

-- Step 3: Index tambahan untuk query join yang efisien di data.ts
--   (join fact_sourcing_opportunity → dim_category_keyword sudah ada via idx_scoring_keyword)
CREATE INDEX IF NOT EXISTS idx_scoring_run_id
  ON fact_sourcing_opportunity(pipeline_run_id);

COMMENT ON CONSTRAINT uq_scoring_keyword_run ON fact_sourcing_opportunity IS
  'Mencegah duplikasi scoring: satu pipeline_run_id hanya boleh menghasilkan '
  '1 baris skor per keyword_id. Pipeline harus menggunakan INSERT ... ON CONFLICT DO UPDATE.';
