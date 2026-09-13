"""
pipeline/discovery/keyword_discovery.py
========================================
Menemukan niche potensial dengan menggabungkan dua sumber sinyal:
  1. TikTok Creative Center — export CSV manual (top keywords Indonesia)
  2. Google Trends via pytrends — validasi stabilitas & pertumbuhan tren

Output: kandidat keyword yang dimasukkan ke dim_category_keyword di Supabase.

Jalankan: python -m pipeline.discovery.keyword_discovery
"""

from __future__ import annotations

import csv
import json
import logging
import os
import time
from pathlib import Path
from typing import Optional

import pandas as pd
import yaml
from dotenv import load_dotenv
from pytrends.request import TrendReq
from sqlalchemy import create_engine, text

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
CONFIG    = yaml.safe_load((BASE_DIR / "config" / "keywords_discovery.yaml").read_text())
CACHE_DIR = BASE_DIR / "data" / "cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# 1. Baca seed keywords dari config
# ---------------------------------------------------------------------------

def load_seed_keywords() -> dict[str, list[str]]:
    """Kembalikan dict {category: [keywords]} dari keywords_discovery.yaml."""
    return CONFIG.get("seed_keywords", {})


# ---------------------------------------------------------------------------
# 2. Google Trends — dengan retry/backoff eksponensial
# ---------------------------------------------------------------------------

def fetch_trends_with_retry(
    keywords: list[str],
    geo: str = "ID",
    timeframe: str = "today 12-m",
    max_retries: int = 5,
) -> Optional[pd.DataFrame]:
    """
    Tarik interest_over_time dari pytrends.
    Retry eksponensial pada HTTP 429 / TooManyRequestsError.
    """
    pytrends = TrendReq(hl="id-ID", tz=420)  # UTC+7 WIB

    for attempt in range(1, max_retries + 1):
        try:
            pytrends.build_payload(keywords, timeframe=timeframe, geo=geo)
            df = pytrends.interest_over_time()
            if df.empty:
                log.warning("pytrends mengembalikan DataFrame kosong untuk: %s", keywords)
                return None
            return df.drop(columns=["isPartial"], errors="ignore")
        except Exception as exc:
            wait = 2 ** attempt
            log.warning(
                "pytrends error (attempt %d/%d): %s — retry in %ds",
                attempt, max_retries, exc, wait,
            )
            time.sleep(wait)

    log.error("pytrends gagal setelah %d retry untuk: %s", max_retries, keywords)
    return None


# ---------------------------------------------------------------------------
# 3. Hitung metrik stabilitas & pertumbuhan tren
# ---------------------------------------------------------------------------

def compute_trend_metrics(df: pd.DataFrame, keyword: str) -> dict:
    """
    Hitung:
      - avg_interest : rata-rata mingguan selama 12 bulan
      - volatility_cv: coefficient of variation (std/mean) — stabil jika < 0.3
      - growth_rate  : perbandingan rata-rata 4 minggu terakhir vs 4 minggu pertama
    """
    series = df[keyword].dropna()
    if series.empty or series.mean() == 0:
        return {"avg_interest": 0, "volatility_cv": 999, "growth_rate": 0}

    avg   = series.mean()
    cv    = series.std() / avg
    early = series.iloc[:4].mean() if len(series) >= 8 else avg
    late  = series.iloc[-4:].mean()
    growth = (late - early) / (early + 1e-9)

    return {
        "avg_interest":  round(float(avg), 2),
        "volatility_cv": round(float(cv), 4),
        "growth_rate":   round(float(growth), 4),
    }


# ---------------------------------------------------------------------------
# 4. Cache hasil trends per keyword
# ---------------------------------------------------------------------------

def save_cache(keyword: str, metrics: dict) -> None:
    cache_file = CACHE_DIR / f"trends_{keyword.replace(' ', '_')}.json"
    cache_file.write_text(json.dumps(metrics, ensure_ascii=False, indent=2))


def load_cache(keyword: str) -> Optional[dict]:
    cache_file = CACHE_DIR / f"trends_{keyword.replace(' ', '_')}.json"
    if cache_file.exists():
        return json.loads(cache_file.read_text())
    return None


# ---------------------------------------------------------------------------
# 5. Opsional: baca export CSV dari TikTok Creative Center
# ---------------------------------------------------------------------------

def load_tiktok_cc_csv(filepath: str) -> pd.DataFrame:
    """
    Baca file CSV hasil export manual dari TikTok Creative Center.
    Kolom yang diharapkan: keyword, popularity_score, growth_rate_7d
    Jika file tidak ada, kembalikan DataFrame kosong.
    """
    path = Path(filepath)
    if not path.exists():
        log.info("TikTok CC CSV tidak ditemukan: %s (opsional, di-skip)", filepath)
        return pd.DataFrame(columns=["keyword", "popularity_score", "growth_rate_7d"])

    df = pd.read_csv(path)
    log.info("TikTok CC: %d keyword dimuat dari %s", len(df), filepath)
    return df


