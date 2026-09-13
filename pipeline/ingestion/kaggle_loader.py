"""
pipeline/ingestion/kaggle_loader.py
=====================================
Load & validasi dataset Kaggle ke Supabase.
Strategi: Zero-scraping — gunakan dataset publik e-commerce Indonesia dari Kaggle.

Dataset yang diharapkan di data/raw/:
  - products.csv  : listing produk kompetitor
  - reviews.csv   : ulasan pelanggan

Kolom minimum yang dibutuhkan:
  products: product_id, product_name, price, item_sold, rating_avg, shop_name, shop_type, location
  reviews : review_id, product_id, rating_star, review_text

Jalankan: python -m pipeline.ingestion.kaggle_loader
"""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Optional

import pandas as pd
import yaml
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

BASE_DIR   = Path(__file__).resolve().parents[2]
RAW_DIR    = BASE_DIR / "data" / "raw"

# Kolom wajib yang harus ada di dataset Kaggle
REQUIRED_PRODUCT_COLS = {"product_id", "product_name", "price", "item_sold", "shop_name", "shop_type", "location"}
REQUIRED_REVIEW_COLS  = {"review_id", "product_id", "rating_star", "review_text"}


# ---------------------------------------------------------------------------
# 1. Baca & validasi file CSV
# ---------------------------------------------------------------------------

def load_products_csv(filepath: str = "data/raw/products.csv") -> Optional[pd.DataFrame]:
    path = BASE_DIR / filepath
    if not path.exists():
        fallback = BASE_DIR / "data" / "sample" / "products_sample.csv"
        if fallback.exists():
            log.info("Menggunakan fallback sampel: %s", fallback)
            path = fallback
        else:
            log.error("File produk tidak ditemukan: %s", path)
            return None

    df = pd.read_csv(path, dtype={"product_id": str})
    log.info("Dimuat: %d baris dari %s", len(df), path.name)

    missing = REQUIRED_PRODUCT_COLS - set(df.columns)
    if missing:
        log.error("Kolom wajib hilang di products.csv: %s", missing)
        return None

    return df


def load_reviews_csv(filepath: str = "data/raw/reviews.csv") -> Optional[pd.DataFrame]:
    path = BASE_DIR / filepath
    if not path.exists():
        fallback = BASE_DIR / "data" / "sample" / "reviews_sample.csv"
        if fallback.exists():
            log.info("Menggunakan fallback sampel: %s", fallback)
            path = fallback
        else:
            log.error("File ulasan tidak ditemukan: %s", path)
            return None

    df = pd.read_csv(path, dtype={"product_id": str, "review_id": str})
    log.info("Dimuat: %d baris dari %s", len(df), path.name)

    missing = REQUIRED_REVIEW_COLS - set(df.columns)
    if missing:
        log.error("Kolom wajib hilang di reviews.csv: %s", missing)
        return None

    return df


# ---------------------------------------------------------------------------
# 2. Transformasi — mapping kolom Kaggle → skema internal
# ---------------------------------------------------------------------------

def transform_products(df: pd.DataFrame, keyword_id: Optional[int] = None) -> pd.DataFrame:
    """
    Map kolom Kaggle ke skema dim_competitor_product + fact_product_snapshot.
    shop_type 'official' / 'star' → is_mall_seller = True
    """
    df = df.copy()
    df["product_id"]  = df["product_id"].astype(str).str.strip()
    df["price"]       = pd.to_numeric(df["price"], errors="coerce")
    df["item_sold"]   = pd.to_numeric(df["item_sold"].astype(str).str.replace(r"[^\d]", "", regex=True), errors="coerce")
    df["is_mall_seller"] = df["shop_type"].str.lower().str.contains("official|star|mall", na=False)
    if "keyword_id" not in df.columns:
        df["keyword_id"] = keyword_id

    # Hapus duplikat product_id
    before = len(df)
    df = df.drop_duplicates(subset=["product_id"])
    if len(df) < before:
        log.info("Deduplikasi: %d baris duplikat dihapus dari products", before - len(df))

    return df


def transform_reviews(df: pd.DataFrame) -> pd.DataFrame:
    """Map kolom Kaggle ke skema fact_customer_reviews."""
    df = df.copy()
    df["product_id"] = df["product_id"].astype(str).str.strip()
    df["rating"]     = pd.to_numeric(df["rating_star"], errors="coerce").astype("Int64")
    df["review_text"] = df["review_text"].fillna("").astype(str).str[:2000]  # truncate panjang

    # Hapus ulasan tanpa product_id atau rating valid
    before = len(df)
    df = df.dropna(subset=["product_id", "rating"])
    df = df[df["rating"].between(1, 5)]
    if len(df) < before:
        log.info("Filtering: %d ulasan tidak valid dihapus", before - len(df))

    return df


