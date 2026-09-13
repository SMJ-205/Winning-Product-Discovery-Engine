-- =============================================================================
-- 02_ddl_facts.sql — Tabel Fakta (Time-Series & Ulasan)
-- Database: Supabase PostgreSQL
-- =============================================================================

-- Fakta: Snapshot Kinerja Produk (Time-Series)
-- UNIQUE(product_id, snapshot_date) menjamin idempotency — re-run pipeline
-- tidak menduplikasi data untuk produk & tanggal yang sama.
CREATE TABLE IF NOT EXISTS fact_product_snapshot (
    snapshot_id          BIGSERIAL PRIMARY KEY,
    product_id           TEXT NOT NULL REFERENCES dim_competitor_product(product_id) ON DELETE CASCADE,
    snapshot_date        DATE NOT NULL,
    price                NUMERIC(12, 2),
    units_sold_monthly   INT,
    search_trend_index   NUMERIC(5, 2),   -- dari pytrends, skala 0-100
    review_count         INT,
    rating_avg           NUMERIC(3, 2),
    gmv_monthly          NUMERIC(16, 2) GENERATED ALWAYS AS (price * units_sold_monthly) STORED,
    loaded_at            TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (product_id, snapshot_date)    -- IDEMPOTENCY CONSTRAINT
);

CREATE INDEX IF NOT EXISTS idx_snapshot_product  ON fact_product_snapshot(product_id);
CREATE INDEX IF NOT EXISTS idx_snapshot_date     ON fact_product_snapshot(snapshot_date DESC);

COMMENT ON TABLE  fact_product_snapshot IS 'Snapshot harga & penjualan mingguan/harian per produk.';
COMMENT ON COLUMN fact_product_snapshot.gmv_monthly IS 'Gross Merchandise Value bulanan (kalkulasi otomatis).';
COMMENT ON COLUMN fact_product_snapshot.search_trend_index IS 'Indeks minat penelusuran dari Google Trends (0-100).';

-- Fakta: Ulasan Pelanggan & Aspek Keluhan
CREATE TABLE IF NOT EXISTS fact_customer_reviews (
    review_id         BIGSERIAL PRIMARY KEY,
    product_id        TEXT NOT NULL REFERENCES dim_competitor_product(product_id) ON DELETE CASCADE,
    rating            SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text       TEXT,
    sentiment_score   NUMERIC(5, 4),  -- diisi oleh nlp_pipeline.py, rentang [-1.0, 1.0]
    complaint_aspects TEXT[],         -- array kategori keluhan, diisi oleh nlp_pipeline.py
    review_date       DATE,
    loaded_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product  ON fact_customer_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating   ON fact_customer_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_date     ON fact_customer_reviews(review_date DESC);
-- GIN index untuk query array complaint_aspects
CREATE INDEX IF NOT EXISTS idx_reviews_aspects  ON fact_customer_reviews USING GIN (complaint_aspects);

COMMENT ON TABLE  fact_customer_reviews IS 'Ulasan pelanggan dari Kaggle dataset, diperkaya NLP.';
COMMENT ON COLUMN fact_customer_reviews.sentiment_score IS 'Skor sentimen leksikon: -1.0 (sangat negatif) s.d. 1.0 (sangat positif).';
COMMENT ON COLUMN fact_customer_reviews.complaint_aspects IS 'Kategori keluhan yang teridentifikasi: Quality, Packaging, Shipping, dll.';
