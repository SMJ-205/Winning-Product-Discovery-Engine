"""
pipeline/quality/data_quality_checks.py
==========================================
Validasi data wajib sebelum skor WPS dipublikasikan ke dashboard.
4 assertion yang harus lolos semua:
  1. vw_subcategory_features tidak kosong
  2. keyword_id unik dalam agregasi
  3. winning_product_score dalam rentang 0–100
  4. median_price > 0

Jika salah satu gagal, pipeline berhenti dan tidak menulis ke Supabase.
"""

from __future__ import annotations

import logging

import pandas as pd

log = logging.getLogger(__name__)


def run_data_quality_checks(df_features: pd.DataFrame, df_scored: pd.DataFrame) -> bool:
    """
    Jalankan semua data quality checks.
    Kembalikan True jika semua lolos, raise AssertionError jika ada yang gagal.
    """
    errors = []

    # Check 1: View tidak kosong
    if df_features.empty:
        errors.append("vw_subcategory_features kosong — cek apakah pipeline ingestion sudah berjalan.")

    if not errors:
        # Check 2: keyword_id unik (tidak ada duplikat agregasi)
        if not df_features["keyword_id"].is_unique:
            dup_ids = df_features[df_features["keyword_id"].duplicated()]["keyword_id"].tolist()
            errors.append(f"Duplikat keyword_id ditemukan dalam agregasi: {dup_ids}")

        # Check 3: WPS dalam rentang valid
        if not df_scored.empty:
            oob = df_scored[~df_scored["winning_product_score"].between(0, 100)]
            if not oob.empty:
                errors.append(
                    f"WPS di luar rentang 0–100 untuk {len(oob)} sub-kategori: "
                    f"{oob['winning_product_score'].tolist()}"
                )

        # Check 4: median_price tidak nol atau negatif
        if "median_price" in df_features.columns:
            bad_price = df_features[df_features["median_price"] <= 0]
            if not bad_price.empty:
                errors.append(
                    f"median_price <= 0 untuk {len(bad_price)} sub-kategori: "
                    f"{bad_price['sub_category'].tolist()}"
                )

    if errors:
        for e in errors:
            log.error("[FAIL] %s", e)
        raise AssertionError(
            f"Data quality checks GAGAL ({len(errors)} error):\n" +
            "\n".join(f"  - {e}" for e in errors)
        )

    log.info("[OK] Semua data quality checks lolos (%d sub-kategori, %d skor).",
             len(df_features), len(df_scored))
    return True