# ---------------------------------------------------------------------------
# 6. Filter & scoring kandidat keyword
# ---------------------------------------------------------------------------

def score_keyword_candidates(metrics_list: list[dict]) -> pd.DataFrame:
    """
    Filter dan ranking keyword berdasarkan:
      - avg_interest >= min_avg_interest (dari config)
      - volatility_cv < stability_cv_threshold (dari config)
    Kemudian urutkan berdasarkan growth_rate DESC.
    """
    cfg = CONFIG.get("pytrends", {})
    min_interest = cfg.get("min_avg_interest", 20)
    cv_threshold = cfg.get("stability_cv_threshold", 0.3)

    df = pd.DataFrame(metrics_list)
    if df.empty:
        return df

    filtered = df[
        (df["avg_interest"] >= min_interest) &
        (df["volatility_cv"] < cv_threshold)
    ].sort_values("growth_rate", ascending=False)

    log.info(
        "Keyword discovery: %d dari %d kandidat lolos filter (CV < %.1f, avg_interest >= %d)",
        len(filtered), len(df), cv_threshold, min_interest,
    )
    return filtered


# ---------------------------------------------------------------------------
# 7. Upsert kandidat ke Supabase dim_category_keyword
# ---------------------------------------------------------------------------

def upsert_to_supabase(candidates: pd.DataFrame, category_name: str, cost_category: str = "default") -> int:
    """
    Insert kandidat ke dim_category_keyword.
    ON CONFLICT DO NOTHING — aman untuk dijalankan berulang.
    """
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        log.warning("DATABASE_URL tidak ditemukan — skip upsert ke Supabase.")
        return 0

    engine = create_engine(database_url)
    inserted = 0

    with engine.begin() as conn:
        for _, row in candidates.iterrows():
            result = conn.execute(
                text("""
                    INSERT INTO dim_category_keyword
                        (category_name, sub_category, search_keyword, cost_category)
                    VALUES (:cat, :sub, :kw, :cc)
                    ON CONFLICT (search_keyword) DO NOTHING
                """),
                {
                    "cat": category_name,
                    "sub": row.get("sub_category", category_name),
                    "kw":  row["keyword"],
                    "cc":  cost_category,
                },
            )
            inserted += result.rowcount

    log.info("Upsert selesai: %d keyword baru ditambahkan ke dim_category_keyword", inserted)
    return inserted


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def run_discovery(tiktok_csv_path: str = "data/raw/tiktok_cc_keywords.csv") -> pd.DataFrame:
    """Jalankan full discovery pipeline. Kembalikan DataFrame kandidat."""
    pytrends_cfg = CONFIG.get("pytrends", {})
    max_per_run  = pytrends_cfg.get("max_keywords_per_run", 5)
    geo          = pytrends_cfg.get("geo", "ID")
    timeframe    = pytrends_cfg.get("timeframe", "today 12-m")

    all_metrics: list[dict] = []

    for category, keywords in load_seed_keywords().items():
        log.info("=== Kategori: %s (%d keyword) ===", category, len(keywords))

        # Batch maks 5 keyword per pytrends request
        for i in range(0, len(keywords), max_per_run):
            batch = keywords[i : i + max_per_run]
            log.info("Batch: %s", batch)

            df_trends = fetch_trends_with_retry(batch, geo=geo, timeframe=timeframe)

            for kw in batch:
                if df_trends is not None and kw in df_trends.columns:
                    metrics = compute_trend_metrics(df_trends, kw)
                else:
                    # Gunakan cache sebagai fallback
                    cached = load_cache(kw)
                    if cached:
                        log.info("Menggunakan cache untuk keyword: %s", kw)
                        metrics = cached
                    else:
                        log.warning("Tidak ada data untuk keyword: %s — di-skip.", kw)
                        continue

                metrics.update({"keyword": kw, "category": category, "sub_category": category})
                save_cache(kw, metrics)
                all_metrics.append(metrics)

            # Jeda antar batch untuk hindari rate-limit
            time.sleep(3)

    candidates = score_keyword_candidates(all_metrics)

    # Simpan hasil ke Supabase (per kategori)
    if not candidates.empty:
        for category in candidates["category"].unique():
            subset = candidates[candidates["category"] == category]
            upsert_to_supabase(subset, category_name=category, cost_category=category)

    return candidates


if __name__ == "__main__":
    result = run_discovery()
    print("\n=== Top Keyword Candidates ===")
    print(result[["keyword", "category", "avg_interest", "volatility_cv", "growth_rate"]].to_string(index=False))
