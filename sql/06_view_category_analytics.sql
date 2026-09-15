-- =============================================================================
-- 06_view_category_analytics.sql — View Analitik Dinamis per Kategori
-- Database: Supabase PostgreSQL
--
-- Fix v2 (2026-09-15):
--   - Ganti JSON_AGG → JSONB_AGG (jsonb punya equality operator, json tidak)
--   - Pindahkan window MAX ke CTE terpisah (global_max) agar tidak perlu
--     self-join JOIN ... ON TRUE yang menyebabkan GROUP BY error
--   - Hapus top_cities dari GROUP BY (aggregate dengan MAX()::jsonb)
-- =============================================================================

CREATE OR REPLACE VIEW vw_category_analytics AS
WITH

-- ── CTE 1: Basis produk dengan kategori ──────────────────────────────────────
product_base AS (
  SELECT
    p.product_id,
    p.keyword_id,
    p.location        AS seller_city,
    p.is_mall_seller,
    k.category_name,
    k.sub_category,
    k.cost_category
  FROM dim_competitor_product p
  JOIN dim_category_keyword k ON k.keyword_id = p.keyword_id
  WHERE k.is_active = TRUE
),

-- ── CTE 2: Snapshot terbaru per produk ───────────────────────────────────────
latest_snapshot AS (
  SELECT DISTINCT ON (product_id)
    product_id,
    price,
    units_sold_monthly,
    snapshot_date
  FROM fact_product_snapshot
  ORDER BY product_id, snapshot_date DESC
),

-- ── CTE 3: Metrik review per produk ─────────────────────────────────────────
review_metrics AS (
  SELECT
    product_id,
    COUNT(*)                                          AS review_count,
    AVG(rating)                                       AS avg_rating,
    SUM(CASE WHEN rating <= 2 THEN 1 ELSE 0 END)      AS neg_count,
    SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END)      AS pos_count,
    AVG(COALESCE(sentiment_score, 0))                 AS avg_sentiment
  FROM fact_customer_reviews
  GROUP BY product_id
),

-- ── CTE 4: Distribusi kota seller per kategori ───────────────────────────────
city_dist AS (
  SELECT
    category_name,
    seller_city,
    COUNT(*) AS product_count
  FROM product_base
  WHERE seller_city IS NOT NULL AND seller_city <> ''
  GROUP BY category_name, seller_city
),

-- ── CTE 5: Rank kota per kategori ────────────────────────────────────────────
city_ranked AS (
  SELECT
    category_name,
    seller_city,
    product_count,
    RANK() OVER (PARTITION BY category_name ORDER BY product_count DESC) AS city_rank
  FROM city_dist
),

-- ── CTE 6: Top-3 cities per category sebagai JSONB array ─────────────────────
-- Menggunakan JSONB (bukan JSON) agar punya equality operator untuk GROUP BY
city_top3 AS (
  SELECT
    category_name,
    JSONB_AGG(
      JSONB_BUILD_OBJECT('city', seller_city, 'count', product_count)
      ORDER BY city_rank
    ) AS top_cities
  FROM city_ranked
  WHERE city_rank <= 3
  GROUP BY category_name
),

-- ── CTE 7: Agregat per kategori ──────────────────────────────────────────────
category_agg AS (
  SELECT
    pb.category_name,
    COUNT(DISTINCT pb.product_id)                             AS n_products,
    COUNT(DISTINCT pb.keyword_id)                             AS n_keywords,
    COALESCE(SUM(ls.units_sold_monthly), 0)                   AS total_units_monthly,
    COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ls.price), 0) AS median_price,
    COALESCE(AVG(pb.is_mall_seller::int), 0)                  AS mall_seller_ratio,
    COALESCE(AVG(rm.review_count), 0)                         AS avg_review_count,
    COALESCE(AVG(rm.avg_rating), 0)                           AS avg_rating,
    COALESCE(
      SUM(rm.neg_count)::float / NULLIF(SUM(rm.review_count), 0), 0
    )                                                          AS negative_review_rate,
    COALESCE(
      SUM(rm.pos_count)::float / NULLIF(SUM(rm.review_count), 0), 0
    )                                                          AS positive_review_rate,
    COALESCE(AVG(rm.avg_sentiment), 0)                        AS avg_sentiment_score
  FROM product_base pb
  LEFT JOIN latest_snapshot ls ON ls.product_id = pb.product_id
  LEFT JOIN review_metrics rm  ON rm.product_id = pb.product_id
  GROUP BY pb.category_name
),

-- ── CTE 8: Global max untuk normalisasi RFM score (terpisah dari CTE 7) ──────
-- Dipisah agar tidak perlu self-join JOIN ... ON TRUE yang memperumit GROUP BY
global_max AS (
  SELECT
    MAX(total_units_monthly) AS max_units,
    MAX(median_price)        AS max_price
  FROM category_agg
)

-- ── Final SELECT ──────────────────────────────────────────────────────────────
-- top_cities tidak perlu masuk GROUP BY karena diambil via LEFT JOIN 1:1
-- pada category_name (yang sudah ada di GROUP BY)
SELECT
  ca.category_name,
  ca.n_products,
  ca.n_keywords,
  ca.total_units_monthly,
  ca.median_price,
  ca.mall_seller_ratio,
  ca.avg_review_count,
  ca.avg_rating,
  ca.negative_review_rate,
  ca.positive_review_rate,
  ca.avg_sentiment_score,

  -- RFM Proxy — skala 1–5
  -- R: berbasis positive review rate (proxy kepuasan / loyalitas pembeli)
  ROUND(
    LEAST(5, GREATEST(1,
      1 + (ca.positive_review_rate * 4)
    ))::numeric, 1
  )                                                                AS rfm_recency_score,

  -- F: total unit per bulan → proxy frekuensi beli kategori
  ROUND(
    LEAST(5, GREATEST(1,
      1 + (ca.total_units_monthly::float / NULLIF(gm.max_units, 0) * 4)
    ))::numeric, 1
  )                                                                AS rfm_frequency_score,

  -- M: median harga → proxy monetary value
  ROUND(
    LEAST(5, GREATEST(1,
      1 + (ca.median_price / NULLIF(gm.max_price, 0) * 4)
    ))::numeric, 1
  )                                                                AS rfm_monetary_score,

  -- AOV string untuk display
  'Rp ' || TO_CHAR(ca.median_price, 'FM999,999') || ' median'      AS rfm_monetary_display,

  -- Estimasi retention rate dari positive review rate
  ROUND((ca.positive_review_rate * 100)::numeric, 0)               AS est_retention_rate,

  ct.top_cities

FROM category_agg ca
CROSS JOIN global_max gm
LEFT JOIN city_top3 ct ON ct.category_name = ca.category_name;

COMMENT ON VIEW vw_category_analytics IS
  'Analitik dinamis per kategori: supply origin, rating distribution, dan RFM proxy. '
  'Menggantikan data hardcoded di analyticsProfiles.ts. '
  'Age/gender tidak tersedia dari dataset → tetap gunakan estimated static profile di UI.';
