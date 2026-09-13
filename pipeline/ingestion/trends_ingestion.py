"""
pipeline/ingestion/trends_ingestion.py
=========================================
Mengambil tren penelusuran historis 12 bulan dari Google Trends via pytrends
untuk setiap keyword aktif di dim_category_keyword.

Fitur:
  - Retry eksponensial (max 5x) untuk handle HTTP 429
  - Cache JSON per keyword sebagai fallback jika pytrends gagal
  - Hitung volatility_cv dan update ke fact_product_snapshot.search_trend_index
  - Batasi <= 5 keyword per sesi pytrends

Jalankan: python -m pipeline.ingestion.trends_ingestion
"""

from __future__ import annotations

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

BASE_DIR  = Path(__file__).resolve().parents[2]
CONFIG    = yaml.safe_load((BASE_DIR / "config" / "keywords_discovery.yaml").read_text())
CACHE_DIR = BASE_DIR / "data" / "cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

PYTRENDS_CFG  = CONFIG.get("pytrends", {})
MAX_PER_RUN   = PYTRENDS_CFG.get("max_keywords_per_run", 5)
GEO           = PYTRENDS_CFG.get("geo", "ID")
TIMEFRAME     = PYTRENDS_CFG.get("timeframe", "today 12-m")


# ---------------------------------------------------------------------------
# 1. Ambil keyword aktif dari Supabase
# ---------------------------------------------------------------------------

def fetch_active_keywords(engine) -> list[dict]:
    with engine.connect() as conn:
        rows = conn.execute(
            text("SELECT keyword_id, search_keyword FROM dim_category_keyword WHERE is_active = TRUE")
        ).mappings().all()
    return [dict(r) for r in rows]


# ---------------------------------------------------------------------------
# 2. pytrends dengan retry eksponensial
# ---------------------------------------------------------------------------

def fetch_trends(
    keywords: list[str],
    max_retries: int = 5,
) -> Optional[pd.DataFrame]:
    """Tarik interest_over_time. Retry eksponensial pada error."""
    pytrends = TrendReq(hl="id-ID", tz=420)

    for attempt in range(1, max_retries + 1):
        try:
            pytrends.build_payload(keywords, timeframe=TIMEFRAME, geo=GEO)
            df = pytrends.interest_over_time()
            if df.empty:
                log.warning("pytrends: data kosong untuk %s", keywords)
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
# 3. Cache per keyword
# ---------------------------------------------------------------------------

def cache_path(keyword: str) -> Path:
    return CACHE_DIR / f"trends_{keyword.replace(' ', '_')}.json"


def save_to_cache(keyword: str, data: dict) -> None:
    cache_path(keyword).write_text(json.dumps(data, ensure_ascii=False, indent=2))


def load_from_cache(keyword: str) -> Optional[dict]:
    p = cache_path(keyword)
    if p.exists():
        log.info("Menggunakan cache fallback untuk: %s", keyword)
        return json.loads(p.read_text())
    return None


# ---------------------------------------------------------------------------
# 4. Hitung metrik dari series trends
# ---------------------------------------------------------------------------

def compute_metrics(series: pd.Series) -> dict:
    if series.empty or series.mean() == 0:
        return {"avg_interest": 0.0, "volatility_cv": 999.0, "latest_index": 0.0}

    avg       = float(series.mean())
    cv        = float(series.std() / avg) if avg > 0 else 999.0
    latest    = float(series.iloc[-1])
    return {
        "avg_interest":  round(avg, 2),
        "volatility_cv": round(cv, 4),
        "latest_index":  round(latest, 2),
    }


# ---------------------------------------------------------------------------
# 5. Update search_trend_index ke fact_product_snapshot
# ---------------------------------------------------------------------------

def update_trend_index(keyword_id: int, latest_index: float, engine) -> None:
    """
    Update search_trend_index pada snapshot hari ini untuk semua produk
    yang terhubung ke keyword_id ini.
    """
    with engine.begin() as conn:
        conn.execute(
            text("""
                UPDATE fact_product_snapshot fps
                SET search_trend_index = :idx
                FROM dim_competitor_product dcp
                WHERE fps.product_id = dcp.product_id
                  AND dcp.keyword_id = :kid
                  AND fps.snapshot_date = CURRENT_DATE
            """),
            {"idx": latest_index, "kid": keyword_id},
        )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def run_trends_ingestion() -> list[dict]:
    """
    Jalankan ingestion trends untuk semua keyword aktif.
    Kembalikan list hasil metrik per keyword.
    """
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise EnvironmentError("DATABASE_URL belum di-set.")

    engine   = create_engine(database_url)
    keywords = fetch_active_keywords(engine)
    log.info("Keyword aktif: %d", len(keywords))

    results = []

    # Batch sesuai batas pytrends
    for i in range(0, len(keywords), MAX_PER_RUN):
        batch = keywords[i : i + MAX_PER_RUN]
        kw_names = [b["search_keyword"] for b in batch]

        log.info("Batch %d/%d: %s", i // MAX_PER_RUN + 1, -(-len(keywords) // MAX_PER_RUN), kw_names)

        df_trends = fetch_trends(kw_names)

        for item in batch:
            kw   = item["search_keyword"]
            kid  = item["keyword_id"]

            if df_trends is not None and kw in df_trends.columns:
                metrics = compute_metrics(df_trends[kw])
                save_to_cache(kw, metrics)
            else:
                cached = load_from_cache(kw)
                if cached:
                    metrics = cached
                else:
                    log.warning("Tidak ada data untuk %s — di-skip", kw)
                    continue

            update_trend_index(kid, metrics["latest_index"], engine)
            results.append({"keyword": kw, "keyword_id": kid, **metrics})
            log.info("  %-30s avg=%.1f  cv=%.3f  latest=%.1f",
                     kw, metrics["avg_interest"], metrics["volatility_cv"], metrics["latest_index"])

        time.sleep(3)  # Jeda antar batch

    log.info("Trends ingestion selesai: %d keyword diproses.", len(results))
    return results


if __name__ == "__main__":
    rows = run_trends_ingestion()
    print("\n=== Trends Ingestion Results ===")
    for r in rows:
        print(f"  {r['keyword']:<30} avg={r['avg_interest']:.1f}  cv={r['volatility_cv']:.3f}")
