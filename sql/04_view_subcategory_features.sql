-- =============================================================================
-- 04_view_subcategory_features.sql — View Agregasi Fitur per Sub-Kategori
-- Database: Supabase PostgreSQL
--
-- View ini adalah JEMBATAN antara raw data dan scoring engine Python.
-- Tanpa view ini, kolom seperti monthly_sold_units, search_trend_index,
-- mall_seller_ratio tidak pernah tersedia untuk fungsi scoring di pipeline.
-- =============================================================================

CREATE OR REPLACE VIEW vw_subcategory_features AS
SELECT
    k.keyword_id,
    k.category_name,
    k.sub_category,
    k.search_keyword,
    k.cost_category,

    -- Sinyal Demand: rata-rata indeks tren & total penjualan bulanan
    COALESCE(AVG(s.search_trend_index), 0)          AS search_trend_index,
    COALESCE(SUM(s.units_sold_monthly), 0)           AS monthly_sold_units,

    -- Sinyal Kompetisi: proporsi Mall Seller & rata-rata jumlah ulasan
    COALESCE(AVG(p.is_mall_seller::int), 0)          AS mall_seller_ratio,
    COALESCE(
        AVG(r_agg.review_count), 0
    )                                                AS avg_review_count,

    -- Sinyal Harga: median harga (lebih robust terhadap outlier vs rata-rata)
    COALESCE(
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY s.price),
        0
    )                                                AS median_price,

    -- Sinyal Gap: proporsi ulasan negatif (rating <= 2)
    COALESCE(
        AVG(CASE WHEN r.rating <= 2 THEN 1.0 ELSE 0.0 END),
        0
    )                                                AS negative_review_rate,

    -- Metadata
    COUNT(DISTINCT p.product_id)                     AS n_products,
    COUNT(DISTINCT r.review_id)                      AS n_reviews,
    MAX(s.snapshot_date)                             AS latest_snapshot_date

FROM dim_category_keyword k
LEFT JOIN dim_competitor_product p   ON p.keyword_id = k.keyword_id
LEFT JOIN fact_product_snapshot s    ON s.product_id = p.product_id
LEFT JOIN fact_customer_reviews r    ON r.product_id = p.product_id
LEFT JOIN (
    -- Sub-query: hitung jumlah ulasan per produk untuk avg_review_count
    SELECT product_id, COUNT(*) AS review_count
    FROM fact_customer_reviews
    GROUP BY product_id
) r_agg ON r_agg.product_id = p.product_id

WHERE k.is_active = TRUE

GROUP BY
    k.keyword_id,
    k.category_name,
    k.sub_category,
    k.search_keyword,
    k.cost_category;

COMMENT ON VIEW vw_subcategory_features IS
    'Agregasi fitur per sub-kategori. Input langsung untuk scoring engine Python (pipeline/scoring/feature_aggregation.py).';
