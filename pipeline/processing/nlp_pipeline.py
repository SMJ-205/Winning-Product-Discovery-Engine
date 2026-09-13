"""
pipeline/processing/nlp_pipeline.py
=======================================
Review mining dengan dua fungsi utama:
  1. classify_complaint_aspects(text) → list[str]
     Klasifikasi aspek keluhan dari ulasan negatif menggunakan regex keyword-based.
  2. score_sentiment(text) → float [-1.0, 1.0]
     Sentiment scoring berbasis leksikon Indonesia (gratis, deterministik, tanpa GPU).

Pipeline ini memproses ulasan di fact_customer_reviews yang belum memiliki
sentiment_score (NULL) dan mengisi kolom sentiment_score & complaint_aspects.

Jalankan: python -m pipeline.processing.nlp_pipeline
"""

from __future__ import annotations

import logging
import os
import re
from pathlib import Path
from typing import Optional

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# 1. Kamus keluhan — keyword per kategori aspek
# ---------------------------------------------------------------------------

PAIN_POINT_CATEGORIES: dict[str, list[str]] = {
    "Quality": [
        "tipis", "rapuh", "mudah patah", "retak", "pecah", "gompal", "karatan",
        "bahan jelek", "kualitas buruk", "tidak kuat", "gampang rusak", "goyang",
        "tidak presisi", "bengkok", "cacat", "tidak sesuai", "murahan",
    ],
    "Packaging": [
        "packing jelek", "kardus penyok", "bungkus rusak", "tidak aman",
        "plastik saja", "tidak ada bubble wrap", "barang pecah saat sampai",
        "kemasan rusak", "kotor", "lecet",
    ],
    "Shipping": [
        "lama", "terlambat", "pengiriman lama", "kurir lambat",
        "tidak sampai", "hilang", "resi tidak update", "delay",
    ],
    "Description": [
        "tidak sesuai gambar", "foto berbeda", "beda dari foto", "ukuran tidak sesuai",
        "warna beda", "deskripsi salah", "menipu", "tidak sesuai deskripsi",
    ],
    "Completeness": [
        "tidak lengkap", "kurang", "hilang", "baut kurang", "aksesoris tidak ada",
        "petunjuk tidak ada", "tanpa manual", "tidak disertakan",
    ],
    "Compatibility": [
        "tidak cocok", "tidak pas", "tidak masuk", "tidak kompatibel",
        "sulit dipasang", "tidak bisa dipakai",
    ],
}

# ---------------------------------------------------------------------------
# 2. Leksikon sentimen Indonesia (sederhana, deterministik)
# ---------------------------------------------------------------------------

POSITIVE_WORDS: set[str] = {
    "bagus", "baik", "oke", "mantap", "keren", "memuaskan", "puas", "senang",
    "rekomendasi", "recommended", "cocok", "sesuai", "rapi", "kuat", "awet",
    "cepat", "tepat", "presisi", "cantik", "indah", "murah", "terjangkau",
    "worth", "worth it", "berkualitas", "suka", "love", "sempurna",
}

NEGATIVE_WORDS: set[str] = {
    "jelek", "buruk", "rusak", "cacat", "kecewa", "tidak puas", "mengecewakan",
    "parah", "payah", "sampah", "tidak bagus", "tidak baik", "gagal", "hancur",
    "lambat", "mahal", "tidak worth", "tipu", "bohong", "palsu", "abal",
    "tidak sesuai", "retak", "patah", "penyok", "kotor", "bau",
}


# ---------------------------------------------------------------------------
# 3. Pre-processing teks
# ---------------------------------------------------------------------------

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return " ".join(text.split())


# ---------------------------------------------------------------------------
# 4. Klasifikasi aspek keluhan
# ---------------------------------------------------------------------------

def classify_complaint_aspects(review_text: str) -> list[str]:
    """
    Kembalikan list kategori keluhan yang teridentifikasi dari teks ulasan.
    Jika tidak ada yang cocok, kembalikan ['Other Complaints'].
    """
    cleaned = clean_text(review_text)
    matched = [
        category
        for category, keywords in PAIN_POINT_CATEGORIES.items()
        if any(re.search(r"\b" + re.escape(kw) + r"\b", cleaned) for kw in keywords)
    ]
    return matched if matched else ["Other Complaints"]


# ---------------------------------------------------------------------------
# 5. Sentiment scoring berbasis leksikon
# ---------------------------------------------------------------------------

