-- =============================================================================
-- 04_view_subcategory_features.sql — View Agregasi Fitur per Sub-Kategori
-- Database: Supabase PostgreSQL
--
-- View ini adalah JEMBATAN antara raw data dan scoring engine Python.
-- Fix v2 (2026-09-15):
--   - Gunakan CTE latest_snapshot (DISTINCT ON product_id ORDER BY snapshot_date DESC)
--     untuk mengambil snapshot aktif terkini.
--   - Cegah fan-out / Cartesian join antara fact_product_snapshot dan fact_customer_reviews
--     sehingga monthly_sold_units dan median_price akurat mencerminkan snapshot pasar terbaru.
-- =============================================================================

CREATE OR REPLACE VIEW vw_subcategory_features AS
WITH latest_snapshot AS (
    SELECT DISTINCT ON (product_id)
        product_id,
        snapshot_date,
        price,
        units_sold_monthly,
        search_trend_index
    FROM fact_product_snapshot
    ORDER BY product_id, snapshot_date DESC
),
review_agg AS (
    SELECT
        product_id,
        COUNT(*) AS review_count,
        SUM(CASE WHEN rating <= 2 THEN 1.0 ELSE 0.0 END) AS neg_count
    FROM fact_customer_reviews
    GROUP BY product_id
),
product_base AS (
    SELECT
        p.product_id,
        p.keyword_id,
        p.is_mall_seller,
        s.price,
        s.units_sold_monthly,
        s.search_trend_index,
        s.snapshot_date,
        COALESCE(r.review_count, 0) AS review_count,
        COALESCE(r.neg_count, 0) AS neg_count
    FROM dim_competitor_product p
    LEFT JOIN latest_snapshot s ON s.product_id = p.product_id
    LEFT JOIN review_agg r ON r.product_id = p.product_id
)
SELECT
    k.keyword_id,
    k.category_name,
    k.sub_category,
    k.search_keyword,
    k.cost_category,

    -- Sinyal Demand: rata-rata indeks tren & total penjualan bulanan dari snapshot aktif terbaru
    COALESCE(AVG(pb.search_trend_index), 0)         AS search_trend_index,
    COALESCE(SUM(pb.units_sold_monthly), 0)         AS monthly_sold_units,

    -- Sinyal Kompetisi: proporsi Mall Seller & rata-rata jumlah ulasan
    COALESCE(AVG(pb.is_mall_seller::int), 0)        AS mall_seller_ratio,
    COALESCE(AVG(pb.review_count), 0)               AS avg_review_count,

    -- Sinyal Harga: median harga snapshot aktif terbaru (konsisten dengan vw_category_analytics)
    COALESCE(
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY pb.price),
        0
    )                                               AS median_price,

    -- Sinyal Gap: proporsi ulasan negatif (rating <= 2)
    COALESCE(
        (SUM(pb.neg_count)::numeric / NULLIF(SUM(pb.review_count), 0)),
        0
    )::numeric                                      AS negative_review_rate,

    -- Metadata
    COUNT(DISTINCT pb.product_id)                   AS n_products,
    COALESCE(SUM(pb.review_count), 0)::int          AS n_reviews,
    MAX(pb.snapshot_date)                           AS latest_snapshot_date

FROM dim_category_keyword k
LEFT JOIN product_base pb ON pb.keyword_id = k.keyword_id

WHERE k.is_active = TRUE

GROUP BY
    k.keyword_id,
    k.category_name,
    k.sub_category,
    k.search_keyword,
    k.cost_category;

COMMENT ON VIEW vw_subcategory_features IS
    'Agregasi fitur per sub-kategori berbasis snapshot aktif terbaru. Input langsung untuk scoring engine Python (pipeline/scoring/feature_aggregation.py).';
