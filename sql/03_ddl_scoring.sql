-- =============================================================================
-- 03_ddl_scoring.sql — Tabel Hasil Skoring Peluang Sourcing
-- Database: Supabase PostgreSQL
-- Skoring dilakukan pada level keyword_id (sub-kategori), bukan product_id.
-- =============================================================================

CREATE TABLE IF NOT EXISTS fact_sourcing_opportunity (
    opportunity_id          BIGSERIAL PRIMARY KEY,
    keyword_id              INT NOT NULL REFERENCES dim_category_keyword(keyword_id) ON DELETE CASCADE,
    scored_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Komponen skor (masing-masing 0-100 setelah normalisasi min-max)
    demand_score            NUMERIC(5, 2) CHECK (demand_score BETWEEN 0 AND 100),
    competition_score       NUMERIC(5, 2) CHECK (competition_score BETWEEN 0 AND 100),
    margin_score            NUMERIC(5, 2) CHECK (margin_score BETWEEN 0 AND 100),
    gap_score               NUMERIC(5, 2) CHECK (gap_score BETWEEN 0 AND 100),

    -- Skor akhir: WPS = 0.35×Demand + 0.25×(100−Competition) + 0.25×Margin + 0.15×Gap
    winning_product_score   NUMERIC(5, 2) NOT NULL CHECK (winning_product_score BETWEEN 0 AND 100),
    sourcing_recommendation TEXT NOT NULL
        CHECK (sourcing_recommendation IN (
            'High Priority - Immediate Sourcing',
            'Monitor & Sample Testing',
            'Reject - Saturated / Unfeasible'
        )),

    -- Metadata snapshot
    n_products_analyzed     INT,           -- jumlah produk kompetitor yang dianalisis
    n_reviews_analyzed      INT,           -- jumlah ulasan yang diproses NLP
    pipeline_run_id         TEXT           -- untuk traceability (mis. GitHub Actions run ID)
);

CREATE INDEX IF NOT EXISTS idx_scoring_keyword  ON fact_sourcing_opportunity(keyword_id);
CREATE INDEX IF NOT EXISTS idx_scoring_date     ON fact_sourcing_opportunity(scored_at DESC);
CREATE INDEX IF NOT EXISTS idx_scoring_wps      ON fact_sourcing_opportunity(winning_product_score DESC);

COMMENT ON TABLE  fact_sourcing_opportunity IS 'Hasil scoring WPS per sub-kategori, dihasilkan oleh pipeline scoring mingguan.';
COMMENT ON COLUMN fact_sourcing_opportunity.winning_product_score IS
    'WPS = 0.35×Demand + 0.25×(100−Competition) + 0.25×Margin + 0.15×Gap. Skala 0-100.';
COMMENT ON COLUMN fact_sourcing_opportunity.keyword_id IS
    'Referensi ke sub-kategori (bukan product_id) — level agregasi yang benar untuk sinyal demand/kompetisi.';