def score_sentiment(review_text: str) -> float:
    """
    Skor sentimen: (pos_hits - neg_hits) / total_kata, dipangkas ke [-1, 1].
    Nol kata sentimen → netral (0.0).

    Skala ×10 agar lebih sensitif terhadap perbedaan kecil.
    """
    cleaned = clean_text(review_text)
    words   = cleaned.split()

    if not words:
        return 0.0

    pos_hits = sum(1 for w in words if w in POSITIVE_WORDS)
    neg_hits = sum(1 for w in words if w in NEGATIVE_WORDS)

    raw = (pos_hits - neg_hits) / len(words)
    # Scale dan pangkas ke [-1, 1]
    return round(max(-1.0, min(1.0, raw * 10)), 4)


# ---------------------------------------------------------------------------
# 6. Batch processing dari Supabase
# ---------------------------------------------------------------------------

def fetch_unprocessed_reviews(engine, batch_size: int = 500) -> pd.DataFrame:
    """Ambil ulasan yang belum diproses (sentiment_score IS NULL)."""
    query = text("""
        SELECT review_id, product_id, rating, review_text
        FROM fact_customer_reviews
        WHERE sentiment_score IS NULL
          AND review_text IS NOT NULL
          AND review_text <> ''
        ORDER BY review_id
        LIMIT :batch
    """)
    with engine.connect() as conn:
        rows = conn.execute(query, {"batch": batch_size}).mappings().all()
    return pd.DataFrame([dict(r) for r in rows])


def save_nlp_results(df: pd.DataFrame, engine) -> int:
    """Update sentiment_score & complaint_aspects kembali ke Supabase."""
    updated = 0
    with engine.begin() as conn:
        for _, row in df.iterrows():
            conn.execute(
                text("""
                    UPDATE fact_customer_reviews
                    SET sentiment_score   = :score,
                        complaint_aspects = :aspects
                    WHERE review_id = :rid
                """),
                {
                    "score":   float(row["sentiment_score"]),
                    "aspects": list(row["complaint_aspects"]),
                    "rid":     int(row["review_id"]),
                },
            )
            updated += 1
    return updated


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def run_nlp_pipeline(batch_size: int = 500) -> dict:
    """
    Jalankan NLP pipeline dalam batch.
    Kembalikan statistik pemrosesan.
    """
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise EnvironmentError("DATABASE_URL belum di-set.")

    engine     = create_engine(database_url)
    total_done = 0

    while True:
        df = fetch_unprocessed_reviews(engine, batch_size)
        if df.empty:
            log.info("Tidak ada ulasan yang tersisa untuk diproses.")
            break

        log.info("Memproses %d ulasan...", len(df))

        df["complaint_aspects"] = df["review_text"].apply(classify_complaint_aspects)
        df["sentiment_score"]   = df["review_text"].apply(score_sentiment)

        updated = save_nlp_results(df, engine)
        total_done += updated
        log.info("Batch selesai: %d ulasan diperbarui (total: %d)", updated, total_done)

        if len(df) < batch_size:
            break  # Tidak ada lagi batch tersisa

    # Ringkasan distribusi aspek keluhan
    stats: dict = {"total_reviews_processed": total_done}
    log.info("NLP pipeline selesai. Total diproses: %d", total_done)
    return stats


# ---------------------------------------------------------------------------
# Demo / testing lokal (tanpa DB)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    sample_reviews = [
        {"review_id": 1, "text": "Barang tipis banget dan pas sampai ada bagian yang retak dan patah."},
        {"review_id": 2, "text": "Packing cuma plastik biasa jadi kardus penyok parah, baut juga kurang 1."},
        {"review_id": 3, "text": "Petunjuknya ga jelas, pas dipasang goyang dan tidak presisi."},
        {"review_id": 4, "text": "Barang bagus, kualitas oke, sesuai gambar, pengiriman cepat, puas!"},
        {"review_id": 5, "text": "Tidak sesuai deskripsi, warna beda dari foto, sangat mengecewakan."},
    ]

    print("=== Demo NLP Pipeline (tanpa DB) ===\n")
    for r in sample_reviews:
        aspects   = classify_complaint_aspects(r["text"])
        sentiment = score_sentiment(r["text"])
        print(f"  [{r['review_id']}] sentiment={sentiment:+.4f}  aspects={aspects}")
        print(f"       \"{r['text'][:70]}...\"" if len(r["text"]) > 70 else f"       \"{r['text']}\"")
        print()
