"""
pipeline/run_all.py
======================
Entry point orkestrasi seluruh pipeline.
Urutan eksekusi:
  1. kaggle_loader        — load & upsert listing + review dari Kaggle
  2. trends_ingestion     — tarik Google Trends per keyword aktif
  3. nlp_pipeline         — isi sentiment_score & complaint_aspects
  4. feature_aggregation  — baca vw_subcategory_features (via scoring engine)
  5. winning_product_score— hitung WPS, baca HPP/komisi dari YAML
  6. data_quality_checks  — validasi sebelum tulis ke fact_sourcing_opportunity
  7. (scoring engine sudah save hasilnya di langkah 5 jika checks lolos)

Jalankan: python pipeline/run_all.py
"""

from __future__ import annotations

import logging
import os
import sys
from datetime import datetime
from pathlib import Path

# Pastikan root direktori selalu ada di sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger("run_all")


def main() -> None:
    run_id = os.getenv("GITHUB_RUN_ID", f"local-{datetime.now().strftime('%Y%m%d%H%M%S')}")
    log.info("=" * 60)
    log.info("Pipeline run dimulai. Run ID: %s", run_id)
    log.info("=" * 60)

    # ── Step 1: Google Trends Ingestion ──────────────────────────────────
    log.info("[1/6] Google Trends Ingestion (Omnichannel Demand)")
    try:
        from pipeline.ingestion.trends_ingestion import run_trends_ingestion
        trends_results = run_trends_ingestion()
        log.info("Trends ingestion selesai: %d keyword diproses", len(trends_results))
    except Exception as exc:
        log.warning("Trends ingestion gagal (non-fatal, menggunakan cache): %s", exc)

    # ── Step 1b: TikTok Creative Center Weekly Trends ───────────────────
    log.info("[1b/6] TikTok Creative Center Weekly Ingestion")
    try:
        # Otomasi ekstraksi & update data/raw/tiktok_weekly_trends.csv via Playwright
        try:
            from scripts.fetch_tiktok_trends import run_tiktok_trend_extraction
            extract_stat = run_tiktok_trend_extraction(headless=True)
            log.info("Otomasi TikTok CSV: %d baris diperbarui otomatis", extract_stat.get("rows_count", 0))
        except Exception as exc:
            log.warning("Otomasi ekstraksi TikTok Playwright dilewati (%s) — beralih ke file CSV lokal/baseline", exc)

        from pipeline.ingestion.tiktok_trends import run_tiktok_trends_ingestion
        tiktok_results = run_tiktok_trends_ingestion()
        log.info("TikTok trends selesai: %d keyword diproses", len(tiktok_results))
    except Exception as exc:
        log.warning("TikTok trends gagal (non-fatal): %s", exc)

    # ── Step 2: Dynamic Weekly Market & Kaggle Loader ────────────────────
    log.info("[2/6] Market Snapshot & Product Loader (Weekly Dynamic Evolution)")
    try:
        from pipeline.ingestion.kaggle_loader import run_kaggle_loader
        stats = run_kaggle_loader()
        log.info("Market loader selesai: %s", stats)
    except Exception as exc:
        log.error("Market loader gagal: %s", exc)
        sys.exit(1)

    # ── Step 3: NLP Pipeline ──────────────────────────────────────────────
    log.info("[3/6] NLP Pipeline")
    try:
        from pipeline.processing.nlp_pipeline import run_nlp_pipeline
        nlp_stats = run_nlp_pipeline(batch_size=500)
        log.info("NLP pipeline selesai: %s", nlp_stats)
    except Exception as exc:
        log.error("NLP pipeline gagal: %s", exc)
        sys.exit(1)

    # ── Step 4 & 5: Feature Aggregation + Scoring ────────────────────────
    log.info("[4-5/6] Feature Aggregation + WPS Scoring")
    try:
        from pipeline.scoring.feature_aggregation import fetch_subcategory_features
        from pipeline.scoring.winning_product_score import calculate_winning_product_score, save_scoring_results
        from sqlalchemy import create_engine

        engine      = create_engine(os.environ["DATABASE_URL"])
        df_features = fetch_subcategory_features(engine)
        df_scored   = calculate_winning_product_score(df_features)
    except Exception as exc:
        log.error("Scoring gagal: %s", exc)
        sys.exit(1)

    # ── Step 6: Data Quality Checks ──────────────────────────────────────
    log.info("[6/6] Data Quality Checks")
    try:
        from pipeline.quality.data_quality_checks import run_data_quality_checks
        run_data_quality_checks(df_features, df_scored)
    except AssertionError as exc:
        log.error("Data quality checks GAGAL — pipeline dihentikan.\n%s", exc)
        sys.exit(1)

    # ── Simpan hasil ke Supabase (hanya jika checks lolos) ───────────────
    log.info("Menyimpan hasil scoring ke Supabase...")
    try:
        from pipeline.scoring.winning_product_score import save_scoring_results
        saved = save_scoring_results(df_scored, engine, pipeline_run_id=run_id)
        log.info("Hasil disimpan: %d baris", saved)
    except Exception as exc:
        log.error("Gagal menyimpan hasil: %s", exc)
        sys.exit(1)

    log.info("=" * 60)
    log.info("Pipeline run selesai. Run ID: %s", run_id)
    log.info("=" * 60)


if __name__ == "__main__":
    main()