# ---------------------------------------------------------------------------
# 3. Upsert ke Supabase dengan idempotency
# ---------------------------------------------------------------------------

def upsert_products(df: pd.DataFrame, engine) -> tuple[int, int]:
    """Insert produk ke dim_competitor_product + fact_product_snapshot."""
    inserted_dim = 0
    inserted_fact = 0

    dim_cols  = ["product_id", "keyword_id", "product_name", "shop_name", "is_mall_seller", "location"]
    fact_cols = ["product_id", "price", "item_sold"]

    with engine.begin() as conn:
        for _, row in df.iterrows():
            # dim_competitor_product — ON CONFLICT DO UPDATE
            res = conn.execute(
                text("""
                    INSERT INTO dim_competitor_product
                        (product_id, keyword_id, product_name, shop_name, is_mall_seller, location)
                    VALUES (:pid, :kid, :pname, :sname, :mall, :loc)
                    ON CONFLICT (product_id) DO UPDATE
                    SET keyword_id = EXCLUDED.keyword_id,
                        product_name = EXCLUDED.product_name,
                        shop_name = EXCLUDED.shop_name,
                        is_mall_seller = EXCLUDED.is_mall_seller,
                        location = EXCLUDED.location
                """),
                {
                    "pid":   str(row["product_id"]),
                    "kid":   row.get("keyword_id"),
                    "pname": row.get("product_name", ""),
                    "sname": row.get("shop_name", ""),
                    "mall":  bool(row.get("is_mall_seller", False)),
                    "loc":   row.get("location", ""),
                },
            )
            inserted_dim += res.rowcount

            # fact_product_snapshot — UNIQUE(product_id, snapshot_date) → idempotent
            res = conn.execute(
                text("""
                    INSERT INTO fact_product_snapshot
                        (product_id, snapshot_date, price, units_sold_monthly)
                    VALUES (:pid, CURRENT_DATE, :price, :sold)
                    ON CONFLICT (product_id, snapshot_date) DO UPDATE
                    SET price = EXCLUDED.price,
                        units_sold_monthly = EXCLUDED.units_sold_monthly
                """),
                {
                    "pid":   str(row["product_id"]),
                    "price": float(row.get("price") or 0),
                    "sold":  int(row.get("item_sold") or 0),
                },
            )
            inserted_fact += res.rowcount

    log.info("Produk: %d dim baru, %d snapshot baru", inserted_dim, inserted_fact)
    return inserted_dim, inserted_fact


def upsert_reviews(df: pd.DataFrame, engine) -> int:
    """Insert ulasan ke fact_customer_reviews. Sentiment & aspects diisi oleh NLP pipeline."""
    inserted = 0

    with engine.begin() as conn:
        for _, row in df.iterrows():
            res = conn.execute(
                text("""
                    INSERT INTO fact_customer_reviews
                        (product_id, rating, review_text)
                    VALUES (:pid, :rating, :text)
                    ON CONFLICT DO NOTHING
                """),
                {
                    "pid":    str(row["product_id"]),
                    "rating": int(row["rating"]),
                    "text":   str(row.get("review_text", "")),
                },
            )
            inserted += res.rowcount

    log.info("Ulasan: %d baris baru diinsert ke fact_customer_reviews", inserted)
    return inserted


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def run_kaggle_loader(
    products_path: str = "data/raw/products.csv",
    reviews_path:  str = "data/raw/reviews.csv",
) -> dict:
    """Jalankan full load & upsert. Kembalikan ringkasan statistik."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise EnvironmentError("DATABASE_URL belum di-set di environment / .env")

    engine = create_engine(database_url)

    # Load
    df_products = load_products_csv(products_path)
    df_reviews  = load_reviews_csv(reviews_path)

    stats = {"products_inserted": 0, "snapshots_inserted": 0, "reviews_inserted": 0}

    # Transform & upsert products
    if df_products is not None:
        df_products = transform_products(df_products)
        ins_dim, ins_snap = upsert_products(df_products, engine)
        stats["products_inserted"]  = ins_dim
        stats["snapshots_inserted"] = ins_snap

    # Transform & upsert reviews
    if df_reviews is not None:
        df_reviews = transform_reviews(df_reviews)
        stats["reviews_inserted"] = upsert_reviews(df_reviews, engine)

    log.info("Kaggle loader selesai: %s", stats)
    return stats


if __name__ == "__main__":
    result = run_kaggle_loader()
    print("\n=== Kaggle Loader Summary ===")
    for k, v in result.items():
        print(f"  {k}: {v:,}")
