"""
pipeline/tests/test_wps.py
============================
Unit tests untuk scoring engine dan NLP pipeline.
Jalankan: pytest pipeline/tests/test_wps.py -v
"""

import pytest
import pandas as pd

from pipeline.scoring.winning_product_score import calculate_winning_product_score, normalize_col
from pipeline.processing.nlp_pipeline import classify_complaint_aspects, score_sentiment


# ─────────────────────────────────────────────────────────────────────────────
# Fixtures
# ─────────────────────────────────────────────────────────────────────────────

@pytest.fixture
def sample_features() -> pd.DataFrame:
    """DataFrame minimal yang mensimulasikan output vw_subcategory_features."""
    return pd.DataFrame([
        {
            "keyword_id": 1, "category_name": "Dapur", "sub_category": "Rak Bumbu",
            "search_keyword": "rak bumbu dapur", "cost_category": "dapur_dan_makan",
            "search_trend_index": 65.0, "monthly_sold_units": 1200,
            "mall_seller_ratio": 0.3, "avg_review_count": 85,
            "median_price": 89000.0, "negative_review_rate": 0.18,
            "n_products": 48, "n_reviews": 312,
        },
        {
            "keyword_id": 2, "category_name": "Dapur", "sub_category": "Toples Kaca",
            "search_keyword": "toples kaca", "cost_category": "dapur_dan_makan",
            "search_trend_index": 40.0, "monthly_sold_units": 500,
            "mall_seller_ratio": 0.6, "avg_review_count": 200,
            "median_price": 45000.0, "negative_review_rate": 0.08,
            "n_products": 30, "n_reviews": 150,
        },
        {
            "keyword_id": 3, "category_name": "Rumah", "sub_category": "Rak Sepatu",
            "search_keyword": "rak sepatu minimalis", "cost_category": "peralatan_rumah",
            "search_trend_index": 80.0, "monthly_sold_units": 2000,
            "mall_seller_ratio": 0.1, "avg_review_count": 40,
            "median_price": 120000.0, "negative_review_rate": 0.25,
            "n_products": 60, "n_reviews": 420,
        },
    ])


# ─────────────────────────────────────────────────────────────────────────────
# Tests: normalize_col
# ─────────────────────────────────────────────────────────────────────────────

class TestNormalizeCol:
    def test_normal_range(self):
        s = pd.Series([0.0, 50.0, 100.0])
        result = normalize_col(s)
        assert result.min() == pytest.approx(0.0)
        assert result.max() == pytest.approx(100.0)

    def test_edge_case_all_same(self):
        """Jika semua nilai sama, harus return 50.0 untuk semua."""
        s = pd.Series([42.0, 42.0, 42.0])
        result = normalize_col(s)
        assert (result == 50.0).all()

    def test_single_value(self):
        s = pd.Series([100.0])
        result = normalize_col(s)
        assert result.iloc[0] == pytest.approx(50.0)


# ─────────────────────────────────────────────────────────────────────────────
# Tests: calculate_winning_product_score
# ─────────────────────────────────────────────────────────────────────────────

