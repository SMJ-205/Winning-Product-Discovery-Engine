-- =============================================================================
-- 01_ddl_dimensions.sql — Tabel Dimensi
-- Database: Supabase PostgreSQL
-- Run sekali saat setup. Aman untuk dijalankan ulang (IF NOT EXISTS).
-- =============================================================================

-- Dimensi: Kata Kunci Kategori & Niche Target
CREATE TABLE IF NOT EXISTS dim_category_keyword (
    keyword_id       SERIAL PRIMARY KEY,
    category_name    TEXT NOT NULL,
    sub_category     TEXT NOT NULL,
    search_keyword   TEXT NOT NULL UNIQUE,
    target_price_min NUMERIC(12, 2),
    target_price_max NUMERIC(12, 2),
    cost_category    TEXT DEFAULT 'default', -- merujuk ke config/cost_params.yaml
    is_active        BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dim_keyword_category ON dim_category_keyword(category_name);
CREATE INDEX IF NOT EXISTS idx_dim_keyword_active   ON dim_category_keyword(is_active);

COMMENT ON TABLE  dim_category_keyword IS 'Daftar niche/sub-kategori target yang dianalisis.';
COMMENT ON COLUMN dim_category_keyword.cost_category IS 'Key yang dipetakan ke cost_params.yaml untuk HPP & komisi.';

-- Dimensi: Produk Kompetitor
CREATE TABLE IF NOT EXISTS dim_competitor_product (
    product_id     TEXT PRIMARY KEY,
    keyword_id     INT REFERENCES dim_category_keyword(keyword_id) ON DELETE SET NULL,
    platform       TEXT NOT NULL DEFAULT 'tokopedia',
    product_name   TEXT,
    shop_name      TEXT,
    is_mall_seller BOOLEAN DEFAULT FALSE,
    location       TEXT,
    product_url    TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dim_product_keyword  ON dim_competitor_product(keyword_id);
CREATE INDEX IF NOT EXISTS idx_dim_product_platform ON dim_competitor_product(platform);
CREATE INDEX IF NOT EXISTS idx_dim_product_mall     ON dim_competitor_product(is_mall_seller);

COMMENT ON TABLE  dim_competitor_product IS 'Katalog produk kompetitor dari Kaggle dataset.';
COMMENT ON COLUMN dim_competitor_product.is_mall_seller IS 'TRUE jika toko adalah Official Store / Star Seller.';
