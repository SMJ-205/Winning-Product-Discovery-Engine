"""
pipeline/scoring/feature_aggregation.py
==========================================
Membaca view vw_subcategory_features dari Supabase dan mengembalikan
DataFrame yang siap digunakan oleh scoring engine (winning_product_score.py).

View ini adalah JEMBATAN antara raw data dan algoritma Python — tanpa ini,
kolom seperti monthly_sold_units, search_trend_index, mall_seller_ratio tidak
pernah tersedia.
"""

from __future__ import annotations

import logging
import os

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()
log = logging.getLogger(__name__)


def fetch_subcategory_features(engine=None) -> pd.DataFrame:
    """
    Baca vw_subcategory_features dari Supabase.
    Kembalikan DataFrame dengan kolom:
      keyword_id, category_name, sub_category, search_keyword, cost_category,
      search_trend_index, monthly_sold_units, mall_seller_ratio,
      avg_review_count, median_price, negative_review_rate,
      n_products, n_reviews, latest_snapshot_date
    """
    if engine is None:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise EnvironmentError("DATABASE_URL belum di-set.")
        engine = create_engine(database_url)

    df = pd.read_sql("SELECT * FROM vw_subcategory_features;", engine)

    if df.empty:
        log.warning("vw_subcategory_features mengembalikan DataFrame kosong — cek pipeline ingestion.")
        return df

    log.info(
        "Feature aggregation: %d sub-kategori dimuat dari vw_subcategory_features.",
        len(df),
    )
    return df
