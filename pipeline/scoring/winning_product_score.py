"""
pipeline/scoring/winning_product_score.py
============================================
Formula WPS (Winning Product Score) yang diperbaiki dari draf awal:

  WPS = 0.35 × Demand + 0.25 × (100 − Competition) + 0.25 × Margin + 0.15 × Gap

Perbaikan dari draf awal:
  - Bobot berjumlah tepat 1.0 (bukan 0.50)
  - Competition dibalik menjadi "keunggulan kompetitif" (100 − norm_competition)
  - WPS otomatis berada di rentang 0–100 setelah min-max normalization
  - HPP & komisi dibaca dari config/cost_params.yaml (bukan hardcode)

Jalankan: python -m pipeline.scoring.winning_product_score
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

from pipeline.scoring.feature_aggregation import fetch_subcategory_features

load_dotenv()
log = logging.getLogger(__name__)

BASE_DIR    = Path(__file__).resolve().parents[2]
COST_CONFIG = yaml.safe_load((BASE_DIR / "config" / "cost_params.yaml").read_text())


# ---------------------------------------------------------------------------
# 1. Helper: load parameter biaya per kategori
# ---------------------------------------------------------------------------

def get_cost_params(cost_category: str) -> dict:
    """
    Kembalikan parameter biaya untuk kategori yang diberikan.
    Fallback ke 'default' jika kategori tidak ditemukan.
    """
    categories = COST_CONFIG.get("categories", {})
    return categories.get(cost_category, categories["default"])


# ---------------------------------------------------------------------------
# 2. Normalisasi min-max
# ---------------------------------------------------------------------------

def normalize_col(series: pd.Series) -> pd.Series:
    """
    Min-max normalization ke skala 0–100.
    Edge case: jika max == min (semua nilai sama), kembalikan 50.0 untuk semua.
    """
    mn, mx = series.min(), series.max()
    if mx == mn:
        return pd.Series(50.0, index=series.index)
    return ((series - mn) / (mx - mn)) * 100


# ---------------------------------------------------------------------------
# 3. Hitung WPS
# ---------------------------------------------------------------------------

def calculate_winning_product_score(df_features: pd.DataFrame) -> pd.DataFrame:
    """
    Input : DataFrame dari vw_subcategory_features (keluaran feature_aggregation.py).
    Output: DataFrame yang sama, diperkaya kolom skor & rekomendasi.

    Formula (bobot tepat 1.0):
      WPS = 0.35 × Demand + 0.25 × (100 − Competition) + 0.25 × Margin + 0.15 × Gap
    """
    if df_features.empty:
        log.warning("DataFrame kosong — tidak ada yang di-scoring.")
        return df_features

    df = df_features.copy()

    # ── Komponen 1: Demand Velocity ──────────────────────────────────────────
    # Gabungan penjualan bulanan × volume penelusuran
    demand_raw        = df["monthly_sold_units"] * df["search_trend_index"]
    df["norm_demand"] = normalize_col(demand_raw)

    # ── Komponen 2: Tingkat Kompetisi → Keunggulan Kompetitif ───────────────
    # mall_seller_ratio * 100 + avg_review_count sebagai proxy saturasi pasar
    competition_raw         = df["mall_seller_ratio"] * 100 + df["avg_review_count"]
    df["norm_competition"]  = normalize_col(competition_raw)
    # Balik: makin tinggi competition_advantage → makin longgar persaingan
    df["competition_advantage"] = 100 - df["norm_competition"]

    # ── Komponen 3: Potensi Margin ───────────────────────────────────────────
    # Margin per unit = median_price × net_margin_pct
    # net_margin_pct dibaca dari config per kategori
    def compute_net_margin(row: pd.Series) -> float:
        params = get_cost_params(row.get("cost_category", "default"))
        net    = 1 - params["cogs_ratio"] - params["marketplace_fee_pct"] - params.get("ads_budget_pct", 0.10)
        return max(net, 0.0)  # tidak boleh negatif

    df["net_margin_pct"] = df.apply(compute_net_margin, axis=1)
    df["norm_margin"]    = normalize_col(df["net_margin_pct"] * df["median_price"])

    # ── Komponen 4: Gap Opportunity ──────────────────────────────────────────
    # Proporsi ulasan negatif = proxy "masalah yang belum diselesaikan kompetitor"
    df["norm_gap"] = normalize_col(df["negative_review_rate"])

    # ── Formula WPS ─────────────────────────────────────────────────────────
    # Bobot total = 0.35 + 0.25 + 0.25 + 0.15 = 1.0
    df["winning_product_score"] = (
        0.35 * df["norm_demand"]
        + 0.25 * df["competition_advantage"]
        + 0.25 * df["norm_margin"]
        + 0.15 * df["norm_gap"]
    ).round(2)

    # ── Rekomendasi ─────────────────────────────────────────────────────────
    thresholds   = COST_CONFIG.get("thresholds", {})
    high_thresh  = thresholds.get("high_priority", 70)
    mid_thresh   = thresholds.get("monitor", 50)

    def assign_recommendation(score: float) -> str:
        # Threshold dapat dikalibrasi ulang tiap kuartal via cost_params.yaml
        if score >= high_thresh:
            return "High Priority - Immediate Sourcing"
        elif score >= mid_thresh:
            return "Monitor & Sample Testing"
        return "Reject - Saturated / Unfeasible"

    df["sourcing_recommendation"] = df["winning_product_score"].apply(assign_recommendation)

    log.info(
        "Scoring selesai: %d sub-kategori. Distribusi — High: %d | Monitor: %d | Reject: %d",
        len(df),
        (df["sourcing_recommendation"] == "High Priority - Immediate Sourcing").sum(),
        (df["sourcing_recommendation"] == "Monitor & Sample Testing").sum(),
        (df["sourcing_recommendation"] == "Reject - Saturated / Unfeasible").sum(),
    )
    return df


# ---------------------------------------------------------------------------
# 4. Simpan hasil ke fact_sourcing_opportunity
# ---------------------------------------------------------------------------

def save_scoring_results(df_scored: pd.DataFrame, engine, pipeline_run_id: str = "") -> int:
    """
    UPSERT hasil scoring ke fact_sourcing_opportunity.

    Menggunakan INSERT ... ON CONFLICT DO UPDATE (upsert) agar pipeline
    bersifat idempotent terhadap constraint uq_scoring_keyword_run
    UNIQUE(keyword_id, pipeline_run_id).

    Jika pipeline_run_id yang sama dijalankan ulang (mis. retry GitHub Actions),
    baris yang ada akan diperbarui dengan skor terbaru — bukan duplikat baru.
    """
    saved = 0
    with engine.begin() as conn:
        for _, row in df_scored.iterrows():
            conn.execute(
                text("""
                    INSERT INTO fact_sourcing_opportunity
                        (keyword_id, demand_score, competition_score, margin_score,
                         gap_score, winning_product_score, sourcing_recommendation,
                         n_products_analyzed, n_reviews_analyzed, pipeline_run_id)
                    VALUES
                        (:kid, :demand, :comp, :margin, :gap, :wps, :rec,
                         :n_prod, :n_rev, :run_id)
                    ON CONFLICT (keyword_id, pipeline_run_id)
                    DO UPDATE SET
                        demand_score            = EXCLUDED.demand_score,
                        competition_score       = EXCLUDED.competition_score,
                        margin_score            = EXCLUDED.margin_score,
                        gap_score               = EXCLUDED.gap_score,
                        winning_product_score   = EXCLUDED.winning_product_score,
                        sourcing_recommendation = EXCLUDED.sourcing_recommendation,
                        n_products_analyzed     = EXCLUDED.n_products_analyzed,
                        n_reviews_analyzed      = EXCLUDED.n_reviews_analyzed,
                        scored_at               = NOW()
                """),
                {
                    "kid":    int(row["keyword_id"]),
                    "demand": float(row["norm_demand"]),
                    "comp":   float(row["norm_competition"]),
                    "margin": float(row["norm_margin"]),
                    "gap":    float(row["norm_gap"]),
                    "wps":    float(row["winning_product_score"]),
                    "rec":    row["sourcing_recommendation"],
                    "n_prod": int(row.get("n_products", 0)),
                    "n_rev":  int(row.get("n_reviews", 0)),
                    "run_id": pipeline_run_id,
                },
            )
            saved += 1
    log.info(
        "Upsert scoring selesai: %d baris ke fact_sourcing_opportunity (run_id=%s)",
        saved,
        pipeline_run_id or "local",
    )
    return saved



# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def run_scoring(pipeline_run_id: str = "") -> pd.DataFrame:
    """Jalankan full scoring pipeline. Kembalikan DataFrame hasil skor."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise EnvironmentError("DATABASE_URL belum di-set.")

    engine      = create_engine(database_url)
    df_features = fetch_subcategory_features(engine)

    if df_features.empty:
        log.error("Tidak ada data fitur — hentikan scoring.")
        return df_features

    df_scored = calculate_winning_product_score(df_features)
    save_scoring_results(df_scored, engine, pipeline_run_id)

    return df_scored


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
    df = run_scoring()
    if not df.empty:
        cols = ["sub_category", "winning_product_score", "sourcing_recommendation"]
        print("\n=== Top 10 Winning Products ===")
        print(df[cols].sort_values("winning_product_score", ascending=False).head(10).to_string(index=False))