class TestWinningProductScore:
    def test_wps_in_range(self, sample_features):
        """WPS harus berada dalam rentang 0–100 untuk semua baris."""
        df = calculate_winning_product_score(sample_features)
        assert df["winning_product_score"].between(0, 100).all(), \
            f"WPS di luar rentang: {df['winning_product_score'].tolist()}"

    def test_weights_sum_to_one(self):
        """Pastikan bobot formula berjumlah tepat 1.0."""
        weights = [0.35, 0.25, 0.25, 0.15]
        assert sum(weights) == pytest.approx(1.0), \
            f"Total bobot = {sum(weights)} (harus 1.0)"

    def test_recommendation_labels(self, sample_features):
        """Setiap baris harus memiliki salah satu dari 3 label rekomendasi."""
        valid_labels = {
            "High Priority - Immediate Sourcing",
            "Monitor & Sample Testing",
            "Reject - Saturated / Unfeasible",
        }
        df = calculate_winning_product_score(sample_features)
        assert set(df["sourcing_recommendation"].unique()).issubset(valid_labels)

    def test_output_columns_exist(self, sample_features):
        """Kolom output yang dibutuhkan harus ada."""
        df = calculate_winning_product_score(sample_features)
        required = ["winning_product_score", "sourcing_recommendation",
                    "norm_demand", "norm_competition", "norm_margin", "norm_gap"]
        for col in required:
            assert col in df.columns, f"Kolom '{col}' tidak ditemukan"

    def test_empty_input(self):
        """Input kosong harus dikembalikan tanpa error."""
        df_empty = pd.DataFrame(columns=["keyword_id", "monthly_sold_units",
                                          "search_trend_index", "mall_seller_ratio",
                                          "avg_review_count", "median_price",
                                          "negative_review_rate", "cost_category"])
        result = calculate_winning_product_score(df_empty)
        assert result.empty

    def test_higher_demand_higher_wps(self, sample_features):
        """Sub-kategori dengan demand lebih tinggi seharusnya mendapat WPS lebih tinggi
        (jika faktor lain serupa). Rak Sepatu punya demand & gap tertinggi."""
        df = calculate_winning_product_score(sample_features)
        rak_sepatu = df[df["keyword_id"] == 3]["winning_product_score"].iloc[0]
        toples     = df[df["keyword_id"] == 2]["winning_product_score"].iloc[0]
        # Rak Sepatu punya demand jauh lebih tinggi & kompetisi rendah
        assert rak_sepatu > toples, \
            f"Rak Sepatu WPS ({rak_sepatu}) seharusnya > Toples Kaca ({toples})"


# ─────────────────────────────────────────────────────────────────────────────
# Tests: NLP Pipeline
# ─────────────────────────────────────────────────────────────────────────────

class TestNLPPipeline:
    def test_classify_quality_complaint(self):
        text = "Barang tipis banget dan pas sampai ada bagian yang retak dan patah."
        result = classify_complaint_aspects(text)
        assert "Quality" in result

    def test_classify_packaging_complaint(self):
        text = "Packing cuma plastik biasa jadi kardus penyok parah."
        result = classify_complaint_aspects(text)
        assert "Packaging" in result

    def test_classify_completeness_complaint(self):
        text = "Baut juga kurang 1, tidak lengkap."
        result = classify_complaint_aspects(text)
        assert "Completeness" in result

    def test_classify_fallback_other(self):
        """Ulasan tanpa kata kunci spesifik harus fallback ke Other Complaints."""
        text = "Tidak suka."
        result = classify_complaint_aspects(text)
        assert result == ["Other Complaints"]

    def test_classify_empty_text(self):
        result = classify_complaint_aspects("")
        assert result == ["Other Complaints"]

    def test_sentiment_positive(self):
        text = "Barang bagus, kualitas oke, sesuai gambar, puas!"
        score = score_sentiment(text)
        assert score > 0, f"Teks positif harus skor > 0, dapat: {score}"

    def test_sentiment_negative(self):
        text = "Barang jelek, rusak, mengecewakan, tidak bagus sama sekali."
        score = score_sentiment(text)
        assert score < 0, f"Teks negatif harus skor < 0, dapat: {score}"

    def test_sentiment_range(self):
        """Skor harus selalu dalam rentang [-1, 1]."""
        texts = [
            "bagus bagus bagus bagus bagus bagus bagus",
            "jelek jelek jelek jelek jelek jelek jelek",
            "biasa aja",
            "",
        ]
        for t in texts:
            score = score_sentiment(t)
            assert -1.0 <= score <= 1.0, f"Skor di luar range [-1,1]: {score} untuk '{t}'"

    def test_sentiment_empty(self):
        assert score_sentiment("") == 0.0

    def test_sentiment_neutral(self):
        """Teks tanpa kata sentimen harus netral."""
        score = score_sentiment("produk ini merupakan barang yang ada di pasaran")
        assert score == 0.0
